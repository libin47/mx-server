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
exports.LinkDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const link_model_1 = require("./link.model");
class LinkDto extends link_model_1.LinkModel {
    static _OPENAPI_METADATA_FACTORY() {
        return { author: { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsString)({ message: '输入你的大名吧' }),
    (0, class_validator_1.MaxLength)(20, { message: '乃的名字太长了' }),
    __metadata("design:type", String)
], LinkDto.prototype, "author", void 0);
exports.LinkDto = LinkDto;
