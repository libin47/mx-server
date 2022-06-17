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
exports.RolesGuard = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../../modules/auth/auth.service");
const configs_service_1 = require("../../modules/configs/configs.service");
const get_req_transformer_1 = require("../../transformers/get-req.transformer");
const auth_guard_1 = require("./auth.guard");
let RolesGuard = class RolesGuard extends auth_guard_1.AuthGuard {
    constructor(authService, configs) {
        super(authService, configs);
        this.authService = authService;
        this.configs = configs;
    }
    async canActivate(context) {
        const request = this.getRequest(context);
        let isMaster = false;
        try {
            await super.canActivate(context);
            isMaster = true;
        }
        catch { }
        request.isGuest = !isMaster;
        request.isMaster = isMaster;
        return true;
    }
    getRequest(context) {
        return (0, get_req_transformer_1.getNestExecutionContextRequest)(context);
    }
};
RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        configs_service_1.ConfigsService])
], RolesGuard);
exports.RolesGuard = RolesGuard;
