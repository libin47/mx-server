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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = exports.LinkApplyEmailType = exports.ReplyMailType = void 0;
const cluster_1 = __importDefault(require("cluster"));
const ejs_1 = require("ejs");
const nodemailer_1 = require("nodemailer");
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const event_bus_constant_1 = require("../../constants/event-bus.constant");
const configs_service_1 = require("../../modules/configs/configs.service");
const cache_service_1 = require("../cache/cache.service");
const helper_asset_service_1 = require("./helper.asset.service");
var ReplyMailType;
(function (ReplyMailType) {
    ReplyMailType["Owner"] = "owner";
    ReplyMailType["Guest"] = "guest";
})(ReplyMailType = exports.ReplyMailType || (exports.ReplyMailType = {}));
var LinkApplyEmailType;
(function (LinkApplyEmailType) {
    LinkApplyEmailType[LinkApplyEmailType["ToMaster"] = 0] = "ToMaster";
    LinkApplyEmailType[LinkApplyEmailType["ToCandidate"] = 1] = "ToCandidate";
})(LinkApplyEmailType = exports.LinkApplyEmailType || (exports.LinkApplyEmailType = {}));
let EmailService = EmailService_1 = class EmailService {
    constructor(configsService, assetService, cacheService) {
        this.configsService = configsService;
        this.assetService = assetService;
        this.cacheService = cacheService;
        this.init();
        this.logger = new common_1.Logger(EmailService_1.name);
        if (cluster_1.default.isWorker) {
            cacheService.subscribe(event_bus_constant_1.EventBusEvents.EmailInit, () => {
                this.init();
            });
        }
    }
    async readTemplate(type) {
        switch (type) {
            case ReplyMailType.Guest:
                return this.assetService.getAsset('/email-template/guest.template.ejs', { encoding: 'utf-8' });
            case ReplyMailType.Owner:
                return this.assetService.getAsset('/email-template/owner.template.ejs', { encoding: 'utf-8' });
        }
    }
    async writeTemplate(type, source) {
        switch (type) {
            case ReplyMailType.Guest:
                return this.assetService.writeUserCustomAsset('/email-template/guest.template.ejs', source, { encoding: 'utf-8' });
            case ReplyMailType.Owner:
                return this.assetService.writeUserCustomAsset('/email-template/owner.template.ejs', source, { encoding: 'utf-8' });
        }
    }
    async deleteTemplate(type) {
        switch (type) {
            case ReplyMailType.Guest:
                await this.assetService.removeUserCustomAsset('/email-template/guest.template.ejs');
                break;
            case ReplyMailType.Owner:
                await this.assetService.removeUserCustomAsset('/email-template/owner.template.ejs');
                break;
        }
    }
    init() {
        this.getConfigFromConfigService()
            .then((config) => {
            this.instance = (0, nodemailer_1.createTransport)({
                ...config,
                secure: true,
                tls: {
                    rejectUnauthorized: false,
                },
            });
            this.checkIsReady().then((ready) => {
                if (ready) {
                    this.logger.log('送信服务已经加载完毕！');
                }
            });
        })
            .catch(() => { });
    }
    getConfigFromConfigService() {
        return new Promise((r, j) => {
            this.configsService.waitForConfigReady().then(({ mailOptions }) => {
                const { options, user, pass } = mailOptions;
                if (!user && !pass) {
                    const message = '邮件件客户端未认证';
                    this.logger.error(message);
                    return j(message);
                }
                r({
                    host: options === null || options === void 0 ? void 0 : options.host,
                    port: parseInt((options === null || options === void 0 ? void 0 : options.port) || '465'),
                    auth: { user, pass },
                });
            });
        });
    }
    async checkIsReady() {
        return !!this.instance && (await this.verifyClient());
    }
    verifyClient() {
        return new Promise((r, j) => {
            this.instance.verify((error) => {
                if (error) {
                    this.logger.error('邮件客户端初始化连接失败！');
                    r(false);
                }
                else {
                    r(true);
                }
            });
        });
    }
    async sendCommentNotificationMail({ to, source, type, }) {
        const { seo, mailOptions } = await this.configsService.waitForConfigReady();
        const { user } = mailOptions;
        const from = `"${seo.title || 'Mx Space'}" <${user}>`;
        if (type === ReplyMailType.Guest) {
            const options = {
                from,
                ...{
                    subject: `[${seo.title || 'Mx Space'}] 主人给你了新的回复呐`,
                    to,
                    html: this.render((await this.readTemplate(type)), source),
                },
            };
            if (isDev) {
                delete options.html;
                Object.assign(options, { source });
                this.logger.log(options);
                return;
            }
            await this.instance.sendMail(options);
        }
        else {
            const options = {
                from,
                ...{
                    subject: `[${seo.title || 'Mx Space'}] 有新回复了耶~`,
                    to,
                    html: this.render((await this.readTemplate(type)), source),
                },
            };
            if (isDev) {
                delete options.html;
                Object.assign(options, { source });
                this.logger.log(options);
                return;
            }
            await this.instance.sendMail(options);
        }
    }
    render(template, source) {
        return (0, ejs_1.render)(template, {
            text: source.text,
            time: source.time,
            author: source.author,
            link: source.link,
            ip: source.ip || '',
            title: source.title,
            master: source.master,
            mail: source.mail,
        });
    }
    getInstance() {
        return this.instance;
    }
};
__decorate([
    (0, event_emitter_1.OnEvent)(event_bus_constant_1.EventBusEvents.EmailInit),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EmailService.prototype, "init", null);
EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [configs_service_1.ConfigsService,
        helper_asset_service_1.AssetService,
        cache_service_1.CacheService])
], EmailService);
exports.EmailService = EmailService;
