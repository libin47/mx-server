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
exports.IdempotenceInterceptor = void 0;
const rxjs_1 = require("rxjs");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const meta_constant_1 = require("../../constants/meta.constant");
const system_constant_1 = require("../../constants/system.constant");
const cache_service_1 = require("../../processors/cache/cache.service");
const utils_1 = require("../../utils");
const IdempotenceHeaderKey = 'x-idempotence';
let IdempotenceInterceptor = class IdempotenceInterceptor {
    constructor(cacheService, reflector) {
        this.cacheService = cacheService;
        this.reflector = reflector;
    }
    async intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        if (request.method.toUpperCase() === 'GET') {
            return next.handle();
        }
        const handler = context.getHandler();
        const options = this.reflector.get(meta_constant_1.HTTP_IDEMPOTENCE_OPTIONS, handler);
        if (!options) {
            return next.handle();
        }
        const { errorMessage = '相同请求成功后在 60 秒内只能发送一次', pendingMessage = '相同请求正在处理中...', handler: errorHandler, expired = 60, disableGenerateKey = false, } = options;
        const redis = this.cacheService.getClient();
        const idempotence = request.headers[IdempotenceHeaderKey];
        const key = disableGenerateKey
            ? undefined
            : options.generateKey
                ? options.generateKey(request)
                : this.generateKey(request);
        const idempotenceKey = !!(idempotence || key) && (0, utils_1.getRedisKey)(`idempotence:${idempotence || key}`);
        (0, common_1.SetMetadata)(meta_constant_1.HTTP_IDEMPOTENCE_KEY, idempotenceKey)(handler);
        if (idempotenceKey) {
            const resultValue = (await redis.get(idempotenceKey));
            if (resultValue !== null) {
                if (errorHandler) {
                    return await errorHandler(request);
                }
                const message = {
                    1: errorMessage,
                    0: pendingMessage,
                }[resultValue];
                throw new common_1.ConflictException(message);
            }
            else {
                await redis.set(idempotenceKey, '0');
                await redis.expire(idempotenceKey, expired);
            }
        }
        return next.handle().pipe((0, rxjs_1.tap)(async () => {
            idempotenceKey && (await redis.set(idempotenceKey, '1'));
        }), (0, rxjs_1.catchError)(async (err) => {
            if (idempotenceKey) {
                await redis.del(idempotenceKey);
            }
            throw err;
        }));
    }
    generateKey(req) {
        const { body, params, query = {}, headers, url } = req;
        const obj = { body, url, params, query };
        const uuid = headers['x-uuid'];
        if (uuid) {
            obj.uuid = uuid;
        }
        else {
            const ua = headers['user-agent'];
            const ip = (0, utils_1.getIp)(req);
            if (!ua && !ip) {
                return undefined;
            }
            Object.assign(obj, { ua, ip });
        }
        return (0, utils_1.hashString)(JSON.stringify(obj));
    }
};
IdempotenceInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(system_constant_1.REFLECTOR)),
    __metadata("design:paramtypes", [cache_service_1.CacheService,
        core_1.Reflector])
], IdempotenceInterceptor);
exports.IdempotenceInterceptor = IdempotenceInterceptor;
