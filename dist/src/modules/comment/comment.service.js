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
var CommentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentService = void 0;
const mongoose_1 = require("mongoose");
const url_1 = require("url");
const common_1 = require("@nestjs/common");
const cant_find_exception_1 = require("../../common/exceptions/cant-find.exception");
const master_lost_exception_1 = require("../../common/exceptions/master-lost.exception");
const database_service_1 = require("../../processors/database/database.service");
const helper_email_service_1 = require("../../processors/helper/helper.email.service");
const model_transformer_1 = require("../../transformers/model.transformer");
const utils_1 = require("../../utils");
const configs_service_1 = require("../configs/configs.service");
const tool_service_1 = require("../tool/tool.service");
const user_service_1 = require("../user/user.service");
const block_keywords_json_1 = __importDefault(require("./block-keywords.json"));
const comment_model_1 = require("./comment.model");
let CommentService = CommentService_1 = class CommentService {
    constructor(commentModel, databaseService, configs, userService, mailService, toolService, configsService) {
        this.commentModel = commentModel;
        this.databaseService = databaseService;
        this.configs = configs;
        this.userService = userService;
        this.mailService = mailService;
        this.toolService = toolService;
        this.configsService = configsService;
        this.logger = new common_1.Logger(CommentService_1.name);
    }
    get model() {
        return this.commentModel;
    }
    getModelByRefType(type) {
        switch (type) {
            case comment_model_1.CommentRefTypes.Note:
                return this.databaseService.getModelByRefType('Note');
            case comment_model_1.CommentRefTypes.Page:
                return this.databaseService.getModelByRefType('Page');
            case comment_model_1.CommentRefTypes.Post:
                return this.databaseService.getModelByRefType('Post');
        }
    }
    async checkSpam(doc) {
        const res = await (async () => {
            const commentOptions = await this.configs.get('commentOptions');
            if (!commentOptions.antiSpam) {
                return false;
            }
            const master = await this.userService.getMaster();
            if (doc.author === master.username) {
                return false;
            }
            if (commentOptions.blockIps) {
                if (!doc.ip) {
                    return false;
                }
                const isBlock = commentOptions.blockIps.some((ip) => new RegExp(ip, 'ig').test(doc.ip));
                if (isBlock) {
                    return true;
                }
            }
            const customKeywords = commentOptions.spamKeywords || [];
            const isBlock = [...customKeywords, ...block_keywords_json_1.default].some((keyword) => new RegExp(keyword, 'ig').test(doc.text));
            if (isBlock) {
                return true;
            }
            if (commentOptions.disableNoChinese && !(0, utils_1.hasChinese)(doc.text)) {
                return true;
            }
            return false;
        })();
        if (res) {
            this.logger.warn('--> 检测到一条垃圾评论: ' +
                `作者: ${doc.author}, IP: ${doc.ip}, 内容为: ${doc.text}`);
        }
        return res;
    }
    async createComment(id, doc, type) {
        let ref;
        if (type) {
            const model = this.getModelByRefType(type);
            ref = await model.findById(id).lean();
        }
        else {
            const { type: type_, document } = await this.databaseService.findGlobalById(id);
            ref = document;
            type = type_;
        }
        if (!ref) {
            throw new cant_find_exception_1.CannotFindException();
        }
        const commentIndex = ref.commentsIndex || 0;
        doc.key = `#${commentIndex + 1}`;
        console.log(doc);
        const comment = await this.commentModel.create({
            ...doc,
            ref: new mongoose_1.Types.ObjectId(id),
            refType: type,
        });
        await this.databaseService.getModelByRefType(type).updateOne({ _id: ref._id }, {
            $inc: {
                commentsIndex: 1,
            },
        });
        return comment;
    }
    async ValidAuthorName(author) {
        const isExist = await this.userService.model.findOne({
            name: author,
        });
        if (isExist) {
            throw new common_1.BadRequestException('用户名与主人重名啦, 但是你好像并不是我的主人唉');
        }
    }
    async deleteComments(id) {
        const comment = await this.commentModel.findOneAndDelete({ _id: id });
        if (!comment) {
            throw new cant_find_exception_1.CannotFindException();
        }
        const { children, parent } = comment;
        if (children && children.length > 0) {
            await Promise.all(children.map(async (id) => {
                await this.deleteComments(id);
            }));
        }
        if (parent) {
            const parent = await this.commentModel.findById(comment.parent);
            if (parent) {
                await parent.updateOne({
                    $pull: {
                        children: comment._id,
                    },
                });
            }
        }
    }
    async allowComment(id, type) {
        var _a, _b;
        if (type) {
            const model = this.getModelByRefType(type);
            const doc = await model.findById(id);
            if (!doc) {
                throw new cant_find_exception_1.CannotFindException();
            }
            return (_a = doc.allowComment) !== null && _a !== void 0 ? _a : true;
        }
        else {
            const { document: doc } = await this.databaseService.findGlobalById(id);
            if (!doc) {
                throw new cant_find_exception_1.CannotFindException();
            }
            return (_b = doc.allowComment) !== null && _b !== void 0 ? _b : true;
        }
    }
    async getComments({ page, size, state } = { page: 1, size: 10, state: 0 }) {
        const queryList = await this.commentModel.paginate({ state }, {
            select: '+ip +agent -children',
            page,
            limit: size,
            populate: [
                { path: 'parent', select: '-children' },
                {
                    path: 'ref',
                    select: 'title _id slug nid categoryId',
                },
            ],
            sort: { created: -1 },
        });
        return queryList;
    }
    async sendEmail(model, type) {
        const enable = (await this.configs.get('mailOptions')).enable;
        if (!enable) {
            return;
        }
        this.userService.model.findOne().then(async (master) => {
            if (!master) {
                throw new master_lost_exception_1.MasterLostException();
            }
            const refType = model.refType;
            const refModel = this.getModelByRefType(refType);
            const refDoc = await refModel.findById(model.ref).lean();
            const time = new Date(model.created);
            const parent = await this.commentModel
                .findOne({ _id: model.parent })
                .lean();
            const parsedTime = `${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()}`;
            if (!refDoc || !master.mail) {
                return;
            }
            this.mailService.sendCommentNotificationMail({
                to: type === helper_email_service_1.ReplyMailType.Owner ? master.mail : parent.mail,
                type,
                source: {
                    title: refDoc.title,
                    text: model.text,
                    author: type === helper_email_service_1.ReplyMailType.Guest ? parent.author : model.author,
                    master: master.name,
                    link: await this.resolveUrlByType(refType, refDoc),
                    time: parsedTime,
                    mail: helper_email_service_1.ReplyMailType.Owner === type ? model.mail : master.mail,
                    ip: model.ip || '',
                },
            });
        });
    }
    async resolveUrlByType(type, model) {
        const { url: { webUrl: base }, } = await this.configs.waitForConfigReady();
        switch (type) {
            case comment_model_1.CommentRefTypes.Note: {
                return new url_1.URL(`/notes/${model.nid}`, base).toString();
            }
            case comment_model_1.CommentRefTypes.Page: {
                return new url_1.URL(`/${model.slug}`, base).toString();
            }
            case comment_model_1.CommentRefTypes.Post: {
                return new url_1.URL(`/${model.category.slug}/${model.slug}`, base).toString();
            }
        }
    }
    async attachIpLocation(model, ip) {
        if (!ip) {
            return model;
        }
        const { recordIpLocation, fetchLocationTimeout = 3000 } = await this.configsService.get('commentOptions');
        if (!recordIpLocation) {
            return model;
        }
        const newModel = { ...model };
        newModel.location = await this.toolService
            .getIp(ip, fetchLocationTimeout)
            .then((res) => `${res.regionName && res.regionName !== res.cityName
            ? `${res.regionName}`
            : ''}${res.cityName ? `${res.cityName}` : ''}` || undefined)
            .catch(() => undefined);
        return newModel;
    }
};
CommentService = CommentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, model_transformer_1.InjectModel)(comment_model_1.CommentModel)),
    __metadata("design:paramtypes", [Object, database_service_1.DatabaseService,
        configs_service_1.ConfigsService,
        user_service_1.UserService,
        helper_email_service_1.EmailService,
        tool_service_1.ToolService,
        configs_service_1.ConfigsService])
], CommentService);
exports.CommentService = CommentService;
