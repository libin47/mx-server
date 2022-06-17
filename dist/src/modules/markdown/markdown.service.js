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
var MarkdownService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkdownService = void 0;
const js_yaml_1 = require("js-yaml");
const jszip_1 = __importDefault(require("jszip"));
const lodash_1 = require("lodash");
const marked_1 = require("marked");
const mongoose_1 = require("mongoose");
const xss_1 = __importDefault(require("xss"));
const common_1 = require("@nestjs/common");
const database_service_1 = require("../../processors/database/database.service");
const helper_asset_service_1 = require("../../processors/helper/helper.asset.service");
const helper_macro_service_1 = require("../../processors/helper/helper.macro.service");
const model_transformer_1 = require("../../transformers/model.transformer");
const category_model_1 = require("../category/category.model");
const note_model_1 = require("../note/note.model");
const page_model_1 = require("../page/page.model");
const post_model_1 = require("../post/post.model");
let MarkdownService = MarkdownService_1 = class MarkdownService {
    constructor(assetService, categoryModel, postModel, noteModel, pageModel, databaseService, macroService) {
        this.assetService = assetService;
        this.categoryModel = categoryModel;
        this.postModel = postModel;
        this.noteModel = noteModel;
        this.pageModel = pageModel;
        this.databaseService = databaseService;
        this.macroService = macroService;
        this.genDate = (item) => {
            const { meta } = item;
            if (!meta) {
                return {
                    created: new Date(),
                    modified: new Date(),
                };
            }
            const { date, updated } = meta;
            return {
                created: date ? new Date(date) : new Date(),
                modified: updated
                    ? new Date(updated)
                    : date
                        ? new Date(date)
                        : new Date(),
            };
        };
    }
    async insertPostsToDb(data) {
        var _a;
        let count = 1;
        const categoryNameAndId = (await this.categoryModel.find().lean()).map((c) => {
            return { name: c.name, _id: c._id, slug: c.slug };
        });
        const insertOrCreateCategory = async (name) => {
            if (!name) {
                return;
            }
            const hasCategory = categoryNameAndId.find((c) => name === c.name || name === c.slug);
            if (!hasCategory) {
                const newCategoryDoc = await this.categoryModel.create({
                    name,
                    slug: name,
                    type: 0,
                });
                categoryNameAndId.push({
                    name: newCategoryDoc.name,
                    _id: newCategoryDoc._id,
                    slug: newCategoryDoc.slug,
                });
                await newCategoryDoc.save();
                return newCategoryDoc;
            }
            else {
                return hasCategory;
            }
        };
        const genDate = this.genDate;
        const models = [];
        const defaultCategory = await this.categoryModel.findOne();
        if (!defaultCategory) {
            throw new common_1.InternalServerErrorException('分类不存在');
        }
        for await (const item of data) {
            if (!item.meta) {
                models.push({
                    title: `未命名-${count++}`,
                    slug: new Date().getTime(),
                    text: item.text,
                    ...genDate(item),
                    categoryId: new mongoose_1.Types.ObjectId(defaultCategory._id),
                });
            }
            else {
                const category = await insertOrCreateCategory((_a = item.meta.categories) === null || _a === void 0 ? void 0 : _a.shift());
                models.push({
                    title: item.meta.title,
                    slug: item.meta.slug || item.meta.title,
                    text: item.text,
                    ...genDate(item),
                    categoryId: (category === null || category === void 0 ? void 0 : category._id) || defaultCategory._id,
                });
            }
        }
        return await this.postModel
            .insertMany(models, { ordered: false })
            .catch((err) => {
            common_1.Logger.log('一篇文章导入失败', MarkdownService_1.name);
        });
    }
    async insertNotesToDb(data) {
        const models = [];
        for await (const item of data) {
            if (!item.meta) {
                models.push({
                    title: '未命名记录',
                    text: item.text,
                    ...this.genDate(item),
                });
            }
            else {
                models.push({
                    title: item.meta.title,
                    text: item.text,
                    ...this.genDate(item),
                });
            }
        }
        return await this.noteModel.create(models);
    }
    async extractAllArticle() {
        return {
            posts: await this.postModel.find().populate('category'),
            notes: await this.noteModel.find().lean(),
            pages: await this.pageModel.find().lean(),
        };
    }
    async generateArchive({ documents, options = {}, }) {
        const zip = new jszip_1.default();
        for (const document of documents) {
            zip.file((options.slug ? document.meta.slug : document.meta.title)
                .concat('.md')
                .replace(/\//g, '-'), document.text);
        }
        return zip;
    }
    markdownBuilder(property, includeYAMLHeader, showHeader) {
        const { meta: { created, modified, title }, text, } = property;
        if (!includeYAMLHeader) {
            return `${showHeader ? `# ${title}\n\n` : ''}${text.trim()}`;
        }
        const header = {
            date: created,
            updated: modified,
            title,
            ...(0, lodash_1.omit)(property.meta, ['created', 'modified', 'title']),
        };
        const toYaml = (0, js_yaml_1.dump)(header, { skipInvalid: true });
        const res = `
---
${toYaml.trim()}
---

${showHeader ? `# ${title}\n\n` : ''}
${text.trim()}
`.trim();
        return res;
    }
    async renderArticle(id) {
        const doc = await this.databaseService.findGlobalById(id);
        if (!doc.document) {
            throw new common_1.BadRequestException('文档不存在');
        }
        return {
            html: this.renderMarkdownContent(await this.macroService.replaceTextMacro(doc.document.text, doc.document)),
            ...doc,
            document: doc.document,
        };
    }
    renderMarkdownContent(text) {
        marked_1.marked.use({
            gfm: true,
            sanitize: false,
            extensions: [
                {
                    level: 'inline',
                    name: 'spoiler',
                    start(src) {
                        var _a, _b;
                        return (_b = (_a = src.match(/\|/)) === null || _a === void 0 ? void 0 : _a.index) !== null && _b !== void 0 ? _b : -1;
                    },
                    renderer(token) {
                        return `<span class="spoiler" style="filter: invert(25%)">${this.parser.parseInline(token.text)}\n</span>`;
                    },
                    tokenizer(src, tokens) {
                        const rule = /^\|\|([\s\S]+?)\|\|(?!\|)/;
                        const match = rule.exec(src);
                        if (match) {
                            return {
                                type: 'spoiler',
                                raw: match[0],
                                text: this.lexer.inlineTokens(match[1].trim()),
                            };
                        }
                    },
                    childTokens: ['text'],
                },
                {
                    level: 'inline',
                    name: 'mention',
                    start(src) {
                        var _a, _b;
                        return (_b = (_a = src.match(/\(/)) === null || _a === void 0 ? void 0 : _a.index) !== null && _b !== void 0 ? _b : -1;
                    },
                    renderer(token) {
                        const username = this.parser.parseInline(token.text).slice(1);
                        return `<a class="mention" rel="noreferrer nofollow" href="https://github.com/${username}" target="_blank">@${username}\n</a>`;
                    },
                    tokenizer(src, tokens) {
                        const rule = /^\((@(\w+\b))\)\s?(?!\[.*?\])/;
                        const match = rule.exec(src);
                        if (match) {
                            return {
                                type: 'mention',
                                raw: match[0],
                                text: this.lexer.inlineTokens(match[1].trim(), []),
                            };
                        }
                    },
                    childTokens: ['text'],
                },
            ],
            renderer: {
                image(src, title, _alt) {
                    if (typeof src !== 'string') {
                        return '';
                    }
                    const alt = (_alt === null || _alt === void 0 ? void 0 : _alt.match(/^[!¡]/)) ? _alt.replace(/^[¡!]/, '') : '';
                    if (!alt) {
                        return `<img src="${(0, xss_1.default)(src)}"/>`;
                    }
                    return `<figure>
          <img src="${(0, xss_1.default)(src)}"/>
          <figcaption style="text-align: center; margin: 1em auto;">${(0, xss_1.default)(alt)}</figcaption></figure>`;
                },
                code(code, lang) {
                    if (lang == 'mermaid') {
                        return `<pre class="mermaid">${code}</pre>`;
                    }
                    else {
                        return `<pre><code class="language-${lang}">${(0, xss_1.default)(code)}</code></pre>`;
                    }
                },
            },
        });
        return (0, marked_1.marked)(text);
    }
    async getRenderedMarkdownHtmlStructure(html, title, theme = 'newsprint') {
        const style = await this.assetService.getAsset('/markdown/markdown.css', {
            encoding: 'utf8',
        });
        const themeStyleSheet = await this.assetService.getAsset(`/markdown/theme/${theme}.css`, { encoding: 'utf-8' });
        return {
            body: [`<article><h1>${title}</h1>${html}</article>`],
            extraScripts: [
                '<script src="https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/mermaid/8.9.0/mermaid.min.js"></script>',
                '<script src="https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/prism/1.23.0/components/prism-core.min.js"></script>',
                '<script src="https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/prism/1.23.0/plugins/autoloader/prism-autoloader.min.js"></script>',
                '<script src="https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/prism/1.23.0/plugins/line-numbers/prism-line-numbers.min.js" />',
            ],
            script: [
                `window.mermaid.initialize({theme: 'default',startOnLoad: false})`,
                `window.mermaid.init(undefined, '.mermaid')`,
            ],
            link: [
                '<link href="https://cdn.jsdelivr.net/gh/PrismJS/prism-themes@master/themes/prism-one-light.css" rel="stylesheet" />',
                '<link href="https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/prism/1.23.0/plugins/line-numbers/prism-line-numbers.min.css" rel="stylesheet" />',
            ],
            style: [style, themeStyleSheet],
        };
    }
    getMarkdownEjsRenderTemplate() {
        return this.assetService.getAsset('/render/markdown.ejs', {
            encoding: 'utf8',
        });
    }
};
MarkdownService = MarkdownService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, model_transformer_1.InjectModel)(category_model_1.CategoryModel)),
    __param(2, (0, model_transformer_1.InjectModel)(post_model_1.PostModel)),
    __param(3, (0, model_transformer_1.InjectModel)(note_model_1.NoteModel)),
    __param(4, (0, model_transformer_1.InjectModel)(page_model_1.PageModel)),
    __metadata("design:paramtypes", [helper_asset_service_1.AssetService, Object, Object, Object, Object, database_service_1.DatabaseService,
        helper_macro_service_1.TextMacroService])
], MarkdownService);
exports.MarkdownService = MarkdownService;
