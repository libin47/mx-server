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
exports.SystemEventsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const cache_service_1 = require("../../cache/cache.service");
const helper_jwt_service_1 = require("../../helper/helper.jwt.service");
const auth_service_1 = require("../../../modules/auth/auth.service");
const auth_gateway_1 = require("../shared/auth.gateway");
const AuthGateway = (0, auth_gateway_1.createAuthGateway)({
    namespace: 'system',
    authway: 'custom-token',
});
let SystemEventsGateway = class SystemEventsGateway extends AuthGateway {
    constructor(jwtService, authService, cacheService) {
        super(jwtService, authService, cacheService);
        this.jwtService = jwtService;
        this.authService = authService;
        this.cacheService = cacheService;
    }
};
SystemEventsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ namespace: 'system' }),
    __metadata("design:paramtypes", [helper_jwt_service_1.JWTService,
        auth_service_1.AuthService,
        cache_service_1.CacheService])
], SystemEventsGateway);
exports.SystemEventsGateway = SystemEventsGateway;
