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
exports.IConfig = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const class_validator_jsonschema_1 = require("class-validator-jsonschema");
const configs_dto_1 = require("./configs.dto");
let IConfig = class IConfig {
};
__decorate([
    (0, class_transformer_1.Type)(() => configs_dto_1.UrlDto),
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", Object)
], IConfig.prototype, "url", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => configs_dto_1.SeoDto),
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", Object)
], IConfig.prototype, "seo", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => configs_dto_1.AdminExtraDto),
    __metadata("design:type", Object)
], IConfig.prototype, "adminExtra", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => configs_dto_1.TextOptionsDto),
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", Object)
], IConfig.prototype, "textOptions", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => configs_dto_1.MailOptionsDto),
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", Object)
], IConfig.prototype, "mailOptions", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => configs_dto_1.CommentOptionsDto),
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", Object)
], IConfig.prototype, "commentOptions", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => configs_dto_1.BarkOptionsDto),
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", Object)
], IConfig.prototype, "barkOptions", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => configs_dto_1.FriendLinkOptionsDto),
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", Object)
], IConfig.prototype, "friendLinkOptions", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => configs_dto_1.BackupOptionsDto),
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", Object)
], IConfig.prototype, "backupOptions", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => configs_dto_1.BaiduSearchOptionsDto),
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", Object)
], IConfig.prototype, "baiduSearchOptions", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => configs_dto_1.AlgoliaSearchOptionsDto),
    __metadata("design:type", Object)
], IConfig.prototype, "algoliaSearchOptions", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => configs_dto_1.TerminalOptionsDto),
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", Object)
], IConfig.prototype, "terminalOptions", void 0);
IConfig = __decorate([
    (0, class_validator_jsonschema_1.JSONSchema)({
        title: '设置',
        ps: ['* 敏感字段不显示，后端默认不返回敏感字段，显示为空'],
    })
], IConfig);
exports.IConfig = IConfig;
