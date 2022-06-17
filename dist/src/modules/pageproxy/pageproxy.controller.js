"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageProxyController = void 0;
const openapi = require("@nestjs/swagger");
const fs_1 = require("fs");
const promises_1 = __importDefault(require("fs/promises"));
const lodash_1 = require("lodash");
const mime_types_1 = require("mime-types");
const package_json_1 = __importDefault(require("../../../package.json"));
const path_1 = require("path");
const common_1 = require("@nestjs/common");
const cookie_decorator_1 = require("../../common/decorator/cookie.decorator");
const http_decorator_1 = require("../../common/decorator/http.decorator");
const openapi_decorator_1 = require("../../common/decorator/openapi.decorator");
const cache_constant_1 = require("../../constants/cache.constant");
const path_constant_1 = require("../../constants/path.constant");
const cache_service_1 = require("../../processors/cache/cache.service");
const redis_util_1 = require("../../utils/redis.util");
const package_json_2 = require("../../../package.json");
const pageproxy_dto_1 = require("./pageproxy.dto");
const pageproxy_service_1 = require("./pageproxy.service");
let PageProxyController = class PageProxyController {
    constructor(cacheService, service) {
        this.cacheService = cacheService;
        this.service = service;
    }
    async proxyAdmin(cookies, query, reply) {
        if (query.__local) {
            reply.redirect('/proxy/qaqdmin');
            return;
        }
        if ((await this.service.checkCanAccessAdminProxy()) === false) {
            return reply.type('application/json').status(403).send({
                message: 'admin proxy not enabled',
            });
        }
        const { __apiUrl: apiUrl, __gatewayUrl: gatewayUrl, __onlyGithub: onlyGithub, __debug: debug, __version: adminVersion = package_json_2.dashboard.version, __purge, } = query;
        if (__purge) {
            await this.cacheService.getClient().del((0, redis_util_1.getRedisKey)(cache_constant_1.RedisKeys.AdminPage));
        }
        if (apiUrl) {
            reply.setCookie('__apiUrl', apiUrl, { maxAge: 1000 * 60 * 10 });
        }
        if (gatewayUrl) {
            reply.setCookie('__gatewayUrl', gatewayUrl, { maxAge: 1000 * 60 * 10 });
        }
        if (debug === false) {
            reply.clearCookie('__apiUrl');
            reply.clearCookie('__gatewayUrl');
        }
        const source = await (async () => {
            if (!onlyGithub && typeof adminVersion == 'undefined') {
                const fromRedis = await this.cacheService.get((0, redis_util_1.getRedisKey)(cache_constant_1.RedisKeys.AdminPage));
                if (fromRedis) {
                    return {
                        text: fromRedis,
                        from: 'redis',
                    };
                }
            }
            let latestVersion = '';
            if ((0, lodash_1.isNull)(adminVersion)) {
                try {
                    latestVersion =
                        await this.service.getAdminLastestVersionFromGHRelease();
                }
                catch (e) {
                    reply.type('application/json').status(500).send({
                        message: '从获取 GitHub 获取数据失败, 连接超时',
                    });
                    throw e;
                }
            }
            const v = adminVersion || latestVersion;
            const indexEntryUrl = `https://raw.githubusercontent.com/${package_json_1.default.dashboard.repo}/page_v${v}/index.html`;
            const indexEntryCdnUrl = `https://fastly.jsdelivr.net/gh/${package_json_1.default.dashboard.repo}@page_v${v}/index.html`;
            const tasks = [
                fetch(indexEntryUrl)
                    .then((res) => res.text())
                    .then((text) => ({ text, from: 'github' })),
            ];
            if (!onlyGithub) {
                tasks.push(fetch(indexEntryCdnUrl)
                    .then((res) => res.text())
                    .then((text) => ({ text, from: 'jsdelivr' })));
            }
            return await Promise.any(tasks).catch((e) => {
                const err = '网络连接异常, 所有请求均失败, 无法获取后台入口文件';
                reply.type('application/json').status(500).send({ message: err });
                throw new common_1.InternalServerErrorException(err);
            });
        })();
        await this.cacheService.set((0, redis_util_1.getRedisKey)(cache_constant_1.RedisKeys.AdminPage), source.text, {
            ttl: 10 * 60,
        });
        const sessionInjectableData = debug === false
            ? {}
            : {
                BASE_API: apiUrl !== null && apiUrl !== void 0 ? apiUrl : cookies['__apiUrl'],
                GATEWAY: gatewayUrl !== null && gatewayUrl !== void 0 ? gatewayUrl : cookies['__gatewayUrl'],
            };
        const entry = await this.service.injectAdminEnv(source.text, {
            BASE_API: sessionInjectableData.BASE_API,
            GATEWAY: sessionInjectableData.GATEWAY,
            from: source.from,
        });
        return reply.type('text/html').send(entry);
    }
    async getLocalBundledAdmin(reply) {
        if ((await this.service.checkCanAccessAdminProxy()) === false) {
            return reply.type('application/json').status(403).send({
                message: 'admin proxy not enabled',
            });
        }
        const entryPath = path.join(path_constant_1.LOCAL_ADMIN_ASSET_PATH, 'index.html');
        const isAssetPathIsExist = (0, fs_1.existsSync)(entryPath);
        if (!isAssetPathIsExist) {
            reply.code(404).type('text/html')
                .send(`<p>Local Admin Assets is not found. Navigator to page proxy in 3 second. </p><script>setTimeout(() => {
        location.href = '/qaqdmin'
      }, 3000);</script>`);
            return;
        }
        try {
            const entry = await promises_1.default.readFile(entryPath, 'utf8');
            const injectEnv = await this.service.injectAdminEnv(entry, {
                ...(await this.service.getUrlFromConfig()),
                from: 'server',
            });
            reply
                .type('text/html')
                .send(this.service.rewriteAdminEntryAssetPath(injectEnv));
        }
        catch (e) {
            reply.code(500).send({
                message: e.message,
            });
            isDev && console.error(e);
        }
    }
    async proxyAssetRoute(request, reply) {
        if ((await this.service.checkCanAccessAdminProxy()) === false) {
            return reply.type('application/json').status(403).send({
                message: 'admin proxy not enabled, proxy assets is forbidden',
            });
        }
        const url = request.url;
        const relativePath = url.replace(/^\/proxy\//, '');
        const path = (0, path_1.join)(path_constant_1.LOCAL_ADMIN_ASSET_PATH, relativePath);
        const isPathExist = (0, fs_1.existsSync)(path);
        if (!isPathExist) {
            return reply.code(404).send();
        }
        const isFile = (0, fs_1.statSync)(path).isFile();
        if (!isFile) {
            return reply.type('application/json').code(400).send({
                message: "can't pipe directory",
            });
        }
        const stream = (0, fs_1.createReadStream)(path);
        const minetype = (0, mime_types_1.lookup)((0, path_1.extname)(path));
        reply.header('cache-control', 'public, max-age=31536000');
        reply.header('expires', new Date(Date.now() + 31536000 * 1000).toUTCString());
        if (minetype) {
            reply.type(minetype).send(stream);
        }
        else {
            reply.send(stream);
        }
    }
};
__decorate([
    (0, common_1.Get)('/qaqdmin'),
    http_decorator_1.HTTPDecorators.Bypass,
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, cookie_decorator_1.Cookies)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pageproxy_dto_1.PageProxyDebugDto, Object]),
    __metadata("design:returntype", Promise)
], PageProxyController.prototype, "proxyAdmin", null);
__decorate([
    (0, common_1.Get)('/proxy/qaqdmin'),
    http_decorator_1.HTTPDecorators.Bypass,
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PageProxyController.prototype, "getLocalBundledAdmin", null);
__decorate([
    (0, common_1.Get)('/proxy/*'),
    http_decorator_1.HTTPDecorators.Bypass,
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PageProxyController.prototype, "proxyAssetRoute", null);
PageProxyController = __decorate([
    (0, common_1.Controller)('/'),
    openapi_decorator_1.ApiName,
    __metadata("design:paramtypes", [cache_service_1.CacheService,
        pageproxy_service_1.PageProxyService])
], PageProxyController);
exports.PageProxyController = PageProxyController;
