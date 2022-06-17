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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageProxyService = void 0;
const linkedom_1 = require("linkedom");
const url_1 = require("url");
const common_1 = require("@nestjs/common");
const package_json_1 = __importDefault(require("../../../package.json"));
const app_config_1 = require("../../app.config");
const configs_service_1 = require("../configs/configs.service");
const init_service_1 = require("../init/init.service");
let PageProxyService = class PageProxyService {
    constructor(configs, initService) {
        this.configs = configs;
        this.initService = initService;
    }
    async checkCanAccessAdminProxy() {
        const { adminExtra } = await this.configs.waitForConfigReady();
        if (!adminExtra.enableAdminProxy && !isDev) {
            return false;
        }
        return true;
    }
    async getAdminLastestVersionFromGHRelease() {
        const { tag_name } = await fetch(`https://api.github.com/repos/${package_json_1.default.dashboard.repo}/releases/latest`).then((data) => data.json());
        return tag_name.replace(/^v/, '');
    }
    async injectAdminEnv(htmlEntry, env) {
        const config = await this.configs.waitForConfigReady();
        const { adminExtra, url: { webUrl }, } = config;
        const { from, BASE_API, GATEWAY } = env;
        return htmlEntry.replace(`<!-- injectable script -->`, `<script>${`window.pageSource='${from !== null && from !== void 0 ? from : 'server'}';\nwindow.injectData = ${JSON.stringify({
            LOGIN_BG: adminExtra.background,
            TITLE: adminExtra.title,
            WEB_URL: webUrl,
            INIT: await this.initService.isInit(),
        })}`}
     ${BASE_API
            ? `window.injectData.BASE_API = '${BASE_API}'`
            : `window.injectData.BASE_API = location.origin + '${!isDev ? `/api/v${app_config_1.API_VERSION}` : ''}';`}
      ${GATEWAY
            ? `window.injectData.GATEWAY = '${GATEWAY}';`
            : `window.injectData.GATEWAY = location.origin;`}
      </script>`);
    }
    rewriteAdminEntryAssetPath(htmlEntry) {
        if (!htmlEntry) {
            throw new common_1.InternalServerErrorException('htmlEntry is empty');
        }
        const dom = (0, linkedom_1.parseHTML)(htmlEntry);
        const window = dom.window;
        const document = window.document;
        const $scripts = document.querySelectorAll('script[src]');
        const $links = document.querySelectorAll('link[href]');
        const urlReplacer = (__url) => {
            let url;
            try {
                const isValidUrl = new url_1.URL(__url);
                url = isValidUrl;
            }
            catch {
                url = new url_1.URL(__url, 'http://localhost');
            }
            return url;
        };
        $scripts.forEach(($script) => {
            const originSrc = $script.src;
            const url = urlReplacer(originSrc);
            $script.src = path.join('/proxy', url.pathname);
        });
        $links.forEach(($link) => {
            const originHref = $link.href;
            const url = urlReplacer(originHref);
            $link.href = path.join('/proxy', url.pathname);
        });
        return dom.document.toString();
    }
    async getUrlFromConfig() {
        const config = await this.configs.waitForConfigReady();
        const url = config.url;
        return {
            BASE_API: url.serverUrl || (isDev ? '/' : '/api/v2'),
            GATEWAY: url.wsUrl || '/',
        };
    }
};
PageProxyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [configs_service_1.ConfigsService,
        init_service_1.InitService])
], PageProxyService);
exports.PageProxyService = PageProxyService;
