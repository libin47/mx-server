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
exports.AnalyzeController = void 0;
const openapi = require("@nestjs/swagger");
const dayjs_1 = __importDefault(require("dayjs"));
const common_1 = require("@nestjs/common");
const auth_decorator_1 = require("../../common/decorator/auth.decorator");
const http_decorator_1 = require("../../common/decorator/http.decorator");
const openapi_decorator_1 = require("../../common/decorator/openapi.decorator");
const cache_constant_1 = require("../../constants/cache.constant");
const cache_service_1 = require("../../processors/cache/cache.service");
const redis_util_1 = require("../../utils/redis.util");
const time_util_1 = require("../../utils/time.util");
const analyze_dto_1 = require("./analyze.dto");
const analyze_service_1 = require("./analyze.service");
let AnalyzeController = class AnalyzeController {
    constructor(service, cacheService) {
        this.service = service;
        this.cacheService = cacheService;
    }
    async getAnalyze(query) {
        const { from, to = new Date(), page = 1, size = 50 } = query;
        const data = await this.service.getRangeAnalyzeData(from, to, {
            limit: size | 0,
            page,
        });
        return data;
    }
    async getAnalyzeToday(query) {
        const { page = 1, size = 50 } = query;
        const today = new Date();
        const todayEarly = (0, time_util_1.getTodayEarly)(today);
        return await this.service.getRangeAnalyzeData(todayEarly, today, {
            limit: ~~size,
            page,
        });
    }
    async getAnalyzeWeek(query) {
        const { page = 1, size = 50 } = query;
        const today = new Date();
        const weekStart = (0, time_util_1.getWeekStart)(today);
        return await this.service.getRangeAnalyzeData(weekStart, today, {
            limit: size,
            page,
        });
    }
    async getFragment() {
        const getIpAndPvAggregate = async () => {
            const day = await this.service.getIpAndPvAggregate('day', true);
            const dayData = Array(24)
                .fill(undefined)
                .map((v, i) => {
                var _a, _b;
                return [
                    {
                        hour: `${i}时`,
                        key: 'ip',
                        value: ((_a = day[i.toString().padStart(2, '0')]) === null || _a === void 0 ? void 0 : _a.ip) || 0,
                    },
                    {
                        hour: `${i}时`,
                        key: 'pv',
                        value: ((_b = day[i.toString().padStart(2, '0')]) === null || _b === void 0 ? void 0 : _b.pv) || 0,
                    },
                ];
            });
            const all = (await this.service.getIpAndPvAggregate('all'));
            const weekData = all
                .slice(0, 7)
                .map((item) => {
                const date = `周${['日', '一', '二', '三', '四', '五', '六'][(0, dayjs_1.default)(item.date).get('day')]}`;
                return [
                    {
                        day: date,
                        key: 'ip',
                        value: item.ip,
                    },
                    {
                        day: date,
                        key: 'pv',
                        value: item.pv,
                    },
                ];
            })
                .reverse();
            const monthData = all
                .slice(0, 30)
                .map((item) => {
                return [
                    {
                        date: item.date.split('-').slice(1, 3).join('-'),
                        key: 'ip',
                        value: item.ip,
                    },
                    {
                        date: item.date.split('-').slice(1, 3).join('-'),
                        key: 'pv',
                        value: item.pv,
                    },
                ];
            })
                .reverse();
            return {
                dayData,
                weekData,
                monthData,
            };
        };
        const [paths, total, today_ips, { dayData, monthData, weekData }] = await Promise.all([
            this.service.getRangeOfTopPathVisitor(),
            this.service.getCallTime(),
            this.service.getTodayAccessIp(),
            getIpAndPvAggregate(),
        ]);
        return {
            today: dayData.flat(1),
            weeks: weekData.flat(1),
            months: monthData.flat(1),
            paths: paths.slice(50),
            total,
            today_ips,
        };
    }
    async getTodayLikedArticle() {
        const client = this.cacheService.getClient();
        const keys = await client.keys((0, redis_util_1.getRedisKey)(cache_constant_1.RedisKeys.Like, '*'));
        return Promise.all(keys.map(async (key) => {
            const id = key.split('_').pop();
            return {
                id,
                ips: await client.smembers((0, redis_util_1.getRedisKey)(cache_constant_1.RedisKeys.Like, id)),
            };
        }));
    }
    async clearAnalyze(query) {
        const { from = new Date('2020-01-01'), to = new Date() } = query;
        await this.service.cleanAnalyzeRange({ from, to });
        return;
    }
};
__decorate([
    (0, common_1.Get)('/'),
    http_decorator_1.Paginator,
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AnalyzeController.prototype, "getAnalyze", null);
__decorate([
    (0, common_1.Get)('/today'),
    http_decorator_1.Paginator,
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AnalyzeController.prototype, "getAnalyzeToday", null);
__decorate([
    (0, common_1.Get)('/week'),
    http_decorator_1.Paginator,
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AnalyzeController.prototype, "getAnalyzeWeek", null);
__decorate([
    (0, common_1.Get)('/aggregate'),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyzeController.prototype, "getFragment", null);
__decorate([
    (0, common_1.Get)('/like'),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyzeController.prototype, "getTodayLikedArticle", null);
__decorate([
    (0, common_1.Delete)('/'),
    (0, common_1.HttpCode)(204),
    openapi.ApiResponse({ status: 204 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [analyze_dto_1.AnalyzeDto]),
    __metadata("design:returntype", Promise)
], AnalyzeController.prototype, "clearAnalyze", null);
AnalyzeController = __decorate([
    (0, common_1.Controller)({ path: 'analyze' }),
    openapi_decorator_1.ApiName,
    (0, auth_decorator_1.Auth)(),
    __metadata("design:paramtypes", [analyze_service_1.AnalyzeService,
        cache_service_1.CacheService])
], AnalyzeController);
exports.AnalyzeController = AnalyzeController;
