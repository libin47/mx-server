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
exports.AnalyzeModel = void 0;
const openapi = require("@nestjs/swagger");
const mongoose_1 = require("mongoose");
const ua_parser_js_1 = require("ua-parser-js");
const swagger_1 = require("@nestjs/swagger");
const typegoose_1 = require("@typegoose/typegoose");
const base_model_1 = require("../../shared/model/base.model");
let AnalyzeModel = class AnalyzeModel extends base_model_1.BaseModel {
    static _OPENAPI_METADATA_FACTORY() {
        return { ip: { required: false, type: () => String }, ua: { required: true, type: () => Object }, path: { required: false, type: () => String } };
    }
};
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], AnalyzeModel.prototype, "ip", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: mongoose_1.SchemaTypes.Mixed }),
    __metadata("design:type", Object)
], AnalyzeModel.prototype, "ua", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], AnalyzeModel.prototype, "path", void 0);
__decorate([
    (0, swagger_1.ApiHideProperty)(),
    __metadata("design:type", Date)
], AnalyzeModel.prototype, "timestamp", void 0);
AnalyzeModel = __decorate([
    (0, typegoose_1.modelOptions)({
        schemaOptions: {
            timestamps: {
                createdAt: 'timestamp',
                updatedAt: false,
            },
        },
        options: {
            customName: 'Analyze',
            allowMixed: typegoose_1.Severity.ALLOW,
        },
    }),
    (0, typegoose_1.index)({ timestamp: -1 })
], AnalyzeModel);
exports.AnalyzeModel = AnalyzeModel;
