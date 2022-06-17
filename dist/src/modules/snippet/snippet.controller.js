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
exports.SnippetController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const auth_decorator_1 = require("../../common/decorator/auth.decorator");
const demo_decorator_1 = require("../../common/decorator/demo.decorator");
const http_decorator_1 = require("../../common/decorator/http.decorator");
const openapi_decorator_1 = require("../../common/decorator/openapi.decorator");
const role_decorator_1 = require("../../common/decorator/role.decorator");
const path_constant_1 = require("../../constants/path.constant");
const id_dto_1 = require("../../shared/dto/id.dto");
const pager_dto_1 = require("../../shared/dto/pager.dto");
const paginate_transformer_1 = require("../../transformers/paginate.transformer");
const utils_1 = require("../../utils");
const snippet_dto_1 = require("./snippet.dto");
const snippet_model_1 = require("./snippet.model");
const snippet_service_1 = require("./snippet.service");
let SnippetController = class SnippetController {
    constructor(snippetService) {
        this.snippetService = snippetService;
    }
    async getList(query) {
        const { page, size, select = '', db_query } = query;
        return (0, paginate_transformer_1.transformDataToPaginate)(await this.snippetService.model.paginate(db_query !== null && db_query !== void 0 ? db_query : {}, {
            page,
            limit: size,
            select,
            sort: {
                reference: 1,
                created: -1,
            },
        }));
    }
    async createMore(body) {
        const { snippets, packages = [] } = body;
        const tasks = snippets.map((snippet) => this.create(snippet));
        const resultList = await Promise.all(tasks);
        try {
            if (packages.length) {
                const tasks2 = packages.map((pkg) => {
                    return (0, utils_1.installPKG)(pkg, path_constant_1.DATA_DIR);
                });
                await Promise.all(tasks2);
            }
        }
        catch (err) {
            await Promise.all(resultList.map((doc) => {
                return doc.remove();
            }));
            throw err;
        }
    }
    async create(body) {
        return await this.snippetService.create(body);
    }
    async getSnippetById(param) {
        const { id } = param;
        const snippet = await this.snippetService.getSnippetById(id);
        return snippet;
    }
    async aggregate(body) {
        return this.snippetService.model.aggregate(body);
    }
    async getSnippetByName(name, reference, isMaster) {
        if (typeof name !== 'string') {
            throw new common_1.ForbiddenException('name should be string');
        }
        if (typeof reference !== 'string') {
            throw new common_1.ForbiddenException('reference should be string');
        }
        let cached = null;
        if (isMaster) {
            cached =
                (await Promise.all(['public', 'private'].map((type) => {
                    return this.snippetService.getCachedSnippet(reference, name, type);
                }))).find(Boolean) || null;
        }
        else {
            cached = await this.snippetService.getCachedSnippet(reference, name, 'public');
        }
        if (cached) {
            const json = JSON.safeParse(cached);
            return json ? json : cached;
        }
        const snippet = await this.snippetService.getSnippetByName(name, reference);
        if (snippet.private && !isMaster) {
            throw new common_1.ForbiddenException('snippet is private');
        }
        if (snippet.type !== snippet_model_1.SnippetType.Function) {
            return this.snippetService.attachSnippet(snippet).then((res) => {
                this.snippetService.cacheSnippet(res, res.data);
                return res.data;
            });
        }
    }
    async update(param, body) {
        const { id } = param;
        return await this.snippetService.update(id, body);
    }
    async delete(param) {
        const { id } = param;
        await this.snippetService.delete(id);
    }
};
__decorate([
    (0, common_1.Get)('/'),
    (0, auth_decorator_1.Auth)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pager_dto_1.PagerDto]),
    __metadata("design:returntype", Promise)
], SnippetController.prototype, "getList", null);
__decorate([
    (0, common_1.Post)('/more'),
    (0, auth_decorator_1.Auth)(),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [snippet_dto_1.SnippetMoreDto]),
    __metadata("design:returntype", Promise)
], SnippetController.prototype, "createMore", null);
__decorate([
    (0, common_1.Post)('/'),
    (0, auth_decorator_1.Auth)(),
    demo_decorator_1.BanInDemo,
    http_decorator_1.HTTPDecorators.Idempotence(),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [snippet_model_1.SnippetModel]),
    __metadata("design:returntype", Promise)
], SnippetController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('/:id'),
    (0, auth_decorator_1.Auth)(),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.MongoIdDto]),
    __metadata("design:returntype", Promise)
], SnippetController.prototype, "getSnippetById", null);
__decorate([
    (0, common_1.Post)('/aggregate'),
    (0, auth_decorator_1.Auth)(),
    openapi.ApiResponse({ status: 201, type: [Object] }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SnippetController.prototype, "aggregate", null);
__decorate([
    (0, common_1.Get)('/:reference/:name'),
    http_decorator_1.HTTPDecorators.Bypass,
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('name')),
    __param(1, (0, common_1.Param)('reference')),
    __param(2, (0, role_decorator_1.IsMaster)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Boolean]),
    __metadata("design:returntype", Promise)
], SnippetController.prototype, "getSnippetByName", null);
__decorate([
    (0, common_1.Put)('/:id'),
    (0, auth_decorator_1.Auth)(),
    demo_decorator_1.BanInDemo,
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.MongoIdDto, snippet_model_1.SnippetModel]),
    __metadata("design:returntype", Promise)
], SnippetController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('/:id'),
    (0, auth_decorator_1.Auth)(),
    demo_decorator_1.BanInDemo,
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.MongoIdDto]),
    __metadata("design:returntype", Promise)
], SnippetController.prototype, "delete", null);
SnippetController = __decorate([
    openapi_decorator_1.ApiName,
    (0, common_1.Controller)('snippets'),
    __metadata("design:paramtypes", [snippet_service_1.SnippetService])
], SnippetController);
exports.SnippetController = SnippetController;
