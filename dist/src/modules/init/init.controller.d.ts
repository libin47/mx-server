import { ConfigsService } from '../configs/configs.service';
import { ConfigKeyDto } from '../option/dtos/config.dto';
import { InitService } from './init.service';
export declare class InitController {
    private readonly configs;
    private readonly initService;
    constructor(configs: ConfigsService, initService: InitService);
    isInit(): Promise<{
        isInit: boolean;
    }>;
    getDefaultConfig(): Promise<import("../configs/configs.interface").IConfig>;
    patch(params: ConfigKeyDto, body: Record<string, any>): Promise<Required<import("../configs/configs.dto").UrlDto> | Required<import("../configs/configs.dto").SeoDto> | Required<import("../configs/configs.dto").AdminExtraDto> | Required<import("../configs/configs.dto").TextOptionsDto> | Required<import("../configs/configs.dto").MailOptionsDto> | Required<import("../configs/configs.dto").CommentOptionsDto> | Required<import("../configs/configs.dto").BarkOptionsDto> | Required<import("../configs/configs.dto").FriendLinkOptionsDto> | Required<import("../configs/configs.dto").BackupOptionsDto> | Required<import("../configs/configs.dto").BaiduSearchOptionsDto> | Required<import("../configs/configs.dto").AlgoliaSearchOptionsDto> | Required<import("../configs/configs.dto").TerminalOptionsDto>>;
}
