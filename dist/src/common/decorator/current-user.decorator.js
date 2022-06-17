"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentUserToken = exports.CurrentUser = void 0;
const common_1 = require("@nestjs/common");
const get_req_transformer_1 = require("../../transformers/get-req.transformer");
exports.CurrentUser = (0, common_1.createParamDecorator)((data, ctx) => {
    return (0, get_req_transformer_1.getNestExecutionContextRequest)(ctx).user;
});
exports.CurrentUserToken = (0, common_1.createParamDecorator)((data, ctx) => {
    return (0, get_req_transformer_1.getNestExecutionContextRequest)(ctx).token;
});
