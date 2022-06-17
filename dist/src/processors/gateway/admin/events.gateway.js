"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminEventsGateway = void 0;
const path_1 = require("path");
const socket_io_1 = require("socket.io");
const websockets_1 = require("@nestjs/websockets");
const path_constant_1 = require("../../../constants/path.constant");
const cache_service_1 = require("../../cache/cache.service");
const helper_jwt_service_1 = require("../../helper/helper.jwt.service");
const business_event_constant_1 = require("../../../constants/business-event.constant");
const auth_service_1 = require("../../../modules/auth/auth.service");
const auth_gateway_1 = require("../shared/auth.gateway");
const AuthGateway = (0, auth_gateway_1.createAuthGateway)({ namespace: 'admin', authway: 'jwt' });
let AdminEventsGateway = class AdminEventsGateway extends AuthGateway {
    constructor(jwtService, authService, cacheService) {
        super(jwtService, authService, cacheService);
        this.jwtService = jwtService;
        this.authService = authService;
        this.cacheService = cacheService;
        this.subscribeSocketToHandlerMap = new WeakMap();
    }
    async subscribeStdOut(client, data) {
        const { prevLog = true } = data || {};
        if (this.subscribeSocketToHandlerMap.has(client)) {
            return;
        }
        const handler = (data) => {
            client.send(this.gatewayMessageFormat(business_event_constant_1.BusinessEvents.STDOUT, data));
        };
        this.subscribeSocketToHandlerMap.set(client, handler);
        if (prevLog) {
            const { getTodayLogFilePath } = await Promise.resolve().then(() => __importStar(require('~/global/consola.global')));
            const stream = fs
                .createReadStream((0, path_1.resolve)(path_constant_1.LOG_DIR, getTodayLogFilePath()), {
                encoding: 'utf-8',
                highWaterMark: 32 * 1024,
            })
                .on('data', handler)
                .on('end', () => {
                this.cacheService.subscribe('log', handler);
                stream.close();
            });
        }
        else {
            this.cacheService.subscribe('log', handler);
        }
    }
    unsubscribeStdOut(client) {
        const cb = this.subscribeSocketToHandlerMap.get(client);
        if (cb) {
            this.cacheService.unsubscribe('log', cb);
        }
        this.subscribeSocketToHandlerMap.delete(client);
    }
    handleDisconnect(client) {
        super.handleDisconnect(client);
        this.unsubscribeStdOut(client);
    }
};
__decorate([
    (0, websockets_1.SubscribeMessage)('log'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], AdminEventsGateway.prototype, "subscribeStdOut", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('unlog'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], AdminEventsGateway.prototype, "unsubscribeStdOut", null);
AdminEventsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ namespace: 'admin' }),
    __metadata("design:paramtypes", [helper_jwt_service_1.JWTService,
        auth_service_1.AuthService,
        cache_service_1.CacheService])
], AdminEventsGateway);
exports.AdminEventsGateway = AdminEventsGateway;
