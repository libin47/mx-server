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
exports.BarkOptionsDto = exports.TextOptionsDto = exports.FriendLinkOptionsDto = exports.TerminalOptionsDto = exports.AdminExtraDto = exports.AlgoliaSearchOptionsDto = exports.BaiduSearchOptionsDto = exports.BackupOptionsDto = exports.CommentOptionsDto = exports.MailOptionsDto = exports.UrlDto = exports.SeoDto = void 0;
const openapi = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const class_validator_jsonschema_1 = require("class-validator-jsonschema");
const swagger_1 = require("@nestjs/swagger");
const isAllowedUrl_1 = require("../../utils/validator/isAllowedUrl");
const configs_jsonschema_decorator_1 = require("./configs.jsonschema.decorator");
let SeoDto = class SeoDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: true, type: () => String }, description: { required: true, type: () => String }, keywords: { required: false, type: () => [String] } };
    }
};
__decorate([
    (0, class_validator_1.IsString)({ message: '标题必须是字符串' }),
    (0, class_validator_1.IsNotEmpty)({ message: '不能为空!!' }),
    (0, class_validator_1.IsOptional)(),
    (0, configs_jsonschema_decorator_1.JSONSchemaPlainField)('网站标题'),
    __metadata("design:type", String)
], SeoDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: '描述信息必须是字符串' }),
    (0, class_validator_1.IsNotEmpty)({ message: '不能为空!!' }),
    (0, class_validator_1.IsOptional)(),
    (0, configs_jsonschema_decorator_1.JSONSchemaPlainField)('网站描述'),
    __metadata("design:type", String)
], SeoDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: '关键字必须为一个数组', each: true }),
    (0, class_validator_1.IsOptional)(),
    (0, configs_jsonschema_decorator_1.JSONSchemaArrayField)('关键字'),
    __metadata("design:type", Array)
], SeoDto.prototype, "keywords", void 0);
SeoDto = __decorate([
    (0, class_validator_jsonschema_1.JSONSchema)({ title: 'SEO 优化' })
], SeoDto);
exports.SeoDto = SeoDto;
let UrlDto = class UrlDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { webUrl: { required: true, type: () => String }, adminUrl: { required: true, type: () => String }, serverUrl: { required: true, type: () => String }, wsUrl: { required: true, type: () => String } };
    }
};
__decorate([
    (0, isAllowedUrl_1.IsAllowedUrl)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({ example: 'http://127.0.0.1:2323' }),
    (0, configs_jsonschema_decorator_1.JSONSchemaHalfGirdPlainField)('前端地址'),
    __metadata("design:type", String)
], UrlDto.prototype, "webUrl", void 0);
__decorate([
    (0, isAllowedUrl_1.IsAllowedUrl)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({ example: 'http://127.0.0.1:9528' }),
    (0, configs_jsonschema_decorator_1.JSONSchemaHalfGirdPlainField)('管理后台地址'),
    __metadata("design:type", String)
], UrlDto.prototype, "adminUrl", void 0);
__decorate([
    (0, isAllowedUrl_1.IsAllowedUrl)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({ example: 'http://127.0.0.1:2333' }),
    (0, configs_jsonschema_decorator_1.JSONSchemaHalfGirdPlainField)('API 地址'),
    __metadata("design:type", String)
], UrlDto.prototype, "serverUrl", void 0);
__decorate([
    (0, isAllowedUrl_1.IsAllowedUrl)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({ example: 'http://127.0.0.1:8080' }),
    (0, configs_jsonschema_decorator_1.JSONSchemaHalfGirdPlainField)('Gateway 地址'),
    __metadata("design:type", String)
], UrlDto.prototype, "wsUrl", void 0);
UrlDto = __decorate([
    (0, class_validator_jsonschema_1.JSONSchema)({ title: '网站设置' })
], UrlDto);
exports.UrlDto = UrlDto;
class MailOption {
    static _OPENAPI_METADATA_FACTORY() {
        return { port: { required: true, type: () => Number }, host: { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_transformer_1.Transform)(({ value: val }) => parseInt(val)),
    (0, class_validator_1.IsOptional)(),
    (0, configs_jsonschema_decorator_1.JSONSchemaNumberField)('发件邮箱端口', configs_jsonschema_decorator_1.halfFieldOption),
    __metadata("design:type", Number)
], MailOption.prototype, "port", void 0);
__decorate([
    (0, class_validator_1.IsUrl)({ require_protocol: false }),
    (0, class_validator_1.IsOptional)(),
    (0, configs_jsonschema_decorator_1.JSONSchemaHalfGirdPlainField)('发件邮箱 host'),
    __metadata("design:type", String)
], MailOption.prototype, "host", void 0);
let MailOptionsDto = class MailOptionsDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { enable: { required: true, type: () => Boolean }, user: { required: true, type: () => String }, pass: { required: true, type: () => String }, options: { required: false, type: () => MailOption } };
    }
};
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, configs_jsonschema_decorator_1.JSONSchemaToggleField)('开启邮箱提醒'),
    __metadata("design:type", Boolean)
], MailOptionsDto.prototype, "enable", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    (0, configs_jsonschema_decorator_1.JSONSchemaHalfGirdPlainField)('发件邮箱地址'),
    __metadata("design:type", String)
], MailOptionsDto.prototype, "user", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    (0, configs_jsonschema_decorator_1.JSONSchemaPasswordField)('发件邮箱密码', configs_jsonschema_decorator_1.halfFieldOption),
    __metadata("design:type", String)
], MailOptionsDto.prototype, "pass", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => MailOption),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_jsonschema_1.JSONSchema)({ 'ui:option': { connect: true } }),
    __metadata("design:type", MailOption)
], MailOptionsDto.prototype, "options", void 0);
MailOptionsDto = __decorate([
    (0, class_validator_jsonschema_1.JSONSchema)({ title: '邮件通知设置' })
], MailOptionsDto);
exports.MailOptionsDto = MailOptionsDto;
let CommentOptionsDto = class CommentOptionsDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { antiSpam: { required: true, type: () => Boolean }, spamKeywords: { required: false, type: () => [String] }, blockIps: { required: false, type: () => [String] }, disableNoChinese: { required: false, type: () => Boolean }, recordIpLocation: { required: false, type: () => Boolean }, fetchLocationTimeout: { required: false, type: () => Number } };
    }
};
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, configs_jsonschema_decorator_1.JSONSchemaToggleField)('反垃圾评论'),
    __metadata("design:type", Boolean)
], CommentOptionsDto.prototype, "antiSpam", void 0);
__decorate([
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ArrayUnique)(),
    (0, configs_jsonschema_decorator_1.JSONSchemaArrayField)('自定义屏蔽关键词'),
    __metadata("design:type", Array)
], CommentOptionsDto.prototype, "spamKeywords", void 0);
__decorate([
    (0, class_validator_1.IsIP)(undefined, { each: true }),
    (0, class_validator_1.ArrayUnique)(),
    (0, class_validator_1.IsOptional)(),
    (0, configs_jsonschema_decorator_1.JSONSchemaArrayField)('自定义屏蔽 IP'),
    __metadata("design:type", Array)
], CommentOptionsDto.prototype, "blockIps", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, configs_jsonschema_decorator_1.JSONSchemaToggleField)('禁止非中文评论'),
    __metadata("design:type", Boolean)
], CommentOptionsDto.prototype, "disableNoChinese", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, configs_jsonschema_decorator_1.JSONSchemaToggleField)('评论公开归属地'),
    __metadata("design:type", Boolean)
], CommentOptionsDto.prototype, "recordIpLocation", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, configs_jsonschema_decorator_1.JSONSchemaNumberField)('超时时间', {
        description: '获取 IP 归属地的超时时间。单位: 毫秒。如获取超时则不记录',
    }),
    __metadata("design:type", Number)
], CommentOptionsDto.prototype, "fetchLocationTimeout", void 0);
CommentOptionsDto = __decorate([
    (0, class_validator_jsonschema_1.JSONSchema)({ title: '评论设置' })
], CommentOptionsDto);
exports.CommentOptionsDto = CommentOptionsDto;
let BackupOptionsDto = class BackupOptionsDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { enable: { required: true, type: () => Boolean }, secretId: { required: false, type: () => String }, secretKey: { required: false, type: () => String }, bucket: { required: false, type: () => String }, region: { required: true, type: () => String } };
    }
};
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, configs_jsonschema_decorator_1.JSONSchemaToggleField)('开启自动备份', {
        description: '填写以下 COS 信息, 将同时上传备份到 COS',
    }),
    __metadata("design:type", Boolean)
], BackupOptionsDto.prototype, "enable", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, configs_jsonschema_decorator_1.JSONSchemaHalfGirdPlainField)('SecretId'),
    __metadata("design:type", String)
], BackupOptionsDto.prototype, "secretId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    (0, configs_jsonschema_decorator_1.JSONSchemaPasswordField)('SecretKey', configs_jsonschema_decorator_1.halfFieldOption),
    __metadata("design:type", String)
], BackupOptionsDto.prototype, "secretKey", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, configs_jsonschema_decorator_1.JSONSchemaHalfGirdPlainField)('Bucket'),
    __metadata("design:type", String)
], BackupOptionsDto.prototype, "bucket", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, configs_jsonschema_decorator_1.JSONSchemaHalfGirdPlainField)('地域 Region'),
    __metadata("design:type", String)
], BackupOptionsDto.prototype, "region", void 0);
BackupOptionsDto = __decorate([
    (0, class_validator_jsonschema_1.JSONSchema)({ title: '备份' })
], BackupOptionsDto);
exports.BackupOptionsDto = BackupOptionsDto;
let BaiduSearchOptionsDto = class BaiduSearchOptionsDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { enable: { required: true, type: () => Boolean }, token: { required: false, type: () => String } };
    }
};
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, configs_jsonschema_decorator_1.JSONSchemaToggleField)('开启推送'),
    __metadata("design:type", Boolean)
], BaiduSearchOptionsDto.prototype, "enable", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    (0, configs_jsonschema_decorator_1.JSONSchemaPasswordField)('Token'),
    __metadata("design:type", String)
], BaiduSearchOptionsDto.prototype, "token", void 0);
BaiduSearchOptionsDto = __decorate([
    (0, class_validator_jsonschema_1.JSONSchema)({ title: '百度推送设定' })
], BaiduSearchOptionsDto);
exports.BaiduSearchOptionsDto = BaiduSearchOptionsDto;
let AlgoliaSearchOptionsDto = class AlgoliaSearchOptionsDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { enable: { required: true, type: () => Boolean }, apiKey: { required: false, type: () => String }, appId: { required: false, type: () => String }, indexName: { required: false, type: () => String } };
    }
};
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, configs_jsonschema_decorator_1.JSONSchemaPlainField)('开启 Algolia Search'),
    __metadata("design:type", Boolean)
], AlgoliaSearchOptionsDto.prototype, "enable", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    (0, configs_jsonschema_decorator_1.JSONSchemaPasswordField)('ApiKey'),
    __metadata("design:type", String)
], AlgoliaSearchOptionsDto.prototype, "apiKey", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, configs_jsonschema_decorator_1.JSONSchemaPlainField)('AppId'),
    __metadata("design:type", String)
], AlgoliaSearchOptionsDto.prototype, "appId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, configs_jsonschema_decorator_1.JSONSchemaPlainField)('IndexName'),
    __metadata("design:type", String)
], AlgoliaSearchOptionsDto.prototype, "indexName", void 0);
AlgoliaSearchOptionsDto = __decorate([
    (0, class_validator_jsonschema_1.JSONSchema)({ title: 'Algolia Search' })
], AlgoliaSearchOptionsDto);
exports.AlgoliaSearchOptionsDto = AlgoliaSearchOptionsDto;
let AdminExtraDto = class AdminExtraDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { enableAdminProxy: { required: false, type: () => Boolean }, background: { required: false, type: () => String }, title: { required: false, type: () => String }, gaodemapKey: { required: false, type: () => String } };
    }
};
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, configs_jsonschema_decorator_1.JSONSchemaToggleField)('开启后台管理反代', {
        description: '是否可以通过 API 访问后台',
    }),
    __metadata("design:type", Boolean)
], AdminExtraDto.prototype, "enableAdminProxy", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, configs_jsonschema_decorator_1.JSONSchemaPlainField)('登录页面背景'),
    __metadata("design:type", String)
], AdminExtraDto.prototype, "background", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, configs_jsonschema_decorator_1.JSONSchemaPlainField)('中后台标题'),
    __metadata("design:type", String)
], AdminExtraDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    (0, configs_jsonschema_decorator_1.JSONSchemaPasswordField)('高德查询 API Key', { description: '日记地点定位' }),
    __metadata("design:type", String)
], AdminExtraDto.prototype, "gaodemapKey", void 0);
AdminExtraDto = __decorate([
    (0, class_validator_jsonschema_1.JSONSchema)({ title: '后台附加设置' })
], AdminExtraDto);
exports.AdminExtraDto = AdminExtraDto;
let TerminalOptionsDto = class TerminalOptionsDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { enable: { required: true, type: () => Boolean }, password: { required: false, type: () => String }, script: { required: false, type: () => String } };
    }
};
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, configs_jsonschema_decorator_1.JSONSchemaToggleField)('开启 WebShell'),
    __metadata("design:type", Boolean)
], TerminalOptionsDto.prototype, "enable", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value == 'string' && value.length == 0 ? null : value),
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    (0, configs_jsonschema_decorator_1.JSONSchemaPasswordField)('设定密码', {
        description: '密码为空则不启用密码验证',
    }),
    __metadata("design:type", String)
], TerminalOptionsDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, configs_jsonschema_decorator_1.JSONSchemaPlainField)('前置脚本', {
        'ui:options': {
            type: 'textarea',
        },
    }),
    __metadata("design:type", String)
], TerminalOptionsDto.prototype, "script", void 0);
TerminalOptionsDto = __decorate([
    (0, class_validator_jsonschema_1.JSONSchema)({ title: '终端设定' })
], TerminalOptionsDto);
exports.TerminalOptionsDto = TerminalOptionsDto;
let FriendLinkOptionsDto = class FriendLinkOptionsDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { allowApply: { required: true, type: () => Boolean } };
    }
};
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, configs_jsonschema_decorator_1.JSONSchemaToggleField)('允许申请友链'),
    __metadata("design:type", Boolean)
], FriendLinkOptionsDto.prototype, "allowApply", void 0);
FriendLinkOptionsDto = __decorate([
    (0, class_validator_jsonschema_1.JSONSchema)({ title: '友链设定' })
], FriendLinkOptionsDto);
exports.FriendLinkOptionsDto = FriendLinkOptionsDto;
let TextOptionsDto = class TextOptionsDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { macros: { required: true, type: () => Boolean } };
    }
};
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, configs_jsonschema_decorator_1.JSONSchemaToggleField)('开启文本宏替换'),
    __metadata("design:type", Boolean)
], TextOptionsDto.prototype, "macros", void 0);
TextOptionsDto = __decorate([
    (0, class_validator_jsonschema_1.JSONSchema)({ title: '文本设定' })
], TextOptionsDto);
exports.TextOptionsDto = TextOptionsDto;
let BarkOptionsDto = class BarkOptionsDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { enable: { required: true, type: () => Boolean }, key: { required: true, type: () => String }, serverUrl: { required: true, type: () => String }, enableComment: { required: false, type: () => Boolean } };
    }
};
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, configs_jsonschema_decorator_1.JSONSchemaToggleField)('开启 Bark 通知'),
    __metadata("design:type", Boolean)
], BarkOptionsDto.prototype, "enable", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, configs_jsonschema_decorator_1.JSONSchemaPlainField)('设备 Key'),
    __metadata("design:type", String)
], BarkOptionsDto.prototype, "key", void 0);
__decorate([
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsOptional)(),
    (0, configs_jsonschema_decorator_1.JSONSchemaPlainField)('服务器 URL', {
        description: '如果不填写, 则使用默认的服务器, https://day.app/',
    }),
    __metadata("design:type", String)
], BarkOptionsDto.prototype, "serverUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, configs_jsonschema_decorator_1.JSONSchemaToggleField)('开启评论通知'),
    __metadata("design:type", Boolean)
], BarkOptionsDto.prototype, "enableComment", void 0);
BarkOptionsDto = __decorate([
    (0, class_validator_jsonschema_1.JSONSchema)({ title: 'Bark 通知设定' })
], BarkOptionsDto);
exports.BarkOptionsDto = BarkOptionsDto;
