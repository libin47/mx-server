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
exports.FileService = void 0;
const fs_1 = require("fs");
const common_1 = require("@nestjs/common");
const path_constant_1 = require("../../constants/path.constant");
const utils_1 = require("../../utils");
const configs_service_1 = require("../configs/configs.service");
let FileService = class FileService {
    constructor(configService) {
        this.configService = configService;
    }
    resolveFilePath(type, name) {
        return path.resolve(path_constant_1.STATIC_FILE_DIR, type, name);
    }
    async checkIsExist(path) {
        return fs
            .access(path)
            .then(() => true)
            .catch(() => false);
    }
    async getFile(type, name) {
        return await fs.readFile(this.resolveFilePath(type, name));
    }
    writeFile(type, name, data, encoding) {
        (0, utils_1.banInDemo)();
        return new Promise(async (resolve, reject) => {
            const filePath = this.resolveFilePath(type, name);
            if (await this.checkIsExist(filePath)) {
                reject(new common_1.BadRequestException('文件已存在'));
                return;
            }
            await fs.mkdir(path.dirname(filePath), { recursive: true });
            const writable = (0, fs_1.createWriteStream)(filePath, {
                encoding,
            });
            data.pipe(writable);
            writable.on('close', () => {
                resolve(null);
            });
            writable.on('error', () => reject(null));
            data.on('end', () => {
                writable.end();
            });
            data.on('error', () => reject(null));
        });
    }
    deleteFile(type, name) {
        (0, utils_1.banInDemo)();
        return fs.unlink(this.resolveFilePath(type, name)).catch(() => null);
    }
    getDir(type) {
        return fs
            .mkdir(this.resolveFilePath(type, ''), { recursive: true })
            .then(() => path.resolve(path_constant_1.STATIC_FILE_DIR, type))
            .then((path) => fs.readdir(path));
    }
    async resolveFileUrl(type, name) {
        const { serverUrl } = await this.configService.get('url');
        return `${serverUrl.replace(/\/+$/, '')}/objects/${type}/${name}`;
    }
};
FileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [configs_service_1.ConfigsService])
], FileService);
exports.FileService = FileService;
