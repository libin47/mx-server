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
exports.CategoryController = void 0;
const openapi = require("@nestjs/swagger");
const mongoose_1 = require("mongoose");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_decorator_1 = require("../../common/decorator/auth.decorator");
const http_decorator_1 = require("../../common/decorator/http.decorator");
const openapi_decorator_1 = require("../../common/decorator/openapi.decorator");
const cant_find_exception_1 = require("../../common/exceptions/cant-find.exception");
const id_dto_1 = require("../../shared/dto/id.dto");
const post_service_1 = require("../post/post.service");
const category_dto_1 = require("./category.dto");
const category_model_1 = require("./category.model");
const category_service_1 = require("./category.service");
let CategoryController = class CategoryController {
    constructor(categoryService, postService) {
        this.categoryService = categoryService;
        this.postService = postService;
    }
    async getCategories(query) {
        const { ids, joint, type = category_model_1.CategoryType.Category } = query;
        if (ids) {
            const ignoreKeys = '-text -summary -hide -images -commentsIndex';
            if (joint) {
                const map = new Object();
                await Promise.all(ids.map(async (id) => {
                    const item = await this.postService.model
                        .find({ categoryId: id }, ignoreKeys)
                        .sort({ created: -1 })
                        .lean();
                    map[id] = item;
                    return id;
                }));
                return { entries: map };
            }
            else {
                const map = new Object();
                await Promise.all(ids.map(async (id) => {
                    const posts = await this.postService.model
                        .find({ categoryId: id }, ignoreKeys)
                        .sort({ created: -1 })
                        .lean();
                    const category = await this.categoryService.findCategoryById(id);
                    map[id] = Object.assign({ ...category, children: posts });
                    return id;
                }));
                return { entries: map };
            }
        }
        return type === category_model_1.CategoryType.Category
            ? await this.categoryService.findAllCategory()
            : await this.categoryService.getPostTagsSum();
    }
    async getCategoryById({ query }, { tag }) {
        if (!query) {
            throw new common_1.BadRequestException();
        }
        if (tag === true) {
            return {
                tag: query,
                data: await this.categoryService.findArticleWithTag(query),
            };
        }
        const isId = (0, mongoose_1.isValidObjectId)(query);
        const res = isId
            ? await this.categoryService.model
                .findById(query)
                .sort({ created: -1 })
                .lean()
            : await this.categoryService.model
                .findOne({ slug: query })
                .sort({ created: -1 })
                .lean();
        if (!res) {
            throw new cant_find_exception_1.CannotFindException();
        }
        const children = (await this.categoryService.findCategoryPost(res._id, {
            $and: [tag ? { tags: tag } : {}],
        })) || [];
        return { data: { ...res, children } };
    }
    async create(body) {
        const { name, slug } = body;
        return this.categoryService.model.create({ name, slug: slug !== null && slug !== void 0 ? slug : name });
    }
    async modify(params, body) {
        const { type, slug, name } = body;
        const { id } = params;
        await this.categoryService.model.updateOne({ _id: id }, {
            slug,
            type,
            name,
        });
        return await this.categoryService.model.findById(id);
    }
    async patch(params, body) {
        const { id } = params;
        await this.categoryService.model.updateOne({ _id: id }, body);
        return;
    }
    async deleteCategory(params) {
        const { id } = params;
        const category = await this.categoryService.model.findById(id);
        if (!category) {
            throw new cant_find_exception_1.CannotFindException();
        }
        const postsInCategory = await this.categoryService.findPostsInCategory(category._id);
        if (postsInCategory.length > 0) {
            throw new common_1.BadRequestException('该分类中有其他文章, 无法被删除');
        }
        const res = await this.categoryService.model.deleteOne({
            _id: category._id,
        });
        if ((await this.categoryService.model.countDocuments({})) === 0) {
            await this.categoryService.createDefaultCategory();
        }
        return res;
    }
};
__decorate([
    (0, common_1.Get)('/'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [category_dto_1.MultiCategoriesQueryDto]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Get)('/:query'),
    (0, swagger_1.ApiQuery)({
        description: '混合查询 分类 和 标签云',
        name: 'tag',
        enum: ['true', 'false'],
        required: false,
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [category_dto_1.SlugOrIdDto,
        category_dto_1.MultiQueryTagAndCategoryDto]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "getCategoryById", null);
__decorate([
    (0, common_1.Post)('/'),
    (0, auth_decorator_1.Auth)(),
    http_decorator_1.HTTPDecorators.Idempotence(),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [category_model_1.CategoryModel]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "create", null);
__decorate([
    (0, common_1.Put)('/:id'),
    (0, auth_decorator_1.Auth)(),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.MongoIdDto, category_model_1.CategoryModel]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "modify", null);
__decorate([
    (0, common_1.Patch)('/:id'),
    (0, common_1.HttpCode)(204),
    (0, auth_decorator_1.Auth)(),
    openapi.ApiResponse({ status: 204 }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.MongoIdDto, category_model_1.PartialCategoryModel]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "patch", null);
__decorate([
    (0, common_1.Delete)('/:id'),
    (0, auth_decorator_1.Auth)(),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.MongoIdDto]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "deleteCategory", null);
CategoryController = __decorate([
    (0, common_1.Controller)({ path: 'categories' }),
    openapi_decorator_1.ApiName,
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => post_service_1.PostService))),
    __metadata("design:paramtypes", [category_service_1.CategoryService,
        post_service_1.PostService])
], CategoryController);
exports.CategoryController = CategoryController;
