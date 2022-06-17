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
exports.PostPaginatorModel = exports.PartialPostModel = exports.PostModel = void 0;
const openapi = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const common_1 = require("@nestjs/common");
const mapped_types_1 = require("@nestjs/mapped-types");
const swagger_1 = require("@nestjs/swagger");
const typegoose_1 = require("@typegoose/typegoose");
const count_model_1 = require("../../shared/model/count.model");
const write_base_model_1 = require("../../shared/model/write-base.model");
const category_model_1 = require("../category/category.model");
function autoPopulateCategory(next) {
    this.populate({ path: 'category' });
    next();
}
let PostModel = class PostModel extends write_base_model_1.WriteBaseModel {
    static get protectedKeys() {
        return ['count'].concat(super.protectedKeys);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { slug: { required: true, type: () => String }, summary: { required: false, type: () => String }, categoryId: { required: true, type: () => Object }, copyright: { required: false, type: () => Boolean }, tags: { required: false, type: () => [String] }, pin: { required: false, type: () => Date, nullable: true }, pinOrder: { required: false, type: () => Number } };
    }
};
__decorate([
    (0, typegoose_1.prop)({ trim: true, unique: true, required: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PostModel.prototype, "slug", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostModel.prototype, "summary", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => category_model_1.CategoryModel, required: true }),
    (0, class_validator_1.IsMongoId)(),
    (0, swagger_1.ApiProperty)({ example: '5eb2c62a613a5ab0642f1f7a' }),
    __metadata("design:type", Object)
], PostModel.prototype, "categoryId", void 0);
__decorate([
    (0, typegoose_1.prop)({
        ref: () => category_model_1.CategoryModel,
        foreignField: '_id',
        localField: 'categoryId',
        justOne: true,
    }),
    (0, swagger_1.ApiHideProperty)(),
    __metadata("design:type", Object)
], PostModel.prototype, "category", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], PostModel.prototype, "copyright", void 0);
__decorate([
    (0, typegoose_1.prop)({
        type: String,
    }),
    (0, class_validator_1.IsNotEmpty)({ each: true }),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.ArrayUnique)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], PostModel.prototype, "tags", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: count_model_1.CountModel, default: { read: 0, like: 0 }, _id: false }),
    (0, swagger_1.ApiHideProperty)(),
    __metadata("design:type", count_model_1.CountModel)
], PostModel.prototype, "count", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        const isDateIsoString = (0, class_validator_1.isDateString)(value);
        if (isDateIsoString) {
            return new Date(value);
        }
        if (typeof value != 'boolean') {
            throw new common_1.UnprocessableEntityException('pin value must be boolean');
        }
        if (value === true) {
            return new Date();
        }
        else {
            return null;
        }
    }),
    __metadata("design:type", Object)
], PostModel.prototype, "pin", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, class_validator_1.IsPositive)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], PostModel.prototype, "pinOrder", void 0);
PostModel = __decorate([
    (0, typegoose_1.pre)('findOne', autoPopulateCategory),
    (0, typegoose_1.pre)('find', autoPopulateCategory),
    (0, typegoose_1.index)({ slug: 1 }),
    (0, typegoose_1.index)({ modified: -1 }),
    (0, typegoose_1.index)({ text: 'text' }),
    (0, typegoose_1.modelOptions)({ options: { customName: 'Post', allowMixed: typegoose_1.Severity.ALLOW } })
], PostModel);
exports.PostModel = PostModel;
class PartialPostModel extends (0, mapped_types_1.PartialType)(PostModel) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.PartialPostModel = PartialPostModel;
class PostPaginatorModel {
    static _OPENAPI_METADATA_FACTORY() {
        return { data: { required: true, type: () => [require("./post.model").PostModel] }, pagination: { required: true, type: () => require("../../shared/interface/paginator.interface").Paginator } };
    }
}
exports.PostPaginatorModel = PostPaginatorModel;
