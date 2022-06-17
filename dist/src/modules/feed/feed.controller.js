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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedController = void 0;
const openapi = require("@nestjs/swagger");
const xss_1 = __importDefault(require("xss"));
const common_1 = require("@nestjs/common");
const http_decorator_1 = require("../../common/decorator/http.decorator");
const openapi_decorator_1 = require("../../common/decorator/openapi.decorator");
const cache_constant_1 = require("../../constants/cache.constant");
const aggregate_service_1 = require("../aggregate/aggregate.service");
const configs_service_1 = require("../configs/configs.service");
const markdown_service_1 = require("../markdown/markdown.service");
let FeedController = class FeedController {
    constructor(aggregateService, configs, markdownService) {
        this.aggregateService = aggregateService;
        this.configs = configs;
        this.markdownService = markdownService;
    }
    async rss() {
        const { author, data, url } = await this.aggregateService.buildRssStructure();
        const { title } = await this.configs.get('seo');
        const { avatar } = await this.configs.getMaster();
        const now = new Date();
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <feed xmlns="http://www.w3.org/2005/Atom">
      <title>${title}</title>
      <link href="/atom.xml" rel="self"/>
      <link href="/feed" rel="self"/>
      <link href="${(0, xss_1.default)(url)}"/>
      <updated>${now.toISOString()}</updated>
      <id>${(0, xss_1.default)(url)}</id>
      <author>
        <name>${author}</name>
      </author>
      <generator>${'Mix Space CMS'}</generator>
      <lastBuildDate>${now.toISOString()}</lastBuildDate>
      <language>zh-CN</language>
      <image>
          <url>${(0, xss_1.default)(avatar || '')}</url>
          <title>${title}</title>
          <link>${(0, xss_1.default)(url)}</link>
      </image>
        ${await Promise.all(data.map(async (item) => {
            return `<entry>
            <title>${item.title}</title>
            <link href='${(0, xss_1.default)(item.link)}'/>
            <id>${(0, xss_1.default)(item.link)}</id>
            <published>${item.created}</published>
            <updated>${item.modified}</updated>
            <content type='html'><![CDATA[
              ${`<blockquote>该渲染由 marked 生成, 可能存在部分语句不通或者排版问题, 最佳体验请前往: <a href='${(0, xss_1.default)(item.link)}'>${(0, xss_1.default)(item.link)}</a></blockquote>
              ${await this.markdownService
                .renderArticle(item.id)
                .then((res) => res.html)}
              <p style='text-align: right'>
              <a href='${`${(0, xss_1.default)(item.link)}#comments`}'>看完了？说点什么呢</a>
              </p>`}
            ]]>
            </content>
            </entry>
          `;
        })).then((res) => res.join(''))}
    </feed>`;
        return xml;
    }
};
__decorate([
    (0, common_1.Get)('/'),
    (0, common_1.CacheKey)(cache_constant_1.CacheKeys.RSSXmlCatch),
    (0, common_1.CacheTTL)(3600),
    http_decorator_1.HTTPDecorators.Bypass,
    (0, common_1.Header)('content-type', 'application/xml'),
    openapi.ApiResponse({ status: 200, type: String }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FeedController.prototype, "rss", null);
FeedController = __decorate([
    (0, common_1.Controller)('feed'),
    openapi_decorator_1.ApiName,
    __metadata("design:paramtypes", [aggregate_service_1.AggregateService,
        configs_service_1.ConfigsService,
        markdown_service_1.MarkdownService])
], FeedController);
exports.FeedController = FeedController;
