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
exports.GaodeMapSearchDto = exports.GaodeMapLocationDto = exports.IpDto = void 0;
const openapi = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class IpDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { ip: { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsIP)(),
    __metadata("design:type", String)
], IpDto.prototype, "ip", void 0);
exports.IpDto = IpDto;
class GaodeMapLocationDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { longitude: { required: true, type: () => String }, latitude: { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => +value),
    __metadata("design:type", String)
], GaodeMapLocationDto.prototype, "longitude", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => +value),
    __metadata("design:type", String)
], GaodeMapLocationDto.prototype, "latitude", void 0);
exports.GaodeMapLocationDto = GaodeMapLocationDto;
class GaodeMapSearchDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { keywords: { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GaodeMapSearchDto.prototype, "keywords", void 0);
exports.GaodeMapSearchDto = GaodeMapSearchDto;
