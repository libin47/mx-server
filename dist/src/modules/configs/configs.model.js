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
exports.OptionModel = void 0;
const openapi = require("@nestjs/swagger");
const mongoose_1 = require("mongoose");
const typegoose_1 = require("@typegoose/typegoose");
let OptionModel = class OptionModel {
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, value: { required: true, type: () => Object } };
    }
};
__decorate([
    (0, typegoose_1.prop)({ unique: true, required: true }),
    __metadata("design:type", String)
], OptionModel.prototype, "name", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: mongoose_1.Schema.Types.Mixed }),
    __metadata("design:type", Object)
], OptionModel.prototype, "value", void 0);
OptionModel = __decorate([
    (0, typegoose_1.modelOptions)({
        options: { allowMixed: typegoose_1.Severity.ALLOW, customName: 'Option' },
        schemaOptions: {
            timestamps: {
                createdAt: false,
                updatedAt: false,
            },
        },
    })
], OptionModel);
exports.OptionModel = OptionModel;
