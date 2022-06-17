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
var CacheService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheService = void 0;
const common_1 = require("@nestjs/common");
const redis_util_1 = require("../../utils/redis.util");
let CacheService = CacheService_1 = class CacheService {
    constructor(cache) {
        this.logger = new common_1.Logger(CacheService_1.name);
        this.cache = cache;
        this.redisClient.on('ready', () => {
            this.logger.log('Redis 已准备好！');
        });
    }
    get redisClient() {
        return this.cache.store.getClient();
    }
    get(key) {
        return this.cache.get(key);
    }
    set(key, value, options) {
        return this.cache.set(key, value, options);
    }
    get redisSubPub() {
        var _a;
        return ((_a = this._redisSubPub) !== null && _a !== void 0 ? _a : (this._redisSubPub = require('../../utils/redis-subpub.util').redisSubPub));
    }
    async publish(event, data) {
        return this.redisSubPub.publish(event, data);
    }
    async subscribe(event, callback) {
        return this.redisSubPub.subscribe(event, callback);
    }
    async unsubscribe(event, callback) {
        return this.redisSubPub.unsubscribe(event, callback);
    }
    getClient() {
        return this.redisClient;
    }
    async cleanCatch() {
        const redis = this.getClient();
        const keys = await redis.keys('mx-api-cache:*');
        await Promise.all(keys.map((key) => redis.del(key)));
        return;
    }
    async cleanAllRedisKey() {
        const redis = this.getClient();
        const keys = await redis.keys((0, redis_util_1.getRedisKey)('*'));
        await Promise.all(keys.map((key) => redis.del(key)));
        return;
    }
};
CacheService = CacheService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(common_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object])
], CacheService);
exports.CacheService = CacheService;
