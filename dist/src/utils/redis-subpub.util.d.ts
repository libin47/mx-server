import { Redis } from 'ioredis';
declare class RedisSubPub {
    private channelPrefix;
    pubClient: Redis;
    subClient: Redis;
    constructor(channelPrefix?: string);
    init(): void;
    publish(event: string, data: any): Promise<void>;
    ctc: WeakMap<Function, Callback>;
    subscribe(event: string, callback: (data: any) => void): Promise<void>;
    unsubscribe(event: string, callback: (data: any) => void): Promise<void>;
}
export declare const redisSubPub: RedisSubPub;
declare type Callback = (channel: string, message: string) => void;
export type { RedisSubPub };
