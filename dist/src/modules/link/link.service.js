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
var LinkService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkService = void 0;
const common_1 = require("@nestjs/common");
const business_event_constant_1 = require("../../constants/business-event.constant");
const env_global_1 = require("../../global/env.global");
const helper_email_service_1 = require("../../processors/helper/helper.email.service");
const helper_event_service_1 = require("../../processors/helper/helper.event.service");
const helper_http_service_1 = require("../../processors/helper/helper.http.service");
const model_transformer_1 = require("../../transformers/model.transformer");
const configs_service_1 = require("../configs/configs.service");
const link_model_1 = require("./link.model");
let LinkService = LinkService_1 = class LinkService {
    constructor(linkModel, emailService, configs, eventManager, http, configsService) {
        this.linkModel = linkModel;
        this.emailService = emailService;
        this.configs = configs;
        this.eventManager = eventManager;
        this.http = http;
        this.configsService = configsService;
    }
    get model() {
        return this.linkModel;
    }
    async applyForLink(model) {
        try {
            const doc = await this.model.create({
                ...model,
                type: link_model_1.LinkType.Friend,
                state: link_model_1.LinkState.Audit,
            });
            process.nextTick(() => {
                this.eventManager.broadcast(business_event_constant_1.BusinessEvents.LINK_APPLY, doc, {
                    scope: business_event_constant_1.EventScope.TO_SYSTEM_ADMIN,
                });
            });
        }
        catch (err) {
            throw new common_1.BadRequestException('请不要重复申请友链哦');
        }
    }
    async approveLink(id) {
        const doc = await this.model
            .findOneAndUpdate({ _id: id }, {
            $set: { state: link_model_1.LinkState.Pass },
        })
            .lean();
        if (!doc) {
            throw new common_1.NotFoundException();
        }
        return doc;
    }
    async getCount() {
        const [audit, friends, collection, outdate, banned] = await Promise.all([
            this.model.countDocuments({ state: link_model_1.LinkState.Audit }),
            this.model.countDocuments({
                type: link_model_1.LinkType.Friend,
                state: link_model_1.LinkState.Pass,
            }),
            this.model.countDocuments({
                type: link_model_1.LinkType.Collection,
            }),
            this.model.countDocuments({
                state: link_model_1.LinkState.Outdate,
            }),
            this.model.countDocuments({
                state: link_model_1.LinkState.Banned,
            }),
        ]);
        return {
            audit,
            friends,
            collection,
            outdate,
            banned,
        };
    }
    async sendToCandidate(model) {
        if (!model.email) {
            return;
        }
        const enable = (await this.configs.get('mailOptions')).enable;
        if (!enable || env_global_1.isDev) {
            console.log(`
      To: ${model.email}
      你的友链已通过
        站点标题: ${model.name}
        站点网站: ${model.url}
        站点描述: ${model.description}`);
            return;
        }
        await this.sendLinkApplyEmail({
            model,
            to: model.email,
            template: helper_email_service_1.LinkApplyEmailType.ToCandidate,
        });
    }
    async sendToMaster(authorName, model) {
        const enable = (await this.configs.get('mailOptions')).enable;
        if (!enable || env_global_1.isDev) {
            console.log(`来自 ${authorName} 的友链请求:
        站点标题: ${model.name}
        站点网站: ${model.url}
        站点描述: ${model.description}`);
            return;
        }
        process.nextTick(async () => {
            const master = await this.configs.getMaster();
            await this.sendLinkApplyEmail({
                authorName,
                model,
                to: master.mail,
                template: helper_email_service_1.LinkApplyEmailType.ToMaster,
            });
        });
    }
    async sendLinkApplyEmail({ to, model, authorName, template, }) {
        const { seo, mailOptions } = await this.configsService.waitForConfigReady();
        const { user } = mailOptions;
        const from = `"${seo.title || 'Mx Space'}" <${user}>`;
        await this.emailService.getInstance().sendMail({
            from,
            to,
            subject: template === helper_email_service_1.LinkApplyEmailType.ToMaster
                ? `[${seo.title || 'Mx Space'}] 新的朋友 ${authorName}`
                : `嘿!~, 主人已通过你的友链申请!~`,
            text: template === helper_email_service_1.LinkApplyEmailType.ToMaster
                ? `来自 ${model.name} 的友链请求:
          站点标题: ${model.name}
          站点网站: ${model.url}
          站点描述: ${model.description}
        `
                : `你的友链申请: ${model.name}, ${model.url} 已通过`,
        });
    }
    async checkLinkHealth() {
        const links = await this.model.find({ state: link_model_1.LinkState.Pass });
        const health = await Promise.all(links.map(({ id, url }) => {
            common_1.Logger.debug(`检查友链 ${id} 的健康状态: GET -> ${url}`, LinkService_1.name);
            return this.http.axiosRef
                .get(url, {
                timeout: 5000,
                'axios-retry': {
                    retries: 1,
                    shouldResetTimeout: true,
                },
            })
                .then((res) => {
                return {
                    status: res.status,
                    id,
                };
            })
                .catch((err) => {
                var _a;
                return {
                    id,
                    status: ((_a = err.response) === null || _a === void 0 ? void 0 : _a.status) || 'ERROR',
                    message: err.message,
                };
            });
        })).then((arr) => arr.reduce((acc, cur) => {
            acc[cur.id] = cur;
            return acc;
        }, {}));
        return health;
    }
    async canApplyLink() {
        const configs = await this.configs.get('friendLinkOptions');
        const can = configs.allowApply;
        return can;
    }
};
LinkService = LinkService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, model_transformer_1.InjectModel)(link_model_1.LinkModel)),
    __metadata("design:paramtypes", [Object, helper_email_service_1.EmailService,
        configs_service_1.ConfigsService,
        helper_event_service_1.EventManagerService,
        helper_http_service_1.HttpService,
        configs_service_1.ConfigsService])
], LinkService);
exports.LinkService = LinkService;
