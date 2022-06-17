"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cluster = void 0;
const cluster_1 = __importDefault(require("cluster"));
const os_1 = __importDefault(require("os"));
class Cluster {
    static register(workers, callback) {
        if (cluster_1.default.isPrimary) {
            const cpus = os_1.default.cpus().length;
            consola.info(`Primary server started on ${process.pid}`);
            consola.info(`CPU:${cpus}`);
            process.on('SIGINT', () => {
                var _a;
                consola.info('Cluster shutting down...');
                for (const id in cluster_1.default.workers) {
                    (_a = cluster_1.default.workers[id]) === null || _a === void 0 ? void 0 : _a.kill();
                }
                process.exit(0);
            });
            if (workers > cpus)
                workers = cpus;
            for (let i = 0; i < workers; i++) {
                cluster_1.default.fork();
            }
            cluster_1.default.on('fork', (worker) => {
                worker.on('message', (msg) => {
                    cluster_1.default.workers &&
                        Object.keys(cluster_1.default.workers).forEach((id) => {
                            var _a, _b;
                            (_b = (_a = cluster_1.default.workers) === null || _a === void 0 ? void 0 : _a[id]) === null || _b === void 0 ? void 0 : _b.send(msg);
                        });
                });
            });
            cluster_1.default.on('online', (worker) => {
                consola.info('Worker %s is online', worker.process.pid);
            });
            cluster_1.default.on('exit', (worker, code, signal) => {
                if (code !== 0) {
                    consola.info(`Worker ${worker.process.pid} died. Restarting`);
                    cluster_1.default.fork();
                }
            });
        }
        else {
            callback();
        }
    }
}
exports.Cluster = Cluster;
