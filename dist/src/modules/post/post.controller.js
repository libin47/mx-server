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
exports.PostController = void 0;
const openapi = require("@nestjs/swagger");
const mongoose_1 = require("mongoose");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_decorator_1 = require("../../common/decorator/auth.decorator");
const http_decorator_1 = require("../../common/decorator/http.decorator");
const ip_decorator_1 = require("../../common/decorator/ip.decorator");
const openapi_decorator_1 = require("../../common/decorator/openapi.decorator");
const update_count_decorator_1 = require("../../common/decorator/update-count.decorator");
const cant_find_exception_1 = require("../../common/exceptions/cant-find.exception");
const helper_counting_service_1 = require("../../processors/helper/helper.counting.service");
const id_dto_1 = require("../../shared/dto/id.dto");
const pager_dto_1 = require("../../shared/dto/pager.dto");
const db_query_transformer_1 = require("../../transformers/db-query.transformer");
const post_dto_1 = require("./post.dto");
const post_model_1 = require("./post.model");
const post_service_1 = require("./post.service");
let PostController = class PostController {
    constructor(postService, countingService) {
        this.postService = postService;
        this.countingService = countingService;
    }
    async getPaginate(query) {
        const { size, select, page, year, sortBy, sortOrder } = query;
        return await this.postService.model.paginate({
            ...(0, db_query_transformer_1.addYearCondition)(year),
        }, {
            limit: size,
            page,
            select,
            sort: sortBy
                ? { [sortBy]: sortOrder || -1 }
                : { pinOrder: -1, pin: -1, created: -1 },
        });
    }
    async getById(params) {
        const { id } = params;
        const doc = await this.postService.model.findById(id).populate('category');
        if (!doc) {
            throw new cant_find_exception_1.CannotFindException();
        }
        return doc;
    }
    async getLatest() {
        const last = await this.postService.model
            .findOne({})
            .sort({ created: -1 })
            .lean({ getters: true });
        if (!last) {
            throw new cant_find_exception_1.CannotFindException();
        }
        return this.getByCateAndSlug({
            category: last.category.slug,
            slug: last.slug,
        });
    }
    async getByCateAndSlug(params) {
        const { category, slug } = params;
        const categoryDocument = await this.postService.getCategoryBySlug(category);
        if (!categoryDocument) {
            throw new common_1.NotFoundException('该分类未找到 (｡•́︿•̀｡)');
        }
        const postDocument = await this.postService.model
            .findOne({
            slug,
            categoryId: categoryDocument._id,
        })
            .populate('category');
        if (!postDocument) {
            throw new cant_find_exception_1.CannotFindException();
        }
        return postDocument.toJSON();
    }
    async create(body) {
        var _a;
        const _id = new mongoose_1.Types.ObjectId();
        return await this.postService.create({
            ...body,
            created: new Date(),
            modified: null,
            slug: (_a = body.slug) !== null && _a !== void 0 ? _a : _id.toHexString(),
        });
    }
    async update(params, body) {
        return await this.postService.updateById(params.id, body);
    }
    async patch(params, body) {
        return await this.postService.updateById(params.id, body);
    }
    async deletePost(params) {
        const { id } = params;
        await this.postService.deletePost(id);
        return;
    }
    async thumbsUpArticle(query, location) {
        const { ip } = location;
        const { id } = query;
        try {
            const res = await this.countingService.updateLikeCount('Post', id, ip);
            if (!res) {
                throw new common_1.BadRequestException('你已经支持过啦!');
            }
        }
        catch (e) {
            throw new common_1.BadRequestException(e);
        }
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
], PostController.prototype, "getPaginate", null);
__decorate([
    (0, common_1.Get)('/:id'),
    (0, auth_decorator_1.Auth)(),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.MongoIdDto]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "getById", null);
__decorate([
    (0, common_1.Get)('/latest'),
    (0, update_count_decorator_1.VisitDocument)('Post'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PostController.prototype, "getLatest", null);
__decorate([
    (0, common_1.Get)('/:category/:slug'),
    (0, swagger_1.ApiOperation)({ summary: '根据分类名和自定义别名获取' }),
    (0, update_count_decorator_1.VisitDocument)('Post'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [post_dto_1.CategoryAndSlugDto]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "getByCateAndSlug", null);
__decorate([
    (0, common_1.Post)('/'),
    (0, auth_decorator_1.Auth)(),
    http_decorator_1.HTTPDecorators.Idempotence(),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [post_model_1.PostModel]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "create", null);
__decorate([
    (0, common_1.Put)('/:id'),
    (0, auth_decorator_1.Auth)(),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.MongoIdDto, post_model_1.PostModel]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)('/:id'),
    (0, auth_decorator_1.Auth)(),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.MongoIdDto, post_model_1.PartialPostModel]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "patch", null);
__decorate([
    (0, common_1.Delete)('/:id'),
    (0, auth_decorator_1.Auth)(),
    (0, common_1.HttpCode)(204),
    openapi.ApiResponse({ status: 204 }),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.MongoIdDto]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "deletePost", null);
__decorate([
    (0, common_1.Get)('/_thumbs-up'),
    (0, common_1.HttpCode)(204),
    openapi.ApiResponse({ status: 204 }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, ip_decorator_1.IpLocation)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.MongoIdDto, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "thumbsUpArticle", null);
PostController = __decorate([
    (0, common_1.Controller)('posts'),
    openapi_decorator_1.ApiName,
    __metadata("design:paramtypes", [post_service_1.PostService,
        helper_counting_service_1.CountingService])
], PostController);
exports.PostController = PostController;
