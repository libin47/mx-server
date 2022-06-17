"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTest = exports.cwd = exports.isDev = void 0;
var app_config_1 = require("../app.config");
Object.defineProperty(exports, "isDev", { enumerable: true, get: function () { return app_config_1.isDev; } });
Object.defineProperty(exports, "cwd", { enumerable: true, get: function () { return app_config_1.cwd; } });
Object.defineProperty(exports, "isTest", { enumerable: true, get: function () { return app_config_1.isTest; } });
