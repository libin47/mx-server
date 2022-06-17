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
exports.AnalyzeInterceptor = void 0;
const isbot_1 = __importDefault(require("isbot"));
const ua_parser_js_1 = __importDefault(require("ua-parser-js"));
const url_1 = require("url");
const common_1 = require("@nestjs/common");
const cache_constant_1 = require("../../constants/cache.constant");
const analyze_model_1 = require("../../modules/analyze/analyze.model");
const configs_model_1 = require("../../modules/configs/configs.model");
const cache_service_1 = require("../../processors/cache/cache.service");
const get_req_transformer_1 = require("../../transformers/get-req.transformer");
const model_transformer_1 = require("../../transformers/model.transformer");
const ip_util_1 = require("../../utils/ip.util");
const redis_util_1 = require("../../utils/redis.util");
let AnalyzeInterceptor = class AnalyzeInterceptor {
    constructor(model, options, cacheService) {
        this.model = model;
        this.options = options;
        this.cacheService = cacheService;
        this.init();
    }
    async init() {
        this.parser = new ua_parser_js_1.default();
    }
    async intercept(context, next) {
        const call$ = next.handle();
        const request = (0, get_req_transformer_1.getNestExecutionContextRequest)(context);
        if (!request) {
            return call$;
        }
        const method = request.routerMethod.toUpperCase();
        if (method !== 'GET') {
            return call$;
        }
        const ip = (0, ip_util_1.getIp)(request);
        if (['127.0.0.1', 'localhost', '::-1'].includes(ip)) {
            return call$;
        }
        if (request.user) {
            return call$;
        }
        if ((0, isbot_1.default)(request.headers['user-agent'])) {
            return call$;
        }
        const url = request.url.replace(/^\/api(\/v\d)?/, '');
        if (url.startsWith('/proxy')) {
            return call$;
        }
        process.nextTick(async () => {
            try {
                request.headers['user-agent'] &&
                    this.parser.setUA(request.headers['user-agent']);
                const ua = this.parser.getResult();
                await this.model.create({
                    ip,
                    ua,
                    path: new url_1.URL(`http://a.com${url}`).pathname,
                });
                const apiCallTimeRecord = await this.options.findOne({
                    name: 'apiCallTime',
                });
                if (!apiCallTimeRecord) {
                    await this.options.create({
                        name: 'apiCallTime',
                        value: 1,
                    });
                }
                else {
                    await this.options.updateOne({ name: 'apiCallTime' }, {
                        $inc: {
                            value: 1,
                        },
                    });
                }
                const client = this.cacheService.getClient();
                const count = await client.sadd((0, redis_util_1.getRedisKey)(cache_constant_1.RedisKeys.AccessIp), ip);
                if (count) {
                    const uvRecord = await this.options.findOne({ name: 'uv' });
                    if (uvRecord) {
                        await uvRecord.updateOne({
                            $inc: {
                                value: 1,
                            },
                        });
                    }
                    else {
                        await this.options.create({
                            name: 'uv',
                            value: 1,
                        });
                    }
                }
            }
            catch (e) {
                console.error(e);
            }
        });
        return call$;
    }
};
AnalyzeInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, model_transformer_1.InjectModel)(analyze_model_1.AnalyzeModel)),
    __param(1, (0, model_transformer_1.InjectModel)(configs_model_1.OptionModel)),
    __metadata("design:paramtypes", [Object, Object, cache_service_1.CacheService])
], AnalyzeInterceptor);
exports.AnalyzeInterceptor = AnalyzeInterceptor;
