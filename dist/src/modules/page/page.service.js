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
exports.PageService = void 0;
const class_validator_1 = require("class-validator");
const lodash_1 = require("lodash");
const slugify_1 = __importDefault(require("slugify"));
const common_1 = require("@nestjs/common");
const cant_find_exception_1 = require("../../common/exceptions/cant-find.exception");
const business_event_constant_1 = require("../../constants/business-event.constant");
const helper_event_service_1 = require("../../processors/helper/helper.event.service");
const helper_image_service_1 = require("../../processors/helper/helper.image.service");
const helper_macro_service_1 = require("../../processors/helper/helper.macro.service");
const model_transformer_1 = require("../../transformers/model.transformer");
const page_model_1 = require("./page.model");
let PageService = class PageService {
    constructor(pageModel, imageService, eventManager, macroService) {
        this.pageModel = pageModel;
        this.imageService = imageService;
        this.eventManager = eventManager;
        this.macroService = macroService;
    }
    get model() {
        return this.pageModel;
    }
    async create(doc) {
        const res = await this.model.create({
            ...doc,
            slug: (0, slugify_1.default)(doc.slug),
            created: new Date(),
        });
        process.nextTick(async () => {
            await Promise.all([
                this.imageService.recordImageDimensions(this.pageModel, res._id),
            ]);
        });
        return res;
    }
    async updateById(id, doc) {
        if (['text', 'title', 'subtitle'].some((key) => (0, class_validator_1.isDefined)(doc[key]))) {
            doc.modified = new Date();
        }
        if (doc.slug) {
            doc.slug = (0, slugify_1.default)(doc.slug);
        }
        const newDoc = await this.model
            .findOneAndUpdate({ _id: id }, { ...(0, lodash_1.omit)(doc, page_model_1.PageModel.protectedKeys) }, { new: true })
            .lean({ getters: true });
        if (!newDoc) {
            throw new cant_find_exception_1.CannotFindException();
        }
        process.nextTick(async () => {
            await Promise.all([
                this.imageService.recordImageDimensions(this.pageModel, id),
                this.eventManager.broadcast(business_event_constant_1.BusinessEvents.PAGE_UPDATED, newDoc, {
                    scope: business_event_constant_1.EventScope.TO_SYSTEM,
                }),
                this.eventManager.broadcast(business_event_constant_1.BusinessEvents.PAGE_UPDATED, {
                    ...newDoc,
                    text: await this.macroService.replaceTextMacro(newDoc.text, newDoc),
                }, {
                    scope: business_event_constant_1.EventScope.TO_VISITOR,
                }),
            ]);
        });
    }
};
PageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, model_transformer_1.InjectModel)(page_model_1.PageModel)),
    __metadata("design:paramtypes", [Object, helper_image_service_1.ImageService,
        helper_event_service_1.EventManagerService,
        helper_macro_service_1.TextMacroService])
], PageService);
exports.PageService = PageService;
