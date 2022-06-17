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
exports.LinkController = exports.LinkControllerCrud = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const auth_decorator_1 = require("../../common/decorator/auth.decorator");
const http_decorator_1 = require("../../common/decorator/http.decorator");
const openapi_decorator_1 = require("../../common/decorator/openapi.decorator");
const role_decorator_1 = require("../../common/decorator/role.decorator");
const pager_dto_1 = require("../../shared/dto/pager.dto");
const crud_factor_transformer_1 = require("../../transformers/crud-factor.transformer");
const link_dto_1 = require("./link.dto");
const link_model_1 = require("./link.model");
const link_service_1 = require("./link.service");
const paths = ['links', 'friends'];
let LinkControllerCrud = class LinkControllerCrud extends (0, crud_factor_transformer_1.BaseCrudFactory)({
    model: link_model_1.LinkModel,
}) {
    async gets(pager, isMaster) {
        const { size, page, state } = pager;
        return await this._model.paginate(state !== undefined ? { state } : {}, {
            limit: size,
            page,
            sort: { created: -1 },
            select: isMaster ? '' : '-email',
        });
    }
    async getAll() {
        const condition = {
            state: link_model_1.LinkState.Pass,
        };
        return await this._model.find(condition).sort({ created: -1 }).lean();
    }
};
__decorate([
    (0, common_1.Get)('/'),
    http_decorator_1.Paginator,
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, role_decorator_1.IsMaster)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pager_dto_1.PagerDto, Boolean]),
    __metadata("design:returntype", Promise)
], LinkControllerCrud.prototype, "gets", null);
__decorate([
    (0, common_1.Get)('/all'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LinkControllerCrud.prototype, "getAll", null);
LinkControllerCrud = __decorate([
    (0, common_1.Controller)(paths),
    openapi_decorator_1.ApiName
], LinkControllerCrud);
exports.LinkControllerCrud = LinkControllerCrud;
let LinkController = class LinkController {
    constructor(linkService) {
        this.linkService = linkService;
    }
    async canApplyLink() {
        return {
            can: await this.linkService.canApplyLink(),
        };
    }
    async getLinkCount() {
        return await this.linkService.getCount();
    }
    async applyForLink(body) {
        if (!(await this.linkService.canApplyLink())) {
            throw new common_1.ForbiddenException('主人目前不允许申请友链了！');
        }
        await this.linkService.applyForLink(body);
        process.nextTick(async () => {
            await this.linkService.sendToMaster(body.author, body);
        });
        return;
    }
    async approveLink(id) {
        const doc = await this.linkService.approveLink(id);
        process.nextTick(async () => {
            if (doc.email) {
                await this.linkService.sendToCandidate(doc);
            }
        });
        return;
    }
    async checkHealth() {
        return this.linkService.checkLinkHealth();
    }
};
__decorate([
    (0, common_1.Get)('/audit'),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LinkController.prototype, "canApplyLink", null);
__decorate([
    (0, common_1.Get)('/state'),
    (0, auth_decorator_1.Auth)(),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LinkController.prototype, "getLinkCount", null);
__decorate([
    (0, common_1.Post)('/audit'),
    http_decorator_1.HTTPDecorators.Idempotence({
        expired: 20,
        errorMessage: '哦吼，你已经提交过这个友链了',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [link_dto_1.LinkDto]),
    __metadata("design:returntype", Promise)
], LinkController.prototype, "applyForLink", null);
__decorate([
    (0, common_1.Patch)('/audit/:id'),
    (0, auth_decorator_1.Auth)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LinkController.prototype, "approveLink", null);
__decorate([
    (0, auth_decorator_1.Auth)(),
    (0, common_1.Get)('/health'),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LinkController.prototype, "checkHealth", null);
LinkController = __decorate([
    (0, common_1.Controller)(paths),
    openapi_decorator_1.ApiName,
    __metadata("design:paramtypes", [link_service_1.LinkService])
], LinkController);
exports.LinkController = LinkController;
