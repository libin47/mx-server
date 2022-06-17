"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionModule = void 0;
const common_1 = require("@nestjs/common");
const gateway_module_1 = require("../../processors/gateway/gateway.module");
const base_option_controller_1 = require("./controllers/base.option.controller");
const email_option_controller_1 = require("./controllers/email.option.controller");
let OptionModule = class OptionModule {
};
OptionModule = __decorate([
    (0, common_1.Module)({
        imports: [gateway_module_1.GatewayModule],
        controllers: [base_option_controller_1.BaseOptionController, email_option_controller_1.EmailOptionController],
    })
], OptionModule);
exports.OptionModule = OptionModule;
