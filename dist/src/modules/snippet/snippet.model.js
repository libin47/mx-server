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
exports.SnippetModel = exports.SnippetType = void 0;
const openapi = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const typegoose_1 = require("@typegoose/typegoose");
const base_model_1 = require("../../shared/model/base.model");
var SnippetType;
(function (SnippetType) {
    SnippetType["JSON"] = "json";
    SnippetType["Function"] = "function";
    SnippetType["Text"] = "text";
    SnippetType["YAML"] = "yaml";
})(SnippetType = exports.SnippetType || (exports.SnippetType = {}));
let SnippetModel = class SnippetModel extends base_model_1.BaseModel {
    static _OPENAPI_METADATA_FACTORY() {
        return { type: { required: true, enum: require("./snippet.model").SnippetType }, private: { required: true, type: () => Boolean }, raw: { required: true, type: () => String }, name: { required: true, type: () => String }, reference: { required: true, type: () => String }, comment: { required: false, type: () => String }, metatype: { required: false, type: () => String }, schema: { required: false, type: () => String } };
    }
};
__decorate([
    (0, typegoose_1.prop)({ default: SnippetType['JSON'] }),
    (0, class_validator_1.IsEnum)(SnippetType),
    __metadata("design:type", String)
], SnippetModel.prototype, "type", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], SnippetModel.prototype, "private", void 0);
__decorate([
    (0, typegoose_1.prop)({ require: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Transform)(({ value }) => value.trim()),
    __metadata("design:type", String)
], SnippetModel.prototype, "raw", void 0);
__decorate([
    (0, typegoose_1.prop)({ require: true, trim: true }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(/^[a-zA-Z0-9_-]{1,30}$/, {
        message: 'name 只能使用英文字母和数字下划线且不超过 30 个字符',
    }),
    __metadata("design:type", String)
], SnippetModel.prototype, "name", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: 'root' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SnippetModel.prototype, "reference", void 0);
__decorate([
    (0, typegoose_1.prop)({}),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SnippetModel.prototype, "comment", void 0);
__decorate([
    (0, typegoose_1.prop)({ maxlength: 20 }),
    (0, class_validator_1.MaxLength)(20),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SnippetModel.prototype, "metatype", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SnippetModel.prototype, "schema", void 0);
SnippetModel = __decorate([
    (0, typegoose_1.modelOptions)({
        options: {
            customName: 'snippet',
        },
        schemaOptions: {
            timestamps: {
                createdAt: 'created',
                updatedAt: 'updated',
            },
        },
    }),
    (0, typegoose_1.index)({ name: 1, reference: 1 }),
    (0, typegoose_1.index)({ type: 1 })
], SnippetModel);
exports.SnippetModel = SnippetModel;
