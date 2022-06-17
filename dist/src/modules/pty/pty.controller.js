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
exports.PTYController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const auth_decorator_1 = require("../../common/decorator/auth.decorator");
const openapi_decorator_1 = require("../../common/decorator/openapi.decorator");
const pty_service_1 = require("./pty.service");
let PTYController = class PTYController {
    constructor(service) {
        this.service = service;
    }
    async getPtyLoginRecord() {
        return this.service.getLoginRecord();
    }
};
__decorate([
    (0, common_1.Get)('/record'),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PTYController.prototype, "getPtyLoginRecord", null);
PTYController = __decorate([
    openapi_decorator_1.ApiName,
    (0, auth_decorator_1.Auth)(),
    (0, common_1.Controller)({ path: 'pty' }),
    __metadata("design:paramtypes", [pty_service_1.PTYService])
], PTYController);
exports.PTYController = PTYController;
