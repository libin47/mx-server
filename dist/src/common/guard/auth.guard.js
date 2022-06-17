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
exports.AuthGuard = void 0;
const class_validator_1 = require("class-validator");
const common_1 = require("@nestjs/common");
const env_global_1 = require("../../global/env.global");
const user_mock_1 = require("../../mock/user.mock");
const auth_service_1 = require("../../modules/auth/auth.service");
const configs_service_1 = require("../../modules/configs/configs.service");
const get_req_transformer_1 = require("../../transformers/get-req.transformer");
let AuthGuard = class AuthGuard {
    constructor(authService, configs) {
        this.authService = authService;
        this.configs = configs;
    }
    async canActivate(context) {
        const request = this.getRequest(context);
        if (env_global_1.isTest) {
            request.user = { ...user_mock_1.mockUser1 };
            return true;
        }
        const query = request.query;
        const headers = request.headers;
        const Authorization = headers.authorization || headers.Authorization || query.token;
        if (!Authorization) {
            throw new common_1.UnauthorizedException('未登录');
        }
        if (this.authService.isCustomToken(Authorization)) {
            const [isValid, userModel] = await this.authService.verifyCustomToken(Authorization);
            if (!isValid) {
                throw new common_1.UnauthorizedException('令牌无效');
            }
            request.user = userModel;
            request.token = Authorization;
            return true;
        }
        const jwt = Authorization.replace(/[Bb]earer /, '');
        if (!(0, class_validator_1.isJWT)(jwt)) {
            throw new common_1.UnauthorizedException('令牌无效');
        }
        const ok = await this.authService.jwtServicePublic.verify(jwt);
        if (!ok) {
            throw new common_1.UnauthorizedException('身份过期');
        }
        request.user = await this.configs.getMaster();
        request.token = jwt;
        return true;
    }
    getRequest(context) {
        return (0, get_req_transformer_1.getNestExecutionContextRequest)(context);
    }
};
AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        configs_service_1.ConfigsService])
], AuthGuard);
exports.AuthGuard = AuthGuard;
