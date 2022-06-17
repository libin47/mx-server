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
exports.MultiAlbumsQueryDto = exports.MultiQueryTagAndAlbumDto = exports.SlugOrIdDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const lodash_1 = require("lodash");
const isBooleanOrString_1 = require("../../utils/validator/isBooleanOrString");
class SlugOrIdDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { query: { required: false, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SlugOrIdDto.prototype, "query", void 0);
exports.SlugOrIdDto = SlugOrIdDto;
class MultiQueryTagAndAlbumDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { tag: { required: false, type: () => Object } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value: val }) => {
        if (val === '1' || val === 'true') {
            return true;
        }
        else {
            return val;
        }
    }),
    (0, isBooleanOrString_1.IsBooleanOrString)(),
    __metadata("design:type", Object)
], MultiQueryTagAndAlbumDto.prototype, "tag", void 0);
exports.MultiQueryTagAndAlbumDto = MultiQueryTagAndAlbumDto;
class MultiAlbumsQueryDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { ids: { required: false, type: () => [String] }, joint: { required: false, type: () => Boolean } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)({
        each: true,
        message: '多分类查询使用逗号分隔, 应为 mongoID',
    }),
    (0, class_transformer_1.Transform)(({ value: v }) => (0, lodash_1.uniq)(v.split(','))),
    __metadata("design:type", Array)
], MultiAlbumsQueryDto.prototype, "ids", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)((b) => Boolean(b)),
    (0, swagger_1.ApiProperty)({ enum: [1, 0] }),
    __metadata("design:type", Boolean)
], MultiAlbumsQueryDto.prototype, "joint", void 0);
exports.MultiAlbumsQueryDto = MultiAlbumsQueryDto;
