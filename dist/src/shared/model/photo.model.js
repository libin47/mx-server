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
exports.CountMixed = exports.PhotoBaseModel = exports.BaseCommentIndexModel = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const typegoose_1 = require("@typegoose/typegoose");
const base_model_1 = require("./base.model");
const swagger_1 = require("@nestjs/swagger");
class BaseCommentIndexModel extends base_model_1.BaseModel {
    static get protectedKeys() {
        return ['commentsIndex'].concat(super.protectedKeys);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { allowComment: { required: true, type: () => Boolean } };
    }
}
__decorate([
    (0, typegoose_1.prop)({ default: 0 }),
    (0, swagger_1.ApiHideProperty)(),
    __metadata("design:type", Number)
], BaseCommentIndexModel.prototype, "commentsIndex", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], BaseCommentIndexModel.prototype, "allowComment", void 0);
exports.BaseCommentIndexModel = BaseCommentIndexModel;
class PhotoBaseModel extends BaseCommentIndexModel {
    static get protectedKeys() {
        return super.protectedKeys;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: true, type: () => String }, text: { required: true, type: () => String }, photos: { required: true, type: () => [String] } };
    }
}
__decorate([
    (0, typegoose_1.prop)({ trim: true, index: true, required: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PhotoBaseModel.prototype, "title", void 0);
__decorate([
    (0, typegoose_1.prop)({ trim: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PhotoBaseModel.prototype, "text", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], PhotoBaseModel.prototype, "photos", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: null }),
    (0, swagger_1.ApiHideProperty)(),
    __metadata("design:type", Object)
], PhotoBaseModel.prototype, "modified", void 0);
exports.PhotoBaseModel = PhotoBaseModel;
let CountMixed = class CountMixed {
    static _OPENAPI_METADATA_FACTORY() {
        return { read: { required: false, type: () => Number }, like: { required: false, type: () => Number } };
    }
};
__decorate([
    (0, typegoose_1.prop)({ default: 0 }),
    __metadata("design:type", Number)
], CountMixed.prototype, "read", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: 0 }),
    __metadata("design:type", Number)
], CountMixed.prototype, "like", void 0);
CountMixed = __decorate([
    (0, typegoose_1.modelOptions)({
        schemaOptions: { id: false, _id: false },
        options: { customName: 'count' },
    })
], CountMixed);
exports.CountMixed = CountMixed;
//# sourceMappingURL=photo.model.js.map