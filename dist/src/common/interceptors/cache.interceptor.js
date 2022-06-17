"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpCacheInterceptor = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_config_1 = require("../../app.config");
const META = __importStar(require("../../constants/meta.constant"));
const SYSTEM = __importStar(require("../../constants/system.constant"));
const cache_service_1 = require("../../processors/cache/cache.service");
const get_req_transformer_1 = require("../../transformers/get-req.transformer");
let HttpCacheInterceptor = class HttpCacheInterceptor {
    constructor(cacheManager, reflector, httpAdapterHost) {
        this.cacheManager = cacheManager;
        this.reflector = reflector;
        this.httpAdapterHost = httpAdapterHost;
    }
    async intercept(context, next) {
        const call$ = next.handle();
        if (app_config_1.REDIS.disableApiCache) {
            return call$;
        }
        const request = this.getRequest(context);
        if (request.method.toLowerCase() !== 'get') {
            return call$;
        }
        const handler = context.getHandler();
        const isDisableCache = this.reflector.get(META.HTTP_CACHE_DISABLE, handler);
        const key = this.trackBy(context) || `mx-api-cache:${request.url}`;
        if (isDisableCache) {
            return call$;
        }
        const metaTTL = this.reflector.get(META.HTTP_CACHE_TTL_METADATA, handler);
        const ttl = metaTTL || app_config_1.REDIS.httpCacheTTL;
        try {
            const value = await this.cacheManager.get(key);
            return value
                ? (0, rxjs_1.of)(value)
                : call$.pipe((0, operators_1.tap)((response) => response && this.cacheManager.set(key, response, { ttl })));
        }
        catch (error) {
            console.error(error);
            return call$;
        }
    }
    trackBy(context) {
        const request = this.getRequest(context);
        const httpServer = this.httpAdapterHost.httpAdapter;
        const isHttpApp = Boolean(httpServer === null || httpServer === void 0 ? void 0 : httpServer.getRequestMethod);
        const isGetRequest = isHttpApp &&
            httpServer.getRequestMethod(request) === common_1.RequestMethod[common_1.RequestMethod.GET];
        const cacheKey = this.reflector.get(META.HTTP_CACHE_KEY_METADATA, context.getHandler());
        const isMatchedCache = isHttpApp && isGetRequest && cacheKey;
        return isMatchedCache ? cacheKey : undefined;
    }
    get getRequest() {
        return get_req_transformer_1.getNestExecutionContextRequest.bind(this);
    }
};
HttpCacheInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(SYSTEM.REFLECTOR)),
    __param(2, (0, common_1.Inject)(SYSTEM.HTTP_ADAPTER_HOST)),
    __metadata("design:paramtypes", [cache_service_1.CacheService,
        core_1.Reflector, Object])
], HttpCacheInterceptor);
exports.HttpCacheInterceptor = HttpCacheInterceptor;
