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
exports.PartialCategoryModel = exports.CategoryModel = exports.CategoryType = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const mapped_types_1 = require("@nestjs/mapped-types");
const typegoose_1 = require("@typegoose/typegoose");
const base_model_1 = require("../../shared/model/base.model");
var CategoryType;
(function (CategoryType) {
    CategoryType[CategoryType["Category"] = 0] = "Category";
    CategoryType[CategoryType["Tag"] = 1] = "Tag";
})(CategoryType = exports.CategoryType || (exports.CategoryType = {}));
let CategoryModel = class CategoryModel extends base_model_1.BaseModel {
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, type: { required: false, enum: require("./category.model").CategoryType }, slug: { required: true, type: () => String } };
    }
};
__decorate([
    (0, typegoose_1.prop)({ unique: true, trim: true, required: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CategoryModel.prototype, "name", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: CategoryType.Category }),
    (0, class_validator_1.IsEnum)(CategoryType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CategoryModel.prototype, "type", void 0);
__decorate([
    (0, typegoose_1.prop)({ unique: true, required: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CategoryModel.prototype, "slug", void 0);
CategoryModel = __decorate([
    (0, typegoose_1.index)({ slug: -1 }),
    (0, typegoose_1.modelOptions)({ options: { customName: 'Category' } })
], CategoryModel);
exports.CategoryModel = CategoryModel;
class PartialCategoryModel extends (0, mapped_types_1.PartialType)(CategoryModel) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.PartialCategoryModel = PartialCategoryModel;
