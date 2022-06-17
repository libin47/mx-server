"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyLogger = void 0;
const cluster_1 = __importDefault(require("cluster"));
const perf_hooks_1 = require("perf_hooks");
const common_1 = require("@nestjs/common");
class MyLogger extends common_1.ConsoleLogger {
    constructor(context, options) {
        super(context, options);
        this.lastTimestampAt = perf_hooks_1.performance.now() | 0;
        this.defaultContextPrefix = this.context
            ? `[${chalk.yellow(this.context)}] `
            : `[${chalk.hex('#fd79a8')('System')}] `;
    }
    _getColorByLogLevel(logLevel) {
        switch (logLevel) {
            case 'debug':
                return chalk.magentaBright;
            case 'warn':
                return chalk.yellow;
            case 'error':
                return chalk.red;
            case 'verbose':
                return chalk.cyanBright;
            default:
                return chalk.green;
        }
    }
    _updateAndGetTimestampDiff() {
        const includeTimestamp = this.lastTimestampAt && this.options.timestamp;
        const now = perf_hooks_1.performance.now() | 0;
        const result = includeTimestamp
            ? chalk.yellow(` +${now - this.lastTimestampAt}ms`)
            : '';
        this.lastTimestampAt = now;
        return result;
    }
    formatMessage(message, logLevel = 'log') {
        const formatMessage = typeof message == 'string'
            ? this._getColorByLogLevel(logLevel)(message)
            : message;
        return formatMessage;
    }
    log(message, context, ...argv) {
        this.print('info', message, context, ...argv);
    }
    warn(message, context, ...argv) {
        this.print('warn', message, context, ...argv);
    }
    debug(message, context, ...argv) {
        this.print('debug', message, context, ...argv);
    }
    verbose(message, context, ...argv) {
        this.print('verbose', message, context, ...argv);
    }
    error(message, context, ...argv) {
        const trace = context;
        const _context = argv[0];
        if (!trace && _context) {
            this.print('error', message, _context, ...argv.slice(1));
        }
        else {
            this.print('error', message, context, ...argv);
        }
    }
    print(level, message, context, ...argv) {
        const print = consola[level];
        const formatMessage = this.formatMessage(message, level);
        const diff = this._updateAndGetTimestampDiff();
        const workerPrefix = cluster_1.default.isWorker
            ? chalk.hex('#fab1a0')(`*Worker - ${cluster_1.default.worker.id}*`)
            : '';
        if (context && !argv.length) {
            print(`${workerPrefix} [${chalk.yellow(context)}] `, formatMessage, diff);
        }
        else if (!argv.length) {
            print(`${workerPrefix} ${this.defaultContextPrefix}`, formatMessage, diff);
        }
        else {
            print(`${workerPrefix} ${this.defaultContextPrefix}`, message, context, ...argv, diff);
        }
    }
}
exports.MyLogger = MyLogger;
