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
exports.OffsetDto = exports.PagerDto = void 0;
const openapi = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class DbQueryDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { db_query: { required: false, type: () => Object } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], DbQueryDto.prototype, "db_query", void 0);
class PagerDto extends DbQueryDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { size: { required: true, type: () => Number }, page: { required: true, type: () => Number }, select: { required: false, type: () => String }, sortBy: { required: false, type: () => String }, sortOrder: { required: false, type: () => Object }, year: { required: false, type: () => Number }, state: { required: false, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(50),
    (0, class_validator_1.IsInt)(),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Transform)(({ value: val }) => (val ? parseInt(val) : 10), {
        toClassOnly: true,
    }),
    (0, swagger_1.ApiProperty)({ example: 10 }),
    __metadata("design:type", Number)
], PagerDto.prototype, "size", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value: val }) => (val ? parseInt(val) : 1), {
        toClassOnly: true,
    }),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsInt)(),
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], PagerDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], PagerDto.prototype, "select", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PagerDto.prototype, "sortBy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)([1, -1]),
    (0, class_transformer_1.Transform)(({ value: val }) => {
        const isStringNumber = typeof val === 'string' && !isNaN(val);
        if (isStringNumber) {
            return parseInt(val);
        }
        else {
            return {
                asc: 1,
                desc: -1,
            }[val.toString()];
        }
    }),
    __metadata("design:type", Number)
], PagerDto.prototype, "sortOrder", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value: val }) => parseInt(val)),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsInt)(),
    (0, swagger_1.ApiProperty)({ example: 2020 }),
    __metadata("design:type", Number)
], PagerDto.prototype, "year", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value: val }) => parseInt(val)),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], PagerDto.prototype, "state", void 0);
exports.PagerDto = PagerDto;
class OffsetDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { before: { required: false, type: () => String }, after: { required: false, type: () => String }, size: { required: false, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], OffsetDto.prototype, "before", void 0);
__decorate([
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)((o) => {
        return typeof o.before !== 'undefined';
    }),
    __metadata("design:type", String)
], OffsetDto.prototype, "after", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => +value),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Max)(50),
    __metadata("design:type", Number)
], OffsetDto.prototype, "size", void 0);
exports.OffsetDto = OffsetDto;
