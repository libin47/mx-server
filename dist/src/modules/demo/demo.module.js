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
exports.DemoModule = void 0;
const path_1 = require("path");
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const helper_asset_service_1 = require("../../processors/helper/helper.asset.service");
const backup_module_1 = require("../backup/backup.module");
const backup_service_1 = require("../backup/backup.service");
let DemoModule = class DemoModule {
    constructor(backupService, assetService) {
        this.backupService = backupService;
        this.assetService = assetService;
        this.reset();
    }
    reset() {
        this.backupService.restore((0, path_1.resolve)(this.assetService.embedAssetPath, 'demo-data.zip'));
    }
};
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_1AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DemoModule.prototype, "reset", null);
DemoModule = __decorate([
    (0, common_1.Module)({
        imports: [backup_module_1.BackupModule],
    }),
    __metadata("design:paramtypes", [backup_service_1.BackupService,
        helper_asset_service_1.AssetService])
], DemoModule);
exports.DemoModule = DemoModule;
