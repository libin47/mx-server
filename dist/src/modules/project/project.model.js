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
exports.PartialProjectModel = exports.ProjectModel = void 0;
const openapi = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const typegoose_1 = require("@typegoose/typegoose");
const base_model_1 = require("../../shared/model/base.model");
const validateURL = {
    message: '请更正为正确的网址',
    validator: (v) => {
        if (!v) {
            return true;
        }
        if (Array.isArray(v)) {
            return v.every((url) => (0, class_validator_1.isURL)(url, { require_protocol: true }));
        }
        if (!(0, class_validator_1.isURL)(v, { require_protocol: true })) {
            return false;
        }
        return true;
    },
};
let ProjectModel = class ProjectModel extends base_model_1.BaseModel {
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, previewUrl: { required: false, type: () => String }, docUrl: { required: false, type: () => String }, projectUrl: { required: false, type: () => String }, images: { required: false, type: () => [String] }, description: { required: true, type: () => String }, avatar: { required: false, type: () => String }, text: { required: true, type: () => String } };
    }
};
__decorate([
    (0, typegoose_1.prop)({ required: true, unique: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProjectModel.prototype, "name", void 0);
__decorate([
    (0, typegoose_1.prop)({
        validate: validateURL,
    }),
    (0, class_validator_1.IsUrl)({ require_protocol: true }, { message: '请更正为正确的网址' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' && value.length ? value : null),
    __metadata("design:type", String)
], ProjectModel.prototype, "previewUrl", void 0);
__decorate([
    (0, typegoose_1.prop)({
        validate: validateURL,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)({ require_protocol: true }, { message: '请更正为正确的网址' }),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' && value.length ? value : null),
    __metadata("design:type", String)
], ProjectModel.prototype, "docUrl", void 0);
__decorate([
    (0, typegoose_1.prop)({
        validate: validateURL,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)({ require_protocol: true }, { message: '请更正为正确的网址' }),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' && value.length ? value : null),
    __metadata("design:type", String)
], ProjectModel.prototype, "projectUrl", void 0);
__decorate([
    (0, class_validator_1.IsUrl)({ require_protocol: true }, { each: true }),
    (0, class_validator_1.IsOptional)(),
    (0, typegoose_1.prop)({
        type: String,
        validate: validateURL,
    }),
    __metadata("design:type", Array)
], ProjectModel.prototype, "images", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProjectModel.prototype, "description", void 0);
__decorate([
    (0, typegoose_1.prop)({
        validate: validateURL,
    }),
    (0, class_validator_1.IsUrl)({ require_protocol: true }, { message: '请更正为正确的网址' }),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' && value.length ? value : null),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ProjectModel.prototype, "avatar", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProjectModel.prototype, "text", void 0);
ProjectModel = __decorate([
    (0, typegoose_1.modelOptions)({
        options: {
            customName: 'Project',
        },
    })
], ProjectModel);
exports.ProjectModel = ProjectModel;
class PartialProjectModel extends (0, swagger_1.PartialType)(ProjectModel) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.PartialProjectModel = PartialProjectModel;
