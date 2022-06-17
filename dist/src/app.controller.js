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
exports.AppController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const model_transformer_1 = require("./transformers/model.transformer");
const package_json_1 = __importDefault(require("../package.json"));
const app_config_1 = require("./app.config");
const auth_decorator_1 = require("./common/decorator/auth.decorator");
const cache_decorator_1 = require("./common/decorator/cache.decorator");
const ip_decorator_1 = require("./common/decorator/ip.decorator");
const allow_all_cors_interceptor_1 = require("./common/interceptors/allow-all-cors.interceptor");
const cache_constant_1 = require("./constants/cache.constant");
const configs_model_1 = require("./modules/configs/configs.model");
const cache_service_1 = require("./processors/cache/cache.service");
const redis_util_1 = require("./utils/redis.util");
let AppController = class AppController {
    constructor(cacheService, optionModel) {
        this.cacheService = cacheService;
        this.optionModel = optionModel;
    }
    async appInfo() {
        return {
            name: package_json_1.default.name,
            author: package_json_1.default.author,
            version: isDev ? 'dev' : `${app_config_1.isInDemoMode ? 'demo/' : ''}${package_json_1.default.version}`,
            homepage: package_json_1.default.homepage,
            issues: package_json_1.default.issues,
        };
    }
    ping() {
        return 'pong';
    }
    async likeThis({ ip }) {
        const redis = this.cacheService.getClient();
        const isLikedBefore = await redis.sismember((0, redis_util_1.getRedisKey)(cache_constant_1.RedisKeys.LikeSite), ip);
        if (isLikedBefore) {
            throw new common_1.BadRequestException('一天一次就够啦');
        }
        else {
            redis.sadd((0, redis_util_1.getRedisKey)(cache_constant_1.RedisKeys.LikeSite), ip);
        }
        await this.optionModel.updateOne({
            name: 'like',
        }, {
            $inc: {
                value: 1,
            },
        }, { upsert: true });
        return;
    }
    async getLikeNumber() {
        const doc = await this.optionModel.findOne({ name: 'like' }).lean();
        return doc ? doc.value : 0;
    }
    async cleanCatch() {
        await this.cacheService.cleanCatch();
        return;
    }
    async cleanAllRedisKey() {
        await this.cacheService.cleanAllRedisKey();
        return;
    }
};
__decorate([
    (0, common_1.UseInterceptors)(allow_all_cors_interceptor_1.AllowAllCorsInterceptor),
    (0, common_1.Get)(['/', '/info']),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "appInfo", null);
__decorate([
    (0, common_1.Get)('/ping'),
    (0, common_1.UseInterceptors)(allow_all_cors_interceptor_1.AllowAllCorsInterceptor),
    openapi.ApiResponse({ status: 200, type: String }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "ping", null);
__decorate([
    (0, common_1.Post)('/like_this'),
    cache_decorator_1.HttpCache.disable,
    (0, common_1.HttpCode)(204),
    openapi.ApiResponse({ status: 204 }),
    __param(0, (0, ip_decorator_1.IpLocation)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "likeThis", null);
__decorate([
    (0, common_1.Get)('/like_this'),
    cache_decorator_1.HttpCache.disable,
    openapi.ApiResponse({ status: 200, type: Object }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getLikeNumber", null);
__decorate([
    (0, common_1.Get)('/clean_catch'),
    cache_decorator_1.HttpCache.disable,
    (0, auth_decorator_1.Auth)(),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "cleanCatch", null);
__decorate([
    (0, common_1.Get)('/clean_redis'),
    cache_decorator_1.HttpCache.disable,
    (0, auth_decorator_1.Auth)(),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "cleanAllRedisKey", null);
AppController = __decorate([
    (0, common_1.Controller)(),
    (0, swagger_1.ApiTags)('Root'),
    __param(1, (0, model_transformer_1.InjectModel)(configs_model_1.OptionModel)),
    __metadata("design:paramtypes", [cache_service_1.CacheService, Object])
], AppController);
exports.AppController = AppController;
