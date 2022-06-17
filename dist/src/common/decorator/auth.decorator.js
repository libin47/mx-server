"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_config_1 = require("../../app.config");
const auth_guard_1 = require("../guard/auth.guard");
function Auth() {
    const decorators = [];
    if (!app_config_1.SECURITY.skipAuth) {
        decorators.push((0, common_1.UseGuards)(auth_guard_1.AuthGuard));
    }
    decorators.push((0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Unauthorized' }));
    return (0, common_1.applyDecorators)(...decorators);
}
exports.Auth = Auth;
