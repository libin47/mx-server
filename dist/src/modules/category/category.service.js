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
exports.CategoryService = void 0;
const lodash_1 = require("lodash");
const common_1 = require("@nestjs/common");
const cant_find_exception_1 = require("../../common/exceptions/cant-find.exception");
const model_transformer_1 = require("../../transformers/model.transformer");
const post_service_1 = require("../post/post.service");
const category_model_1 = require("./category.model");
let CategoryService = class CategoryService {
    constructor(categoryModel, postService) {
        this.categoryModel = categoryModel;
        this.postService = postService;
        this.createDefaultCategory();
    }
    async findCategoryById(categoryId) {
        const [category, count] = await Promise.all([
            this.model.findById(categoryId).lean(),
            this.postService.model.countDocuments({ categoryId }),
        ]);
        return {
            ...category,
            count,
        };
    }
    async findAllCategory() {
        const data = await this.model.find({ type: category_model_1.CategoryType.Category }).lean();
        const counts = await Promise.all(data.map((item) => {
            const id = item._id;
            return this.postService.model.countDocuments({ categoryId: id });
        }));
        for (let i = 0; i < data.length; i++) {
            Reflect.set(data[i], 'count', counts[i]);
        }
        return data;
    }
    get model() {
        return this.categoryModel;
    }
    async getPostTagsSum() {
        const data = await this.postService.model.aggregate([
            { $project: { tags: 1 } },
            {
                $unwind: '$tags',
            },
            { $group: { _id: '$tags', count: { $sum: 1 } } },
            {
                $project: {
                    _id: 0,
                    name: '$_id',
                    count: 1,
                },
            },
        ]);
        return data;
    }
    async findArticleWithTag(tag, condition = {}) {
        const posts = await this.postService.model
            .find({
            tags: tag,
            ...condition,
        }, undefined, { lean: true })
            .populate('category');
        if (!posts.length) {
            throw new cant_find_exception_1.CannotFindException();
        }
        return posts.map(({ _id, title, slug, category, created }) => ({
            _id,
            title,
            slug,
            category: (0, lodash_1.omit)(category, ['count', '__v', 'created', 'modified']),
            created,
        }));
    }
    async findCategoryPost(categoryId, condition = {}) {
        return await this.postService.model
            .find({
            categoryId,
            ...condition,
        })
            .select('title created slug _id')
            .sort({ created: -1 });
    }
    async findPostsInCategory(id) {
        return await this.postService.model.find({
            categoryId: id,
        });
    }
    async createDefaultCategory() {
        if ((await this.model.countDocuments()) === 0) {
            return await this.model.create({
                name: '默认分类',
                slug: 'default',
            });
        }
    }
};
CategoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, model_transformer_1.InjectModel)(category_model_1.CategoryModel)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => post_service_1.PostService))),
    __metadata("design:paramtypes", [Object, post_service_1.PostService])
], CategoryService);
exports.CategoryService = CategoryService;
