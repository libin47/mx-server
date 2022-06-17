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
exports.RecentlyController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const auth_decorator_1 = require("../../common/decorator/auth.decorator");
const http_decorator_1 = require("../../common/decorator/http.decorator");
const openapi_decorator_1 = require("../../common/decorator/openapi.decorator");
const id_dto_1 = require("../../shared/dto/id.dto");
const pager_dto_1 = require("../../shared/dto/pager.dto");
const recently_model_1 = require("./recently.model");
const recently_service_1 = require("./recently.service");
let RecentlyController = class RecentlyController {
    constructor(recentlyService) {
        this.recentlyService = recentlyService;
    }
    async getLatestOne() {
        return await this.recentlyService.getLatestOne();
    }
    getAll() {
        return this.recentlyService.getAll();
    }
    async getList(query) {
        const { before, after, size } = query;
        if (before && after) {
            throw new common_1.BadRequestException('you can only choose `before` or `after`');
        }
        return await this.recentlyService.getOffset({ before, after, size });
    }
    async create(body) {
        const res = await this.recentlyService.create(body);
        return res;
    }
    async del({ id }) {
        const res = await this.recentlyService.delete(id);
        if (!res) {
            throw new common_1.BadRequestException('删除失败, 条目不存在');
        }
        return;
    }
};
__decorate([
    (0, common_1.Get)('/latest'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RecentlyController.prototype, "getLatestOne", null);
__decorate([
    (0, common_1.Get)('/all'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RecentlyController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)('/'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pager_dto_1.OffsetDto]),
    __metadata("design:returntype", Promise)
], RecentlyController.prototype, "getList", null);
__decorate([
    (0, common_1.Post)('/'),
    http_decorator_1.HTTPDecorators.Idempotence(),
    (0, auth_decorator_1.Auth)(),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [recently_model_1.RecentlyModel]),
    __metadata("design:returntype", Promise)
], RecentlyController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)('/:id'),
    (0, auth_decorator_1.Auth)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.MongoIdDto]),
    __metadata("design:returntype", Promise)
], RecentlyController.prototype, "del", null);
RecentlyController = __decorate([
    (0, common_1.Controller)(['recently', 'shorthand']),
    openapi_decorator_1.ApiName,
    __metadata("design:paramtypes", [recently_service_1.RecentlyService])
], RecentlyController);
exports.RecentlyController = RecentlyController;
