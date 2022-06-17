import { Cache } from 'cache-manager';
import { Redis } from 'ioredis';
import { RedisSubPub } from '../../utils/redis-subpub.util';
export declare type TCacheKey = string;
export declare type TCacheResult<T> = Promise<T | undefined>;
export declare class CacheService {
    private cache;
    private logger;
    constructor(cache: Cache);
    private get redisClient();
    get<T>(key: TCacheKey): TCacheResult<T>;
    set<T>(key: TCacheKey, value: any, options?: {
        ttl: number;
    }): TCacheResult<T>;
    private _redisSubPub;
    get redisSubPub(): RedisSubPub;
    publish(event: string, data: any): Promise<void>;
    subscribe(event: string, callback: (data: any) => void): Promise<void>;
    unsubscribe(event: string, callback: (data: any) => void): Promise<void>;
    getClient(): Redis;
    cleanCatch(): Promise<void>;
    cleanAllRedisKey(): Promise<void>;
}
