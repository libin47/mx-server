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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopicBaseController = void 0;
const openapi = require("@nestjs/swagger");
const slugify_1 = __importDefault(require("slugify"));
const common_1 = require("@nestjs/common");
const cant_find_exception_1 = require("../../common/exceptions/cant-find.exception");
const crud_factor_transformer_1 = require("../../transformers/crud-factor.transformer");
const topic_model_1 = require("./topic.model");
class Upper {
    constructor(_model) {
        this._model = _model;
    }
    async getTopicByTopic(slug) {
        slug = (0, slugify_1.default)(slug);
        const topic = await this._model.findOne({ slug }).lean();
        if (!topic) {
            throw new cant_find_exception_1.CannotFindException();
        }
        return topic;
    }
}
__decorate([
    (0, common_1.Get)('/slug/:slug'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], Upper.prototype, "getTopicByTopic", null);
exports.TopicBaseController = (0, crud_factor_transformer_1.BaseCrudFactory)({
    model: topic_model_1.TopicModel,
    classUpper: Upper,
});
