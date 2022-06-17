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
exports.SayModel = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const typegoose_1 = require("@typegoose/typegoose");
const base_model_1 = require("../../shared/model/base.model");
let SayModel = class SayModel extends base_model_1.BaseModel {
    static _OPENAPI_METADATA_FACTORY() {
        return { text: { required: true, type: () => String }, source: { required: true, type: () => String }, author: { required: true, type: () => String } };
    }
};
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SayModel.prototype, "text", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SayModel.prototype, "source", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SayModel.prototype, "author", void 0);
SayModel = __decorate([
    (0, typegoose_1.modelOptions)({
        options: { customName: 'Say' },
    })
], SayModel);
exports.SayModel = SayModel;
