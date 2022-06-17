"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpiderGuard = void 0;
const common_1 = require("@nestjs/common");
const env_global_1 = require("../../global/env.global");
const get_req_transformer_1 = require("../../transformers/get-req.transformer");
let SpiderGuard = class SpiderGuard {
    canActivate(context) {
        if (env_global_1.isDev) {
            return true;
        }
        const request = this.getRequest(context);
        const headers = request.headers;
        const ua = headers['user-agent'] || '';
        const isSpiderUA = !!ua.match(/(Scrapy|HttpClient|axios|python|requests)/i) &&
            !ua.match(/(mx-space|rss|google|baidu|bing)/gi);
        if (ua && !isSpiderUA) {
            return true;
        }
        throw new common_1.ForbiddenException(`爬虫是被禁止的哦，UA: ${ua}`);
    }
    getRequest(context) {
        return (0, get_req_transformer_1.getNestExecutionContextRequest)(context);
    }
};
SpiderGuard = __decorate([
    (0, common_1.Injectable)()
], SpiderGuard);
exports.SpiderGuard = SpiderGuard;
