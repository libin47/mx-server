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
exports.HealthController = void 0;
const openapi = require("@nestjs/swagger");
const lodash_1 = require("lodash");
const path_1 = require("path");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const schedule_1 = require("@nestjs/schedule");
const auth_decorator_1 = require("../../common/decorator/auth.decorator");
const demo_decorator_1 = require("../../common/decorator/demo.decorator");
const http_decorator_1 = require("../../common/decorator/http.decorator");
const openapi_decorator_1 = require("../../common/decorator/openapi.decorator");
const meta_constant_1 = require("../../constants/meta.constant");
const path_constant_1 = require("../../constants/path.constant");
const system_constant_1 = require("../../constants/system.constant");
const consola_global_1 = require("../../global/consola.global");
const helper_cron_service_1 = require("../../processors/helper/helper.cron.service");
const helper_tq_service_1 = require("../../processors/helper/helper.tq.service");
const utils_1 = require("../../utils");
const health_dto_1 = require("./health.dto");
let HealthController = class HealthController {
    constructor(schedulerRegistry, cronService, reflector, taskQueue) {
        this.schedulerRegistry = schedulerRegistry;
        this.cronService = cronService;
        this.reflector = reflector;
        this.taskQueue = taskQueue;
    }
    async getAllCron() {
        const cron = Object.getPrototypeOf(this.cronService);
        const keys = Object.getOwnPropertyNames(cron).slice(1);
        const map = {};
        for (const key of keys) {
            const method = cron[key];
            if (!(0, lodash_1.isFunction)(method)) {
                continue;
            }
            const options = this.reflector.get(system_constant_1.SCHEDULE_CRON_OPTIONS, method);
            const description = this.reflector.get(meta_constant_1.CRON_DESCRIPTION, method) || '';
            const job = this.schedulerRegistry.getCronJob(options.name);
            map[key] = {
                ...options,
                description,
                lastDate: (job === null || job === void 0 ? void 0 : job.lastDate()) || null,
                nextDate: (job === null || job === void 0 ? void 0 : job.nextDate()) || null,
                status: (job === null || job === void 0 ? void 0 : job.running) ? 'running' : 'stopped',
            };
        }
        return map;
    }
    async runCron(name) {
        if (!(0, lodash_1.isString)(name)) {
            throw new common_1.UnprocessableEntityException('name must be string');
        }
        const cron = Object.getPrototypeOf(this.cronService);
        const keys = Object.getOwnPropertyNames(cron).slice(1);
        const hasMethod = keys.find((key) => key === name);
        if (!hasMethod) {
            throw new common_1.BadRequestException(`${name} is not a cron`);
        }
        this.taskQueue.add(name, async () => this.cronService[name].call(this.cronService));
    }
    async getCronTaskStatus(name) {
        if (!(0, lodash_1.isString)(name)) {
            throw new common_1.BadRequestException('name must be string');
        }
        const task = await this.taskQueue.get(name);
        if (!task) {
            throw new common_1.BadRequestException(`${name} is not a cron in task queue`);
        }
        return task;
    }
    async getPM2List(params) {
        const { type } = params;
        let logDir;
        switch (type) {
            case 'native':
                logDir = path_constant_1.LOG_DIR;
                break;
            case 'pm2':
                logDir = (0, path_1.resolve)(os.homedir(), '.pm2', 'logs');
                break;
        }
        if (!fs.pathExistsSync(logDir)) {
            throw new common_1.BadRequestException('log dir not exists');
        }
        const files = await fs.readdir(logDir);
        const allFile = [];
        switch (type) {
            case 'pm2':
                for (const file of files) {
                    if (file.startsWith('mx-server-') && file.endsWith('.log')) {
                        allFile.push(file);
                    }
                }
                break;
            case 'native':
                allFile.push(...files);
                break;
        }
        const res = [];
        for (const [i, file] of Object.entries(allFile)) {
            const byteSize = fs.statSync(path.join(logDir, file)).size;
            const size = (0, utils_1.formatByteSize)(byteSize);
            let index;
            let _type;
            switch (type) {
                case 'pm2':
                    _type = file.split('-')[2].split('.')[0];
                    index = parseInt(file.split('-')[3], 10) || 0;
                    break;
                case 'native':
                    _type = 'log';
                    index = +i;
                    break;
            }
            res.push({ size, filename: file, index, type: _type });
        }
        return res;
    }
    async getLog(query, params, reply) {
        const { type: logType } = params;
        let stream;
        switch (logType) {
            case 'pm2': {
                const { index, type = 'out', filename: __filename } = query;
                const logDir = (0, path_1.resolve)(os.homedir(), '.pm2', 'logs');
                if (!fs.pathExistsSync(logDir)) {
                    throw new common_1.BadRequestException('log dir not exists');
                }
                const filename = __filename !== null && __filename !== void 0 ? __filename : `mx-server-${type}${index === 0 ? '' : `-${index}`}.log`;
                const logPath = path.join(logDir, filename);
                if (!fs.existsSync(logPath)) {
                    throw new common_1.BadRequestException('log file not exists');
                }
                stream = fs.createReadStream(logPath, {
                    encoding: 'utf8',
                });
                break;
            }
            case 'native': {
                const { filename } = query;
                const logDir = path_constant_1.LOG_DIR;
                if (!filename) {
                    throw new common_1.UnprocessableEntityException('filename must be string');
                }
                stream = fs.createReadStream(path.join(logDir, filename), {
                    encoding: 'utf-8',
                });
                break;
            }
        }
        reply.type('text/plain');
        reply.send(stream);
    }
    async deleteLog(params, query) {
        const { type } = params;
        const { filename } = query;
        switch (type) {
            case 'native': {
                const logPath = path.join(path_constant_1.LOG_DIR, filename);
                const todayLogFile = (0, consola_global_1.getTodayLogFilePath)();
                if (logPath.endsWith('error.log') || todayLogFile === logPath) {
                    await fs.writeFile(logPath, '', { encoding: 'utf8', flag: 'w' });
                    break;
                }
                await fs.rm(logPath);
                break;
            }
            case 'pm2': {
                const logDir = (0, path_1.resolve)(os.homedir(), '.pm2', 'logs');
                if (!fs.pathExistsSync(logDir)) {
                    throw new common_1.BadRequestException('log dir not exists');
                }
                await fs.rm(path.join(logDir, filename));
                break;
            }
        }
    }
};
__decorate([
    (0, common_1.Get)('/cron'),
    http_decorator_1.HTTPDecorators.Bypass,
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "getAllCron", null);
__decorate([
    (0, common_1.Post)('/cron/run/:name'),
    demo_decorator_1.BanInDemo,
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "runCron", null);
__decorate([
    (0, common_1.Get)('/cron/task/:name'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "getCronTaskStatus", null);
__decorate([
    (0, common_1.Get)('/log/list/:type'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [health_dto_1.LogTypeDto]),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "getPM2List", null);
__decorate([
    (0, common_1.Get)('/log/:type'),
    http_decorator_1.HTTPDecorators.Bypass,
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [health_dto_1.LogQueryDto,
        health_dto_1.LogTypeDto, Object]),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "getLog", null);
__decorate([
    (0, common_1.Delete)('/log/:type'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [health_dto_1.LogTypeDto, health_dto_1.LogQueryDto]),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "deleteLog", null);
HealthController = __decorate([
    (0, common_1.Controller)({
        path: 'health',
    }),
    (0, auth_decorator_1.Auth)(),
    openapi_decorator_1.ApiName,
    __metadata("design:paramtypes", [schedule_1.SchedulerRegistry,
        helper_cron_service_1.CronService,
        core_1.Reflector,
        helper_tq_service_1.TaskQueueService])
], HealthController);
exports.HealthController = HealthController;
