import { CacheService } from '~/processors/cache/cache.service';
export declare class PTYService {
    private readonly cacheService;
    constructor(cacheService: CacheService);
    getLoginRecord(): Promise<{
        startTime: Date;
        ip: string;
        endTime: string | null | undefined;
    }[]>;
}
