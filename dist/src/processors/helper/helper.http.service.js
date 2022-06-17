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
var HttpService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpService = void 0;
const axios_1 = __importDefault(require("axios"));
const axios_retry_1 = __importDefault(require("axios-retry"));
const perf_hooks_1 = require("perf_hooks");
const util_1 = require("util");
const common_1 = require("@nestjs/common");
const app_config_1 = require("../../app.config");
const cache_constant_1 = require("../../constants/cache.constant");
const utils_1 = require("../../utils");
const package_json_1 = require("../../../package.json");
const cache_service_1 = require("../cache/cache.service");
let HttpService = HttpService_1 = class HttpService {
    constructor(cacheService) {
        this.cacheService = cacheService;
        this.axiosDefaultConfig = {
            ...app_config_1.AXIOS_CONFIG,
            headers: {
                'user-agent': `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.55 Safari/537.36 MX-Space/${package_json_1.version}`,
            },
            'axios-retry': {
                retries: 3,
                retryDelay: (count) => {
                    return 1000 * count;
                },
                shouldResetTimeout: true,
            },
        };
        this.logger = new common_1.Logger(HttpService_1.name);
        this.http = this.bindInterceptors(axios_1.default.create({
            ...app_config_1.AXIOS_CONFIG,
            headers: {
                'user-agent': `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.55 Safari/537.36 MX-Space/${package_json_1.version}`,
            },
        }));
        (0, axios_retry_1.default)(this.http, {
            retries: 3,
            retryDelay: (count) => {
                return 1000 * count;
            },
            shouldResetTimeout: true,
        });
    }
    extend(config) {
        return this.bindDebugVerboseInterceptor(axios_1.default.create({ ...this.axiosDefaultConfig, ...config }));
    }
    async getAndCacheRequest(url) {
        this.logger.debug(`--> GET: ${url}`);
        const client = this.cacheService.getClient();
        const has = await client.hget((0, utils_1.getRedisKey)(cache_constant_1.RedisKeys.HTTPCache), url);
        if (has) {
            this.logger.debug(`--> GET: ${url} from redis`);
            return has;
        }
        const { data } = await this.http.get(url, {
            responseType: 'text',
        });
        this.logger.debug(`--> GET: ${url} from remote`);
        await client.hset((0, utils_1.getRedisKey)(cache_constant_1.RedisKeys.HTTPCache), url, data);
        return data;
    }
    get axiosRef() {
        return this.http;
    }
    bindDebugVerboseInterceptor($http) {
        if (!app_config_1.DEBUG_MODE.httpRequestVerbose) {
            return $http;
        }
        $http.interceptors.request.use((req) => {
            var _a;
            if (!req.__debugLogger) {
                return req;
            }
            req.__requestStartedAt = perf_hooks_1.performance.now();
            this.logger.log(`HTTP Request: [${(_a = req.method) === null || _a === void 0 ? void 0 : _a.toUpperCase()}] ${req.baseURL || ''}${req.url}
params: ${this.prettyStringify(req.params)}
data: ${this.prettyStringify(req.data)}`);
            return req;
        });
        $http.interceptors.response.use((res) => {
            var _a, _b;
            if (!res.config.__debugLogger) {
                return res;
            }
            const endAt = perf_hooks_1.performance.now();
            res.config.__requestEndedAt = endAt;
            res.config.__requestDuration =
                (_b = (_a = res.config) === null || _a === void 0 ? void 0 : _a.__requestStartedAt) !== null && _b !== void 0 ? _b : endAt - res.config.__requestStartedAt;
            this.logger.log(`HTTP Response ${`${res.config.baseURL || ''}${res.config.url}`} +${res.config.__requestDuration.toFixed(2)}ms: \n${this.prettyStringify(res.data)} `);
            return res;
        }, (err) => {
            const res = err.response;
            const error = Promise.reject(err);
            if (!res) {
                this.logger.error(`HTTP Response Failed ${err.config.url || ''}, Network Error: ${err.message}`);
                return error;
            }
            this.logger.error(chalk.red(`HTTP Response Failed ${`${res.config.baseURL || ''}${res.config.url}`}\n${this.prettyStringify(res.data)}`));
            return error;
        });
        return $http;
    }
    bindInterceptors($http) {
        this.bindDebugVerboseInterceptor($http);
        return $http;
    }
    prettyStringify(data) {
        return (0, util_1.inspect)(data, { colors: true });
    }
};
HttpService = HttpService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cache_service_1.CacheService])
], HttpService);
exports.HttpService = HttpService;
