"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageProxyModule = void 0;
const common_1 = require("@nestjs/common");
const init_module_1 = require("../init/init.module");
const pageproxy_controller_1 = require("./pageproxy.controller");
const pageproxy_service_1 = require("./pageproxy.service");
let PageProxyModule = class PageProxyModule {
};
PageProxyModule = __decorate([
    (0, common_1.Module)({
        controllers: [pageproxy_controller_1.PageProxyController],
        providers: [pageproxy_service_1.PageProxyService],
        imports: [init_module_1.InitModule],
    })
], PageProxyModule);
exports.PageProxyModule = PageProxyModule;
