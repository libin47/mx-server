"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CannotFindException = exports.NotFoundMessage = void 0;
const lodash_1 = require("lodash");
const common_1 = require("@nestjs/common");
exports.NotFoundMessage = [
    '真不巧, 内容走丢了 o(╥﹏╥)o',
    '电波无法到达 ωω',
    '数据..不小心丢失了啦 π_π',
    '404, 这也不是我的错啦 (๐•̆ ·̭ •̆๐)',
    '嘿, 这里空空如也, 不如别处走走?',
];
class CannotFindException extends common_1.NotFoundException {
    constructor() {
        super((0, lodash_1.sample)(exports.NotFoundMessage));
    }
}
exports.CannotFindException = CannotFindException;
