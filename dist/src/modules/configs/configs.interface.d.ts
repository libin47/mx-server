import { AdminExtraDto, AlgoliaSearchOptionsDto, BackupOptionsDto, BaiduSearchOptionsDto, BarkOptionsDto, CommentOptionsDto, FriendLinkOptionsDto, MailOptionsDto, SeoDto, TerminalOptionsDto, TextOptionsDto, UrlDto } from './configs.dto';
export declare abstract class IConfig {
    url: Required<UrlDto>;
    seo: Required<SeoDto>;
    adminExtra: Required<AdminExtraDto>;
    textOptions: Required<TextOptionsDto>;
    mailOptions: Required<MailOptionsDto>;
    commentOptions: Required<CommentOptionsDto>;
    barkOptions: Required<BarkOptionsDto>;
    friendLinkOptions: Required<FriendLinkOptionsDto>;
    backupOptions: Required<BackupOptionsDto>;
    baiduSearchOptions: Required<BaiduSearchOptionsDto>;
    algoliaSearchOptions: Required<AlgoliaSearchOptionsDto>;
    terminalOptions: Required<TerminalOptionsDto>;
}
export declare type IConfigKeys = keyof IConfig;
