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
exports.WebEventsGateway = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const socket_io_1 = __importDefault(require("socket.io"));
const websockets_1 = require("@nestjs/websockets");
const redis_emitter_1 = require("@socket.io/redis-emitter");
const business_event_constant_1 = require("../../../constants/business-event.constant");
const cache_constant_1 = require("../../../constants/cache.constant");
const cache_service_1 = require("../../cache/cache.service");
const redis_util_1 = require("../../../utils/redis.util");
const time_util_1 = require("../../../utils/time.util");
const base_gateway_1 = require("../base.gateway");
const danmaku_dto_1 = require("./dtos/danmaku.dto");
let WebEventsGateway = class WebEventsGateway extends base_gateway_1.BoardcastBaseGateway {
    constructor(cacheService) {
        super();
        this.cacheService = cacheService;
    }
    async sendOnlineNumber() {
        return {
            online: await this.getcurrentClientCount(),
            timestamp: new Date().toISOString(),
        };
    }
    createNewDanmaku(data, client) {
        const validator = (0, class_transformer_1.plainToClass)(danmaku_dto_1.DanmakuDto, data);
        (0, class_validator_1.validate)(validator).then((errors) => {
            if (errors.length > 0) {
                return client.send(errors);
            }
            this.broadcast(business_event_constant_1.BusinessEvents.DANMAKU_CREATE, data);
            client.send([]);
        });
    }
    async getcurrentClientCount() {
        const server = this.namespace.server;
        const sockets = await server.of('/web').adapter.sockets(new Set());
        return sockets.size;
    }
    async handleConnection(socket) {
        this.broadcast(business_event_constant_1.BusinessEvents.VISITOR_ONLINE, await this.sendOnlineNumber());
        process.nextTick(async () => {
            const redisClient = this.cacheService.getClient();
            const dateFormat = (0, time_util_1.getShortDate)(new Date());
            const maxOnlineCount = +(await redisClient.hget((0, redis_util_1.getRedisKey)(cache_constant_1.RedisKeys.MaxOnlineCount), dateFormat)) || 0;
            await redisClient.hset((0, redis_util_1.getRedisKey)(cache_constant_1.RedisKeys.MaxOnlineCount), dateFormat, Math.max(maxOnlineCount, await this.getcurrentClientCount()));
            const key = (0, redis_util_1.getRedisKey)(cache_constant_1.RedisKeys.MaxOnlineCount, 'total');
            const totalCount = +(await redisClient.hget(key, dateFormat)) || 0;
            await redisClient.hset(key, dateFormat, totalCount + 1);
        });
        super.handleConnect(socket);
    }
    async handleDisconnect(client) {
        super.handleDisconnect(client);
        this.broadcast(business_event_constant_1.BusinessEvents.VISITOR_OFFLINE, await this.sendOnlineNumber());
    }
    broadcast(event, data) {
        const client = new redis_emitter_1.Emitter(this.cacheService.getClient());
        client.of('/web').emit('message', this.gatewayMessageFormat(event, data));
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.default.Namespace)
], WebEventsGateway.prototype, "namespace", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)(business_event_constant_1.BusinessEvents.DANMAKU_CREATE),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [danmaku_dto_1.DanmakuDto, socket_io_1.default.Socket]),
    __metadata("design:returntype", void 0)
], WebEventsGateway.prototype, "createNewDanmaku", null);
WebEventsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: 'web',
    }),
    __metadata("design:paramtypes", [cache_service_1.CacheService])
], WebEventsGateway);
exports.WebEventsGateway = WebEventsGateway;
