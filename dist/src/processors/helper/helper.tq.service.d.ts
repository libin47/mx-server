import { Redis } from 'ioredis';
import { CacheService } from '../cache/cache.service';
declare type ITask = RedisMap<string, {
    status: 'pending' | 'fulfill' | 'reject';
    updatedAt: Date;
    message?: string;
}>;
export declare class TaskQueueService {
    private readonly redis;
    tasks: ITask;
    constructor(redis: CacheService);
    add(name: string, task: () => Promise<any>): void;
    get(name: string): Promise<{
        status: "pending" | "fulfill" | "reject";
        updatedAt: Date;
        message?: string | undefined;
    } | null>;
}
declare class RedisMap<K extends string, V = unknown> {
    private readonly redis;
    private readonly hashName;
    constructor(redis: Redis, hashName: string);
    static key: string;
    get(key: K): Promise<V | null>;
    set(key: K, data: V): Promise<number>;
}
export {};
