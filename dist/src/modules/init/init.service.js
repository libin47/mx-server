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
var InitService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitService = void 0;
const common_1 = require("@nestjs/common");
const path_constant_1 = require("../../constants/path.constant");
const user_service_1 = require("../user/user.service");
let InitService = InitService_1 = class InitService {
    constructor(userService) {
        this.userService = userService;
        this.logger = new common_1.Logger(InitService_1.name);
    }
    getTempdir() {
        return path_constant_1.TEMP_DIR;
    }
    getDatadir() {
        return path_constant_1.DATA_DIR;
    }
    isInit() {
        return this.userService.hasMaster();
    }
};
InitService = InitService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService])
], InitService);
exports.InitService = InitService;
