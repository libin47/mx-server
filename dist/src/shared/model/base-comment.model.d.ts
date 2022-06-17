import { BaseModel } from './base.model';
export declare abstract class BaseCommentIndexModel extends BaseModel {
    commentsIndex?: number;
    allowComment: boolean;
    static get protectedKeys(): string[];
}
