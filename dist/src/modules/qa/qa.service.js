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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QAService = void 0;
const common_1 = require("@nestjs/common");
const model_transformer_1 = require("../../transformers/model.transformer");
const cant_find_exception_1 = require("../../common/exceptions/cant-find.exception");
const qa_model_1 = require("./qa.model");
let QAService = class QAService {
    constructor(qaModel) {
        this.qaModel = qaModel;
        this.createDefaultQA();
    }
    async findQAById(QAId) {
        const QA = await this.model.findById(QAId).lean();
        return QA;
    }
    async checkAnswer(QAId, answer) {
        const QA = await this.model.findById(QAId);
        if (!QA) {
            throw new cant_find_exception_1.CannotFindException();
        }
        for (var i = 0; i < QA.answer.length; i++) {
            if (QA.answer[i] == answer) {
                return true;
            }
        }
        return false;
    }
    async findAllQA() {
        const data = await this.model.find().lean();
        return data;
    }
    get model() {
        return this.qaModel;
    }
    async createDefaultQA() {
        if ((await this.model.countDocuments()) === 0) {
            var answer;
            answer = ["答案"];
            return await this.model.create({
                question: '这是一个默认问题，答案是答案',
                answer: answer,
            });
        }
    }
};
QAService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, model_transformer_1.InjectModel)(qa_model_1.QAModel)),
    __metadata("design:paramtypes", [Object])
], QAService);
exports.QAService = QAService;
