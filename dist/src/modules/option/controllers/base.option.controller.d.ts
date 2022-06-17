import { IConfig } from '~/modules/configs/configs.interface';
import { ConfigsService } from '~/modules/configs/configs.service';
import { ConfigKeyDto } from '../dtos/config.dto';
export declare class BaseOptionController {
    private readonly configsService;
    private readonly configs;
    constructor(configsService: ConfigsService, configs: ConfigsService);
    getOption(): Record<string, any>;
    getJsonSchema(): any;
    getOptionKey(key: keyof IConfig): Promise<{
        data: Record<string, any>;
    }>;
    patch(params: ConfigKeyDto, body: Record<string, any>): Promise<Required<import("../../configs/configs.dto").UrlDto> | Required<import("../../configs/configs.dto").SeoDto> | Required<import("../../configs/configs.dto").AdminExtraDto> | Required<import("../../configs/configs.dto").TextOptionsDto> | Required<import("../../configs/configs.dto").MailOptionsDto> | Required<import("../../configs/configs.dto").CommentOptionsDto> | Required<import("../../configs/configs.dto").BarkOptionsDto> | Required<import("../../configs/configs.dto").FriendLinkOptionsDto> | Required<import("../../configs/configs.dto").BackupOptionsDto> | Required<import("../../configs/configs.dto").BaiduSearchOptionsDto> | Required<import("../../configs/configs.dto").AlgoliaSearchOptionsDto> | Required<import("../../configs/configs.dto").TerminalOptionsDto>>;
}
