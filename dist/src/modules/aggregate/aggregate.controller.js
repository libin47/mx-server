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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AggregateController = void 0;
const openapi = require("@nestjs/swagger");
const lodash_1 = require("lodash");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_decorator_1 = require("../../common/decorator/auth.decorator");
const openapi_decorator_1 = require("../../common/decorator/openapi.decorator");
const role_decorator_1 = require("../../common/decorator/role.decorator");
const cache_constant_1 = require("../../constants/cache.constant");
const analyze_service_1 = require("../analyze/analyze.service");
const configs_service_1 = require("../configs/configs.service");
const aggregate_dto_1 = require("./aggregate.dto");
const aggregate_service_1 = require("./aggregate.service");
let AggregateController = class AggregateController {
    constructor(aggregateService, configsService, analyzeService) {
        this.aggregateService = aggregateService;
        this.configsService = configsService;
        this.analyzeService = analyzeService;
    }
    async aggregate() {
        const tasks = await Promise.allSettled([
            this.configsService.getMaster(),
            this.aggregateService.getAllCategory(),
            this.aggregateService.getAllPages(),
            this.configsService.get('url'),
            this.configsService.get('seo'),
        ]);
        const [user, categories, pageMeta, url, seo] = tasks.map((t) => {
            if (t.status === 'fulfilled') {
                return t.value;
            }
            else {
                return null;
            }
        });
        return {
            user,
            seo,
            url: (0, lodash_1.omit)(url, ['adminUrl']),
            categories,
            pageMeta,
        };
    }
    async top(query, isMaster) {
        const { size } = query;
        return await this.aggregateService.topActivity(size, isMaster);
    }
    async getTimeline(query) {
        const { sort = 1, type, year } = query;
        return { data: await this.aggregateService.getTimeline(year, type, sort) };
    }
    async getSiteMapContent() {
        return { data: await this.aggregateService.getSiteMapContent() };
    }
    async getRSSFeed() {
        return await this.aggregateService.buildRssStructure();
    }
    async stat() {
        const [count, callTime, todayIpAccess] = await Promise.all([
            this.aggregateService.getCounts(),
            this.analyzeService.getCallTime(),
            this.analyzeService.getTodayAccessIp(),
        ]);
        return {
            ...count,
            ...callTime,
            todayIpAccessCount: todayIpAccess.length,
        };
    }
};
__decorate([
    (0, common_1.Get)('/'),
    (0, common_1.CacheKey)(cache_constant_1.CacheKeys.AggregateCatch),
    (0, common_1.CacheTTL)(300),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AggregateController.prototype, "aggregate", null);
__decorate([
    (0, common_1.Get)('/top'),
    (0, swagger_1.ApiProperty)({ description: '获取最新发布的内容' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, role_decorator_1.IsMaster)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [aggregate_dto_1.TopQueryDto, Boolean]),
    __metadata("design:returntype", Promise)
], AggregateController.prototype, "top", null);
__decorate([
    (0, common_1.Get)('/timeline'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [aggregate_dto_1.TimelineQueryDto]),
    __metadata("design:returntype", Promise)
], AggregateController.prototype, "getTimeline", null);
__decorate([
    (0, common_1.Get)('/sitemap'),
    (0, common_1.CacheKey)(cache_constant_1.CacheKeys.SiteMapCatch),
    (0, common_1.CacheTTL)(3600),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AggregateController.prototype, "getSiteMapContent", null);
__decorate([
    (0, common_1.Get)('/feed'),
    (0, common_1.CacheKey)(cache_constant_1.CacheKeys.RSS),
    (0, common_1.CacheTTL)(3600),
    openapi.ApiResponse({ status: 200, type: Object }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AggregateController.prototype, "getRSSFeed", null);
__decorate([
    (0, common_1.Get)('/stat'),
    (0, auth_decorator_1.Auth)(),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AggregateController.prototype, "stat", null);
AggregateController = __decorate([
    (0, common_1.Controller)('aggregate'),
    openapi_decorator_1.ApiName,
    __metadata("design:paramtypes", [aggregate_service_1.AggregateService,
        configs_service_1.ConfigsService,
        analyze_service_1.AnalyzeService])
], AggregateController);
exports.AggregateController = AggregateController;
