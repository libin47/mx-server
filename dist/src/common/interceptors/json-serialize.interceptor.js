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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONSerializeInterceptor = void 0;
const lodash_1 = require("lodash");
const rxjs_1 = require("rxjs");
const snakecase_keys_1 = __importDefault(require("snakecase-keys"));
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const system_constant_1 = require("../../constants/system.constant");
let JSONSerializeInterceptor = class JSONSerializeInterceptor {
    constructor(reflector) {
        this.reflector = reflector;
    }
    intercept(context, next) {
        const handler = context.getHandler();
        const bypass = this.reflector.get(system_constant_1.RESPONSE_PASSTHROUGH_METADATA, handler);
        if (bypass) {
            return next.handle();
        }
        const http = context.switchToHttp();
        if (!http.getRequest()) {
            return next.handle();
        }
        return next.handle().pipe((0, rxjs_1.map)((data) => {
            return this.serialize(data);
        }));
    }
    serialize(obj) {
        var _a, _b, _c;
        if (!(0, lodash_1.isObjectLike)(obj)) {
            return obj;
        }
        if ((0, lodash_1.isArrayLike)(obj)) {
            obj = Array.from(obj).map((i) => {
                return this.serialize(i);
            });
        }
        else {
            if (obj.toJSON || obj.toObject) {
                obj = (_b = (_a = obj.toJSON) === null || _a === void 0 ? void 0 : _a.call(obj)) !== null && _b !== void 0 ? _b : (_c = obj.toObject) === null || _c === void 0 ? void 0 : _c.call(obj);
            }
            Reflect.deleteProperty(obj, '__v');
            const keys = Object.keys(obj);
            for (const key of keys) {
                const val = obj[key];
                if (!(0, lodash_1.isObjectLike)(val)) {
                    continue;
                }
                if (val.toJSON) {
                    obj[key] = val.toJSON();
                    if (!(0, lodash_1.isObjectLike)(obj[key])) {
                        continue;
                    }
                    Reflect.deleteProperty(obj[key], '__v');
                }
                obj[key] = this.serialize(obj[key]);
            }
            obj = (0, snakecase_keys_1.default)(obj);
        }
        return obj;
    }
};
JSONSerializeInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], JSONSerializeInterceptor);
exports.JSONSerializeInterceptor = JSONSerializeInterceptor;
