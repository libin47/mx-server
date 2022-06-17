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
exports.PartialPageModel = exports.PageModel = exports.PageType = void 0;
const openapi = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const mapped_types_1 = require("@nestjs/mapped-types");
const typegoose_1 = require("@typegoose/typegoose");
const write_base_model_1 = require("../../shared/model/write-base.model");
const isNilOrString_1 = require("../../utils/validator/isNilOrString");
var PageType;
(function (PageType) {
    PageType["md"] = "md";
    PageType["html"] = "html";
    PageType["json"] = "json";
})(PageType = exports.PageType || (exports.PageType = {}));
let PageModel = class PageModel extends write_base_model_1.WriteBaseModel {
    static _OPENAPI_METADATA_FACTORY() {
        return { slug: { required: true, type: () => String }, subtitle: { required: false, type: () => String, nullable: true }, order: { required: true, type: () => Number }, type: { required: false, type: () => String } };
    }
};
__decorate([
    (0, typegoose_1.prop)({ trim: 1, index: true, required: true, unique: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PageModel.prototype, "slug", void 0);
__decorate([
    (0, typegoose_1.prop)({ trim: true, type: String }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, isNilOrString_1.IsNilOrString)(),
    __metadata("design:type", Object)
], PageModel.prototype, "subtitle", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: 1 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value)),
    __metadata("design:type", Number)
], PageModel.prototype, "order", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: 'md' }),
    (0, class_validator_1.IsEnum)(PageType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PageModel.prototype, "type", void 0);
PageModel = __decorate([
    (0, typegoose_1.modelOptions)({
        options: {
            customName: 'Page',
        },
    })
], PageModel);
exports.PageModel = PageModel;
class PartialPageModel extends (0, mapped_types_1.PartialType)(PageModel) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.PartialPageModel = PartialPageModel;
