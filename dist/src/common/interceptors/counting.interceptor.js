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
exports.CountingInterceptor = void 0;
const rxjs_1 = require("rxjs");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const meta_constant_1 = require("../../constants/meta.constant");
const helper_counting_service_1 = require("../../processors/helper/helper.counting.service");
const get_req_transformer_1 = require("../../transformers/get-req.transformer");
const ip_util_1 = require("../../utils/ip.util");
let CountingInterceptor = class CountingInterceptor {
    constructor(countingService, reflector) {
        this.countingService = countingService;
        this.reflector = reflector;
    }
    intercept(context, next) {
        const request = this.getRequest(context);
        if (request.isMaster) {
            return next.handle();
        }
        const handler = context.getHandler();
        return next.handle().pipe((0, rxjs_1.map)((data) => {
            var _a, _b;
            const documentType = this.reflector.get(meta_constant_1.HTTP_RES_UPDATE_DOC_COUNT_TYPE, handler);
            if (documentType && data) {
                this.countingService.updateReadCount(documentType, data.id || ((_a = data === null || data === void 0 ? void 0 : data.data) === null || _a === void 0 ? void 0 : _a.id) || data._id || ((_b = data === null || data === void 0 ? void 0 : data.data) === null || _b === void 0 ? void 0 : _b._id), (0, ip_util_1.getIp)(this.getRequest(context)));
            }
            return data;
        }));
    }
    get getRequest() {
        return get_req_transformer_1.getNestExecutionContextRequest.bind(this);
    }
};
CountingInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [helper_counting_service_1.CountingService,
        core_1.Reflector])
], CountingInterceptor);
exports.CountingInterceptor = CountingInterceptor;
