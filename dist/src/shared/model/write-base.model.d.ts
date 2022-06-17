import { BaseCommentIndexModel } from './base-comment.model';
import { ImageModel } from './image.model';
export declare class WriteBaseModel extends BaseCommentIndexModel {
    title: string;
    text: string;
    images?: ImageModel[];
    modified: Date | null;
    meta?: Record<string, any>;
    static get protectedKeys(): string[];
}
