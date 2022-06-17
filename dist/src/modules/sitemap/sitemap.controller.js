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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SitemapController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const http_decorator_1 = require("../../common/decorator/http.decorator");
const openapi_decorator_1 = require("../../common/decorator/openapi.decorator");
const cache_constant_1 = require("../../constants/cache.constant");
const aggregate_service_1 = require("../aggregate/aggregate.service");
let SitemapController = class SitemapController {
    constructor(aggregateService) {
        this.aggregateService = aggregateService;
    }
    async getSitemap() {
        const content = await this.aggregateService.getSiteMapContent();
        const xml = `
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  ${content
            .map((item) => {
            var _a;
            return `<url>
  <loc>${item.url}</loc>
  <lastmod>${((_a = item.published_at) === null || _a === void 0 ? void 0 : _a.toISOString()) || 'N/A'}</lastmod>
  </url>`;
        })
            .join('')}
  </urlset>
  `.trim();
        return xml;
    }
};
__decorate([
    (0, common_1.Get)('/'),
    (0, common_1.CacheTTL)(3600),
    (0, common_1.CacheKey)(cache_constant_1.CacheKeys.SiteMapXmlCatch),
    http_decorator_1.HTTPDecorators.Bypass,
    (0, common_1.Header)('content-type', 'application/xml'),
    openapi.ApiResponse({ status: 200, type: String }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SitemapController.prototype, "getSitemap", null);
SitemapController = __decorate([
    (0, common_1.Controller)('sitemap'),
    openapi_decorator_1.ApiName,
    __metadata("design:paramtypes", [aggregate_service_1.AggregateService])
], SitemapController);
exports.SitemapController = SitemapController;
