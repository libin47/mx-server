import { CacheService } from '~/processors/cache/cache.service';
import { ConfigsService } from '../configs/configs.service';
import { GaodeMapLocationDto, GaodeMapSearchDto, IpDto } from './tool.dto';
import { ToolService } from './tool.service';
export declare class ToolController {
    private readonly toolService;
    private readonly cacheService;
    private readonly configs;
    constructor(toolService: ToolService, cacheService: CacheService, configs: ConfigsService);
    getIpInfo(params: IpDto): Promise<any>;
    callGeocodeLocationApi(query: GaodeMapLocationDto): Promise<any>;
    callGeocodeSearchApi(query: GaodeMapSearchDto): Promise<any>;
}
