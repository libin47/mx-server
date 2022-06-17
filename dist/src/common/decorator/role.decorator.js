"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsMaster = exports.IsGuest = void 0;
const common_1 = require("@nestjs/common");
const get_req_transformer_1 = require("../../transformers/get-req.transformer");
exports.IsGuest = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = (0, get_req_transformer_1.getNestExecutionContextRequest)(ctx);
    return request.isGuest;
});
exports.IsMaster = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = (0, get_req_transformer_1.getNestExecutionContextRequest)(ctx);
    return request.isMaster;
});
