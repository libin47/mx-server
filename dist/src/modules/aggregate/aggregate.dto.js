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
exports.TimelineQueryDto = exports.TimelineType = exports.TopQueryDto = void 0;
const openapi = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class TopQueryDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { size: { required: false, type: () => Number } };
    }
}
__decorate([
    (0, class_transformer_1.Transform)(({ value: val }) => parseInt(val)),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(10),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], TopQueryDto.prototype, "size", void 0);
exports.TopQueryDto = TopQueryDto;
var TimelineType;
(function (TimelineType) {
    TimelineType[TimelineType["Post"] = 0] = "Post";
    TimelineType[TimelineType["Note"] = 1] = "Note";
    TimelineType[TimelineType["Photo"] = 2] = "Photo";
})(TimelineType = exports.TimelineType || (exports.TimelineType = {}));
class TimelineQueryDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { sort: { required: false, type: () => Object }, year: { required: false, type: () => Number }, type: { required: false, enum: require("./aggregate.dto").TimelineType } };
    }
}
__decorate([
    (0, class_transformer_1.Transform)(({ value: val }) => Number(val)),
    (0, class_validator_1.IsEnum)([1, -1]),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({ enum: [-1, 1] }),
    __metadata("design:type", Number)
], TimelineQueryDto.prototype, "sort", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value: val }) => Number(val)),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], TimelineQueryDto.prototype, "year", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(TimelineType),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({ enum: [0, 1] }),
    (0, class_transformer_1.Transform)(({ value: v }) => v | 0),
    __metadata("design:type", Number)
], TimelineQueryDto.prototype, "type", void 0);
exports.TimelineQueryDto = TimelineQueryDto;
