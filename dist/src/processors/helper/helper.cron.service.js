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
var CronService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronService = void 0;
const cluster_1 = __importDefault(require("cluster"));
const cos_nodejs_sdk_v5_1 = __importDefault(require("cos-nodejs-sdk-v5"));
const dayjs_1 = __importDefault(require("dayjs"));
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const mkdirp_1 = __importDefault(require("mkdirp"));
const path_1 = require("path");
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const schedule_1 = require("@nestjs/schedule");
const app_config_1 = require("../../app.config");
const cron_description_decorator_1 = require("../../common/decorator/cron-description.decorator");
const cache_constant_1 = require("../../constants/cache.constant");
const event_bus_constant_1 = require("../../constants/event-bus.constant");
const path_constant_1 = require("../../constants/path.constant");
const aggregate_service_1 = require("../../modules/aggregate/aggregate.service");
const analyze_model_1 = require("../../modules/analyze/analyze.model");
const backup_service_1 = require("../../modules/backup/backup.service");
const configs_service_1 = require("../../modules/configs/configs.service");
const note_service_1 = require("../../modules/note/note.service");
const page_service_1 = require("../../modules/page/page.service");
const post_service_1 = require("../../modules/post/post.service");
const search_service_1 = require("../../modules/search/search.service");
const model_transformer_1 = require("../../transformers/model.transformer");
const redis_util_1 = require("../../utils/redis.util");
const cache_service_1 = require("../cache/cache.service");
const helper_http_service_1 = require("./helper.http.service");
let CronService = CronService_1 = class CronService {
    constructor(http, configs, analyzeModel, cacheService, aggregateService, postService, noteService, pageService, backupService, searchService) {
        this.http = http;
        this.configs = configs;
        this.analyzeModel = analyzeModel;
        this.cacheService = cacheService;
        this.aggregateService = aggregateService;
        this.postService = postService;
        this.noteService = noteService;
        this.pageService = pageService;
        this.backupService = backupService;
        this.searchService = searchService;
        this.logger = new common_1.Logger(CronService_1.name);
        if (app_config_1.isMainCluster || cluster_1.default.isWorker) {
            Object.getOwnPropertyNames(this.constructor.prototype)
                .filter((name) => name != 'constructor')
                .forEach((name) => {
                const metaKeys = Reflect.getOwnMetadataKeys(this[name]);
                const metaMap = new Map();
                for (const key of metaKeys) {
                    metaMap.set(key, Reflect.getOwnMetadata(key, this[name]));
                }
                const originMethod = this[name];
                this[name] = (...args) => {
                    var _a;
                    if (((_a = cluster_1.default.worker) === null || _a === void 0 ? void 0 : _a.id) === 1 || app_config_1.isMainCluster) {
                        originMethod.call(this, ...args);
                    }
                };
                for (const metaKey of metaKeys) {
                    Reflect.defineMetadata(metaKey, metaMap.get(metaKey), this[name]);
                }
            });
        }
    }
    async backupDB({ uploadCOS = true } = {}) {
        if (app_config_1.isInDemoMode) {
            return;
        }
        const backup = await this.backupService.backup();
        if (!backup) {
            this.logger.log('没有开启备份');
            return;
        }
        process.nextTick(async () => {
            if (!uploadCOS) {
                return;
            }
            const { backupOptions } = await this.configs.waitForConfigReady();
            if (!backupOptions.bucket ||
                !backupOptions.region ||
                !backupOptions.secretId ||
                !backupOptions.secretKey) {
                return;
            }
            const backupFilePath = backup.path;
            if (!(0, fs_1.existsSync)(backupFilePath)) {
                this.logger.warn('文件不存在, 无法上传到 COS');
                return;
            }
            this.logger.log('--> 开始上传到 COS');
            const cos = new cos_nodejs_sdk_v5_1.default({
                SecretId: backupOptions.secretId,
                SecretKey: backupOptions.secretKey,
            });
            cos.sliceUploadFile({
                Bucket: backupOptions.bucket,
                Region: backupOptions.region,
                Key: backup.path.slice(backup.path.lastIndexOf('/') + 1),
                FilePath: backupFilePath,
            }, (err) => {
                if (!err) {
                    this.logger.log('--> 上传成功');
                }
                else {
                    this.logger.error('--> 上传失败了');
                    throw err;
                }
            });
        });
    }
    async cleanAccessRecord() {
        const cleanDate = (0, dayjs_1.default)().add(-7, 'd');
        await this.analyzeModel.deleteMany({
            timestamp: {
                $lte: cleanDate.toDate(),
            },
        });
        this.logger.log('--> 清理访问记录成功');
    }
    async resetIPAccess() {
        await this.cacheService.getClient().del((0, redis_util_1.getRedisKey)(cache_constant_1.RedisKeys.AccessIp));
        this.logger.log('--> 清理 IP 访问记录成功');
    }
    async resetLikedOrReadArticleRecord() {
        const redis = this.cacheService.getClient();
        await Promise.all([
            redis.keys((0, redis_util_1.getRedisKey)(cache_constant_1.RedisKeys.Like, '*')),
            redis.keys((0, redis_util_1.getRedisKey)(cache_constant_1.RedisKeys.Read, '*')),
        ].map(async (keys) => {
            return keys.then((keys) => keys.map((key) => redis.del(key)));
        }));
        this.logger.log('--> 清理喜欢数成功');
    }
    async cleanTempDirectory() {
        await (0, promises_1.rm)(path_constant_1.TEMP_DIR, { recursive: true });
        mkdirp_1.default.sync(path_constant_1.TEMP_DIR);
        this.logger.log('--> 清理临时文件成功');
    }
    async cleanLogFile() {
        const files = (await (0, promises_1.readdir)(path_constant_1.LOG_DIR)).filter((file) => file !== 'error.log');
        const rmTaskArr = [];
        for (const file of files) {
            const filePath = (0, path_1.join)(path_constant_1.LOG_DIR, file);
            const state = fs.statSync(filePath);
            const oldThanWeek = (0, dayjs_1.default)().diff(state.mtime, 'day') > 7;
            if (oldThanWeek) {
                rmTaskArr.push((0, promises_1.rm)(filePath));
            }
        }
        await Promise.all(rmTaskArr);
        this.logger.log('--> 清理日志文件成功');
    }
    async pushToBaiduSearch() {
        const { url: { webUrl }, baiduSearchOptions: configs, } = await this.configs.waitForConfigReady();
        if (configs.enable) {
            const token = configs.token;
            if (!token) {
                this.logger.error('[BaiduSearchPushTask] token 为空');
                return;
            }
            const pushUrls = await this.aggregateService.getSiteMapContent();
            const urls = pushUrls
                .map((item) => {
                return item.url;
            })
                .join('\n');
            try {
                const res = await this.http.axiosRef.post(`http://data.zz.baidu.com/urls?site=${webUrl}&token=${token}`, urls, {
                    headers: {
                        'Content-Type': 'text/plain',
                    },
                });
                this.logger.log(`百度站长提交结果: ${JSON.stringify(res.data)}`);
                return res.data;
            }
            catch (e) {
                this.logger.error(`百度推送错误: ${e.message}`);
                throw e;
            }
        }
        return null;
    }
    async pushToAlgoliaSearch() {
        const configs = await this.configs.waitForConfigReady();
        if (!configs.algoliaSearchOptions.enable || isDev) {
            return;
        }
        const index = await this.searchService.getAlgoliaSearchIndex();
        this.logger.log('--> 开始推送到 Algolia');
        const documents = [];
        const combineDocuments = await Promise.all([
            this.postService.model
                .find({ hide: false }, 'title text')
                .lean()
                .then((list) => {
                return list.map((data) => {
                    Reflect.set(data, 'objectID', data._id);
                    Reflect.deleteProperty(data, '_id');
                    return {
                        ...data,
                        type: 'post',
                    };
                });
            }),
            this.pageService.model
                .find({}, 'title text')
                .lean()
                .then((list) => {
                return list.map((data) => {
                    Reflect.set(data, 'objectID', data._id);
                    Reflect.deleteProperty(data, '_id');
                    return {
                        ...data,
                        type: 'page',
                    };
                });
            }),
            this.noteService.model
                .find({
                hide: false,
                $or: [
                    { password: undefined },
                    { password: null },
                    { password: { $exists: false } },
                ],
            }, 'title text nid')
                .lean()
                .then((list) => {
                return list.map((data) => {
                    const id = data.nid.toString();
                    Reflect.set(data, 'objectID', data._id);
                    Reflect.deleteProperty(data, '_id');
                    Reflect.deleteProperty(data, 'nid');
                    return {
                        ...data,
                        type: 'note',
                        id,
                    };
                });
            }),
        ]);
        combineDocuments.forEach((documents_) => {
            documents.push(...documents_);
        });
        try {
            await Promise.all([
                index.clearObjects(),
                index.saveObjects(documents, {
                    autoGenerateObjectIDIfNotExist: false,
                }),
                index.setSettings({
                    attributesToHighlight: ['text', 'title'],
                }),
            ]);
            this.logger.log('--> 推送到 algoliasearch 成功');
        }
        catch (err) {
            common_1.Logger.error('algolia推送错误', 'AlgoliaSearch');
            throw err;
        }
    }
};
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_1AM, { name: 'backupDB' }),
    (0, cron_description_decorator_1.CronDescription)('备份 DB 并上传 COS'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CronService.prototype, "backupDB", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT, {
        name: 'cleanAccessRecord',
    }),
    (0, cron_description_decorator_1.CronDescription)('清理访问记录'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronService.prototype, "cleanAccessRecord", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT, { name: 'resetIPAccess' }),
    (0, cron_description_decorator_1.CronDescription)('清理 IP 访问记录'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronService.prototype, "resetIPAccess", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT, {
        name: 'resetLikedOrReadArticleRecord',
    }),
    (0, cron_description_decorator_1.CronDescription)('清理喜欢数'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronService.prototype, "resetLikedOrReadArticleRecord", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_3AM, { name: 'cleanTempDirectory' }),
    (0, cron_description_decorator_1.CronDescription)('清理临时文件'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronService.prototype, "cleanTempDirectory", null);
__decorate([
    (0, schedule_1.Cron)('5 0 * * *', { name: 'cleanTempDirectory' }),
    (0, cron_description_decorator_1.CronDescription)('清理日志文件'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronService.prototype, "cleanLogFile", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_1AM, { name: 'pushToBaiduSearch' }),
    (0, cron_description_decorator_1.CronDescription)('推送到百度搜索'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronService.prototype, "pushToBaiduSearch", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT, { name: 'pushToAlgoliaSearch' }),
    (0, cron_description_decorator_1.CronDescription)('推送到 Algolia Search'),
    (0, event_emitter_1.OnEvent)(event_bus_constant_1.EventBusEvents.PushSearch),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronService.prototype, "pushToAlgoliaSearch", null);
CronService = CronService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, model_transformer_1.InjectModel)(analyze_model_1.AnalyzeModel)),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => aggregate_service_1.AggregateService))),
    __param(5, (0, common_1.Inject)((0, common_1.forwardRef)(() => post_service_1.PostService))),
    __param(6, (0, common_1.Inject)((0, common_1.forwardRef)(() => note_service_1.NoteService))),
    __param(7, (0, common_1.Inject)((0, common_1.forwardRef)(() => page_service_1.PageService))),
    __param(8, (0, common_1.Inject)((0, common_1.forwardRef)(() => backup_service_1.BackupService))),
    __param(9, (0, common_1.Inject)((0, common_1.forwardRef)(() => search_service_1.SearchService))),
    __metadata("design:paramtypes", [helper_http_service_1.HttpService,
        configs_service_1.ConfigsService, Object, cache_service_1.CacheService,
        aggregate_service_1.AggregateService,
        post_service_1.PostService,
        note_service_1.NoteService,
        page_service_1.PageService,
        backup_service_1.BackupService,
        search_service_1.SearchService])
], CronService);
exports.CronService = CronService;
