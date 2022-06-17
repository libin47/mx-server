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
exports.ServerlessStorageModel = exports.ServerlessStorageCollectionName = void 0;
const openapi = require("@nestjs/swagger");
const typegoose_1 = require("@typegoose/typegoose");
exports.ServerlessStorageCollectionName = `serverlessstorages`;
let ServerlessStorageModel = class ServerlessStorageModel {
    get uniqueKey() {
        return `${this.namespace}/${this.key}`;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { namespace: { required: true, type: () => String }, key: { required: true, type: () => String }, value: { required: true, type: () => Object } };
    }
};
__decorate([
    (0, typegoose_1.prop)({ index: 1, required: true }),
    __metadata("design:type", String)
], ServerlessStorageModel.prototype, "namespace", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], ServerlessStorageModel.prototype, "key", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: typegoose_1.mongoose.Schema.Types.Mixed, required: true }),
    __metadata("design:type", Object)
], ServerlessStorageModel.prototype, "value", void 0);
ServerlessStorageModel = __decorate([
    (0, typegoose_1.modelOptions)({
        schemaOptions: {},
        options: {
            customName: exports.ServerlessStorageCollectionName,
            allowMixed: typegoose_1.Severity.ALLOW,
        },
    }),
    (0, typegoose_1.index)({ namespace: 1, key: 1 })
], ServerlessStorageModel);
exports.ServerlessStorageModel = ServerlessStorageModel;
