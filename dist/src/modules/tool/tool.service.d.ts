import { HttpService } from '~/processors/helper/helper.http.service';
import { ConfigsService } from '../configs/configs.service';
import { IP } from './tool.interface';
export declare class ToolService {
    private readonly httpService;
    private readonly configs;
    constructor(httpService: HttpService, configs: ConfigsService);
    getIp(ip: string, timeout?: number): Promise<IP>;
    getGeoLocationByGaode(longitude: string, latitude: string): Promise<any>;
    searchLocationByGaode(keywords: string): Promise<any>;
}
