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
exports.NoteService = void 0;
const class_validator_1 = require("class-validator");
const common_1 = require("@nestjs/common");
const cant_find_exception_1 = require("../../common/exceptions/cant-find.exception");
const business_event_constant_1 = require("../../constants/business-event.constant");
const event_bus_constant_1 = require("../../constants/event-bus.constant");
const helper_event_service_1 = require("../../processors/helper/helper.event.service");
const helper_image_service_1 = require("../../processors/helper/helper.image.service");
const helper_macro_service_1 = require("../../processors/helper/helper.macro.service");
const model_transformer_1 = require("../../transformers/model.transformer");
const utils_1 = require("../../utils");
const comment_model_1 = require("../comment/comment.model");
const comment_service_1 = require("../comment/comment.service");
const note_model_1 = require("./note.model");
const qa_service_1 = require("../qa//qa.service");
let NoteService = class NoteService {
    constructor(noteModel, imageService, eventManager, commentService, textMacrosService, qaService) {
        this.noteModel = noteModel;
        this.imageService = imageService;
        this.eventManager = eventManager;
        this.commentService = commentService;
        this.textMacrosService = textMacrosService;
        this.qaService = qaService;
        this.needCreateDefult();
    }
    get model() {
        return this.noteModel;
    }
    async getLatestOne(condition = {}, projection = undefined) {
        const latest = await this.noteModel
            .findOne(condition, projection)
            .sort({
            created: -1,
        })
            .lean();
        if (!latest) {
            throw new cant_find_exception_1.CannotFindException();
        }
        latest.text = await this.textMacrosService.replaceTextMacro(latest.text, latest);
        const next = await this.noteModel
            .findOne({
            created: {
                $lt: latest.created,
            },
        })
            .sort({
            created: -1,
        })
            .select('nid _id')
            .lean();
        return {
            latest,
            next,
        };
    }
    checkPasswordToAccess(doc, password) {
        const hasPassword = doc.password;
        if (!hasPassword) {
            return true;
        }
        if (!password) {
            return false;
        }
        const isValid = Object.is(password, doc.password);
        return isValid;
    }
    checkQAOK(doc, answer) {
        const qaid = doc.qa;
        if (!qaid) {
            return true;
        }
        if (!answer) {
            return false;
        }
        return this.qaService.checkAnswer(qaid, answer);
    }
    async create(document) {
        const doc = await this.noteModel.create(document);
        process.nextTick(async () => {
            await Promise.all([
                this.eventManager.emit(event_bus_constant_1.EventBusEvents.CleanAggregateCache, null, {
                    scope: business_event_constant_1.EventScope.TO_SYSTEM,
                }),
                this.eventManager.emit(business_event_constant_1.BusinessEvents.NOTE_CREATE, doc.toJSON(), {
                    scope: business_event_constant_1.EventScope.TO_SYSTEM,
                }),
                this.imageService.recordImageDimensions(this.noteModel, doc._id),
                doc.hide || doc.password
                    ? null
                    : this.eventManager.broadcast(business_event_constant_1.BusinessEvents.NOTE_CREATE, {
                        ...doc.toJSON(),
                        text: await this.textMacrosService.replaceTextMacro(doc.text, doc),
                    }, {
                        scope: business_event_constant_1.EventScope.TO_VISITOR,
                    }),
            ]);
        });
        return doc;
    }
    async updateById(id, doc) {
        (0, utils_1.deleteKeys)(doc, ...note_model_1.NoteModel.protectedKeys);
        if (['title', 'text'].some((key) => (0, class_validator_1.isDefined)(doc[key]))) {
            doc.modified = new Date();
        }
        const updated = await this.noteModel.findOneAndUpdate({
            _id: id,
        }, { ...doc }, { new: true });
        process.nextTick(async () => {
            this.eventManager.emit(event_bus_constant_1.EventBusEvents.CleanAggregateCache, null, {
                scope: business_event_constant_1.EventScope.TO_SYSTEM,
            });
            await Promise.all([
                this.imageService.recordImageDimensions(this.noteModel, id),
                this.model
                    .findById(id)
                    .lean()
                    .then(async (doc) => {
                    if (!doc) {
                        return;
                    }
                    delete doc.password;
                    this.eventManager.broadcast(business_event_constant_1.BusinessEvents.NOTE_UPDATE, doc, {
                        scope: business_event_constant_1.EventScope.TO_SYSTEM,
                    });
                    this.eventManager.broadcast(business_event_constant_1.BusinessEvents.NOTE_UPDATE, {
                        ...doc,
                        text: await this.textMacrosService.replaceTextMacro(doc.text, doc),
                    }, {
                        scope: business_event_constant_1.EventScope.TO_VISITOR,
                    });
                }),
            ]);
        });
        return updated;
    }
    async deleteById(id) {
        const doc = await this.noteModel.findById(id);
        if (!doc) {
            throw new cant_find_exception_1.CannotFindException();
        }
        await Promise.all([
            this.noteModel.deleteOne({
                _id: id,
            }),
            this.commentService.model.deleteMany({
                ref: id,
                refType: comment_model_1.CommentRefTypes.Note,
            }),
        ]);
        process.nextTick(async () => {
            await Promise.all([
                this.eventManager.broadcast(business_event_constant_1.BusinessEvents.NOTE_DELETE, id, {
                    scope: business_event_constant_1.EventScope.TO_SYSTEM_VISITOR,
                }),
            ]);
        });
    }
    async getIdByNid(nid) {
        const document = await this.model
            .findOne({
            nid,
        })
            .lean();
        if (!document) {
            return null;
        }
        return document._id;
    }
    async findOneByIdOrNid(unique) {
        if (!(0, class_validator_1.isMongoId)(unique)) {
            const id = await this.getIdByNid(unique);
            return this.model.findOne({ _id: id });
        }
        return this.model.findById(unique);
    }
    async getNotePaginationByTopicId(topicId, pagination = {}, condition) {
        const { page = 1, limit = 10, ...rest } = pagination;
        return await this.model.paginate({
            topicId,
            ...condition,
        }, {
            page,
            limit,
            ...rest,
        });
    }
    async needCreateDefult() {
        await this.noteModel.countDocuments({}).then((count) => {
            if (!count) {
                this.noteModel.countDocuments({
                    title: '第一篇日记',
                    text: 'Hello World',
                });
            }
        });
    }
};
NoteService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, model_transformer_1.InjectModel)(note_model_1.NoteModel)),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => comment_service_1.CommentService))),
    __metadata("design:paramtypes", [Object, helper_image_service_1.ImageService,
        helper_event_service_1.EventManagerService,
        comment_service_1.CommentService,
        helper_macro_service_1.TextMacroService,
        qa_service_1.QAService])
], NoteService);
exports.NoteService = NoteService;
