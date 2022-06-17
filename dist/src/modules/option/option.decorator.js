"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_decorator_1 = require("../../common/decorator/auth.decorator");
function OptionController(name, postfixRoute) {
    const routes = ['options', 'config', 'setting', 'configs', 'option'];
    return (0, common_1.applyDecorators)((0, auth_decorator_1.Auth)(), (0, common_1.Controller)(postfixRoute ? routes.map((route) => `${route}/${postfixRoute}`) : routes), (0, swagger_1.ApiTags)(`${name ? `${name} ` : ''}Option Routes`));
}
exports.OptionController = OptionController;
