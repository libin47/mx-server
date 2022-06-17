"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NODE_REQUIRE_PATH = exports.LOCAL_ADMIN_ASSET_PATH = exports.BACKUP_DIR = exports.STATIC_FILE_DIR = exports.LOG_DIR = exports.USER_ASSET_DIR = exports.DATA_DIR = exports.TEMP_DIR = exports.HOME = void 0;
const os_1 = require("os");
const path_1 = require("path");
const env_global_1 = require("../global/env.global");
exports.HOME = (0, os_1.homedir)();
exports.TEMP_DIR = env_global_1.isDev ? (0, path_1.join)(env_global_1.cwd, './tmp') : '/tmp/mx-space';
exports.DATA_DIR = env_global_1.isDev ? (0, path_1.join)(env_global_1.cwd, './tmp') : (0, path_1.join)(exports.HOME, '.mx-space');
exports.USER_ASSET_DIR = (0, path_1.join)(exports.DATA_DIR, 'assets');
exports.LOG_DIR = (0, path_1.join)(exports.DATA_DIR, 'log');
exports.STATIC_FILE_DIR = (0, path_1.join)(exports.DATA_DIR, 'static');
exports.BACKUP_DIR = !env_global_1.isDev
    ? (0, path_1.join)(exports.DATA_DIR, 'backup')
    : (0, path_1.join)(exports.TEMP_DIR, 'backup');
exports.LOCAL_ADMIN_ASSET_PATH = env_global_1.isDev
    ? (0, path_1.join)(exports.DATA_DIR, 'admin')
    : (0, path_1.join)(env_global_1.cwd, './admin');
exports.NODE_REQUIRE_PATH = (0, path_1.join)(exports.DATA_DIR, 'node_modules');
