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
exports.TaskQueueService = void 0;
const types_1 = require("util/types");
const common_1 = require("@nestjs/common");
const utils_1 = require("../../utils");
const cache_service_1 = require("../cache/cache.service");
let TaskQueueService = class TaskQueueService {
    constructor(redis) {
        this.redis = redis;
        this.tasks = new RedisMap(redis.getClient(), 'tq');
    }
    add(name, task) {
        this.tasks.set(name, { status: 'pending', updatedAt: new Date() });
        if ((0, types_1.isAsyncFunction)(task)) {
            task()
                .then(() => {
                this.tasks.set(name, { status: 'fulfill', updatedAt: new Date() });
            })
                .catch((err) => {
                console.debug(err);
                this.tasks.set(name, {
                    status: 'reject',
                    updatedAt: new Date(),
                    message: err.message,
                });
            });
        }
        else {
            try {
                task();
                this.tasks.set(name, { status: 'fulfill', updatedAt: new Date() });
            }
            catch (err) {
                console.debug(err);
                this.tasks.set(name, {
                    status: 'reject',
                    updatedAt: new Date(),
                    message: err.message,
                });
            }
        }
    }
    async get(name) {
        const task = await this.tasks.get(name);
        return !task ? null : { ...task };
    }
};
TaskQueueService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cache_service_1.CacheService])
], TaskQueueService);
exports.TaskQueueService = TaskQueueService;
class RedisMap {
    constructor(redis, hashName) {
        this.redis = redis;
        this.hashName = hashName;
        this.hashName = `${RedisMap.key}${hashName}#`;
    }
    async get(key) {
        const res = await this.redis.hget(this.hashName, key);
        return (0, utils_1.safeJSONParse)(res);
    }
    set(key, data) {
        return this.redis.hset(this.hashName, key, JSON.stringify(data));
    }
}
RedisMap.key = 'redis-map#';
