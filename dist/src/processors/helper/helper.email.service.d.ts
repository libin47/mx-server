/// <reference types="node" />
import { ConfigsService } from '~/modules/configs/configs.service';
import { CacheService } from '../cache/cache.service';
import { AssetService } from './helper.asset.service';
export declare enum ReplyMailType {
    Owner = "owner",
    Guest = "guest"
}
export declare enum LinkApplyEmailType {
    ToMaster = 0,
    ToCandidate = 1
}
export declare class EmailService {
    private readonly configsService;
    private readonly assetService;
    private readonly cacheService;
    private instance;
    private logger;
    constructor(configsService: ConfigsService, assetService: AssetService, cacheService: CacheService);
    readTemplate(type: ReplyMailType): Promise<string | Buffer | null>;
    writeTemplate(type: ReplyMailType, source: string): Promise<void>;
    deleteTemplate(type: ReplyMailType): Promise<void>;
    init(): void;
    private getConfigFromConfigService;
    checkIsReady(): Promise<boolean>;
    private verifyClient;
    sendCommentNotificationMail({ to, source, type, }: {
        to: string;
        source: EmailTemplateRenderProps;
        type: ReplyMailType;
    }): Promise<void>;
    render(template: string, source: EmailTemplateRenderProps): string;
    getInstance(): import("nodemailer").Transporter<unknown>;
}
export interface EmailTemplateRenderProps {
    author: string;
    ip?: string;
    text: string;
    link: string;
    time: string;
    mail: string;
    title: string;
    master?: string;
}
