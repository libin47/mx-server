"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BanInDemo = void 0;
const common_1 = require("@nestjs/common");
const utils_1 = require("../../utils");
class DemoGuard {
    canActivate() {
        (0, utils_1.banInDemo)();
        return true;
    }
}
exports.BanInDemo = (0, common_1.applyDecorators)((0, common_1.UseGuards)(DemoGuard));
