"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsBooleanOrString = void 0;
const class_validator_1 = require("class-validator");
const lodash_1 = require("lodash");
const simpleValidatorFactory_1 = require("./simpleValidatorFactory");
function IsBooleanOrString(validationOptions) {
    return (0, simpleValidatorFactory_1.validatorFactory)((value) => (0, lodash_1.isBoolean)(value) || (0, class_validator_1.isString)(value))((0, lodash_1.merge)(validationOptions || {}, {
        message: '类型必须为 String or Boolean',
    }));
}
exports.IsBooleanOrString = IsBooleanOrString;
