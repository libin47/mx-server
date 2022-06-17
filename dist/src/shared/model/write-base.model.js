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
exports.WriteBaseModel = void 0;
const openapi = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const typegoose_1 = require("@typegoose/typegoose");
const base_comment_model_1 = require("./base-comment.model");
const image_model_1 = require("./image.model");
class WriteBaseModel extends base_comment_model_1.BaseCommentIndexModel {
    static get protectedKeys() {
        return super.protectedKeys;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: true, type: () => String }, text: { required: true, type: () => String }, meta: { required: false, type: () => Object } };
    }
}
__decorate([
    (0, typegoose_1.prop)({ trim: true, index: true, required: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], WriteBaseModel.prototype, "title", void 0);
__decorate([
    (0, typegoose_1.prop)({ trim: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WriteBaseModel.prototype, "text", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: image_model_1.ImageModel }),
    (0, swagger_1.ApiHideProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => image_model_1.ImageModel),
    __metadata("design:type", Array)
], WriteBaseModel.prototype, "images", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: null, type: Date }),
    (0, swagger_1.ApiHideProperty)(),
    __metadata("design:type", Object)
], WriteBaseModel.prototype, "modified", void 0);
__decorate([
    (0, typegoose_1.prop)({
        type: String,
        get(jsonString) {
            return JSON.safeParse(jsonString);
        },
        set(val) {
            return JSON.stringify(val);
        },
    }, typegoose_1.PropType.NONE),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], WriteBaseModel.prototype, "meta", void 0);
exports.WriteBaseModel = WriteBaseModel;
