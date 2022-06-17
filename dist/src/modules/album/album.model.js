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
exports.PartialAlbumModel = exports.AlbumModel = void 0;
const openapi = require("@nestjs/swagger");
const mapped_types_1 = require("@nestjs/mapped-types");
const typegoose_1 = require("@typegoose/typegoose");
const class_validator_1 = require("class-validator");
const base_model_1 = require("../../shared/model/base.model");
let AlbumModel = class AlbumModel extends base_model_1.BaseModel {
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, slug: { required: true, type: () => String } };
    }
};
__decorate([
    (0, typegoose_1.prop)({ unique: true, trim: true, required: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AlbumModel.prototype, "name", void 0);
__decorate([
    (0, typegoose_1.prop)({ unique: true, required: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AlbumModel.prototype, "slug", void 0);
AlbumModel = __decorate([
    (0, typegoose_1.index)({ slug: -1 }),
    (0, typegoose_1.modelOptions)({ options: { customName: 'Album' } })
], AlbumModel);
exports.AlbumModel = AlbumModel;
class PartialAlbumModel extends (0, mapped_types_1.PartialType)(AlbumModel) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.PartialAlbumModel = PartialAlbumModel;
