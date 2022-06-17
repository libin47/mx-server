"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkdownController = void 0;
const openapi = require("@nestjs/swagger");
const dayjs_1 = __importDefault(require("dayjs"));
const ejs_1 = require("ejs");
const jszip_1 = __importDefault(require("jszip"));
const lodash_1 = require("lodash");
const path_1 = require("path");
const perf_hooks_1 = require("perf_hooks");
const stream_1 = require("stream");
const url_1 = require("url");
const xss_1 = __importDefault(require("xss"));
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_decorator_1 = require("../../common/decorator/auth.decorator");
const cache_decorator_1 = require("../../common/decorator/cache.decorator");
const http_decorator_1 = require("../../common/decorator/http.decorator");
const openapi_decorator_1 = require("../../common/decorator/openapi.decorator");
const role_decorator_1 = require("../../common/decorator/role.decorator");
const article_constant_1 = require("../../constants/article.constant");
const id_dto_1 = require("../../shared/dto/id.dto");
const utils_1 = require("../../utils");
const configs_service_1 = require("../configs/configs.service");
const markdown_dto_1 = require("./markdown.dto");
const markdown_service_1 = require("./markdown.service");
let MarkdownController = class MarkdownController {
    constructor(service, configs) {
        this.service = service;
        this.configs = configs;
    }
    async importArticle(body) {
        const type = body.type;
        switch (type) {
            case article_constant_1.ArticleTypeEnum.Post: {
                return await this.service.insertPostsToDb(body.data);
            }
            case article_constant_1.ArticleTypeEnum.Note: {
                return await this.service.insertNotesToDb(body.data);
            }
        }
    }
    async exportArticleToMarkdown(query) {
        const { show_title: showTitle, slug, yaml } = query;
        const allArticles = await this.service.extractAllArticle();
        const { notes, pages, posts } = allArticles;
        const convertor = (item, extraMetaData = {}) => {
            const meta = {
                created: item.created,
                modified: item.modified,
                title: item.title,
                slug: item.slug || item.title,
                ...extraMetaData,
            };
            return {
                meta,
                text: this.service.markdownBuilder({ meta, text: item.text }, yaml, showTitle),
            };
        };
        const convertPost = posts.map((post) => convertor(post, {
            categories: post.category.name,
            type: 'post',
            permalink: `posts/${post.slug}`,
        }));
        const convertNote = notes.map((note) => convertor(note, {
            mood: note.mood,
            weather: note.weather,
            id: note.nid,
            permalink: `notes/${note.nid}`,
            type: 'note',
            slug: note.nid.toString(),
        }));
        const convertPage = pages.map((page) => convertor(page, {
            subtitle: page.subtitle,
            type: 'page',
            permalink: page.slug,
        }));
        const map = {
            posts: convertPost,
            pages: convertPage,
            notes: convertNote,
        };
        const rtzip = new jszip_1.default();
        await Promise.all(Object.entries(map).map(async ([key, arr]) => {
            const zip = await this.service.generateArchive({
                documents: arr,
                options: {
                    slug,
                },
            });
            zip.forEach(async (relativePath, file) => {
                rtzip.file((0, path_1.join)(key, relativePath), file.nodeStream());
            });
        }));
        const readable = new stream_1.Readable();
        readable.push(await rtzip.generateAsync({ type: 'nodebuffer' }));
        readable.push(null);
        return readable;
    }
    async renderArticle(params, theme, isMaster) {
        const { id } = params;
        const now = perf_hooks_1.performance.now();
        const [{ html: markdownMacros, document, type }, { url: { webUrl }, }, { name: username },] = await Promise.all([
            this.service.renderArticle(id),
            this.configs.waitForConfigReady(),
            this.configs.getMaster(),
        ]);
        if (!isMaster) {
            if (('hide' in document && document.hide) ||
                ('password' in document && !(0, lodash_1.isNil)(document.password))) {
                throw new common_1.ForbiddenException('该文章已隐藏或加密');
            }
        }
        const relativePath = (() => {
            switch (type.toLowerCase()) {
                case 'post':
                    return `/posts/${document.category.slug}/${document.slug}`;
                case 'note':
                    return `/notes/${document.nid}`;
                case 'page':
                    return `/${document.slug}`;
            }
        })();
        const url = new url_1.URL(relativePath, webUrl);
        const structure = await this.service.getRenderedMarkdownHtmlStructure(markdownMacros, document.title, theme);
        const html = (0, ejs_1.render)(await this.service.getMarkdownEjsRenderTemplate(), {
            ...structure,
            title: document.title,
            footer: `<p>本文渲染于 ${(0, utils_1.getShortDateTime)(new Date())}，由 marked.js 解析生成，用时 ${(perf_hooks_1.performance.now() - now).toFixed(2)}ms</p>
      <p>作者：${username}，撰写于${(0, dayjs_1.default)(document.created).format('llll')}</p>
        <p>原文地址：<a href="${url}">${decodeURIComponent(url.toString())}</a></p>
        `,
        });
        return html.trim();
    }
    async markdownPreview(body, theme) {
        const { md, title } = body;
        const html = this.service.renderMarkdownContent(md);
        const structure = await this.service.getRenderedMarkdownHtmlStructure(html, title, theme);
        return (0, ejs_1.render)(await this.service.getMarkdownEjsRenderTemplate(), {
            ...structure,
            title: (0, xss_1.default)(title),
        }).trim();
    }
    async getRenderedMarkdownHtmlStructure(params) {
        const { id } = params;
        const { html, document } = await this.service.renderArticle(id);
        return this.service.getRenderedMarkdownHtmlStructure(html, document.title);
    }
};
__decorate([
    (0, common_1.Post)('/import'),
    (0, auth_decorator_1.Auth)(),
    (0, swagger_1.ApiProperty)({ description: '导入 Markdown YAML 数据' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [markdown_dto_1.DataListDto]),
    __metadata("design:returntype", Promise)
], MarkdownController.prototype, "importArticle", null);
__decorate([
    (0, common_1.Get)('/export'),
    (0, auth_decorator_1.Auth)(),
    (0, swagger_1.ApiProperty)({ description: '导出 Markdown YAML 数据' }),
    http_decorator_1.HTTPDecorators.Bypass,
    (0, common_1.Header)('Content-Type', 'application/zip'),
    openapi.ApiResponse({ status: 200, type: require("stream").Readable }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [markdown_dto_1.ExportMarkdownQueryDto]),
    __metadata("design:returntype", Promise)
], MarkdownController.prototype, "exportArticleToMarkdown", null);
__decorate([
    (0, common_1.Get)('/render/:id'),
    (0, common_1.Header)('content-type', 'text/html'),
    http_decorator_1.HTTPDecorators.Bypass,
    (0, common_1.CacheTTL)(60 * 60),
    openapi.ApiResponse({ status: 200, type: String }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Query)('theme')),
    __param(2, (0, role_decorator_1.IsMaster)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.MongoIdDto, String, Boolean]),
    __metadata("design:returntype", Promise)
], MarkdownController.prototype, "renderArticle", null);
__decorate([
    (0, common_1.Post)('/render'),
    cache_decorator_1.HttpCache.disable,
    (0, auth_decorator_1.Auth)(),
    http_decorator_1.HTTPDecorators.Bypass,
    (0, common_1.Header)('content-type', 'text/html'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)('theme')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [markdown_dto_1.MarkdownPreviewDto, String]),
    __metadata("design:returntype", Promise)
], MarkdownController.prototype, "markdownPreview", null);
__decorate([
    (0, common_1.Get)('/render/structure/:id'),
    (0, common_1.CacheTTL)(60 * 60),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.MongoIdDto]),
    __metadata("design:returntype", Promise)
], MarkdownController.prototype, "getRenderedMarkdownHtmlStructure", null);
MarkdownController = __decorate([
    (0, common_1.Controller)('markdown'),
    openapi_decorator_1.ApiName,
    __metadata("design:paramtypes", [markdown_service_1.MarkdownService,
        configs_service_1.ConfigsService])
], MarkdownController);
exports.MarkdownController = MarkdownController;
