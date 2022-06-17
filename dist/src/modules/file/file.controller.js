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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileController = void 0;
const openapi = require("@nestjs/swagger");
const mime_types_1 = require("mime-types");
const async_1 = require("nanoid/async");
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const auth_decorator_1 = require("../../common/decorator/auth.decorator");
const http_decorator_1 = require("../../common/decorator/http.decorator");
const openapi_decorator_1 = require("../../common/decorator/openapi.decorator");
const cant_find_exception_1 = require("../../common/exceptions/cant-find.exception");
const other_constant_1 = require("../../constants/other.constant");
const helper_upload_service_1 = require("../../processors/helper/helper.upload.service");
const pager_dto_1 = require("../../shared/dto/pager.dto");
const file_dto_1 = require("./file.dto");
const file_service_1 = require("./file.service");
let FileController = class FileController {
    constructor(service, uploadService) {
        this.service = service;
        this.uploadService = uploadService;
    }
    async getTypes(query, params) {
        const { type = 'file' } = params;
        const dir = await this.service.getDir(type);
        return Promise.all(dir.map(async (name) => {
            return { name, url: await this.service.resolveFileUrl(type, name) };
        }));
    }
    async get(params, reply) {
        const { type, name } = params;
        const ext = path.extname(name);
        const mimetype = (0, mime_types_1.lookup)(ext);
        try {
            const buffer = await this.service.getFile(type, name);
            if (mimetype) {
                reply.type(mimetype);
                reply.header('cache-control', 'public, max-age=31536000');
                reply.header('expires', new Date(Date.now() + 31536000 * 1000).toUTCString());
            }
            reply.send(buffer);
        }
        catch {
            throw new cant_find_exception_1.CannotFindException();
        }
    }
    async upload(query, req) {
        const file = await this.uploadService.getAndValidMultipartField(req);
        const { type = 'file' } = query;
        const ext = path.extname(file.filename);
        const filename = (await (0, async_1.customAlphabet)(other_constant_1.alphabet)(18)) + ext.toLowerCase();
        await this.service.writeFile(type, filename, file.file);
        return {
            url: await this.service.resolveFileUrl(type, filename),
            name: filename,
        };
    }
    async delete(params) {
        const { type, name } = params;
        await this.service.deleteFile(type, name);
    }
};
__decorate([
    (0, common_1.Get)('/:type'),
    (0, auth_decorator_1.Auth)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pager_dto_1.PagerDto, file_dto_1.FileUploadDto]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "getTypes", null);
__decorate([
    (0, common_1.Get)('/:type/:name'),
    (0, throttler_1.Throttle)(60, 60),
    http_decorator_1.HTTPDecorators.Bypass,
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [file_dto_1.FileQueryDto, Object]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "get", null);
__decorate([
    http_decorator_1.HTTPDecorators.FileUpload({ description: 'upload file' }),
    (0, common_1.Post)('/upload'),
    (0, auth_decorator_1.Auth)(),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [file_dto_1.FileUploadDto, Object]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "upload", null);
__decorate([
    (0, common_1.Delete)('/:type/:name'),
    (0, auth_decorator_1.Auth)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [file_dto_1.FileQueryDto]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "delete", null);
FileController = __decorate([
    openapi_decorator_1.ApiName,
    (0, common_1.Controller)(['objects', 'files']),
    __metadata("design:paramtypes", [file_service_1.FileService,
        helper_upload_service_1.UploadService])
], FileController);
exports.FileController = FileController;
