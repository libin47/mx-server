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
exports.CommentController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_decorator_1 = require("../../common/decorator/auth.decorator");
const current_user_decorator_1 = require("../../common/decorator/current-user.decorator");
const http_decorator_1 = require("../../common/decorator/http.decorator");
const ip_decorator_1 = require("../../common/decorator/ip.decorator");
const openapi_decorator_1 = require("../../common/decorator/openapi.decorator");
const role_decorator_1 = require("../../common/decorator/role.decorator");
const cant_find_exception_1 = require("../../common/exceptions/cant-find.exception");
const business_event_constant_1 = require("../../constants/business-event.constant");
const helper_email_service_1 = require("../../processors/helper/helper.email.service");
const helper_event_service_1 = require("../../processors/helper/helper.event.service");
const id_dto_1 = require("../../shared/dto/id.dto");
const pager_dto_1 = require("../../shared/dto/pager.dto");
const paginate_transformer_1 = require("../../transformers/paginate.transformer");
const user_model_1 = require("../user/user.model");
const comment_dto_1 = require("./comment.dto");
const comment_interceptor_1 = require("./comment.interceptor");
const comment_model_1 = require("./comment.model");
const comment_service_1 = require("./comment.service");
const idempotenceMessage = '哦吼，这句话你已经说过啦';
let CommentController = class CommentController {
    constructor(commentService, eventManager) {
        this.commentService = commentService;
        this.eventManager = eventManager;
    }
    async getRecentlyComments(query) {
        const { size = 10, page = 1, state = 0 } = query;
        return (0, paginate_transformer_1.transformDataToPaginate)(await this.commentService.getComments({ size, page, state }));
    }
    async getComments(params) {
        const { id } = params;
        const data = await this.commentService.model
            .findOne({
            _id: id,
        })
            .populate('parent');
        if (!data) {
            throw new cant_find_exception_1.CannotFindException();
        }
        return data;
    }
    async getCommentsByRefId(params, query) {
        const { id } = params;
        const { page = 1, size = 10 } = query;
        const comments = await this.commentService.model.paginate({
            parent: undefined,
            ref: id,
            $or: [
                {
                    state: comment_model_1.CommentState.Read,
                },
                { state: comment_model_1.CommentState.Unread },
            ],
        }, {
            limit: size,
            page,
            sort: { created: -1 },
        });
        return (0, paginate_transformer_1.transformDataToPaginate)(comments);
    }
    async comment(params, body, isMaster, ipLocation, query) {
        if (!isMaster) {
            await this.commentService.ValidAuthorName(body.author);
        }
        const { ref } = query;
        const id = params.id;
        if (!(await this.commentService.allowComment(id, ref)) && !isMaster) {
            throw new common_1.ForbiddenException('主人禁止了评论');
        }
        const model = await this.commentService.attachIpLocation({ ...body, ...ipLocation }, isMaster ? '' : ipLocation.ip);
        const comment = await this.commentService.createComment(id, model, ref);
        process.nextTick(async () => {
            if (await this.commentService.checkSpam(comment)) {
                comment.state = comment_model_1.CommentState.Junk;
                await comment.save();
                return;
            }
            else if (!isMaster) {
                this.commentService.sendEmail(comment, helper_email_service_1.ReplyMailType.Owner);
            }
            await this.eventManager.broadcast(business_event_constant_1.BusinessEvents.COMMENT_CREATE, comment, {
                scope: isMaster ? business_event_constant_1.EventScope.TO_SYSTEM_VISITOR : business_event_constant_1.EventScope.ALL,
            });
        });
        return comment;
    }
    async replyByCid(params, body, author, isMaster, ipLocation) {
        if (!isMaster) {
            await this.commentService.ValidAuthorName(author);
        }
        const { id } = params;
        const parent = await this.commentService.model.findById(id).populate('ref');
        if (!parent) {
            throw new cant_find_exception_1.CannotFindException();
        }
        const commentIndex = parent.commentsIndex;
        const key = `${parent.key}#${commentIndex}`;
        const model = await this.commentService.attachIpLocation({
            parent,
            ref: parent.ref._id,
            refType: parent.refType,
            ...body,
            ...ipLocation,
            key,
        }, isMaster ? '' : ipLocation.ip);
        const comment = await this.commentService.model.create(model);
        await parent.updateOne({
            $push: {
                children: comment._id,
            },
            $inc: {
                commentsIndex: 1,
            },
            state: comment.state === comment_model_1.CommentState.Read &&
                parent.state !== comment_model_1.CommentState.Read
                ? comment_model_1.CommentState.Read
                : parent.state,
        });
        if (isMaster) {
            this.commentService.sendEmail(comment, helper_email_service_1.ReplyMailType.Guest);
            this.eventManager.broadcast(business_event_constant_1.BusinessEvents.COMMENT_CREATE, comment, {
                scope: business_event_constant_1.EventScope.TO_SYSTEM_VISITOR,
            });
        }
        else {
            this.commentService.sendEmail(comment, helper_email_service_1.ReplyMailType.Owner);
            this.eventManager.broadcast(business_event_constant_1.BusinessEvents.COMMENT_CREATE, comment, {
                scope: business_event_constant_1.EventScope.ALL,
            });
        }
        return comment;
    }
    async commentByMaster(user, params, body, ipLocation, query) {
        const { name, mail, url, avatar } = user;
        const avatars = avatar;
        const model = {
            author: name,
            ...body,
            mail,
            url,
            avatars,
            state: comment_model_1.CommentState.Read,
        };
        return await this.comment(params, model, true, ipLocation, query);
    }
    async replyByMaster(req, params, body, ipLocation) {
        const { name, mail, url } = req.user;
        const model = {
            author: name,
            ...body,
            mail,
            url,
            state: comment_model_1.CommentState.Read,
        };
        return await this.replyByCid(params, model, undefined, true, ipLocation);
    }
    async modifyCommentState(params, body) {
        const { id } = params;
        const { state } = body;
        try {
            await this.commentService.model.updateOne({
                _id: id,
            }, { state });
            return;
        }
        catch {
            throw new cant_find_exception_1.CannotFindException();
        }
    }
    async deleteComment(params) {
        const { id } = params;
        await this.commentService.deleteComments(id);
        await this.eventManager.broadcast(business_event_constant_1.BusinessEvents.COMMENT_DELETE, id, {
            scope: business_event_constant_1.EventScope.TO_SYSTEM_VISITOR,
            nextTick: true,
        });
        return;
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
], CommentController.prototype, "getRecentlyComments", null);
__decorate([
    (0, common_1.Get)('/:id'),
    (0, swagger_1.ApiOperation)({ summary: '根据 comment id 获取评论, 包括子评论' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.MongoIdDto]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "getComments", null);
__decorate([
    (0, common_1.Get)('/ref/:id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'refId',
        example: '5e6f67e85b303781d28072a3',
    }),
    (0, swagger_1.ApiOperation)({ summary: '根据评论的 refId 获取评论, 如 Post Id' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.MongoIdDto,
        pager_dto_1.PagerDto]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "getCommentsByRefId", null);
__decorate([
    (0, common_1.Post)('/:id'),
    (0, swagger_1.ApiOperation)({ summary: '根据文章的 _id 评论' }),
    http_decorator_1.HTTPDecorators.Idempotence({
        expired: 20,
        errorMessage: idempotenceMessage,
    }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, role_decorator_1.IsMaster)()),
    __param(3, (0, ip_decorator_1.IpLocation)()),
    __param(4, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.MongoIdDto,
        comment_dto_1.CommentDto, Boolean, Object, comment_dto_1.CommentRefTypesDto]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "comment", null);
__decorate([
    (0, common_1.Post)('/reply/:id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'cid',
        example: '5e7370bec56432cbac578e2d',
    }),
    http_decorator_1.HTTPDecorators.Idempotence({
        expired: 20,
        errorMessage: idempotenceMessage,
    }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Body)('author')),
    __param(3, (0, role_decorator_1.IsMaster)()),
    __param(4, (0, ip_decorator_1.IpLocation)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.MongoIdDto,
        comment_dto_1.CommentDto, String, Boolean, Object]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "replyByCid", null);
__decorate([
    (0, common_1.Post)('/master/comment/:id'),
    (0, swagger_1.ApiOperation)({ summary: '主人专用评论接口 需要登录' }),
    (0, auth_decorator_1.Auth)(),
    http_decorator_1.HTTPDecorators.Idempotence({
        expired: 20,
        errorMessage: idempotenceMessage,
    }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, ip_decorator_1.IpLocation)()),
    __param(4, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_model_1.UserModel,
        id_dto_1.MongoIdDto,
        comment_dto_1.TextOnlyDto, Object, comment_dto_1.CommentRefTypesDto]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "commentByMaster", null);
__decorate([
    (0, common_1.Post)('/master/reply/:id'),
    (0, swagger_1.ApiOperation)({ summary: '主人专用评论回复 需要登录' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'cid' }),
    (0, auth_decorator_1.Auth)(),
    http_decorator_1.HTTPDecorators.Idempotence({
        expired: 20,
        errorMessage: idempotenceMessage,
    }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, ip_decorator_1.IpLocation)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, id_dto_1.MongoIdDto,
        comment_dto_1.TextOnlyDto, Object]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "replyByMaster", null);
__decorate([
    (0, common_1.Patch)('/:id'),
    (0, swagger_1.ApiOperation)({ summary: '修改评论的状态' }),
    (0, common_1.HttpCode)(204),
    (0, auth_decorator_1.Auth)(),
    openapi.ApiResponse({ status: 204 }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.MongoIdDto,
        comment_dto_1.StateDto]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "modifyCommentState", null);
__decorate([
    (0, common_1.Delete)('/:id'),
    (0, auth_decorator_1.Auth)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.MongoIdDto]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "deleteComment", null);
CommentController = __decorate([
    (0, common_1.Controller)({ path: 'comments' }),
    (0, common_1.UseInterceptors)(comment_interceptor_1.CommentFilterEmailInterceptor),
    openapi_decorator_1.ApiName,
    __metadata("design:paramtypes", [comment_service_1.CommentService,
        helper_event_service_1.EventManagerService])
], CommentController);
exports.CommentController = CommentController;
