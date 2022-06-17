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
exports.NidType = exports.ListQueryDto = exports.QAQueryDto = exports.NotePasswordQueryDto = exports.NoteQueryDto = void 0;
const openapi = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const pager_dto_1 = require("../../shared/dto/pager.dto");
class NoteQueryDto extends pager_dto_1.PagerDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { sortBy: { required: false, type: () => String }, sortOrder: { required: false, type: () => Object } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['title', 'created', 'modified', 'weather', 'mood']),
    __metadata("design:type", String)
], NoteQueryDto.prototype, "sortBy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)([1, -1]),
    (0, class_validator_1.ValidateIf)((o) => o.sortBy),
    (0, class_transformer_1.Transform)(({ value: v }) => v | 0),
    __metadata("design:type", Number)
], NoteQueryDto.prototype, "sortOrder", void 0);
exports.NoteQueryDto = NoteQueryDto;
class NotePasswordQueryDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { password: { required: false, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], NotePasswordQueryDto.prototype, "password", void 0);
exports.NotePasswordQueryDto = NotePasswordQueryDto;
class QAQueryDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { answer: { required: false, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], QAQueryDto.prototype, "answer", void 0);
exports.QAQueryDto = QAQueryDto;
class ListQueryDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { size: { required: true, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Max)(20),
    (0, class_validator_1.Min)(1),
    (0, class_transformer_1.Transform)(({ value: v }) => parseInt(v)),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ListQueryDto.prototype, "size", void 0);
exports.ListQueryDto = ListQueryDto;
class NidType {
    static _OPENAPI_METADATA_FACTORY() {
        return { nid: { required: true, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsDefined)(),
    (0, class_transformer_1.Transform)(({ value: val }) => parseInt(val)),
    __metadata("design:type", Number)
], NidType.prototype, "nid", void 0);
exports.NidType = NidType;
