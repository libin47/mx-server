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
var AllExceptionsFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
const path_1 = require("path");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const business_event_constant_1 = require("../../constants/business-event.constant");
const event_bus_constant_1 = require("../../constants/event-bus.constant");
const meta_constant_1 = require("../../constants/meta.constant");
const path_constant_1 = require("../../constants/path.constant");
const system_constant_1 = require("../../constants/system.constant");
const env_global_1 = require("../../global/env.global");
const helper_event_service_1 = require("../../processors/helper/helper.event.service");
const ip_util_1 = require("../../utils/ip.util");
const logging_interceptor_1 = require("../interceptors/logging.interceptor");
let AllExceptionsFilter = AllExceptionsFilter_1 = class AllExceptionsFilter {
    constructor(reflector, eventManager) {
        this.reflector = reflector;
        this.eventManager = eventManager;
        this.logger = new common_1.Logger(AllExceptionsFilter_1.name);
    }
    catch(exception, host) {
        var _a, _b, _c;
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception instanceof common_1.HttpException
            ? exception.getStatus()
            : (exception === null || exception === void 0 ? void 0 : exception.status) ||
                (exception === null || exception === void 0 ? void 0 : exception.statusCode) ||
                common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const message = ((_a = exception === null || exception === void 0 ? void 0 : exception.response) === null || _a === void 0 ? void 0 : _a.message) ||
            (exception === null || exception === void 0 ? void 0 : exception.message) ||
            '';
        const url = request.raw.url;
        if (status === common_1.HttpStatus.INTERNAL_SERVER_ERROR) {
            common_1.Logger.error(exception, undefined, 'Catch');
            this.eventManager.broadcast(event_bus_constant_1.EventBusEvents.SystemException, {
                message: exception === null || exception === void 0 ? void 0 : exception.message,
                stack: exception === null || exception === void 0 ? void 0 : exception.stack,
            }, {
                scope: business_event_constant_1.EventScope.TO_SYSTEM,
            });
            if (!env_global_1.isDev) {
                this.errorLogPipe =
                    (_b = this.errorLogPipe) !== null && _b !== void 0 ? _b : fs.createWriteStream((0, path_1.resolve)(path_constant_1.LOG_DIR, 'error.log'), {
                        flags: 'a+',
                        encoding: 'utf-8',
                    });
                this.errorLogPipe.write(`[${new Date().toISOString()}] ${decodeURI(url)}: ${((_c = exception === null || exception === void 0 ? void 0 : exception.response) === null || _c === void 0 ? void 0 : _c.message) ||
                    (exception === null || exception === void 0 ? void 0 : exception.message)}\n${exception.stack}\n`);
            }
        }
        else {
            const ip = (0, ip_util_1.getIp)(request);
            this.logger.warn(`IP: ${ip} 错误信息: (${status}) ${message} Path: ${decodeURI(url)}`);
        }
        const prevRequestTs = this.reflector.get(meta_constant_1.HTTP_REQUEST_TIME, request);
        if (prevRequestTs) {
            const content = `${request.method} -> ${request.url}`;
            common_1.Logger.debug(`--- 响应异常请求：${content}${chalk.yellow(` +${+new Date() - prevRequestTs}ms`)}`, logging_interceptor_1.LoggingInterceptor.name);
        }
        const res = exception.response;
        response
            .status(status)
            .type('application/json')
            .send({
            ok: 0,
            code: res === null || res === void 0 ? void 0 : res.code,
            message: (res === null || res === void 0 ? void 0 : res.message) || (exception === null || exception === void 0 ? void 0 : exception.message) || '未知错误',
        });
    }
};
AllExceptionsFilter = AllExceptionsFilter_1 = __decorate([
    (0, common_1.Catch)(),
    __param(0, (0, common_1.Inject)(system_constant_1.REFLECTOR)),
    __metadata("design:paramtypes", [core_1.Reflector,
        helper_event_service_1.EventManagerService])
], AllExceptionsFilter);
exports.AllExceptionsFilter = AllExceptionsFilter;
