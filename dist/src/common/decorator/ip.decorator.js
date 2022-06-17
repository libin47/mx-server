"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpLocation = void 0;
const common_1 = require("@nestjs/common");
const ip_util_1 = require("../../utils/ip.util");
exports.IpLocation = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const ip = (0, ip_util_1.getIp)(request);
    const agent = request.headers['user-agent'];
    return {
        ip,
        agent,
    };
});
