import { CacheService } from '../cache/cache.service';
export declare class JWTService {
    private readonly cacheService;
    private secret;
    constructor(cacheService: CacheService);
    init(): void;
    verify(token: string): Promise<boolean>;
    isTokenInRedis(token: string): Promise<boolean>;
    revokeToken(token: string): Promise<void>;
    revokeAll(): Promise<void>;
    storeTokenInRedis(token: string): Promise<void>;
    sign(id: string): string;
}
