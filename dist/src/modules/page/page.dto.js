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
exports.PageQueryDto = void 0;
const openapi = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const pager_dto_1 = require("../../shared/dto/pager.dto");
class PageQueryDto extends pager_dto_1.PagerDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { sortBy: { required: false, type: () => String }, sortOrder: { required: false, type: () => Object } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['title', 'created', 'modified', 'order', 'subtitle']),
    __metadata("design:type", String)
], PageQueryDto.prototype, "sortBy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)([1, -1]),
    (0, class_validator_1.ValidateIf)((o) => o.sortBy),
    (0, class_transformer_1.Transform)(({ value: v }) => v | 0),
    __metadata("design:type", Number)
], PageQueryDto.prototype, "sortOrder", void 0);
exports.PageQueryDto = PageQueryDto;
//# sourceMappingURL=page.dto.js.map