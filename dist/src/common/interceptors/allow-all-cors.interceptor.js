"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllowAllCorsInterceptor = void 0;
const common_1 = require("@nestjs/common");
class AllowAllCorsInterceptor {
    intercept(context, next) {
        const handle = next.handle();
        const response = context.switchToHttp().getResponse();
        const allowedMethods = [
            common_1.RequestMethod.GET,
            common_1.RequestMethod.HEAD,
            common_1.RequestMethod.PUT,
            common_1.RequestMethod.PATCH,
            common_1.RequestMethod.POST,
            common_1.RequestMethod.DELETE,
        ];
        const allowedHeaders = [
            'Authorization',
            'Origin',
            'No-Cache',
            'X-Requested-With',
            'If-Modified-Since',
            'Last-Modified',
            'Cache-Control',
            'Expires',
            'Content-Type',
        ];
        response.headers({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': allowedHeaders.join(','),
            'Access-Control-Allow-Methods': allowedMethods.join(','),
            'Access-Control-Max-Age': '86400',
        });
        return handle;
    }
}
exports.AllowAllCorsInterceptor = AllowAllCorsInterceptor;
