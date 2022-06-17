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
exports.SayController = void 0;
const openapi = require("@nestjs/swagger");
const lodash_1 = require("lodash");
const common_1 = require("@nestjs/common");
const crud_factor_transformer_1 = require("../../transformers/crud-factor.transformer");
const say_model_1 = require("./say.model");
class SayController extends (0, crud_factor_transformer_1.BaseCrudFactory)({ model: say_model_1.SayModel }) {
    async getRandomOne() {
        const res = await this.model.find({}).lean();
        if (!res.length) {
            return { data: null };
        }
        return { data: (0, lodash_1.sample)(res) };
    }
}
__decorate([
    (0, common_1.Get)('/random'),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SayController.prototype, "getRandomOne", null);
exports.SayController = SayController;
