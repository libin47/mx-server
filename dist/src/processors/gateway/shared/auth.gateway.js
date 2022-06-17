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
exports.createAuthGateway = void 0;
const socket_io_1 = require("socket.io");
const event_emitter_1 = require("@nestjs/event-emitter");
const websockets_1 = require("@nestjs/websockets");
const redis_emitter_1 = require("@socket.io/redis-emitter");
const event_bus_constant_1 = require("../../../constants/event-bus.constant");
const business_event_constant_1 = require("../../../constants/business-event.constant");
const base_gateway_1 = require("../base.gateway");
const createAuthGateway = (options) => {
    const { namespace, authway = 'all' } = options;
    class AuthGateway extends base_gateway_1.BoardcastBaseGateway {
        constructor(jwtService, authService, cacheService) {
            super();
            this.jwtService = jwtService;
            this.authService = authService;
            this.cacheService = cacheService;
            this.tokenSocketIdMap = new Map();
        }
        async authFailed(client) {
            client.send(this.gatewayMessageFormat(business_event_constant_1.BusinessEvents.AUTH_FAILED, '认证失败'));
            client.disconnect();
        }
        async authToken(token) {
            if (typeof token !== 'string') {
                return false;
            }
            const validCustomToken = async () => {
                const [verifyCustomToken] = await this.authService.verifyCustomToken(token);
                if (verifyCustomToken) {
                    return true;
                }
                return false;
            };
            const validJwt = async () => {
                try {
                    const ok = await this.jwtService.verify(token);
                    if (!ok) {
                        return false;
                    }
                }
                catch {
                    return false;
                }
                return true;
            };
            switch (authway) {
                case 'custom-token': {
                    return await validCustomToken();
                }
                case 'jwt': {
                    return await validJwt();
                }
                case 'all': {
                    const validCustomTokenResult = await validCustomToken();
                    return validCustomTokenResult || (await validJwt());
                }
            }
        }
        async handleConnection(client) {
            const token = client.handshake.query.token ||
                client.handshake.headers['authorization'] ||
                client.handshake.headers['Authorization'];
            if (!token) {
                return this.authFailed(client);
            }
            if (!(await this.authToken(token))) {
                return this.authFailed(client);
            }
            super.handleConnect(client);
            const sid = client.id;
            this.tokenSocketIdMap.set(token.toString(), sid);
        }
        handleDisconnect(client) {
            super.handleDisconnect(client);
        }
        handleTokenExpired(token) {
            const server = this.namespace.server;
            const sid = this.tokenSocketIdMap.get(token);
            if (!sid) {
                return false;
            }
            const socket = server.of(`/${namespace}`).sockets.get(sid);
            if (socket) {
                socket.disconnect();
                super.handleDisconnect(socket);
                return true;
            }
            return false;
        }
        broadcast(event, data) {
            const client = new redis_emitter_1.Emitter(this.cacheService.getClient());
            client
                .of(`/${namespace}`)
                .emit('message', this.gatewayMessageFormat(event, data));
        }
    }
    __decorate([
        (0, websockets_1.WebSocketServer)(),
        __metadata("design:type", socket_io_1.Namespace)
    ], AuthGateway.prototype, "namespace", void 0);
    __decorate([
        (0, event_emitter_1.OnEvent)(event_bus_constant_1.EventBusEvents.TokenExpired),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], AuthGateway.prototype, "handleTokenExpired", null);
    return AuthGateway;
};
exports.createAuthGateway = createAuthGateway;
