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
exports.LinkModel = exports.LinkState = exports.LinkType = void 0;
const openapi = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const lodash_1 = require("lodash");
const url_1 = require("url");
const swagger_1 = require("@nestjs/swagger");
const typegoose_1 = require("@typegoose/typegoose");
const base_model_1 = require("../../shared/model/base.model");
var LinkType;
(function (LinkType) {
    LinkType[LinkType["Friend"] = 0] = "Friend";
    LinkType[LinkType["Collection"] = 1] = "Collection";
})(LinkType = exports.LinkType || (exports.LinkType = {}));
var LinkState;
(function (LinkState) {
    LinkState[LinkState["Pass"] = 0] = "Pass";
    LinkState[LinkState["Audit"] = 1] = "Audit";
    LinkState[LinkState["Outdate"] = 2] = "Outdate";
    LinkState[LinkState["Banned"] = 3] = "Banned";
})(LinkState = exports.LinkState || (exports.LinkState = {}));
let LinkModel = class LinkModel extends base_model_1.BaseModel {
    get hide() {
        return this.state === LinkState.Audit;
    }
    set hide(value) {
        return;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, url: { required: true, type: () => String }, avatar: { required: false, type: () => String }, description: { required: false, type: () => String }, type: { required: false, enum: require("./link.model").LinkType }, state: { required: true, enum: require("./link.model").LinkState }, email: { required: false, type: () => String } };
    }
};
__decorate([
    (0, typegoose_1.prop)({ required: true, trim: true, unique: true }),
    (0, class_validator_1.IsString)({ message: '标题是必须的啦' }),
    (0, class_validator_1.MaxLength)(20, { message: '标题太长了 www' }),
    __metadata("design:type", String)
], LinkModel.prototype, "name", void 0);
__decorate([
    (0, typegoose_1.prop)({
        required: true,
        trim: true,
        unique: true,
        set(val) {
            return new url_1.URL(val).origin;
        },
    }),
    (0, class_validator_1.IsUrl)({ require_protocol: true, protocols: ['https'] }, { message: '只有 HTTPS 被允许哦' }),
    __metadata("design:type", String)
], LinkModel.prototype, "url", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)({ require_protocol: true, protocols: ['https'] }, { message: '只有 HTTPS 被允许哦' }),
    (0, typegoose_1.prop)({ trim: true }),
    (0, class_transformer_1.Transform)(({ value }) => (value === '' ? null : value)),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], LinkModel.prototype, "avatar", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, typegoose_1.prop)({ trim: true }),
    (0, class_validator_1.MaxLength)(50, { message: '描述信息超过 50 会坏掉的！' }),
    __metadata("design:type", String)
], LinkModel.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(LinkType),
    (0, swagger_1.ApiProperty)({ enum: (0, lodash_1.range)(0, 1) }),
    (0, typegoose_1.prop)({ default: LinkType.Friend }),
    __metadata("design:type", Number)
], LinkModel.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(LinkState),
    (0, typegoose_1.prop)({ default: LinkState.Pass }),
    __metadata("design:type", Number)
], LinkModel.prototype, "state", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, class_validator_1.IsEmail)(undefined, { message: '请输入正确的邮箱！' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (value === '' ? null : value)),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], LinkModel.prototype, "email", void 0);
LinkModel = __decorate([
    (0, typegoose_1.modelOptions)({ options: { customName: 'Link' } })
], LinkModel);
exports.LinkModel = LinkModel;
