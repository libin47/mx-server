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
var CountingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountingService = void 0;
const common_1 = require("@nestjs/common");
const cache_constant_1 = require("../../constants/cache.constant");
const note_model_1 = require("../../modules/note/note.model");
const post_model_1 = require("../../modules/post/post.model");
const model_transformer_1 = require("../../transformers/model.transformer");
const redis_util_1 = require("../../utils/redis.util");
const cache_service_1 = require("../cache/cache.service");
const database_service_1 = require("../database/database.service");
let CountingService = CountingService_1 = class CountingService {
    constructor(postModel, noteModel, redis, databaseService) {
        this.postModel = postModel;
        this.noteModel = noteModel;
        this.redis = redis;
        this.databaseService = databaseService;
        this.logger = new common_1.Logger(CountingService_1.name);
    }
    checkIdAndIp(id, ip) {
        if (!ip) {
            this.logger.debug('无法更新阅读计数, IP 无效');
            return false;
        }
        if (!id) {
            this.logger.debug('无法更新阅读计数, ID 不存在');
            return false;
        }
        return true;
    }
    async updateReadCount(type, id, ip) {
        if (!this.checkIdAndIp(id, ip)) {
            return;
        }
        const model = this.databaseService.getModelByRefType(type);
        const doc = await model.findById(id);
        if (!doc) {
            this.logger.debug('无法更新阅读计数, 文档不存在');
            return;
        }
        const redis = this.redis.getClient();
        const isReadBefore = await redis.sismember((0, redis_util_1.getRedisKey)(cache_constant_1.RedisKeys.Read, id), ip);
        if (isReadBefore) {
            this.logger.debug(`已经增加过计数了, ${id}`);
            return;
        }
        await Promise.all([
            redis.sadd((0, redis_util_1.getRedisKey)(cache_constant_1.RedisKeys.Read, doc._id), ip),
            doc.updateOne({ $inc: { 'count.read': 1 } }),
        ]);
        this.logger.debug(`增加阅读计数, (${doc.title}`);
    }
    async updateLikeCount(type, id, ip) {
        if (!this.checkIdAndIp(id, ip)) {
            throw '无法获取到 IP';
        }
        const model = this.databaseService.getModelByRefType(type);
        const doc = await model.findById(id);
        if (!doc) {
            throw '无法更新喜欢计数, 文档不存在';
        }
        const redis = this.redis.getClient();
        const isLikeBefore = await redis.sismember((0, redis_util_1.getRedisKey)(cache_constant_1.RedisKeys.Like, id), ip);
        if (isLikeBefore) {
            this.logger.debug(`已经增加过计数了, ${id}`);
            return false;
        }
        await Promise.all([
            redis.sadd((0, redis_util_1.getRedisKey)(cache_constant_1.RedisKeys.Like, doc._id), ip),
            doc.updateOne({ $inc: { 'count.like': 1 } }),
        ]);
        this.logger.debug(`增加喜欢计数, (${doc.title}`);
        return true;
    }
};
CountingService = CountingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, model_transformer_1.InjectModel)(post_model_1.PostModel)),
    __param(1, (0, model_transformer_1.InjectModel)(note_model_1.NoteModel)),
    __metadata("design:paramtypes", [Object, Object, cache_service_1.CacheService,
        database_service_1.DatabaseService])
], CountingService);
exports.CountingService = CountingService;
