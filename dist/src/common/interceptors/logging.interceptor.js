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
var LoggingInterceptor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingInterceptor = void 0;
const operators_1 = require("rxjs/operators");
const common_1 = require("@nestjs/common");
const meta_constant_1 = require("../../constants/meta.constant");
const get_req_transformer_1 = require("../../transformers/get-req.transformer");
let LoggingInterceptor = LoggingInterceptor_1 = class LoggingInterceptor {
    constructor() {
        this.logger = new common_1.Logger(LoggingInterceptor_1.name, { timestamp: false });
    }
    intercept(context, next) {
        const call$ = next.handle();
        const request = this.getRequest(context);
        const content = `${request.method} -> ${request.url}`;
        this.logger.debug(`+++ 收到请求：${content}`);
        const now = +new Date();
        (0, common_1.SetMetadata)(meta_constant_1.HTTP_REQUEST_TIME, now)(this.getRequest(context));
        return call$.pipe((0, operators_1.tap)(() => this.logger.debug(`--- 响应请求：${content}${chalk.yellow(` +${+new Date() - now}ms`)}`)));
    }
    getRequest(context) {
        return (0, get_req_transformer_1.getNestExecutionContextRequest)(context);
    }
};
LoggingInterceptor = LoggingInterceptor_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], LoggingInterceptor);
exports.LoggingInterceptor = LoggingInterceptor;
