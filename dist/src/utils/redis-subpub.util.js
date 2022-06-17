"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisSubPub = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const common_1 = require("@nestjs/common");
const app_config_1 = require("../app.config");
const env_global_1 = require("../global/env.global");
class RedisSubPub {
    constructor(channelPrefix = 'mx-channel#') {
        this.channelPrefix = channelPrefix;
        this.ctc = new WeakMap();
        if (!env_global_1.isTest) {
            this.init();
        }
        else {
        }
    }
    init() {
        const pubClient = new ioredis_1.default({ host: app_config_1.REDIS.host, port: app_config_1.REDIS.port });
        const subClient = pubClient.duplicate();
        this.pubClient = pubClient;
        this.subClient = subClient;
    }
    async publish(event, data) {
        const channel = this.channelPrefix + event;
        const _data = JSON.stringify(data);
        if (event !== 'log') {
            common_1.Logger.debug(`发布事件：${channel} <- ${_data}`, RedisSubPub.name);
        }
        await this.pubClient.publish(channel, _data);
    }
    async subscribe(event, callback) {
        const myChannel = this.channelPrefix + event;
        this.subClient.subscribe(myChannel);
        const cb = (channel, message) => {
            if (channel === myChannel) {
                if (event !== 'log') {
                    common_1.Logger.debug(`接收事件：${channel} -> ${message}`, RedisSubPub.name);
                }
                callback(JSON.parse(message));
            }
        };
        this.ctc.set(callback, cb);
        this.subClient.on('message', cb);
    }
    async unsubscribe(event, callback) {
        const channel = this.channelPrefix + event;
        this.subClient.unsubscribe(channel);
        const cb = this.ctc.get(callback);
        if (cb) {
            this.subClient.off('message', cb);
            this.ctc.delete(callback);
        }
    }
}
exports.redisSubPub = new RedisSubPub();
