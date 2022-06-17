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
exports.BaseOptionController = void 0;
const openapi = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const common_1 = require("@nestjs/common");
const demo_decorator_1 = require("../../../common/decorator/demo.decorator");
const http_decorator_1 = require("../../../common/decorator/http.decorator");
const configs_interface_1 = require("../../configs/configs.interface");
const configs_service_1 = require("../../configs/configs.service");
const jsonschema_util_1 = require("../../../utils/jsonschema.util");
const config_dto_1 = require("../dtos/config.dto");
const option_decorator_1 = require("../option.decorator");
let BaseOptionController = class BaseOptionController {
    constructor(configsService, configs) {
        this.configsService = configsService;
        this.configs = configs;
    }
    getOption() {
        return (0, class_transformer_1.instanceToPlain)(this.configs.getConfig());
    }
    getJsonSchema() {
        return Object.assign((0, jsonschema_util_1.classToJsonSchema)(configs_interface_1.IConfig), {
            default: this.configs.defaultConfig,
        });
    }
    async getOptionKey(key) {
        if (typeof key !== 'string' && !key) {
            throw new common_1.UnprocessableEntityException(`key must be IConfigKeys, got ${key}`);
        }
        const value = await this.configs.get(key);
        if (!value) {
            throw new common_1.BadRequestException('key is not exists.');
        }
        return { data: (0, class_transformer_1.instanceToPlain)(value) };
    }
    patch(params, body) {
        if (typeof body !== 'object') {
            throw new common_1.UnprocessableEntityException('body must be object');
        }
        return this.configsService.patchAndValid(params.key, body);
    }
};
__decorate([
    (0, common_1.Get)('/'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BaseOptionController.prototype, "getOption", null);
__decorate([
    http_decorator_1.HTTPDecorators.Bypass,
    (0, common_1.Get)('/jsonschema'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BaseOptionController.prototype, "getJsonSchema", null);
__decorate([
    (0, common_1.Get)('/:key'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BaseOptionController.prototype, "getOptionKey", null);
__decorate([
    (0, common_1.Patch)('/:key'),
    demo_decorator_1.BanInDemo,
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [config_dto_1.ConfigKeyDto, Object]),
    __metadata("design:returntype", void 0)
], BaseOptionController.prototype, "patch", null);
BaseOptionController = __decorate([
    (0, option_decorator_1.OptionController)(),
    __metadata("design:paramtypes", [configs_service_1.ConfigsService,
        configs_service_1.ConfigsService])
], BaseOptionController);
exports.BaseOptionController = BaseOptionController;
