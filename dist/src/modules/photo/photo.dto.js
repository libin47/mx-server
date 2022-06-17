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
exports.AlbumAndSlugDto = exports.PhotoQueryDto = void 0;
const openapi = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const pager_dto_1 = require("../../shared/dto/pager.dto");
class PhotoQueryDto extends pager_dto_1.PagerDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { sortBy: { required: false, type: () => String }, sortOrder: { required: false, type: () => Object }, album: { required: false, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['albumId', 'title', 'created', 'modified']),
    (0, class_transformer_1.Transform)(({ value: v }) => (v === 'album' ? 'albumId' : v)),
    __metadata("design:type", String)
], PhotoQueryDto.prototype, "sortBy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)([1, -1]),
    (0, class_validator_1.ValidateIf)((o) => o.sortBy),
    (0, class_transformer_1.Transform)(({ value: v }) => v | 0),
    __metadata("design:type", Number)
], PhotoQueryDto.prototype, "sortOrder", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PhotoQueryDto.prototype, "album", void 0);
exports.PhotoQueryDto = PhotoQueryDto;
class AlbumAndSlugDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { album: { required: true, type: () => String }, slug: { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AlbumAndSlugDto.prototype, "album", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value: v }) => decodeURI(v)),
    __metadata("design:type", String)
], AlbumAndSlugDto.prototype, "slug", void 0);
exports.AlbumAndSlugDto = AlbumAndSlugDto;
