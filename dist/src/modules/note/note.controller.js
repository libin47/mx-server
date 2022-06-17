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
exports.NoteController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_decorator_1 = require("../../common/decorator/auth.decorator");
const http_decorator_1 = require("../../common/decorator/http.decorator");
const ip_decorator_1 = require("../../common/decorator/ip.decorator");
const openapi_decorator_1 = require("../../common/decorator/openapi.decorator");
const role_decorator_1 = require("../../common/decorator/role.decorator");
const update_count_decorator_1 = require("../../common/decorator/update-count.decorator");
const cant_find_exception_1 = require("../../common/exceptions/cant-find.exception");
const helper_counting_service_1 = require("../../processors/helper/helper.counting.service");
const helper_macro_service_1 = require("../../processors/helper/helper.macro.service");
const id_dto_1 = require("../../shared/dto/id.dto");
const pager_dto_1 = require("../../shared/dto/pager.dto");
const db_query_transformer_1 = require("../../transformers/db-query.transformer");
const note_dto_1 = require("./note.dto");
const note_model_1 = require("./note.model");
const note_service_1 = require("./note.service");
let NoteController = class NoteController {
    constructor(noteService, countingService, macrosService) {
        this.noteService = noteService;
        this.countingService = countingService;
        this.macrosService = macrosService;
    }
    async getLatestOne(isMaster, query) {
        const { answer } = query;
        const { latest, next } = await this.noteService.getLatestOne({
            ...(0, db_query_transformer_1.addHidePasswordAndHideCondition)(isMaster),
        }, isMaster ? '+location +coordinates' : '-location -coordinates');
        const QANice = await this.noteService.checkQAOK(latest, answer);
        if (!QANice &&
            !isMaster) {
            if (!answer) {
                latest.text = '';
                latest["statcode"] = -1;
                latest["stat"] = "Need answer the question";
            }
            else {
                latest.text = '';
                latest["statcode"] = -2;
                latest["stat"] = "Answer error";
            }
        }
        else {
            latest["statcode"] = 0;
        }
        return { data: latest, next: next };
    }
    async getNotes(isMaster, query) {
        const { size, select, page, sortBy, sortOrder, year, db_query } = query;
        const condition = {
            ...(0, db_query_transformer_1.addHidePasswordAndHideCondition)(isMaster),
            ...(0, db_query_transformer_1.addYearCondition)(year),
        };
        return await this.noteService.model.paginate(db_query !== null && db_query !== void 0 ? db_query : condition, {
            limit: size,
            page,
            select: isMaster
                ? select
                : select === null || select === void 0 ? void 0 : select.replace(/[+-]?(coordinates|location|password)/g, ''),
            sort: sortBy ? { [sortBy]: sortOrder || -1 } : { created: -1 },
        });
    }
    async getOneNote(isMaster, params, query) {
        const { id } = params;
        const { answer } = query;
        const current = await this.noteService.model
            .findOne({
            _id: id,
        })
            .select(`+password +location +coordinates`)
            .lean({ getters: true });
        if (!current) {
            throw new cant_find_exception_1.CannotFindException();
        }
        const QANice = await this.noteService.checkQAOK(current, answer);
        if (!QANice && !isMaster) {
            if (!answer) {
                current.text = '';
                current["statcode"] = -1;
                current["stat"] = "Need answer the question";
            }
            else {
                current.text = '';
                current["statcode"] = -2;
                current["stat"] = "Answer error";
            }
        }
        else {
            current["statcode"] = 0;
        }
        const select = '_id title nid id created modified';
        const prev = await this.noteService.model
            .findOne({
            created: {
                $gt: current.created,
            },
        })
            .sort({ created: 1 })
            .select(select)
            .lean();
        const next = await this.noteService.model
            .findOne({
            created: {
                $lt: current.created,
            },
        })
            .sort({ created: -1 })
            .select(select)
            .lean();
        delete current.password;
        return { data: current, next, prev };
    }
    async getNoteList(query, params, isMaster) {
        const { size = 10 } = query;
        const half = size >> 1;
        const { id } = params;
        const select = 'nid _id title created';
        const condition = isMaster ? {} : { hide: false };
        const currentDocument = await this.noteService.model
            .findById(id)
            .select(select)
            .lean();
        if (!currentDocument) {
            return { data: [], size: 0 };
        }
        const prevList = half - 1 === 0
            ? []
            : await this.noteService.model
                .find({
                created: {
                    $gt: currentDocument.created,
                },
                ...condition,
            }, select)
                .limit(half - 1)
                .sort({ created: 1 })
                .lean();
        const nextList = !half
            ? []
            : await this.noteService.model
                .find({
                created: {
                    $lt: currentDocument.created,
                },
                ...condition,
            }, select)
                .limit(half - 1)
                .sort({ created: -1 })
                .lean();
        const data = [...prevList, ...nextList, currentDocument].sort((a, b) => b.created - a.created);
        return { data, size: data.length };
    }
    async create(body) {
        return await this.noteService.create(body);
    }
    async modify(body, params) {
        return await this.noteService.updateById(params.id, body);
    }
    async patch(body, params) {
        await this.noteService.updateById(params.id, body);
        return;
    }
    async likeNote(param, location) {
        var _a;
        const id = typeof param.id === 'number'
            ? (_a = (await this.noteService.model.findOne({ nid: param.id }).lean())) === null || _a === void 0 ? void 0 : _a._id
            : param.id;
        if (!id) {
            throw new cant_find_exception_1.CannotFindException();
        }
        try {
            const res = await this.countingService.updateLikeCount('Note', id, location.ip);
            if (!res) {
                throw new common_1.BadRequestException('你已经喜欢过啦!');
            }
            return;
        }
        catch (e) {
            throw new common_1.BadRequestException(e);
        }
    }
    async deleteNote(params) {
        await this.noteService.deleteById(params.id);
    }
    async getNoteByNid(params, isMaster, query, isSingle) {
        const id = await this.noteService.getIdByNid(params.nid);
        if (!id) {
            throw new cant_find_exception_1.CannotFindException();
        }
        return await this.getOneNote(isMaster, { id }, query);
    }
    async modifyNoteByNid(params, body) {
        const id = await this.noteService.getIdByNid(params.nid);
        if (!id) {
            throw new cant_find_exception_1.CannotFindException();
        }
        return await this.modify(body, {
            id,
        });
    }
    async getNotesByTopic(params, query, isMaster) {
        const { id } = params;
        const { size, page, select = '_id title nid id created modified', sortBy, sortOrder, } = query;
        const condition = isMaster
            ? { $or: [{ hide: false }, { hide: true }] }
            : { hide: false };
        return await this.noteService.getNotePaginationByTopicId(id, {
            page,
            limit: size,
            select,
            sort: sortBy ? { [sortBy]: sortOrder } : undefined,
        }, { ...condition });
    }
};
__decorate([
    (0, common_1.Get)('/latest'),
    (0, swagger_1.ApiOperation)({ summary: '获取最新发布一篇记录' }),
    (0, update_count_decorator_1.VisitDocument)('Note'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, role_decorator_1.IsMaster)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean, note_dto_1.QAQueryDto]),
    __metadata("design:returntype", Promise)
], NoteController.prototype, "getLatestOne", null);
__decorate([
    (0, common_1.Get)('/'),
    http_decorator_1.Paginator,
    (0, swagger_1.ApiOperation)({ summary: '获取记录带分页器' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, role_decorator_1.IsMaster)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean, note_dto_1.NoteQueryDto]),
    __metadata("design:returntype", Promise)
], NoteController.prototype, "getNotes", null);
__decorate([
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, role_decorator_1.IsMaster)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean, id_dto_1.MongoIdDto,
        note_dto_1.QAQueryDto]),
    __metadata("design:returntype", Promise)
], NoteController.prototype, "getOneNote", null);
__decorate([
    (0, common_1.Get)('/list/:id'),
    (0, swagger_1.ApiOperation)({ summary: '以一篇记录为基准的中间 10 篇记录' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, role_decorator_1.IsMaster)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [note_dto_1.ListQueryDto,
        id_dto_1.MongoIdDto, Boolean]),
    __metadata("design:returntype", Promise)
], NoteController.prototype, "getNoteList", null);
__decorate([
    (0, common_1.Post)('/'),
    http_decorator_1.HTTPDecorators.Idempotence(),
    (0, auth_decorator_1.Auth)(),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [note_model_1.NoteModel]),
    __metadata("design:returntype", Promise)
], NoteController.prototype, "create", null);
__decorate([
    (0, common_1.Put)('/:id'),
    (0, auth_decorator_1.Auth)(),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [note_model_1.NoteModel, id_dto_1.MongoIdDto]),
    __metadata("design:returntype", Promise)
], NoteController.prototype, "modify", null);
__decorate([
    (0, common_1.Patch)('/:id'),
    (0, auth_decorator_1.Auth)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [note_model_1.PartialNoteModel, id_dto_1.MongoIdDto]),
    __metadata("design:returntype", Promise)
], NoteController.prototype, "patch", null);
__decorate([
    (0, common_1.Get)('like/:id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, ip_decorator_1.IpLocation)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.IntIdOrMongoIdDto, Object]),
    __metadata("design:returntype", Promise)
], NoteController.prototype, "likeNote", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, auth_decorator_1.Auth)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.MongoIdDto]),
    __metadata("design:returntype", Promise)
], NoteController.prototype, "deleteNote", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '根据 nid 查找' }),
    (0, common_1.Get)('/nid/:nid'),
    (0, update_count_decorator_1.VisitDocument)('Note'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, role_decorator_1.IsMaster)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Query)('single')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [note_dto_1.NidType, Boolean, note_dto_1.QAQueryDto, Boolean]),
    __metadata("design:returntype", Promise)
], NoteController.prototype, "getNoteByNid", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '根据 nid 修改' }),
    (0, common_1.Put)('/nid/:nid'),
    (0, auth_decorator_1.Auth)(),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [note_dto_1.NidType, note_model_1.NoteModel]),
    __metadata("design:returntype", Promise)
], NoteController.prototype, "modifyNoteByNid", null);
__decorate([
    (0, common_1.Get)('/topics/:id'),
    http_decorator_1.HTTPDecorators.Paginator,
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, role_decorator_1.IsMaster)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.MongoIdDto,
        pager_dto_1.PagerDto, Boolean]),
    __metadata("design:returntype", Promise)
], NoteController.prototype, "getNotesByTopic", null);
NoteController = __decorate([
    openapi_decorator_1.ApiName,
    (0, common_1.Controller)({ path: 'notes' }),
    __metadata("design:paramtypes", [note_service_1.NoteService,
        helper_counting_service_1.CountingService,
        helper_macro_service_1.TextMacroService])
], NoteController);
exports.NoteController = NoteController;
