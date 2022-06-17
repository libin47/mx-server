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
exports.ToolController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const auth_decorator_1 = require("../../common/decorator/auth.decorator");
const cache_decorator_1 = require("../../common/decorator/cache.decorator");
const openapi_decorator_1 = require("../../common/decorator/openapi.decorator");
const cache_constant_1 = require("../../constants/cache.constant");
const cache_service_1 = require("../../processors/cache/cache.service");
const redis_util_1 = require("../../utils/redis.util");
const configs_service_1 = require("../configs/configs.service");
const tool_dto_1 = require("./tool.dto");
const tool_service_1 = require("./tool.service");
let ToolController = class ToolController {
    constructor(toolService, cacheService, configs) {
        this.toolService = toolService;
        this.cacheService = cacheService;
        this.configs = configs;
    }
    async getIpInfo(params) {
        const { ip } = params;
        const redis = this.cacheService.getClient();
        try {
            const [ipFromRedis] = await redis.hmget((0, redis_util_1.getRedisKey)(cache_constant_1.RedisKeys.IpInfoMap), ip);
            if (ipFromRedis) {
                return JSON.parse(ipFromRedis);
            }
        }
        catch { }
        const result = await this.toolService.getIp(ip);
        await redis.hmset((0, redis_util_1.getRedisKey)(cache_constant_1.RedisKeys.IpInfoMap), ip, JSON.stringify(result));
        return result;
    }
    async callGeocodeLocationApi(query) {
        const { latitude, longitude } = query;
        const data = await this.toolService.getGeoLocationByGaode(longitude, latitude);
        return data;
    }
    async callGeocodeSearchApi(query) {
        let { keywords } = query;
        keywords = keywords.replace(/\s/g, '|');
        return this.toolService.searchLocationByGaode(keywords);
    }
};
__decorate([
    (0, common_1.Get)('/ip/:ip'),
    (0, cache_decorator_1.HttpCache)({ disable: true }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tool_dto_1.IpDto]),
    __metadata("design:returntype", Promise)
], ToolController.prototype, "getIpInfo", null);
__decorate([
    (0, common_1.Get)('geocode/location'),
    (0, common_1.CacheTTL)(60 * 60 * 24),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tool_dto_1.GaodeMapLocationDto]),
    __metadata("design:returntype", Promise)
], ToolController.prototype, "callGeocodeLocationApi", null);
__decorate([
    (0, common_1.CacheTTL)(10),
    (0, common_1.Get)('geocode/search'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tool_dto_1.GaodeMapSearchDto]),
    __metadata("design:returntype", Promise)
], ToolController.prototype, "callGeocodeSearchApi", null);
ToolController = __decorate([
    (0, common_1.Controller)('tools'),
    openapi_decorator_1.ApiName,
    (0, auth_decorator_1.Auth)(),
    __metadata("design:paramtypes", [tool_service_1.ToolService,
        cache_service_1.CacheService,
        configs_service_1.ConfigsService])
], ToolController);
exports.ToolController = ToolController;
