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
exports.UserModel = exports.TokenModel = exports.OAuthModel = void 0;
const openapi = require("@nestjs/swagger");
const bcrypt_1 = require("bcrypt");
const mongoose_1 = require("mongoose");
const typegoose_1 = require("@typegoose/typegoose");
const base_model_1 = require("../../shared/model/base.model");
class OAuthModel {
    static _OPENAPI_METADATA_FACTORY() {
        return { platform: { required: true, type: () => String }, id: { required: true, type: () => String } };
    }
}
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], OAuthModel.prototype, "platform", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], OAuthModel.prototype, "id", void 0);
exports.OAuthModel = OAuthModel;
class TokenModel {
    static _OPENAPI_METADATA_FACTORY() {
        return { created: { required: true, type: () => Date }, token: { required: true, type: () => String }, expired: { required: false, type: () => Date }, name: { required: true, type: () => String } };
    }
}
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Date)
], TokenModel.prototype, "created", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], TokenModel.prototype, "token", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Date)
], TokenModel.prototype, "expired", void 0);
__decorate([
    (0, typegoose_1.prop)({ unique: true }),
    __metadata("design:type", String)
], TokenModel.prototype, "name", void 0);
exports.TokenModel = TokenModel;
let UserModel = class UserModel extends base_model_1.BaseModel {
    static _OPENAPI_METADATA_FACTORY() {
        return { username: { required: true, type: () => String }, name: { required: true, type: () => String }, introduce: { required: false, type: () => String }, avatar: { required: false, type: () => String }, password: { required: true, type: () => String }, mail: { required: true, type: () => String }, url: { required: false, type: () => String }, lastLoginTime: { required: false, type: () => Date }, lastLoginIp: { required: false, type: () => String }, socialIds: { required: false, type: () => Object }, apiToken: { required: false, type: () => [require("./user.model").TokenModel] }, oauth2: { required: false, type: () => [require("./user.model").OAuthModel] } };
    }
};
__decorate([
    (0, typegoose_1.prop)({ required: true, unique: true, trim: true }),
    __metadata("design:type", String)
], UserModel.prototype, "username", void 0);
__decorate([
    (0, typegoose_1.prop)({ trim: true }),
    __metadata("design:type", String)
], UserModel.prototype, "name", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], UserModel.prototype, "introduce", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], UserModel.prototype, "avatar", void 0);
__decorate([
    (0, typegoose_1.prop)({
        select: false,
        get(val) {
            return val;
        },
        set(val) {
            return (0, bcrypt_1.hashSync)(val, 6);
        },
        required: true,
    }),
    __metadata("design:type", String)
], UserModel.prototype, "password", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], UserModel.prototype, "mail", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], UserModel.prototype, "url", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Date)
], UserModel.prototype, "lastLoginTime", void 0);
__decorate([
    (0, typegoose_1.prop)({ select: false }),
    __metadata("design:type", String)
], UserModel.prototype, "lastLoginIp", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: mongoose_1.Schema.Types.Mixed }),
    __metadata("design:type", Object)
], UserModel.prototype, "socialIds", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: TokenModel, select: false }),
    __metadata("design:type", Array)
], UserModel.prototype, "apiToken", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: OAuthModel, select: false }),
    __metadata("design:type", Array)
], UserModel.prototype, "oauth2", void 0);
UserModel = __decorate([
    (0, typegoose_1.modelOptions)({ options: { customName: 'User', allowMixed: typegoose_1.Severity.ALLOW } })
], UserModel);
exports.UserModel = UserModel;
