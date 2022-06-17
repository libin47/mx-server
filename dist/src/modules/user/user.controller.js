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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_decorator_1 = require("../../common/decorator/auth.decorator");
const cache_decorator_1 = require("../../common/decorator/cache.decorator");
const current_user_decorator_1 = require("../../common/decorator/current-user.decorator");
const demo_decorator_1 = require("../../common/decorator/demo.decorator");
const ip_decorator_1 = require("../../common/decorator/ip.decorator");
const openapi_decorator_1 = require("../../common/decorator/openapi.decorator");
const role_decorator_1 = require("../../common/decorator/role.decorator");
const utils_1 = require("../../utils");
const auth_service_1 = require("../auth/auth.service");
const user_dto_1 = require("./user.dto");
const user_service_1 = require("./user.service");
let UserController = class UserController {
    constructor(userService, authService) {
        this.userService = userService;
        this.authService = authService;
    }
    async getMasterInfo(isMaster) {
        return await this.userService.getMasterInfo(isMaster);
    }
    async register(userDto) {
        var _a;
        userDto.name = (_a = userDto.name) !== null && _a !== void 0 ? _a : userDto.username;
        return await this.userService.createMaster(userDto);
    }
    async login(dto, ipLocation) {
        var _a;
        const user = await this.userService.login(dto.username, dto.password);
        const footstep = await this.userService.recordFootstep(ipLocation.ip);
        const { name, username, created, url, mail, id } = user;
        const avatar = (_a = user.avatar) !== null && _a !== void 0 ? _a : (0, utils_1.getAvatar)(mail);
        return {
            token: this.authService.jwtServicePublic.sign(user._id),
            ...footstep,
            name,
            username,
            created,
            url,
            mail,
            avatar,
            id,
        };
    }
    checkLogged(isMaster) {
        return { ok: +isMaster, isGuest: !isMaster };
    }
    async patchMasterData(body, user) {
        return await this.userService.patchUserData(user, body);
    }
    async singout(token) {
        return this.userService.signout(token);
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: '获取主人信息' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, role_decorator_1.IsMaster)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getMasterInfo", null);
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: '注册' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.UserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({ summary: '登录' }),
    (0, cache_decorator_1.HttpCache)({ disable: true }),
    (0, common_1.HttpCode)(200),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, ip_decorator_1.IpLocation)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('check_logged'),
    (0, swagger_1.ApiOperation)({ summary: '判断当前 Token 是否有效 ' }),
    (0, auth_decorator_1.Auth)(),
    cache_decorator_1.HttpCache.disable,
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, role_decorator_1.IsMaster)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "checkLogged", null);
__decorate([
    (0, common_1.Patch)(),
    (0, swagger_1.ApiOperation)({ summary: '修改主人的信息' }),
    (0, auth_decorator_1.Auth)(),
    cache_decorator_1.HttpCache.disable,
    demo_decorator_1.BanInDemo,
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.UserPatchDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "patchMasterData", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, auth_decorator_1.Auth)(),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, current_user_decorator_1.CurrentUserToken)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "singout", null);
UserController = __decorate([
    openapi_decorator_1.ApiName,
    (0, common_1.Controller)(['master', 'user']),
    __metadata("design:paramtypes", [user_service_1.UserService,
        auth_service_1.AuthService])
], UserController);
exports.UserController = UserController;
