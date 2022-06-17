"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.banInDemo = void 0;
const app_config_1 = require("../app.config");
const ban_in_demo_exception_1 = require("../common/exceptions/ban-in-demo.exception");
const banInDemo = () => {
    if (app_config_1.isInDemoMode) {
        throw new ban_in_demo_exception_1.BanInDemoExcpetion();
    }
};
exports.banInDemo = banInDemo;
