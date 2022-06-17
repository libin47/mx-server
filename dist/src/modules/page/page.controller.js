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
exports.PageController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const auth_decorator_1 = require("../../common/decorator/auth.decorator");
const http_decorator_1 = require("../../common/decorator/http.decorator");
const openapi_decorator_1 = require("../../common/decorator/openapi.decorator");
const cant_find_exception_1 = require("../../common/exceptions/cant-find.exception");
const helper_macro_service_1 = require("../../processors/helper/helper.macro.service");
const id_dto_1 = require("../../shared/dto/id.dto");
const pager_dto_1 = require("../../shared/dto/pager.dto");
const page_model_1 = require("./page.model");
const page_service_1 = require("./page.service");
let PageController = class PageController {
    constructor(pageService, macroService) {
        this.pageService = pageService;
        this.macroService = macroService;
    }
    async getPagesSummary(query) {
        const { size, select, page, sortBy, sortOrder } = query;
        return await this.pageService.model.paginate({}, {
            limit: size,
            page,
            select,
            sort: sortBy
                ? { [sortBy]: sortOrder || -1 }
                : { order: -1, modified: -1 },
        });
    }
    async getPageById(params) {
        const page = this.pageService.model
            .findById(params.id)
            .lean({ getters: true });
        if (!page) {
            throw new cant_find_exception_1.CannotFindException();
        }
        return page;
    }
    async getPageBySlug(slug) {
        if (typeof slug !== 'string') {
            throw new common_1.UnprocessableEntityException('slug must be string');
        }
        const page = await this.pageService.model
            .findOne({
            slug,
        })
            .lean({ getters: true });
        if (!page) {
            throw new cant_find_exception_1.CannotFindException();
        }
        page.text = await this.macroService.replaceTextMacro(page.text, page);
        return page;
    }
    async create(body) {
        return await this.pageService.create(body);
    }
    async modify(body, params) {
        const { id } = params;
        await this.pageService.updateById(id, body);
        return await this.pageService.model.findById(id).lean();
    }
    async patch(body, params) {
        const { id } = params;
        await this.pageService.updateById(id, body);
        return;
    }
    async deletePage(params) {
        await this.pageService.model.deleteOne({
            _id: params.id,
        });
        return;
    }
};
__decorate([
    (0, common_1.Get)('/'),
    http_decorator_1.Paginator,
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pager_dto_1.PagerDto]),
    __metadata("design:returntype", Promise)
], PageController.prototype, "getPagesSummary", null);
__decorate([
    (0, common_1.Get)('/:id'),
    (0, auth_decorator_1.Auth)(),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.MongoIdDto]),
    __metadata("design:returntype", Promise)
], PageController.prototype, "getPageById", null);
__decorate([
    (0, common_1.Get)('/slug/:slug'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PageController.prototype, "getPageBySlug", null);
__decorate([
    (0, common_1.Post)('/'),
    (0, auth_decorator_1.Auth)(),
    http_decorator_1.HTTPDecorators.Idempotence(),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [page_model_1.PageModel]),
    __metadata("design:returntype", Promise)
], PageController.prototype, "create", null);
__decorate([
    (0, common_1.Put)('/:id'),
    (0, auth_decorator_1.Auth)(),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [page_model_1.PageModel, id_dto_1.MongoIdDto]),
    __metadata("design:returntype", Promise)
], PageController.prototype, "modify", null);
__decorate([
    (0, common_1.Patch)('/:id'),
    (0, auth_decorator_1.Auth)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [page_model_1.PartialPageModel, id_dto_1.MongoIdDto]),
    __metadata("design:returntype", Promise)
], PageController.prototype, "patch", null);
__decorate([
    (0, common_1.Delete)('/:id'),
    (0, auth_decorator_1.Auth)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.MongoIdDto]),
    __metadata("design:returntype", Promise)
], PageController.prototype, "deletePage", null);
PageController = __decorate([
    (0, common_1.Controller)('pages'),
    openapi_decorator_1.ApiName,
    __metadata("design:paramtypes", [page_service_1.PageService,
        helper_macro_service_1.TextMacroService])
], PageController);
exports.PageController = PageController;
