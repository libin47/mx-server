"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachHeaderTokenMiddleware = void 0;
const common_1 = require("@nestjs/common");
const ip_util_1 = require("../../utils/ip.util");
let AttachHeaderTokenMiddleware = class AttachHeaderTokenMiddleware {
    async use(req, res, next) {
        var _a;
        const url = (_a = req.originalUrl) === null || _a === void 0 ? void 0 : _a.replace(/^\/api(\/v\d)?/, '');
        const parser = (0, ip_util_1.parseRelativeUrl)(url);
        if (parser.searchParams.get('token')) {
            req.headers.authorization = parser.searchParams.get('token');
        }
        next();
    }
};
AttachHeaderTokenMiddleware = __decorate([
    (0, common_1.Injectable)()
], AttachHeaderTokenMiddleware);
exports.AttachHeaderTokenMiddleware = AttachHeaderTokenMiddleware;
//# sourceMappingURL=attach-auth.middleware.js.map