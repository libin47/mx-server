"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessException = void 0;
const common_1 = require("@nestjs/common");
const error_code_constant_1 = require("../../constants/error-code.constant");
class BusinessException extends common_1.HttpException {
    constructor(code) {
        const [message, status] = error_code_constant_1.ErrorCode[code];
        super(common_1.HttpException.createBody({ code, message }, message, status), status);
    }
}
exports.BusinessException = BusinessException;
