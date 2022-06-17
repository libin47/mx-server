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
exports.UserPatchDto = exports.LoginDto = exports.UserDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const isAllowedUrl_1 = require("../../utils/validator/isAllowedUrl");
class UserOptionDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { introduce: { required: false, type: () => String }, mail: { required: false, type: () => String }, url: { required: false, type: () => String }, name: { required: false, type: () => String }, avatar: { required: false, type: () => String }, socialIds: { required: false, type: () => Object } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({ example: '我是练习时长两年半的个人练习生' }),
    __metadata("design:type", String)
], UserOptionDto.prototype, "introduce", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: 'example@example.com' }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UserOptionDto.prototype, "mail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: 'http://example.com' }),
    (0, class_validator_1.IsUrl)({ require_protocol: true }, { message: '请更正为正确的网址' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UserOptionDto.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UserOptionDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, isAllowedUrl_1.IsAllowedUrl)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UserOptionDto.prototype, "avatar", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, swagger_1.ApiProperty)({ description: '各种社交 id 记录' }),
    __metadata("design:type", Object)
], UserOptionDto.prototype, "socialIds", void 0);
class UserDto extends UserOptionDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { username: { required: true, type: () => String }, password: { required: true, type: () => String } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: '用户名？' }),
    __metadata("design:type", String)
], UserDto.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: '密码？' }),
    __metadata("design:type", String)
], UserDto.prototype, "password", void 0);
exports.UserDto = UserDto;
class LoginDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { username: { required: true, type: () => String }, password: { required: true, type: () => String } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ required: true }),
    (0, class_validator_1.IsString)({ message: '用户名？' }),
    __metadata("design:type", String)
], LoginDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: true }),
    (0, class_validator_1.IsString)({ message: '密码？' }),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
exports.LoginDto = LoginDto;
class UserPatchDto extends UserOptionDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { username: { required: true, type: () => String }, password: { required: true, type: () => String } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UserPatchDto.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UserPatchDto.prototype, "password", void 0);
exports.UserPatchDto = UserPatchDto;
