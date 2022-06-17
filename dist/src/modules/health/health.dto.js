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
exports.LogTypeDto = exports.LogQueryDto = void 0;
const openapi = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class LogQueryDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { type: { required: false, type: () => Object }, index: { required: true, type: () => Number }, filename: { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsIn)(['out', 'error']),
    (0, class_validator_1.ValidateIf)((o) => typeof o.filename === 'undefined'),
    __metadata("design:type", String)
], LogQueryDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Transform)(({ value }) => +value),
    (0, class_validator_1.ValidateIf)((o) => typeof o.filename === 'undefined'),
    __metadata("design:type", Number)
], LogQueryDto.prototype, "index", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LogQueryDto.prototype, "filename", void 0);
exports.LogQueryDto = LogQueryDto;
class LogTypeDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { type: { required: true, type: () => Object } };
    }
}
__decorate([
    (0, class_validator_1.IsIn)(['pm2', 'native']),
    __metadata("design:type", String)
], LogTypeDto.prototype, "type", void 0);
exports.LogTypeDto = LogTypeDto;
