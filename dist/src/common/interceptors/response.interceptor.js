"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseInterceptor = void 0;
const lodash_1 = require("lodash");
const operators_1 = require("rxjs/operators");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const meta_constant_1 = require("../../constants/meta.constant");
const SYSTEM = __importStar(require("../../constants/system.constant"));
const paginate_transformer_1 = require("../../transformers/paginate.transformer");
let ResponseInterceptor = class ResponseInterceptor {
    constructor(reflector) {
        this.reflector = reflector;
    }
    intercept(context, next) {
        if (!context.switchToHttp().getRequest()) {
            return next.handle();
        }
        const handler = context.getHandler();
        const bypass = this.reflector.get(SYSTEM.RESPONSE_PASSTHROUGH_METADATA, handler);
        if (bypass) {
            return next.handle();
        }
        return next.handle().pipe((0, operators_1.map)((data) => {
            if (typeof data === 'undefined') {
                context.switchToHttp().getResponse().status(204);
                return data;
            }
            if (this.reflector.get(meta_constant_1.HTTP_RES_TRANSFORM_PAGINATE, handler)) {
                return (0, paginate_transformer_1.transformDataToPaginate)(data);
            }
            return (0, lodash_1.isArrayLike)(data) ? { data } : data;
        }));
    }
};
ResponseInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], ResponseInterceptor);
exports.ResponseInterceptor = ResponseInterceptor;
