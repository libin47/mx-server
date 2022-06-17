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
exports.StateDto = exports.CommentRefTypesDto = exports.TextOnlyDto = exports.CommentDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const comment_model_1 = require("./comment.model");
class CommentDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { author: { required: true, type: () => String }, text: { required: true, type: () => String }, mail: { required: true, type: () => String }, url: { required: false, type: () => String }, avatars: { required: false, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.MaxLength)(20, { message: '昵称不得大于 20 个字符' }),
    __metadata("design:type", String)
], CommentDto.prototype, "author", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.MaxLength)(500, { message: '评论内容不得大于 500 个字符' }),
    __metadata("design:type", String)
], CommentDto.prototype, "text", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEmail)(undefined, { message: '请更正为正确的邮箱' }),
    (0, swagger_1.ApiProperty)({ example: 'test@mail.com' }),
    (0, class_validator_1.MaxLength)(50, { message: '邮箱地址不得大于 50 个字符' }),
    __metadata("design:type", String)
], CommentDto.prototype, "mail", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsUrl)({ require_protocol: true }, { message: '请更正为正确的网址' }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({ example: 'http://example.com' }),
    (0, class_validator_1.MaxLength)(50, { message: '地址不得大于 50 个字符' }),
    __metadata("design:type", String)
], CommentDto.prototype, "url", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsUrl)({ require_protocol: true }, { message: '请更正为正确的图像网址' }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({ example: 'https://image.wind-watcher.cn/dd3010cf57ee5ae139c84e69c665bf5d' }),
    (0, class_validator_1.MaxLength)(100, { message: '头像地址不得大于 100 个字符' }),
    __metadata("design:type", String)
], CommentDto.prototype, "avatars", void 0);
exports.CommentDto = CommentDto;
class TextOnlyDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { text: { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TextOnlyDto.prototype, "text", void 0);
exports.TextOnlyDto = TextOnlyDto;
class CommentRefTypesDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { ref: { required: false, enum: require("./comment.model").CommentRefTypes } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(comment_model_1.CommentRefTypes),
    (0, swagger_1.ApiProperty)({ enum: comment_model_1.CommentRefTypes, required: false }),
    __metadata("design:type", String)
], CommentRefTypesDto.prototype, "ref", void 0);
exports.CommentRefTypesDto = CommentRefTypesDto;
class StateDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { state: { required: true, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsIn)([0, 1, 2]),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], StateDto.prototype, "state", void 0);
exports.StateDto = StateDto;
