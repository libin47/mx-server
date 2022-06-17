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
exports.QAController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const auth_decorator_1 = require("../../common/decorator/auth.decorator");
const openapi_decorator_1 = require("../../common/decorator/openapi.decorator");
const role_decorator_1 = require("../../common/decorator/role.decorator");
const cant_find_exception_1 = require("../../common/exceptions/cant-find.exception");
const id_dto_1 = require("../../shared/dto/id.dto");
const query_util_1 = require("../../utils/query.util");
const qa_model_1 = require("./qa.model");
const qa_service_1 = require("./qa.service");
let QAController = class QAController {
    constructor(qaService) {
        this.qaService = qaService;
    }
    async getQAs(isMaster) {
        return await this.qaService.model
            .find({ ...(0, query_util_1.addConditionCanSee)(isMaster) })
            .sort({ created: -1 })
            .lean();
    }
    async getQbyId(params) {
        const { id } = params;
        const QA = await this.qaService.findQAById(id);
        if (!QA) {
            throw new cant_find_exception_1.CannotFindException();
        }
        return { 'question': QA.question };
    }
    async checkQAById(body) {
        const { id, answer } = body;
        return await this.qaService.checkAnswer(id, answer);
    }
    async create(body) {
        const { question, answer } = body;
        return this.qaService.model.create({ question: question, answer: answer });
    }
    async modify(params, body) {
        const { question, answer } = body;
        const { id } = params;
        await this.qaService.model.updateOne({ _id: id }, {
            question,
            answer,
        });
        return await this.qaService.model.findById(id);
    }
    async patch(params, body) {
        const { id } = params;
        await this.qaService.model.updateOne({ _id: id }, body);
        return;
    }
    async deleteAlbum(params) {
        const { id } = params;
        const qa = await this.qaService.model.findById(id);
        if (!qa) {
            throw new cant_find_exception_1.CannotFindException();
        }
        const res = await this.qaService.model.deleteOne({
            _id: qa._id,
        });
        if ((await this.qaService.model.countDocuments({})) === 0) {
            await this.qaService.createDefaultQA();
        }
        return res;
    }
};
__decorate([
    (0, common_1.Get)('/'),
    (0, auth_decorator_1.Auth)(),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, role_decorator_1.IsMaster)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean]),
    __metadata("design:returntype", Promise)
], QAController.prototype, "getQAs", null);
__decorate([
    (0, common_1.Get)('/:id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.MongoIdDto]),
    __metadata("design:returntype", Promise)
], QAController.prototype, "getQbyId", null);
__decorate([
    (0, common_1.Post)('/:id'),
    openapi.ApiResponse({ status: 201, type: Boolean }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [qa_model_1.AnswerModel]),
    __metadata("design:returntype", Promise)
], QAController.prototype, "checkQAById", null);
__decorate([
    (0, common_1.Post)('/'),
    (0, auth_decorator_1.Auth)(),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [qa_model_1.QAModel]),
    __metadata("design:returntype", Promise)
], QAController.prototype, "create", null);
__decorate([
    (0, common_1.Put)('/:id'),
    (0, auth_decorator_1.Auth)(),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.MongoIdDto, qa_model_1.QAModel]),
    __metadata("design:returntype", Promise)
], QAController.prototype, "modify", null);
__decorate([
    (0, common_1.Patch)('/:id'),
    (0, common_1.HttpCode)(204),
    (0, auth_decorator_1.Auth)(),
    openapi.ApiResponse({ status: 204 }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.MongoIdDto, qa_model_1.PartialQAModel]),
    __metadata("design:returntype", Promise)
], QAController.prototype, "patch", null);
__decorate([
    (0, common_1.Delete)('/:id'),
    (0, auth_decorator_1.Auth)(),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.MongoIdDto]),
    __metadata("design:returntype", Promise)
], QAController.prototype, "deleteAlbum", null);
QAController = __decorate([
    (0, common_1.Controller)({ path: 'QA' }),
    openapi_decorator_1.ApiName,
    __metadata("design:paramtypes", [qa_service_1.QAService])
], QAController);
exports.QAController = QAController;
