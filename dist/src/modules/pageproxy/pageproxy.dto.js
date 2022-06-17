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
exports.PageProxyDebugDto = void 0;
const openapi = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const isAllowedUrl_1 = require("../../utils/validator/isAllowedUrl");
class PageProxyDebugDto {
    constructor() {
        this.__onlyGithub = false;
        this.__purge = false;
        this.__local = false;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { __debug: { required: true, type: () => Boolean }, __apiUrl: { required: false, type: () => String }, __gatewayUrl: { required: false, type: () => String }, __onlyGithub: { required: true, type: () => Object, default: false }, __version: { required: false, type: () => String }, __purge: { required: true, type: () => Object, description: "\u65E0\u7F13\u5B58\u8BBF\u95EE, redis no", default: false }, __local: { required: true, type: () => Object, default: false } };
    }
}
__decorate([
    (0, class_validator_1.IsIn)([false]),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (value === 'false' ? false : true)),
    __metadata("design:type", Boolean)
], PageProxyDebugDto.prototype, "__debug", void 0);
__decorate([
    (0, isAllowedUrl_1.IsAllowedUrl)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PageProxyDebugDto.prototype, "__apiUrl", void 0);
__decorate([
    (0, isAllowedUrl_1.IsAllowedUrl)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PageProxyDebugDto.prototype, "__gatewayUrl", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        return ['', 'true', true].includes(value) ? true : false;
    }),
    __metadata("design:type", Object)
], PageProxyDebugDto.prototype, "__onlyGithub", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsSemVer)(),
    (0, class_transformer_1.Transform)(({ value }) => (value === 'latest' ? null : value)),
    __metadata("design:type", String)
], PageProxyDebugDto.prototype, "__version", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => (value === 'true' ? true : false)),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], PageProxyDebugDto.prototype, "__purge", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], PageProxyDebugDto.prototype, "__local", void 0);
exports.PageProxyDebugDto = PageProxyDebugDto;
