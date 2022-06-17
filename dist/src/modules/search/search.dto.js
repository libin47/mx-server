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
exports.SearchDto = void 0;
const openapi = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const pager_dto_1 = require("../../shared/dto/pager.dto");
class SearchDto extends pager_dto_1.PagerDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { keyword: { required: true, type: () => String }, orderBy: { required: true, type: () => String }, order: { required: true, type: () => Number }, rawAlgolia: { required: false, type: () => Boolean } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SearchDto.prototype, "keyword", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ description: '根据什么排序', required: false }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchDto.prototype, "orderBy", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value: val }) => parseInt(val)),
    (0, class_validator_1.IsEnum)([1, -1]),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({ description: '倒序|正序', enum: [1, -1], required: false }),
    __metadata("design:type", Number)
], SearchDto.prototype, "order", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)([0, 1]),
    (0, class_transformer_1.Transform)(({ value }) => (value === 'true' || value === '1' ? 1 : 0)),
    __metadata("design:type", Boolean)
], SearchDto.prototype, "rawAlgolia", void 0);
exports.SearchDto = SearchDto;
