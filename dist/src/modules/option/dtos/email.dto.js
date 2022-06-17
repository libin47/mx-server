"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplyEmailBodyDto = exports.ReplyEmailTypeDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const helper_email_service_1 = require("../../../processors/helper/helper.email.service");
class ReplyEmailTypeDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { type: { required: true, enum: require("../../../processors/helper/helper.email.service").ReplyMailType } };
    }
}
__decorate([
    (0, class_validator_1.IsEnum)(helper_email_service_1.ReplyMailType),
    __metadata("design:type", String)
], ReplyEmailTypeDto.prototype, "type", void 0);
exports.ReplyEmailTypeDto = ReplyEmailTypeDto;
class ReplyEmailBodyDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { source: { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReplyEmailBodyDto.prototype, "source", void 0);
exports.ReplyEmailBodyDto = ReplyEmailBodyDto;
