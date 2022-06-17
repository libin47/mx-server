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
exports.PhotoPaginatorModel = exports.PartialPhotoModel = exports.PhotoModel = void 0;
const openapi = require("@nestjs/swagger");
const mapped_types_1 = require("@nestjs/mapped-types");
const swagger_1 = require("@nestjs/swagger");
const typegoose_1 = require("@typegoose/typegoose");
const class_validator_1 = require("class-validator");
const base_model_1 = require("../../shared/model/base.model");
const album_model_1 = require("../album/album.model");
let PhotoModel = class PhotoModel extends base_model_1.PhotoBaseModel {
    static get protectedKeys() {
        return ['count'].concat(super.protectedKeys);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { slug: { required: true, type: () => String }, albumId: { required: true, type: () => Object }, hide: { required: false, type: () => Boolean }, copyright: { required: false, type: () => Boolean } };
    }
};
__decorate([
    (0, typegoose_1.prop)({ trim: true, unique: true, required: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PhotoModel.prototype, "slug", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => album_model_1.AlbumModel, required: true }),
    (0, class_validator_1.IsMongoId)(),
    (0, swagger_1.ApiProperty)({ example: '5eb2c62a613a5ab0642f1f7a' }),
    __metadata("design:type", Object)
], PhotoModel.prototype, "albumId", void 0);
__decorate([
    (0, typegoose_1.prop)({
        ref: () => album_model_1.AlbumModel,
        foreignField: '_id',
        localField: 'albumId',
        justOne: true,
    }),
    (0, swagger_1.ApiHideProperty)(),
    __metadata("design:type", Object)
], PhotoModel.prototype, "album", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], PhotoModel.prototype, "hide", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], PhotoModel.prototype, "copyright", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: base_model_1.CountMixed, default: { read: 0, like: 0 }, _id: false }),
    (0, swagger_1.ApiHideProperty)(),
    __metadata("design:type", base_model_1.CountMixed)
], PhotoModel.prototype, "count", void 0);
PhotoModel = __decorate([
    (0, typegoose_1.index)({ slug: 1 }),
    (0, typegoose_1.index)({ modified: -1 }),
    (0, typegoose_1.index)({ text: 'text' }),
    (0, typegoose_1.modelOptions)({ options: { customName: 'Photo', allowMixed: typegoose_1.Severity.ALLOW } })
], PhotoModel);
exports.PhotoModel = PhotoModel;
class PartialPhotoModel extends (0, mapped_types_1.PartialType)(PhotoModel) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.PartialPhotoModel = PartialPhotoModel;
class PhotoPaginatorModel {
    static _OPENAPI_METADATA_FACTORY() {
        return { data: { required: true, type: () => [require("./photo.model").PhotoModel] }, pagination: { required: true, type: () => require("../../shared/interface/paginator.interface").Paginator } };
    }
}
exports.PhotoPaginatorModel = PhotoPaginatorModel;
