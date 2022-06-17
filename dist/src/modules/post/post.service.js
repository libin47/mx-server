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
exports.PostService = void 0;
const class_validator_1 = require("class-validator");
const lodash_1 = require("lodash");
const slugify_1 = __importDefault(require("slugify"));
const common_1 = require("@nestjs/common");
const business_exception_1 = require("../../common/exceptions/business.exception");
const cant_find_exception_1 = require("../../common/exceptions/cant-find.exception");
const business_event_constant_1 = require("../../constants/business-event.constant");
const error_code_constant_1 = require("../../constants/error-code.constant");
const event_bus_constant_1 = require("../../constants/event-bus.constant");
const helper_event_service_1 = require("../../processors/helper/helper.event.service");
const helper_image_service_1 = require("../../processors/helper/helper.image.service");
const helper_macro_service_1 = require("../../processors/helper/helper.macro.service");
const model_transformer_1 = require("../../transformers/model.transformer");
const category_service_1 = require("../category/category.service");
const comment_model_1 = require("../comment/comment.model");
const post_model_1 = require("./post.model");
let PostService = class PostService {
    constructor(postModel, commentModel, categoryService, imageService, eventManager, textMacroService) {
        this.postModel = postModel;
        this.commentModel = commentModel;
        this.categoryService = categoryService;
        this.imageService = imageService;
        this.eventManager = eventManager;
        this.textMacroService = textMacroService;
    }
    get model() {
        return this.postModel;
    }
    findWithPaginator(condition, options) {
        return this.postModel.paginate(condition, options);
    }
    async create(post) {
        const { categoryId } = post;
        const category = await this.categoryService.findCategoryById(categoryId);
        if (!category) {
            throw new common_1.BadRequestException('分类丢失了 ಠ_ಠ');
        }
        const slug = post.slug ? (0, slugify_1.default)(post.slug) : (0, slugify_1.default)(post.title);
        if (!(await this.isAvailableSlug(slug))) {
            throw new business_exception_1.BusinessException(error_code_constant_1.ErrorCodeEnum.SlugNotAvailable);
        }
        const res = await this.postModel.create({
            ...post,
            slug,
            categoryId: category.id,
            created: new Date(),
            modified: null,
        });
        process.nextTick(async () => {
            const doc = res.toJSON();
            await Promise.all([
                this.eventManager.emit(event_bus_constant_1.EventBusEvents.CleanAggregateCache, null, {
                    scope: business_event_constant_1.EventScope.TO_SYSTEM,
                }),
                this.eventManager.broadcast(business_event_constant_1.BusinessEvents.POST_CREATE, {
                    ...doc,
                    category,
                }, {
                    scope: business_event_constant_1.EventScope.TO_SYSTEM,
                }),
                this.eventManager.broadcast(business_event_constant_1.BusinessEvents.POST_CREATE, {
                    ...doc,
                    category,
                    text: await this.textMacroService.replaceTextMacro(doc.text, doc),
                }, {
                    scope: business_event_constant_1.EventScope.TO_SYSTEM,
                }),
                this.imageService.recordImageDimensions(this.postModel, res._id),
            ]);
        });
        return res;
    }
    async updateById(id, data) {
        const oldDocument = await this.postModel.findById(id).lean();
        if (!oldDocument) {
            throw new common_1.BadRequestException('文章不存在');
        }
        const { categoryId } = data;
        if (categoryId && categoryId !== oldDocument.categoryId) {
            const category = await this.categoryService.findCategoryById(categoryId);
            if (!category) {
                throw new common_1.BadRequestException('分类不存在');
            }
        }
        if ([data.text, data.title, data.slug].some((i) => (0, class_validator_1.isDefined)(i))) {
            const now = new Date();
            data.modified = now;
        }
        const originDocument = await this.postModel.findById(id);
        if (!originDocument) {
            throw new cant_find_exception_1.CannotFindException();
        }
        if (data.slug && data.slug !== originDocument.slug) {
            data.slug = (0, slugify_1.default)(data.slug);
            const isAvailableSlug = await this.isAvailableSlug(data.slug);
            if (!isAvailableSlug) {
                throw new business_exception_1.BusinessException(error_code_constant_1.ErrorCodeEnum.SlugNotAvailable);
            }
        }
        Object.assign(originDocument, (0, lodash_1.omit)(data, post_model_1.PostModel.protectedKeys));
        await originDocument.save();
        process.nextTick(async () => {
            const doc = await this.postModel.findById(id).lean({ getters: true });
            await Promise.all([
                this.eventManager.emit(event_bus_constant_1.EventBusEvents.CleanAggregateCache, null, {
                    scope: business_event_constant_1.EventScope.TO_SYSTEM,
                }),
                data.text &&
                    this.imageService.recordImageDimensions(this.postModel, id),
                doc &&
                    this.eventManager.broadcast(business_event_constant_1.BusinessEvents.POST_UPDATE, {
                        ...doc,
                        text: await this.textMacroService.replaceTextMacro(doc.text, doc),
                    }, {
                        scope: business_event_constant_1.EventScope.TO_VISITOR,
                    }),
                this.eventManager.broadcast(business_event_constant_1.BusinessEvents.POST_UPDATE, doc, {
                    scope: business_event_constant_1.EventScope.TO_SYSTEM,
                }),
            ]);
        });
        return originDocument.toObject();
    }
    async deletePost(id) {
        await Promise.all([
            this.model.deleteOne({ _id: id }),
            this.commentModel.deleteMany({ ref: id, refType: comment_model_1.CommentRefTypes.Post }),
        ]);
        await this.eventManager.broadcast(business_event_constant_1.BusinessEvents.POST_DELETE, id, {
            scope: business_event_constant_1.EventScope.TO_SYSTEM_VISITOR,
            nextTick: true,
        });
    }
    async getCategoryBySlug(slug) {
        return await this.categoryService.model.findOne({ slug });
    }
    async isAvailableSlug(slug) {
        return (await this.postModel.countDocuments({ slug })) === 0;
    }
};
PostService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, model_transformer_1.InjectModel)(post_model_1.PostModel)),
    __param(1, (0, model_transformer_1.InjectModel)(comment_model_1.CommentModel)),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => category_service_1.CategoryService))),
    __metadata("design:paramtypes", [Object, Object, category_service_1.CategoryService,
        helper_image_service_1.ImageService,
        helper_event_service_1.EventManagerService,
        helper_macro_service_1.TextMacroService])
], PostService);
exports.PostService = PostService;
