"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BanInDemoExcpetion = void 0;
const error_code_constant_1 = require("../../constants/error-code.constant");
const business_exception_1 = require("./business.exception");
class BanInDemoExcpetion extends business_exception_1.BusinessException {
    constructor() {
        super(error_code_constant_1.ErrorCodeEnum.BanInDemo);
    }
}
exports.BanInDemoExcpetion = BanInDemoExcpetion;
