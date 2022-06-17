"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryInterceptor = void 0;
const qs_1 = __importDefault(require("qs"));
const common_1 = require("@nestjs/common");
const get_req_transformer_1 = require("../../transformers/get-req.transformer");
let QueryInterceptor = class QueryInterceptor {
    intercept(context, next) {
        const request = (0, get_req_transformer_1.getNestExecutionContextRequest)(context);
        const query = request.query;
        if (!query) {
            return next.handle();
        }
        const queryObj = query.db_query;
        if (request.user) {
            ;
            request.query.db_query =
                typeof queryObj === 'string' ? qs_1.default.parse(queryObj) : queryObj;
        }
        else {
            delete request.query.db_query;
        }
        return next.handle();
    }
};
QueryInterceptor = __decorate([
    (0, common_1.Injectable)()
], QueryInterceptor);
exports.QueryInterceptor = QueryInterceptor;
