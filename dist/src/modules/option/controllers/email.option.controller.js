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
exports.EmailOptionController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const helper_email_service_1 = require("../../../processors/helper/helper.email.service");
const email_dto_1 = require("../dtos/email.dto");
const option_decorator_1 = require("../option.decorator");
let EmailOptionController = class EmailOptionController {
    constructor(emailService) {
        this.emailService = emailService;
    }
    async getEmailReplyTemplate({ type }) {
        const template = await this.emailService.readTemplate(type === 'guest' ? helper_email_service_1.ReplyMailType.Guest : helper_email_service_1.ReplyMailType.Owner);
        return {
            template,
            props: {
                author: '评论人Kemmer',
                link: 'https://example.com',
                mail: 'example@example.com',
                text: '这是一段回复评论',
                title: '文章的标题',
                time: '2020/01/01',
                master: '你的名字',
                ip: '0.0.0.0',
            },
        };
    }
    async writeEmailReplyTemplate({ type }, body) {
        await this.emailService.writeTemplate(type === 'guest' ? helper_email_service_1.ReplyMailType.Guest : helper_email_service_1.ReplyMailType.Owner, body.source);
        return {
            source: body.source,
        };
    }
    async deleteEmailReplyTemplate({ type }) {
        await this.emailService.deleteTemplate(type);
        return;
    }
};
__decorate([
    (0, common_1.Get)('/template/reply'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [email_dto_1.ReplyEmailTypeDto]),
    __metadata("design:returntype", Promise)
], EmailOptionController.prototype, "getEmailReplyTemplate", null);
__decorate([
    (0, common_1.Put)('/template/reply'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [email_dto_1.ReplyEmailTypeDto,
        email_dto_1.ReplyEmailBodyDto]),
    __metadata("design:returntype", Promise)
], EmailOptionController.prototype, "writeEmailReplyTemplate", null);
__decorate([
    (0, common_1.Delete)('/template/reply'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [email_dto_1.ReplyEmailTypeDto]),
    __metadata("design:returntype", Promise)
], EmailOptionController.prototype, "deleteEmailReplyTemplate", null);
EmailOptionController = __decorate([
    (0, option_decorator_1.OptionController)('Email', 'email'),
    __metadata("design:paramtypes", [helper_email_service_1.EmailService])
], EmailOptionController);
exports.EmailOptionController = EmailOptionController;
