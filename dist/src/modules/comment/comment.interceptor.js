"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentFilterEmailInterceptor = void 0;
const class_validator_1 = require("class-validator");
const lodash_1 = require("lodash");
const rxjs_1 = require("rxjs");
const common_1 = require("@nestjs/common");
const get_req_transformer_1 = require("../../transformers/get-req.transformer");
const utils_1 = require("../../utils");
let CommentFilterEmailInterceptor = class CommentFilterEmailInterceptor {
    intercept(context, next) {
        const request = this.getRequest(context);
        const isMaster = request.user;
        if (isMaster) {
            return next.handle();
        }
        return next.handle().pipe((0, rxjs_1.map)(function handle(data) {
            var _a, _b;
            if (!data) {
                return data;
            }
            try {
                if ((0, lodash_1.isArrayLike)(data === null || data === void 0 ? void 0 : data.data)) {
                    (_a = data === null || data === void 0 ? void 0 : data.data) === null || _a === void 0 ? void 0 : _a.forEach((item, i) => {
                        var _a, _b;
                        data.data[i] = ((_b = (_a = data.data[i]).toObject) === null || _b === void 0 ? void 0 : _b.call(_a)) || data.data[i];
                        if (!item.avatar && (0, class_validator_1.isDefined)(item.mail)) {
                            data.data[i].avatar = (0, utils_1.getAvatar)(item.mail);
                            delete data.data[i].mail;
                        }
                        if (item.children) {
                            handle({ data: data.data[i].children });
                        }
                    });
                }
                if ((0, lodash_1.isObjectLike)(data)) {
                    data = ((_b = data === null || data === void 0 ? void 0 : data.toJSON) === null || _b === void 0 ? void 0 : _b.call(data)) || data;
                    Reflect.deleteProperty(data, 'mail');
                }
                return (0, lodash_1.cloneDeep)(data);
            }
            catch (e) {
                if (isDev) {
                    console.error('e:', e);
                }
                return (0, lodash_1.cloneDeep)(data);
            }
        }));
    }
    get getRequest() {
        return get_req_transformer_1.getNestExecutionContextRequest.bind(this);
    }
};
CommentFilterEmailInterceptor = __decorate([
    (0, common_1.Injectable)()
], CommentFilterEmailInterceptor);
exports.CommentFilterEmailInterceptor = CommentFilterEmailInterceptor;
