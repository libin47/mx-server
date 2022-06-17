"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsAllowedUrl = void 0;
const class_validator_1 = require("class-validator");
const simpleValidatorFactory_1 = require("./simpleValidatorFactory");
const IsAllowedUrl = (validationOptions) => {
    return (0, simpleValidatorFactory_1.validatorFactory)((val) => (0, class_validator_1.isURL)(val, { require_protocol: true, require_tld: false }))({
        message: '请更正为正确的网址',
        ...validationOptions,
    });
};
exports.IsAllowedUrl = IsAllowedUrl;
