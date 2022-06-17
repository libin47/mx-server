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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopicModel = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const slugify_1 = __importDefault(require("slugify"));
const typegoose_1 = require("@typegoose/typegoose");
const base_model_1 = require("../../shared/model/base.model");
let TopicModel = class TopicModel extends base_model_1.BaseModel {
    static _OPENAPI_METADATA_FACTORY() {
        return { description: { required: false, type: () => String }, introduce: { required: true, type: () => String }, name: { required: true, type: () => String }, slug: { required: true, type: () => String }, icon: { required: false, type: () => String } };
    }
};
__decorate([
    (0, typegoose_1.prop)({ default: '' }),
    (0, class_validator_1.MaxLength)(400, { message: '描述信息最多 400 个字符' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TopicModel.prototype, "description", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100, { message: '简介最多 100 个字符' }),
    __metadata("design:type", String)
], TopicModel.prototype, "introduce", void 0);
__decorate([
    (0, typegoose_1.prop)({ unique: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({
        message: '话题名称不能为空',
    }),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], TopicModel.prototype, "name", void 0);
__decorate([
    (0, typegoose_1.prop)({
        unique: true,
        set(val) {
            return (0, slugify_1.default)(val);
        },
    }),
    (0, class_validator_1.IsString)({
        message: '路径必须是字符串',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], TopicModel.prototype, "slug", void 0);
__decorate([
    (0, class_validator_1.IsUrl)({
        require_protocol: true,
    }, {
        message: '请输入正确的 URL',
    }),
    (0, typegoose_1.prop)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TopicModel.prototype, "icon", void 0);
TopicModel = __decorate([
    (0, typegoose_1.modelOptions)({
        options: {
            customName: 'Topic',
        },
    }),
    (0, typegoose_1.index)({ name: 1 })
], TopicModel);
exports.TopicModel = TopicModel;
