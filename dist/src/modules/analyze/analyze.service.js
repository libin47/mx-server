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
exports.AnalyzeService = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const lodash_1 = require("lodash");
const common_1 = require("@nestjs/common");
const cache_constant_1 = require("../../constants/cache.constant");
const cache_service_1 = require("../../processors/cache/cache.service");
const model_transformer_1 = require("../../transformers/model.transformer");
const redis_util_1 = require("../../utils/redis.util");
const configs_model_1 = require("../configs/configs.model");
const analyze_model_1 = require("./analyze.model");
let AnalyzeService = class AnalyzeService {
    constructor(options, analyzeModel, cacheService) {
        this.options = options;
        this.analyzeModel = analyzeModel;
        this.cacheService = cacheService;
    }
    get model() {
        return this.analyzeModel;
    }
    async getRangeAnalyzeData(from = new Date('2020-1-1'), to = new Date(), options) {
        const { limit = 50, page = 1 } = options || {};
        const condition = {
            $and: [
                {
                    timestamp: {
                        $gte: from,
                    },
                },
                {
                    timestamp: {
                        $lte: to,
                    },
                },
            ],
        };
        return await this.analyzeModel.paginate(condition, {
            sort: { timestamp: -1 },
            page,
            limit,
        });
    }
    async getCallTime() {
        var _a, _b;
        const callTime = ((_a = (await this.options
            .findOne({
            name: 'apiCallTime',
        })
            .lean())) === null || _a === void 0 ? void 0 : _a.value) || 0;
        const uv = ((_b = (await this.options
            .findOne({
            name: 'uv',
        })
            .lean())) === null || _b === void 0 ? void 0 : _b.value) || 0;
        return { callTime, uv };
    }
    async cleanAnalyzeRange(range) {
        const { from, to } = range;
        await this.analyzeModel.deleteMany({
            $and: [
                {
                    timestamp: {
                        $gte: from,
                    },
                },
                {
                    timestamp: {
                        $lte: to,
                    },
                },
            ],
        });
    }
    async getIpAndPvAggregate(type, returnObj) {
        let cond = {};
        const now = (0, dayjs_1.default)();
        const beforeDawn = now.set('minute', 0).set('second', 0).set('hour', 0);
        switch (type) {
            case 'day': {
                cond = {
                    timestamp: {
                        $gte: beforeDawn.toDate(),
                    },
                };
                break;
            }
            case 'month': {
                cond = {
                    timestamp: {
                        $gte: beforeDawn.set('day', -30).toDate(),
                    },
                };
                break;
            }
            case 'week': {
                cond = {
                    timestamp: {
                        $gte: beforeDawn.set('day', -7).toDate(),
                    },
                };
                break;
            }
            case 'all':
            default: {
                break;
            }
        }
        const [res, res2] = await Promise.all([
            this.analyzeModel.aggregate([
                { $match: cond },
                {
                    $project: {
                        _id: 1,
                        timestamp: 1,
                        hour: {
                            $dateToString: {
                                format: '%H',
                                date: { $subtract: ['$timestamp', 0] },
                                timezone: '+08:00',
                            },
                        },
                        date: {
                            $dateToString: {
                                format: '%Y-%m-%d',
                                date: { $subtract: ['$timestamp', 0] },
                                timezone: '+08:00',
                            },
                        },
                    },
                },
                {
                    $group: {
                        _id: type === 'day' ? '$hour' : '$date',
                        pv: {
                            $sum: 1,
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        ...(type === 'day' ? { hour: '$_id' } : { date: '$_id' }),
                        pv: 1,
                    },
                },
                {
                    $sort: {
                        date: -1,
                    },
                },
            ]),
            this.analyzeModel.aggregate([
                { $match: cond },
                {
                    $project: {
                        _id: 1,
                        timestamp: 1,
                        ip: 1,
                        hour: {
                            $dateToString: {
                                format: '%H',
                                date: { $subtract: ['$timestamp', 0] },
                                timezone: '+08:00',
                            },
                        },
                        date: {
                            $dateToString: {
                                format: '%Y-%m-%d',
                                date: { $subtract: ['$timestamp', 0] },
                                timezone: '+08:00',
                            },
                        },
                    },
                },
                {
                    $group: {
                        _id: type === 'day'
                            ? { ip: '$ip', hour: '$hour' }
                            : { ip: '$ip', date: '$date' },
                    },
                },
                {
                    $group: {
                        _id: type === 'day' ? '$_id.hour' : '$_id.date',
                        ip: {
                            $sum: 1,
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        ...(type === 'day' ? { hour: '$_id' } : { date: '$_id' }),
                        ip: 1,
                    },
                },
                {
                    $sort: {
                        date: -1,
                    },
                },
            ]),
        ]);
        const arr = (0, lodash_1.merge)(res, res2);
        if (returnObj) {
            const obj = {};
            for (const item of arr) {
                obj[item.hour || item.date] = item;
            }
            return obj;
        }
        return arr;
    }
    async getRangeOfTopPathVisitor(from, to) {
        from = from !== null && from !== void 0 ? from : new Date(new Date().getTime() - 1000 * 24 * 3600 * 7);
        to = to !== null && to !== void 0 ? to : new Date();
        const pipeline = [
            {
                $match: {
                    timestamp: {
                        $gte: from,
                        $lte: to,
                    },
                },
            },
            {
                $group: {
                    _id: '$path',
                    count: {
                        $sum: 1,
                    },
                },
            },
            {
                $sort: {
                    count: -1,
                },
            },
            {
                $project: {
                    _id: 0,
                    path: '$_id',
                    count: 1,
                },
            },
        ];
        const res = await this.analyzeModel.aggregate(pipeline).exec();
        return res;
    }
    async getTodayAccessIp() {
        const redis = this.cacheService.getClient();
        const fromRedisIps = await redis.smembers((0, redis_util_1.getRedisKey)(cache_constant_1.RedisKeys.AccessIp));
        return fromRedisIps;
    }
};
AnalyzeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, model_transformer_1.InjectModel)(configs_model_1.OptionModel)),
    __param(1, (0, model_transformer_1.InjectModel)(analyze_model_1.AnalyzeModel)),
    __metadata("design:paramtypes", [Object, Object, cache_service_1.CacheService])
], AnalyzeService);
exports.AnalyzeService = AnalyzeService;
