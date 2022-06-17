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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var BackupService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackupService = void 0;
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const mkdirp_1 = __importDefault(require("mkdirp"));
const path_1 = require("path");
const stream_1 = require("stream");
const zx_cjs_1 = require("zx-cjs");
const common_1 = require("@nestjs/common");
const app_config_1 = require("../../app.config");
const business_event_constant_1 = require("../../constants/business-event.constant");
const path_constant_1 = require("../../constants/path.constant");
const cache_service_1 = require("../../processors/cache/cache.service");
const helper_event_service_1 = require("../../processors/helper/helper.event.service");
const utils_1 = require("../../utils");
const system_util_1 = require("../../utils/system.util");
const configs_service_1 = require("../configs/configs.service");
let BackupService = BackupService_1 = class BackupService {
    constructor(eventManager, configs, cacheService) {
        this.eventManager = eventManager;
        this.configs = configs;
        this.cacheService = cacheService;
        this.logger = new common_1.Logger(BackupService_1.name);
    }
    async list() {
        const backupPath = path_constant_1.BACKUP_DIR;
        if (!(0, fs_1.existsSync)(backupPath)) {
            return [];
        }
        const backupFilenames = await (0, promises_1.readdir)(backupPath);
        const backups = [];
        for (const filename of backupFilenames) {
            const path = (0, path_1.resolve)(backupPath, filename);
            if (!(0, fs_1.statSync)(path).isDirectory()) {
                continue;
            }
            backups.push({
                filename,
                path,
            });
        }
        return Promise.all(backups.map(async (item) => {
            const { path } = item;
            const size = await (0, system_util_1.getFolderSize)(path);
            delete item.path;
            return { ...item, size };
        }));
    }
    async backup() {
        const { backupOptions: configs } = await this.configs.waitForConfigReady();
        if (!configs.enable) {
            return;
        }
        this.logger.log('--> 备份数据库中');
        const dateDir = (0, utils_1.getMediumDateTime)(new Date());
        const backupDirPath = (0, path_1.join)(path_constant_1.BACKUP_DIR, dateDir);
        mkdirp_1.default.sync(backupDirPath);
        try {
            await $ `mongodump -h ${app_config_1.MONGO_DB.host} --port ${app_config_1.MONGO_DB.port} -d ${app_config_1.MONGO_DB.dbName} --excludeCollection analyzes -o ${backupDirPath} >/dev/null 2>&1`;
            cd(backupDirPath);
            await nothrow((0, zx_cjs_1.quiet)($ `mv ${app_config_1.MONGO_DB.dbName} mx-space`));
            await (0, zx_cjs_1.quiet)($ `zip -r backup-${dateDir} mx-space/* && rm -rf mx-space`);
            const excludeFolders = ['backup', 'log', 'node_modules', 'admin'];
            const flags = excludeFolders.map((item) => ['--exclude', item]).flat(1);
            cd(path_constant_1.DATA_DIR);
            await (0, promises_1.rm)((0, path_1.join)(path_constant_1.DATA_DIR, 'backup_data'), { recursive: true, force: true });
            await (0, promises_1.rm)((0, path_1.join)(path_constant_1.DATA_DIR, 'temp_copy_need'), {
                recursive: true,
                force: true,
            });
            await $ `rsync -a . ./temp_copy_need --exclude temp_copy_need ${flags} && mv temp_copy_need backup_data && zip -r ${(0, path_1.join)(backupDirPath, `backup-${dateDir}`)} ./backup_data && rm -rf backup_data`;
            this.logger.log('--> 备份成功');
        }
        catch (e) {
            this.logger.error(`--> 备份失败, 请确保已安装 zip 或 mongo-tools, mongo-tools 的版本需要与 mongod 版本一致, ${e.message}` ||
                e.stderr);
            throw e;
        }
        const path = (0, path_1.join)(backupDirPath, `backup-${dateDir}.zip`);
        return {
            buffer: await (0, promises_1.readFile)(path),
            path,
        };
    }
    async getFileStream(dirname) {
        const path = this.checkBackupExist(dirname);
        const stream = new stream_1.Readable();
        stream.push(await (0, promises_1.readFile)(path));
        stream.push(null);
        return stream;
    }
    checkBackupExist(dirname) {
        const path = (0, path_1.join)(path_constant_1.BACKUP_DIR, dirname, `backup-${dirname}.zip`);
        if (!(0, fs_1.existsSync)(path)) {
            throw new common_1.BadRequestException('文件不存在');
        }
        return path;
    }
    async saveTempBackupByUpload(buffer) {
        const tempDirPath = '/tmp/mx-space/backup';
        const tempBackupPath = (0, path_1.join)(tempDirPath, 'backup.zip');
        mkdirp_1.default.sync(tempDirPath);
        await (0, promises_1.writeFile)(tempBackupPath, buffer);
        await this.restore(tempBackupPath);
        await this.eventManager.broadcast(business_event_constant_1.BusinessEvents.CONTENT_REFRESH, 'restore_done', {
            scope: business_event_constant_1.EventScope.ALL,
        });
    }
    async restore(restoreFilePath) {
        await this.backup();
        const isExist = fs.existsSync(restoreFilePath);
        if (!isExist) {
            throw new common_1.InternalServerErrorException('备份文件不存在');
        }
        const dirPath = path.dirname(restoreFilePath);
        const tempdirs = ['mx-space', 'backup_data'];
        await Promise.all(tempdirs.map((dir) => {
            return (0, promises_1.rm)((0, path_1.join)(dirPath, dir), { recursive: true, force: true });
        }));
        try {
            cd(dirPath);
            await $ `unzip ${restoreFilePath}`;
        }
        catch {
            throw new common_1.InternalServerErrorException('服务端 unzip 命令未找到');
        }
        try {
            if (!(0, fs_1.existsSync)((0, path_1.join)(dirPath, 'mx-space'))) {
                throw new common_1.InternalServerErrorException('备份文件错误, 目录不存在');
            }
            cd(dirPath);
            await $ `mongorestore -h ${app_config_1.MONGO_DB.host || '127.0.0.1'} --port ${app_config_1.MONGO_DB.port || 27017} -d ${app_config_1.MONGO_DB.dbName} ./mx-space --drop  >/dev/null 2>&1`;
        }
        catch (e) {
            this.logger.error(e);
            throw e;
        }
        finally {
            await (0, promises_1.rm)((0, path_1.join)(dirPath, 'mx-space'), { recursive: true, force: true });
        }
        const backupDataDir = (0, path_1.join)(dirPath, 'backup_data');
        const backupDataDirFilenames = await (0, promises_1.readdir)(backupDataDir);
        await Promise.all(backupDataDirFilenames.map(async (filename) => {
            const fullpath = (0, path_1.join)(dirPath, 'backup_data', filename);
            const targetPath = (0, path_1.join)(path_constant_1.DATA_DIR, filename);
            await (0, promises_1.rm)(targetPath, { recursive: true, force: true });
            await $ `cp -r ${fullpath} ${targetPath}`;
        }));
        try {
            const packageJson = await (0, promises_1.readFile)((0, path_1.join)(backupDataDir, 'package.json'), {
                encoding: 'utf-8',
            });
            const pkg = JSON.parse(packageJson);
            if (pkg.dependencies) {
                await Promise.all(Object.entries(pkg.dependencies).map(([name, version]) => {
                    this.logger.log(`--> 安装依赖 ${name}@${version}`);
                    return (0, system_util_1.installPKG)(`${name}@${version}`, path_constant_1.DATA_DIR).catch((er) => {
                        this.logger.error(`--> 依赖安装失败：${er.message}`);
                    });
                }));
            }
        }
        catch (er) { }
        await Promise.all([
            this.cacheService.cleanAllRedisKey(),
            this.cacheService.cleanCatch(),
        ]);
        await (0, promises_1.rm)(backupDataDir, { force: true, recursive: true });
    }
    async rollbackTo(dirname) {
        const bakFilePath = this.checkBackupExist(dirname);
        await this.restore(bakFilePath);
        await this.eventManager.broadcast(business_event_constant_1.BusinessEvents.CONTENT_REFRESH, 'restore_done', {
            scope: business_event_constant_1.EventScope.ALL,
        });
    }
    async deleteBackup(filename) {
        const path = (0, path_1.join)(path_constant_1.BACKUP_DIR, filename);
        if (!(0, fs_1.existsSync)(path)) {
            throw new common_1.BadRequestException('文件不存在');
        }
        await (0, promises_1.rm)(path, { recursive: true });
        return true;
    }
};
BackupService = BackupService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [helper_event_service_1.EventManagerService,
        configs_service_1.ConfigsService,
        cache_service_1.CacheService])
], BackupService);
exports.BackupService = BackupService;
