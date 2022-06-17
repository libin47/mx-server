import { IpRecord } from './common/decorator/ip.decorator';
import { OptionModel } from './modules/configs/configs.model';
import { CacheService } from './processors/cache/cache.service';
export declare class AppController {
    private readonly cacheService;
    private readonly optionModel;
    constructor(cacheService: CacheService, optionModel: MongooseModel<OptionModel>);
    appInfo(): Promise<{
        name: string;
        author: string;
        version: string;
        homepage: string;
        issues: string;
    }>;
    ping(): 'pong';
    likeThis({ ip }: IpRecord): Promise<void>;
    getLikeNumber(): Promise<any>;
    cleanCatch(): Promise<void>;
    cleanAllRedisKey(): Promise<void>;
}
