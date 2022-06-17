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
exports.IntIdOrMongoIdDto = exports.MongoIdDto = void 0;
const openapi = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
class MongoIdDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsMongoId)(),
    (0, swagger_1.ApiProperty)({ example: '5e6f67e75b303781d2807278' }),
    __metadata("design:type", String)
], MongoIdDto.prototype, "id", void 0);
exports.MongoIdDto = MongoIdDto;
class IntIdOrMongoIdDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Object } };
    }
}
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if ((0, class_validator_1.isMongoId)(value)) {
            return value;
        }
        const nid = +value;
        if (!isNaN(nid)) {
            return nid;
        }
        throw new common_1.UnprocessableEntityException('Invalid id');
    }),
    (0, swagger_1.ApiProperty)({ example: [12, '5e6f67e75b303781d2807278'] }),
    __metadata("design:type", Object)
], IntIdOrMongoIdDto.prototype, "id", void 0);
exports.IntIdOrMongoIdDto = IntIdOrMongoIdDto;
