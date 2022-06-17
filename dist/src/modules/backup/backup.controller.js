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
exports.BackupController = void 0;
const openapi = require("@nestjs/swagger");
const stream_1 = require("stream");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_decorator_1 = require("../../common/decorator/auth.decorator");
const demo_decorator_1 = require("../../common/decorator/demo.decorator");
const http_decorator_1 = require("../../common/decorator/http.decorator");
const openapi_decorator_1 = require("../../common/decorator/openapi.decorator");
const helper_upload_service_1 = require("../../processors/helper/helper.upload.service");
const utils_1 = require("../../utils");
const backup_service_1 = require("./backup.service");
let BackupController = class BackupController {
    constructor(backupService, uploadService) {
        this.backupService = backupService;
        this.uploadService = uploadService;
    }
    async createNewBackup() {
        const res = await this.backupService.backup();
        if (typeof res == 'undefined' || typeof res.buffer === 'undefined') {
            throw new common_1.BadRequestException('请先开启在设置开启备份功能');
        }
        const stream = new stream_1.Readable();
        stream.push(res.buffer);
        stream.push(null);
        return stream;
    }
    async get() {
        return this.backupService.list();
    }
    async download(dirname) {
        return this.backupService.getFileStream(dirname);
    }
    async uploadAndRestore(req) {
        const data = await this.uploadService.getAndValidMultipartField(req);
        const { mimetype } = data;
        if (mimetype !== 'application/zip') {
            throw new common_1.UnprocessableEntityException('备份格式必须为 application/zip');
        }
        await this.backupService.saveTempBackupByUpload(await data.toBuffer());
        return;
    }
    async rollback(dirname) {
        if (!dirname) {
            throw new common_1.UnprocessableEntityException('参数有误');
        }
        this.backupService.rollbackTo(dirname);
        return;
    }
    async deleteBackups(files) {
        if (!files) {
            return;
        }
        const _files = files.split(',');
        for await (const f of _files) {
            await this.backupService.deleteBackup(f);
        }
        return;
    }
    async delete(filename) {
        if (!filename) {
            return;
        }
        await this.backupService.deleteBackup(filename);
        return;
    }
};
__decorate([
    (0, common_1.Get)('/new'),
    (0, swagger_1.ApiResponseProperty)({ type: 'string', format: 'binary' }),
    (0, common_1.Header)('Content-Disposition', `attachment; filename="backup-${(0, utils_1.getMediumDateTime)(new Date())}.zip"`),
    (0, common_1.Header)('Content-Type', 'application/zip'),
    http_decorator_1.HTTPDecorators.Bypass,
    openapi.ApiResponse({ status: 200, type: require("stream").Readable }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "createNewBackup", null);
__decorate([
    (0, common_1.Get)('/'),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "get", null);
__decorate([
    http_decorator_1.HTTPDecorators.Bypass,
    (0, common_1.Header)('Content-Type', 'application/zip'),
    (0, common_1.Get)('/:dirname'),
    openapi.ApiResponse({ status: 200, type: require("stream").Readable }),
    __param(0, (0, common_1.Param)('dirname')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "download", null);
__decorate([
    (0, common_1.Post)(['/rollback/', '/']),
    (0, swagger_1.ApiProperty)({ description: '上传备份恢复' }),
    http_decorator_1.HTTPDecorators.FileUpload({ description: 'Upload backup and restore' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "uploadAndRestore", null);
__decorate([
    (0, common_1.Patch)(['/rollback/:dirname', '/:dirname']),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('dirname')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "rollback", null);
__decorate([
    (0, common_1.Delete)('/'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('files')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "deleteBackups", null);
__decorate([
    (0, common_1.Delete)('/:filename'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('filename')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "delete", null);
BackupController = __decorate([
    (0, common_1.Controller)({ path: 'backups' }),
    openapi_decorator_1.ApiName,
    (0, auth_decorator_1.Auth)(),
    demo_decorator_1.BanInDemo,
    __metadata("design:paramtypes", [backup_service_1.BackupService,
        helper_upload_service_1.UploadService])
], BackupController);
exports.BackupController = BackupController;
