import { CommentModel } from '~/modules/comment/comment.model';
import { ConfigsService } from '~/modules/configs/configs.service';
import { HttpService } from './helper.http.service';
export declare type BarkPushOptions = {
    title: string;
    body: string;
    category?: string;
    icon?: string;
    group?: string;
    url?: string;
    sound?: string;
    level?: 'active' | 'timeSensitive' | 'passive';
};
export declare class BarkPushService {
    private readonly httpService;
    private readonly config;
    constructor(httpService: HttpService, config: ConfigsService);
    pushCommentEvent(comment: CommentModel): Promise<void>;
    push(options: BarkPushOptions): Promise<any>;
}
