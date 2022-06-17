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
exports.JWTService = void 0;
const cluster_1 = __importDefault(require("cluster"));
const jsonwebtoken_1 = require("jsonwebtoken");
const node_machine_id_1 = require("node-machine-id");
const common_1 = require("@nestjs/common");
const app_config_1 = require("../../app.config");
const cache_constant_1 = require("../../constants/cache.constant");
const utils_1 = require("../../utils");
const cache_service_1 = require("../cache/cache.service");
let JWTService = class JWTService {
    constructor(cacheService) {
        this.cacheService = cacheService;
        this.secret = '';
        this.init();
    }
    init() {
        if (this.secret) {
            return;
        }
        const getMachineId = () => {
            const id = (0, node_machine_id_1.machineIdSync)();
            if (isDev && cluster_1.default.isPrimary) {
                console.log(id);
            }
            return id;
        };
        const secret = app_config_1.SECURITY.jwtSecret ||
            Buffer.from(getMachineId()).toString('base64').slice(0, 15) ||
            'asjhczxiucipoiopiqm2376';
        if (isDev && cluster_1.default.isPrimary) {
            console.log(secret);
        }
        if (!app_config_1.CLUSTER.enable || cluster_1.default.isPrimary) {
            console.log('JWT Secret start with :', secret.slice(0, 5) + '*'.repeat(secret.length - 5));
        }
        this.secret = secret;
    }
    async verify(token) {
        try {
            (0, jsonwebtoken_1.verify)(token, this.secret);
            return await this.isTokenInRedis(token);
        }
        catch (er) {
            console.debug(er, token);
            return false;
        }
    }
    async isTokenInRedis(token) {
        const redis = this.cacheService.getClient();
        const key = (0, utils_1.getRedisKey)(cache_constant_1.RedisKeys.JWTStore);
        const has = await redis.hexists(key, (0, utils_1.md5)(token));
        return !!has;
    }
    async revokeToken(token) {
        const redis = this.cacheService.getClient();
        const key = (0, utils_1.getRedisKey)(cache_constant_1.RedisKeys.JWTStore);
        await redis.hdel(key, (0, utils_1.md5)(token));
    }
    async revokeAll() {
        const redis = this.cacheService.getClient();
        const key = (0, utils_1.getRedisKey)(cache_constant_1.RedisKeys.JWTStore);
        await redis.del(key);
    }
    async storeTokenInRedis(token) {
        const redis = this.cacheService.getClient();
        await redis.hset((0, utils_1.getRedisKey)(cache_constant_1.RedisKeys.JWTStore), (0, utils_1.md5)(token), JSON.stringify({
            date: new Date().toISOString(),
        }));
    }
    sign(id) {
        const token = (0, jsonwebtoken_1.sign)({ id }, this.secret, {
            expiresIn: '1y',
        });
        this.storeTokenInRedis(token);
        return token;
    }
};
JWTService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cache_service_1.CacheService])
], JWTService);
exports.JWTService = JWTService;
