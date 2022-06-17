"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerStdLogger = exports.consola = exports.getTodayLogFilePath = void 0;
const consola_1 = __importStar(require("consola"));
const cron_1 = require("cron");
const fs_1 = require("fs");
const path_1 = require("path");
const zx_cjs_1 = require("zx-cjs");
const schedule_1 = require("@nestjs/schedule");
const path_constant_1 = require("../constants/path.constant");
const redis_subpub_util_1 = require("../utils/redis-subpub.util");
const time_util_1 = require("../utils/time.util");
const env_global_1 = require("./env.global");
const getTodayLogFilePath = () => (0, path_1.resolve)(path_constant_1.LOG_DIR, `stdout_${(0, time_util_1.getShortDate)(new Date())}.log`);
exports.getTodayLogFilePath = getTodayLogFilePath;
class Reporter extends consola_1.FancyReporter {
    constructor() {
        super(...arguments);
        this.isInVirtualTerminal = typeof process.stdout.columns === 'undefined';
    }
    formatDate(date) {
        return this.isInVirtualTerminal ? '' : super.formatDate(date);
    }
    formatLogObj() {
        return this.isInVirtualTerminal
            ? `${chalk.gray((0, time_util_1.getShortTime)(new Date()))} ${super.formatLogObj
                .apply(this, arguments)
                .replace(/^\n/, '')}`.trimEnd()
            : super.formatLogObj.apply(this, arguments);
    }
}
exports.consola = consola_1.default.create({
    reporters: [new Reporter()],
    level: env_global_1.isDev || zx_cjs_1.argv.verbose ? consola_1.LogLevel.Trace : consola_1.LogLevel.Info,
});
function registerStdLogger() {
    let logStream = (0, fs_1.createWriteStream)((0, exports.getTodayLogFilePath)(), {
        encoding: 'utf-8',
        flags: 'a+',
    });
    logStream.write('\n========================================================\n');
    const job = new cron_1.CronJob(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT, () => {
        logStream.destroy();
        logStream = (0, fs_1.createWriteStream)((0, exports.getTodayLogFilePath)(), {
            encoding: 'utf-8',
            flags: 'a+',
        });
        logStream.write('\n========================================================\n');
    });
    job.start();
    const stdout = process.stdout.write;
    const stderr = process.stderr.write;
    function log(data) {
        if (env_global_1.isTest) {
            return;
        }
        logStream.write(data);
        redis_subpub_util_1.redisSubPub.publish('log', data);
    }
    process.stdout.write = function () {
        log(arguments[0]);
        return stdout.apply(this, arguments);
    };
    process.stderr.write = function () {
        log(arguments[0]);
        return stderr.apply(this, arguments);
    };
    exports.consola.wrapAll();
    Object.defineProperty(process.stdout, 'write', {
        value: process.stdout.write,
        writable: false,
        configurable: false,
    });
    Object.defineProperty(process.stderr, 'write', {
        value: process.stdout.write,
        writable: false,
        configurable: false,
    });
}
exports.registerStdLogger = registerStdLogger;
