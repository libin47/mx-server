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
exports.InitController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const openapi_decorator_1 = require("../../common/decorator/openapi.decorator");
const configs_service_1 = require("../configs/configs.service");
const config_dto_1 = require("../option/dtos/config.dto");
const init_service_1 = require("./init.service");
let InitController = class InitController {
    constructor(configs, initService) {
        this.configs = configs;
        this.initService = initService;
    }
    async isInit() {
        return {
            isInit: await this.initService.isInit(),
        };
    }
    async getDefaultConfig() {
        const { isInit } = await this.isInit();
        if (isInit) {
            throw new common_1.ForbiddenException('默认设置在完成注册之后不可见');
        }
        return this.configs.defaultConfig;
    }
    async patch(params, body) {
        const { isInit } = await this.isInit();
        if (isInit) {
            throw new common_1.BadRequestException('已经完成初始化, 请登录后进行设置');
        }
        if (typeof body !== 'object') {
            throw new common_1.UnprocessableEntityException('body must be object');
        }
        return this.configs.patchAndValid(params.key, body);
    }
};
__decorate([
    (0, common_1.Get)('/'),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InitController.prototype, "isInit", null);
__decorate([
    (0, common_1.Get)('/configs/default'),
    openapi.ApiResponse({ status: 200, type: require("../configs/configs.interface").IConfig }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InitController.prototype, "getDefaultConfig", null);
__decorate([
    (0, common_1.Patch)('/configs/:key'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [config_dto_1.ConfigKeyDto, Object]),
    __metadata("design:returntype", Promise)
], InitController.prototype, "patch", null);
InitController = __decorate([
    (0, common_1.Controller)({
        path: '/init',
        scope: common_1.Scope.REQUEST,
    }),
    openapi_decorator_1.ApiName,
    __metadata("design:paramtypes", [configs_service_1.ConfigsService,
        init_service_1.InitService])
], InitController);
exports.InitController = InitController;
