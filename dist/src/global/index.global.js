"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const cluster_1 = __importDefault(require("cluster"));
const fs_1 = require("fs");
require("zx-cjs/globals");
const common_1 = require("@nestjs/common");
const app_config_1 = require("../app.config");
const path_constant_1 = require("../constants/path.constant");
const consola_global_1 = require("./consola.global");
require("./dayjs.global");
const env_global_1 = require("./env.global");
const json_global_1 = require("./json.global");
function mkdirs() {
    if (!app_config_1.CLUSTER.enable || cluster_1.default.isPrimary) {
        (0, fs_1.mkdirSync)(path_constant_1.DATA_DIR, { recursive: true });
        common_1.Logger.log(chalk.blue(`数据目录已经建好: ${path_constant_1.DATA_DIR}`));
        (0, fs_1.mkdirSync)(path_constant_1.TEMP_DIR, { recursive: true });
        common_1.Logger.log(chalk.blue(`临时目录已经建好: ${path_constant_1.TEMP_DIR}`));
        (0, fs_1.mkdirSync)(path_constant_1.LOG_DIR, { recursive: true });
        common_1.Logger.log(chalk.blue(`日志目录已经建好: ${path_constant_1.LOG_DIR}`));
        (0, fs_1.mkdirSync)(path_constant_1.USER_ASSET_DIR, { recursive: true });
        common_1.Logger.log(chalk.blue(`资源目录已经建好: ${path_constant_1.USER_ASSET_DIR}`));
        (0, fs_1.mkdirSync)(path_constant_1.STATIC_FILE_DIR, { recursive: true });
        common_1.Logger.log(chalk.blue(`文件存放目录已经建好: ${path_constant_1.STATIC_FILE_DIR}`));
    }
}
function registerGlobal() {
    $.verbose = env_global_1.isDev;
    Object.assign(globalThis, {
        isDev: env_global_1.isDev,
        consola: consola_global_1.consola,
        cwd: env_global_1.cwd,
    });
    console.debug = (...rest) => {
        if (env_global_1.isDev) {
            consola_global_1.consola.log.call(console, ...rest);
        }
    };
}
function register() {
    (0, consola_global_1.registerStdLogger)();
    mkdirs();
    registerGlobal();
    (0, json_global_1.registerJSONGlobal)();
}
exports.register = register;
