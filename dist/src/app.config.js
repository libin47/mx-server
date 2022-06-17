"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEBUG_MODE = exports.isMainProcess = exports.isMainCluster = exports.CLUSTER = exports.SECURITY = exports.AXIOS_CONFIG = exports.REDIS = exports.MONGO_DB = exports.CROSS_DOMAIN = exports.isInDemoMode = exports.API_VERSION = exports.PORT = exports.cwd = exports.isTest = exports.isDev = void 0;
const cluster_1 = __importDefault(require("cluster"));
const zx_cjs_1 = require("zx-cjs");
exports.isDev = process.env.NODE_ENV == 'development';
exports.isTest = !!process.env.TEST;
exports.cwd = process.cwd();
exports.PORT = zx_cjs_1.argv.port || process.env.PORT || 2333;
exports.API_VERSION = 2;
exports.isInDemoMode = zx_cjs_1.argv.demo || false;
exports.CROSS_DOMAIN = {
    allowedOrigins: zx_cjs_1.argv.allowed_origins
        ? (_b = (_a = zx_cjs_1.argv.allowed_origins) === null || _a === void 0 ? void 0 : _a.split) === null || _b === void 0 ? void 0 : _b.call(_a, ',')
        : [
            'localhost:9528',
            'localhost:9529',
            'localhost:2323',
            'localhost:2333',
            '127.0.0.1:2323',
            '127.0.0.1:2333',
            '127.0.0.1:9528',
            '127.0.0.1:9529',
            '119.91.218.90:9529',
            '119.91.218.90:9528',
            'wind-watcher.cn',
            'www.wind-watcher.cn',
            'server.wind-watcher.cn',
        ],
};
exports.MONGO_DB = {
    dbName: zx_cjs_1.argv.collection_name || (exports.isInDemoMode ? 'mx-space_demo' : 'mx-space'),
    host: zx_cjs_1.argv.db_host || '127.0.0.1',
    port: zx_cjs_1.argv.db_port || 27017,
    get uri() {
        return `mongodb://${this.host}:${this.port}/${exports.isTest ? 'mx-space_unitest' : this.dbName}`;
    },
};
exports.REDIS = {
    host: zx_cjs_1.argv.redis_host || 'localhost',
    port: zx_cjs_1.argv.redis_port || 6379,
    password: zx_cjs_1.argv.redis_password || null,
    ttl: null,
    httpCacheTTL: 5,
    max: 5,
    disableApiCache: (exports.isDev || zx_cjs_1.argv.disable_cache) && !process.env['ENABLE_CACHE_DEBUG'],
};
exports.AXIOS_CONFIG = {
    timeout: 10000,
};
exports.SECURITY = {
    jwtSecret: zx_cjs_1.argv.jwt_secret || zx_cjs_1.argv.jwtSecret,
    jwtExpire: '7d',
    skipAuth: exports.isTest ? true : false,
};
exports.CLUSTER = {
    enable: (_c = zx_cjs_1.argv.cluster) !== null && _c !== void 0 ? _c : false,
    workers: zx_cjs_1.argv.cluster_workers,
};
exports.isMainCluster = process.env.NODE_APP_INSTANCE && parseInt(process.env.NODE_APP_INSTANCE) === 0;
exports.isMainProcess = cluster_1.default.isPrimary || exports.isMainCluster;
exports.DEBUG_MODE = {
    httpRequestVerbose: (_e = (_d = zx_cjs_1.argv.httpRequestVerbose) !== null && _d !== void 0 ? _d : zx_cjs_1.argv.http_request_verbose) !== null && _e !== void 0 ? _e : true,
};
if (!exports.CLUSTER.enable || cluster_1.default.isPrimary || exports.isMainCluster) {
    console.log(zx_cjs_1.argv);
    console.log('cwd: ', exports.cwd);
}
