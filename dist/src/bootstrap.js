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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrap = void 0;
const cluster_1 = __importDefault(require("cluster"));
const perf_hooks_1 = require("perf_hooks");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_config_1 = require("./app.config");
const app_module_1 = require("./app.module");
const fastify_adapter_1 = require("./common/adapters/fastify.adapter");
const socket_adapter_1 = require("./common/adapters/socket.adapter");
const spider_guard_1 = require("./common/guard/spider.guard");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
const env_global_1 = require("./global/env.global");
const logger_service_1 = require("./processors/logger/logger.service");
const Origin = Array.isArray(app_config_1.CROSS_DOMAIN.allowedOrigins)
    ? app_config_1.CROSS_DOMAIN.allowedOrigins
    : false;
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, fastify_adapter_1.fastifyApp, {
        logger: ['error'].concat(isDev ? ['debug'] : []),
    });
    const hosts = Origin && Origin.map((host) => new RegExp(host, 'i'));
    app.enableCors(hosts
        ? {
            origin: (origin, callback) => {
                const allow = hosts.some((host) => host.test(origin));
                callback(null, allow);
            },
            credentials: true,
        }
        : undefined);
    app.setGlobalPrefix(isDev ? '' : `api/v${app_config_1.API_VERSION}`, {
        exclude: [
            { path: '/qaqdmin', method: common_1.RequestMethod.GET },
            { path: '/proxy/qaqdmin', method: common_1.RequestMethod.GET },
            { path: '/proxy/*', method: common_1.RequestMethod.GET },
        ],
    });
    if (isDev) {
        app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor());
    }
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        errorHttpStatusCode: 422,
        forbidUnknownValues: true,
        enableDebugMessages: isDev,
        stopAtFirstError: true,
    }));
    app.useGlobalGuards(new spider_guard_1.SpiderGuard());
    !env_global_1.isTest && app.useWebSocketAdapter(new socket_adapter_1.RedisIoAdapter(app));
    if (isDev) {
        const { DocumentBuilder, SwaggerModule } = await Promise.resolve().then(() => __importStar(require('@nestjs/swagger')));
        const options = new DocumentBuilder()
            .setTitle('API')
            .setDescription('The blog API description')
            .setVersion(`${app_config_1.API_VERSION}`)
            .addSecurity('bearer', {
            type: 'http',
            scheme: 'bearer',
        })
            .addBearerAuth()
            .build();
        const document = SwaggerModule.createDocument(app, options);
        SwaggerModule.setup('api-docs', app, document);
    }
    await app.listen(+app_config_1.PORT, '0.0.0.0', async () => {
        app.useLogger(app.get(logger_service_1.MyLogger));
        consola.info('ENV:', process.env.NODE_ENV);
        const url = await app.getUrl();
        const pid = process.pid;
        const env = cluster_1.default.isPrimary;
        const prefix = env ? 'P' : 'W';
        if (!app_config_1.isMainProcess) {
            return;
        }
        if (isDev) {
            consola.debug(`[${prefix + pid}] OpenApi: ${url}/api-docs`);
        }
        consola.success(`[${prefix + pid}] Server listen on: ${url}`);
        consola.success(`[${prefix + pid}] Admin Dashboard: ${url}/qaqdmin`);
        consola.success(`[${prefix + pid}] Admin Local Dashboard: ${url}/proxy/qaqdmin`);
        common_1.Logger.log(`Server is up. ${chalk.yellow(`+${perf_hooks_1.performance.now() | 0}ms`)}`);
    });
    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}
exports.bootstrap = bootstrap;
