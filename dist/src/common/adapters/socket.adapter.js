"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisIoAdapter = void 0;
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
const redis_adapter_1 = require("@socket.io/redis-adapter");
const redis_subpub_util_1 = require("../../utils/redis-subpub.util");
class RedisIoAdapter extends platform_socket_io_1.IoAdapter {
    createIOServer(port, options) {
        const server = super.createIOServer(port, options);
        const { pubClient, subClient } = redis_subpub_util_1.redisSubPub;
        const redisAdapter = (0, redis_adapter_1.createAdapter)(pubClient, subClient);
        server.adapter(redisAdapter);
        return server;
    }
}
exports.RedisIoAdapter = RedisIoAdapter;
