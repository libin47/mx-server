"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("../../modules/auth/auth.module");
const events_gateway_1 = require("./admin/events.gateway");
const events_gateway_2 = require("./shared/events.gateway");
const events_gateway_3 = require("./system/events.gateway");
const events_gateway_4 = require("./web/events.gateway");
let GatewayModule = class GatewayModule {
};
GatewayModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule],
        providers: [
            events_gateway_1.AdminEventsGateway,
            events_gateway_4.WebEventsGateway,
            events_gateway_2.SharedGateway,
            events_gateway_3.SystemEventsGateway,
        ],
        exports: [
            events_gateway_1.AdminEventsGateway,
            events_gateway_4.WebEventsGateway,
            events_gateway_2.SharedGateway,
            events_gateway_3.SystemEventsGateway,
        ],
    })
], GatewayModule);
exports.GatewayModule = GatewayModule;
