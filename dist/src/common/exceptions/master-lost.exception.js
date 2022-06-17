"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasterLostException = void 0;
const common_1 = require("@nestjs/common");
class MasterLostException extends common_1.InternalServerErrorException {
    constructor() {
        super('系统异常，站点主人信息已丢失');
    }
}
exports.MasterLostException = MasterLostException;
