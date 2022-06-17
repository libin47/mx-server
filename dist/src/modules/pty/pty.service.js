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
exports.PTYService = void 0;
const common_1 = require("@nestjs/common");
const cache_constant_1 = require("../../constants/cache.constant");
const cache_service_1 = require("../../processors/cache/cache.service");
const utils_1 = require("../../utils");
let PTYService = class PTYService {
    constructor(cacheService) {
        this.cacheService = cacheService;
    }
    async getLoginRecord() {
        const redis = this.cacheService.getClient();
        const keys = await redis.hkeys((0, utils_1.getRedisKey)(cache_constant_1.RedisKeys.PTYSession));
        const values = await Promise.all(keys.map(async (key) => {
            return redis.hget((0, utils_1.getRedisKey)(cache_constant_1.RedisKeys.PTYSession), key);
        }));
        return values
            .filter(Boolean)
            .map((value) => {
            const [startTime, ip, endTime] = value.split(',');
            return {
                startTime: new Date(startTime),
                ip,
                endTime: endTime === '' ? null : endTime,
            };
        })
            .sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
    }
};
PTYService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cache_service_1.CacheService])
], PTYService);
exports.PTYService = PTYService;
