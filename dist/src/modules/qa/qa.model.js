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
exports.PartialQAModel = exports.AnswerModel = exports.QAModel = void 0;
const openapi = require("@nestjs/swagger");
const mapped_types_1 = require("@nestjs/mapped-types");
const typegoose_1 = require("@typegoose/typegoose");
const class_validator_1 = require("class-validator");
const base_model_1 = require("../../shared/model/base.model");
const class_validator_2 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
let QAModel = class QAModel extends base_model_1.BaseModel {
    static _OPENAPI_METADATA_FACTORY() {
        return { question: { required: true, type: () => String }, answer: { required: true, type: () => [String] } };
    }
};
__decorate([
    (0, typegoose_1.prop)({ unique: true, trim: true, required: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], QAModel.prototype, "question", void 0);
__decorate([
    (0, typegoose_1.prop)({ unique: true, required: true }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], QAModel.prototype, "answer", void 0);
QAModel = __decorate([
    (0, typegoose_1.modelOptions)({ options: { customName: 'QA', allowMixed: typegoose_1.Severity.ALLOW } })
], QAModel);
exports.QAModel = QAModel;
class AnswerModel {
    static _OPENAPI_METADATA_FACTORY() {
        return { answer: { required: true, type: () => String }, id: { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AnswerModel.prototype, "answer", void 0);
__decorate([
    (0, class_validator_2.IsMongoId)(),
    (0, swagger_1.ApiProperty)({ example: '62845a778378069102ca28a6' }),
    __metadata("design:type", String)
], AnswerModel.prototype, "id", void 0);
exports.AnswerModel = AnswerModel;
class PartialQAModel extends (0, mapped_types_1.PartialType)(QAModel) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.PartialQAModel = PartialQAModel;
