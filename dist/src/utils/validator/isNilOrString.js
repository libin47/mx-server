"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsNilOrString = void 0;
const class_validator_1 = require("class-validator");
const lodash_1 = require("lodash");
let IsNilOrStringConstraint = class IsNilOrStringConstraint {
    validate(value, _args) {
        return (0, lodash_1.isNil)(value) || (0, class_validator_1.isString)(value);
    }
};
IsNilOrStringConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ async: true })
], IsNilOrStringConstraint);
function IsNilOrString(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsNilOrStringConstraint,
        });
    };
}
exports.IsNilOrString = IsNilOrString;
