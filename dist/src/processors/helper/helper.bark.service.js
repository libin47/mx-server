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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BarkPushService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const business_event_constant_1 = require("../../constants/business-event.constant");
const comment_model_1 = require("../../modules/comment/comment.model");
const configs_service_1 = require("../../modules/configs/configs.service");
const helper_http_service_1 = require("./helper.http.service");
let BarkPushService = class BarkPushService {
    constructor(httpService, config) {
        this.httpService = httpService;
        this.config = config;
    }
    async pushCommentEvent(comment) {
        const { enable } = await this.config.get('barkOptions');
        if (!enable) {
            return;
        }
        const master = await this.config.getMaster();
        if (comment.author == master.name && comment.author == master.username) {
            return;
        }
        const { adminUrl } = await this.config.get('url');
        await this.push({
            title: '收到一条新评论',
            body: `${comment.author} 评论了你的文章: ${comment.text}`,
            icon: comment.avatar,
            url: `${adminUrl}#/comments`,
        });
    }
    async push(options) {
        const { key, serverUrl = 'https://day.app' } = await this.config.get('barkOptions');
        const { title: siteTitle } = await this.config.get('seo');
        if (!key) {
            throw new Error('Bark key is not configured');
        }
        const { title, ...rest } = options;
        const response = await this.httpService.axiosRef.post(`${serverUrl}/push`, {
            device_key: key,
            title: `[${siteTitle}] ${title}`,
            category: siteTitle,
            group: siteTitle,
            ...rest,
        });
        return response.data;
    }
};
__decorate([
    (0, event_emitter_1.OnEvent)(business_event_constant_1.BusinessEvents.COMMENT_CREATE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [comment_model_1.CommentModel]),
    __metadata("design:returntype", Promise)
], BarkPushService.prototype, "pushCommentEvent", null);
BarkPushService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [helper_http_service_1.HttpService,
        configs_service_1.ConfigsService])
], BarkPushService);
exports.BarkPushService = BarkPushService;
