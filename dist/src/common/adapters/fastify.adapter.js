"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fastifyApp = void 0;
const cookie_1 = __importDefault(require("@fastify/cookie"));
const multipart_1 = __importDefault(require("@fastify/multipart"));
const common_1 = require("@nestjs/common");
const platform_fastify_1 = require("@nestjs/platform-fastify");
const utils_1 = require("../../utils");
const app = new platform_fastify_1.FastifyAdapter({
    trustProxy: true,
});
exports.fastifyApp = app;
app.register(multipart_1.default, {
    limits: {
        fields: 10,
        fileSize: 1024 * 1024 * 6,
        files: 5,
    },
});
app.getInstance().addHook('onRequest', (request, reply, done) => {
    const origin = request.headers.origin;
    if (!origin) {
        request.headers.origin = request.headers.host;
    }
    const url = request.url;
    const ua = request.raw.headers['user-agent'];
    if (url.endsWith('.php')) {
        reply.raw.statusMessage =
            'Eh. PHP is not support on this machine. Yep, I also think PHP is bestest programming language. But for me it is beyond my reach.';
        logWarn('PHP 是世界上最好的语言！！！！！', request, 'GodPHP');
        return reply.code(418).send();
    }
    else if (url.match(/\/(adminer|admin|wp-login|phpMyAdmin|\.env)$/gi)) {
        const isMxSpaceClient = ua === null || ua === void 0 ? void 0 : ua.match('mx-space');
        reply.raw.statusMessage = 'Hey, What the fuck are you doing!';
        reply.raw.statusCode = isMxSpaceClient ? 666 : 200;
        logWarn('注意了，有人正在搞渗透，让我看看是谁，是哪个小坏蛋这么不听话。\n', request, 'Security');
        return reply.send('Check request header to find an egg.');
    }
    if (url.match(/favicon\.ico$/) || url.match(/manifest\.json$/)) {
        return reply.code(204).send();
    }
    done();
});
app.register(cookie_1.default, {
    secret: 'cookie-secret',
});
const logWarn = (desc, req, context) => {
    const ua = req.raw.headers['user-agent'];
    common_1.Logger.warn(`${desc}\n` +
        `Path: ${req.url}\n` +
        `IP: ${(0, utils_1.getIp)(req)}\n` +
        `UA: ${ua}`, 'GodPHP');
};
