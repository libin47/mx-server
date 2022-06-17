"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTPDecorators = exports.Idempotence = exports.FileUpload = exports.Bypass = exports.Paginator = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const meta_constant_1 = require("../../constants/meta.constant");
const SYSTEM = __importStar(require("../../constants/system.constant"));
const file_dto_1 = require("../../shared/dto/file.dto");
const Paginator = (target, key, descriptor) => {
    (0, common_1.SetMetadata)(meta_constant_1.HTTP_RES_TRANSFORM_PAGINATE, true)(descriptor.value);
};
exports.Paginator = Paginator;
const Bypass = (target, key, descriptor) => {
    (0, common_1.SetMetadata)(SYSTEM.RESPONSE_PASSTHROUGH_METADATA, true)(descriptor.value);
};
exports.Bypass = Bypass;
function FileUpload({ description }) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiConsumes)('multipart/form-data'), (0, swagger_1.ApiBody)({
        description,
        type: file_dto_1.FileUploadDto,
    }));
}
exports.FileUpload = FileUpload;
const Idempotence = (options) => (target, key, descriptor) => {
    (0, common_1.SetMetadata)(meta_constant_1.HTTP_IDEMPOTENCE_OPTIONS, options || {})(descriptor.value);
};
exports.Idempotence = Idempotence;
exports.HTTPDecorators = {
    Paginator: exports.Paginator,
    Bypass: exports.Bypass,
    FileUpload,
    Idempotence: exports.Idempotence,
};
