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
exports.MarkdownPreviewDto = exports.ExportMarkdownQueryDto = exports.DataListDto = exports.DatatypeDto = exports.MetaDto = void 0;
const openapi = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const article_constant_1 = require("../../constants/article.constant");
class MetaDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: true, type: () => String }, date: { required: true, type: () => Date }, updated: { required: false, type: () => Date }, categories: { required: false, type: () => [String] }, tags: { required: false, type: () => [String] }, slug: { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MetaDto.prototype, "title", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value: v }) => new Date(v)),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], MetaDto.prototype, "date", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value: v }) => new Date(v)),
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], MetaDto.prototype, "updated", void 0);
__decorate([
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], MetaDto.prototype, "categories", void 0);
__decorate([
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], MetaDto.prototype, "tags", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MetaDto.prototype, "slug", void 0);
exports.MetaDto = MetaDto;
class DatatypeDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { meta: { required: true, type: () => require("./markdown.dto").MetaDto }, text: { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => MetaDto),
    __metadata("design:type", MetaDto)
], DatatypeDto.prototype, "meta", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DatatypeDto.prototype, "text", void 0);
exports.DatatypeDto = DatatypeDto;
class DataListDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { type: { required: true, enum: require("../../constants/article.constant").ArticleTypeEnum }, data: { required: true, type: () => [require("./markdown.dto").DatatypeDto] } };
    }
}
__decorate([
    (0, class_validator_1.IsEnum)(article_constant_1.ArticleTypeEnum),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.toLowerCase() : value),
    __metadata("design:type", String)
], DataListDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => DatatypeDto),
    __metadata("design:type", Array)
], DataListDto.prototype, "data", void 0);
exports.DataListDto = DataListDto;
class ExportMarkdownQueryDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { yaml: { required: true, type: () => Boolean }, slug: { required: true, type: () => Boolean }, show_title: { required: true, type: () => Boolean } };
    }
}
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === '1' || value === 'true'),
    (0, swagger_1.ApiProperty)({ description: 'Markdown 头部输出 YAML 信息' }),
    __metadata("design:type", Boolean)
], ExportMarkdownQueryDto.prototype, "yaml", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '输出文件名为 slug' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === '1' || value === 'true'),
    __metadata("design:type", Boolean)
], ExportMarkdownQueryDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Markdown 第一行显示标题' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === '1' || value === 'true'),
    __metadata("design:type", Boolean)
], ExportMarkdownQueryDto.prototype, "show_title", void 0);
exports.ExportMarkdownQueryDto = ExportMarkdownQueryDto;
class MarkdownPreviewDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: true, type: () => String }, md: { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MarkdownPreviewDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MarkdownPreviewDto.prototype, "md", void 0);
exports.MarkdownPreviewDto = MarkdownPreviewDto;
