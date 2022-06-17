/// <reference types="node" />
import { EmailService, EmailTemplateRenderProps } from '~/processors/helper/helper.email.service';
import { ReplyEmailBodyDto, ReplyEmailTypeDto } from '../dtos/email.dto';
export declare class EmailOptionController {
    private readonly emailService;
    constructor(emailService: EmailService);
    getEmailReplyTemplate({ type }: ReplyEmailTypeDto): Promise<{
        template: string | Buffer | null;
        props: EmailTemplateRenderProps;
    }>;
    writeEmailReplyTemplate({ type }: ReplyEmailTypeDto, body: ReplyEmailBodyDto): Promise<{
        source: string;
    }>;
    deleteEmailReplyTemplate({ type }: ReplyEmailTypeDto): Promise<void>;
}
