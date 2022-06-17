import { RedisKeys } from '~/constants/cache.constant';
declare type Prefix = 'mx' | 'mx-demo';
export declare const getRedisKey: <T extends string = RedisKeys | "*">(key: T, ...concatKeys: string[]) => `mx:${T}${string}` | `mx-demo:${T}${string}`;
export {};
