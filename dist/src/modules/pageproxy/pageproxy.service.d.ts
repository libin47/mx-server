import { ConfigsService } from '../configs/configs.service';
import { InitService } from '../init/init.service';
export declare class PageProxyService {
    private readonly configs;
    private readonly initService;
    constructor(configs: ConfigsService, initService: InitService);
    checkCanAccessAdminProxy(): Promise<boolean>;
    getAdminLastestVersionFromGHRelease(): Promise<string>;
    injectAdminEnv(htmlEntry: string, env: {
        from?: string;
        BASE_API?: string;
        GATEWAY?: string;
        [key: string]: string | undefined;
    }): Promise<string>;
    rewriteAdminEntryAssetPath(htmlEntry: string): string;
    getUrlFromConfig(): Promise<{
        BASE_API: string;
        GATEWAY: string;
    }>;
}
export interface IInjectableData {
    BASE_API: null | string;
    WEB_URL: null | string;
    GATEWAY: null | string;
    LOGIN_BG: null | string;
    TITLE: null | string;
    INIT: null | boolean;
}
