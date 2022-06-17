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
exports.PTYGateway = void 0;
const lodash_1 = require("lodash");
const nanoid_1 = require("nanoid");
const node_pty_1 = require("node-pty");
const socket_io_1 = require("socket.io");
const websockets_1 = require("@nestjs/websockets");
const app_config_1 = require("../../app.config");
const business_event_constant_1 = require("../../constants/business-event.constant");
const cache_constant_1 = require("../../constants/cache.constant");
const path_constant_1 = require("../../constants/path.constant");
const auth_service_1 = require("../auth/auth.service");
const configs_service_1 = require("../configs/configs.service");
const cache_service_1 = require("../../processors/cache/cache.service");
const auth_gateway_1 = require("../../processors/gateway/shared/auth.gateway");
const helper_jwt_service_1 = require("../../processors/helper/helper.jwt.service");
const utils_1 = require("../../utils");
const AuthGateway = (0, auth_gateway_1.createAuthGateway)({ namespace: 'pty', authway: 'jwt' });
let PTYGateway = class PTYGateway extends AuthGateway {
    constructor(jwtService, authService, cacheService, configService) {
        super(jwtService, authService);
        this.jwtService = jwtService;
        this.authService = authService;
        this.cacheService = cacheService;
        this.configService = configService;
        this.socket2ptyMap = new WeakMap();
    }
    async pty(client, data) {
        if (app_config_1.isInDemoMode) {
            client.send(this.gatewayMessageFormat(business_event_constant_1.BusinessEvents.PTY_MESSAGE, 'PTY 在演示模式下不可用'));
            return;
        }
        const password = data === null || data === void 0 ? void 0 : data.password;
        const terminalOptions = await this.configService.get('terminalOptions');
        if (!terminalOptions.enable) {
            client.send(this.gatewayMessageFormat(business_event_constant_1.BusinessEvents.PTY_MESSAGE, 'PTY 已禁用'));
            return;
        }
        const isValidPassword = (0, lodash_1.isNil)(terminalOptions.password)
            ? true
            : password === terminalOptions.password;
        if (!isValidPassword) {
            if (typeof password === 'undefined' || password === '') {
                client.send(this.gatewayMessageFormat(business_event_constant_1.BusinessEvents.PTY_MESSAGE, 'PTY 验证未通过：需要密码验证', 10000));
            }
            else {
                client.send(this.gatewayMessageFormat(business_event_constant_1.BusinessEvents.PTY_MESSAGE, 'PTY 验证未通过：密码错误', 10001));
            }
            return;
        }
        const zsh = await nothrow($ `zsh --version`);
        const fish = await nothrow($ `fish --version`);
        const pty = (0, node_pty_1.spawn)(os.platform() === 'win32'
            ? 'powershell.exe'
            : zsh.exitCode == 0
                ? 'zsh'
                : fish.exitCode == 0
                    ? 'fish'
                    : 'bash', [], {
            cwd: path_constant_1.DATA_DIR,
            cols: (data === null || data === void 0 ? void 0 : data.cols) || 30,
            rows: (data === null || data === void 0 ? void 0 : data.rows) || 80,
        });
        const nid = (0, nanoid_1.nanoid)();
        const ip = client.handshake.headers['x-forwarded-for'] ||
            client.handshake.address ||
            (0, utils_1.getIp)(client.request) ||
            client.conn.remoteAddress;
        this.cacheService.getClient().hset((0, utils_1.getRedisKey)(cache_constant_1.RedisKeys.PTYSession), nid, `${new Date().toISOString()},${ip}`);
        pty.onExit(async () => {
            const hvalue = await this.cacheService
                .getClient()
                .hget((0, utils_1.getRedisKey)(cache_constant_1.RedisKeys.PTYSession), nid);
            if (hvalue) {
                this.cacheService
                    .getClient()
                    .hset((0, utils_1.getRedisKey)(cache_constant_1.RedisKeys.PTYSession), nid, `${hvalue},${new Date().toISOString()}`);
            }
        });
        if (terminalOptions.script) {
            pty.write(terminalOptions.script);
            pty.write('\n');
        }
        pty.onData((data) => {
            client.send(this.gatewayMessageFormat(business_event_constant_1.BusinessEvents.PTY, data));
        });
        this.socket2ptyMap.set(client, pty);
    }
    async ptyInput(client, data) {
        const pty = this.socket2ptyMap.get(client);
        if (pty) {
            pty.write(data);
        }
    }
    async ptyExit(client) {
        const pty = this.socket2ptyMap.get(client);
        if (pty) {
            pty.kill();
        }
        this.socket2ptyMap.delete(client);
    }
    handleDisconnect(client) {
        this.ptyExit(client);
        super.handleDisconnect(client);
    }
};
__decorate([
    (0, websockets_1.SubscribeMessage)('pty'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], PTYGateway.prototype, "pty", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('pty-input'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", Promise)
], PTYGateway.prototype, "ptyInput", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('pty-exit'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], PTYGateway.prototype, "ptyExit", null);
PTYGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ namespace: 'pty' }),
    __metadata("design:paramtypes", [helper_jwt_service_1.JWTService,
        auth_service_1.AuthService,
        cache_service_1.CacheService,
        configs_service_1.ConfigsService])
], PTYGateway);
exports.PTYGateway = PTYGateway;
