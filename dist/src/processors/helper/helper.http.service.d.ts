import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { CacheService } from '../cache/cache.service';
declare module 'axios' {
    interface AxiosRequestConfig {
        __requestStartedAt?: number;
        __requestEndedAt?: number;
        __requestDuration?: number;
        __debugLogger?: boolean;
    }
}
export declare class HttpService {
    private readonly cacheService;
    private http;
    private logger;
    constructor(cacheService: CacheService);
    private axiosDefaultConfig;
    extend(config: AxiosRequestConfig<any>): AxiosInstance;
    getAndCacheRequest(url: string): Promise<any>;
    get axiosRef(): AxiosInstance;
    private bindDebugVerboseInterceptor;
    private bindInterceptors;
    private prettyStringify;
}
