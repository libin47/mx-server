import { AxiosRequestConfig } from 'axios';
export declare const isDev: boolean;
export declare const isTest: boolean;
export declare const cwd: string;
export declare const PORT: any;
export declare const API_VERSION = 2;
export declare const isInDemoMode: any;
export declare const CROSS_DOMAIN: {
    allowedOrigins: any;
};
export declare const MONGO_DB: {
    dbName: any;
    host: any;
    port: any;
    readonly uri: string;
};
export declare const REDIS: {
    host: any;
    port: any;
    password: any;
    ttl: null;
    httpCacheTTL: number;
    max: number;
    disableApiCache: any;
};
export declare const AXIOS_CONFIG: AxiosRequestConfig;
export declare const SECURITY: {
    jwtSecret: any;
    jwtExpire: string;
    skipAuth: boolean;
};
export declare const CLUSTER: {
    enable: any;
    workers: any;
};
export declare const isMainCluster: boolean | "" | undefined;
export declare const isMainProcess: boolean | "" | undefined;
export declare const DEBUG_MODE: {
    httpRequestVerbose: any;
};
