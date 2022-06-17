"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheConfigService = void 0;
const cache_manager_ioredis_1 = __importDefault(require("cache-manager-ioredis"));
const common_1 = require("@nestjs/common");
const app_config_1 = require("../../app.config");
let CacheConfigService = class CacheConfigService {
    createCacheOptions() {
        var _a;
        const redisOptions = {
            host: app_config_1.REDIS.host,
            port: app_config_1.REDIS.port,
        };
        if (app_config_1.REDIS.password) {
            redisOptions.password = app_config_1.REDIS.password;
        }
        return {
            store: cache_manager_ioredis_1.default,
            ttl: (_a = app_config_1.REDIS.ttl) !== null && _a !== void 0 ? _a : undefined,
            is_cacheable_value: () => true,
            max: app_config_1.REDIS.max,
            ...redisOptions,
        };
    }
};
CacheConfigService = __decorate([
    (0, common_1.Injectable)()
], CacheConfigService);
exports.CacheConfigService = CacheConfigService;
