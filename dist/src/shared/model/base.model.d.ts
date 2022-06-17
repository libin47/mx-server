import { ImageModel } from './image.model';
export declare class BaseModel {
    created?: Date;
    id?: string;
    static get protectedKeys(): string[];
}
export declare abstract class BaseCommentIndexModel extends BaseModel {
    commentsIndex?: number;
    allowComment: boolean;
    static get protectedKeys(): string[];
}
export declare class PhotoBaseModel extends BaseCommentIndexModel {
    title: string;
    text: string;
    photos: string[];
    modified: Date | null;
    static get protectedKeys(): string[];
}
export declare class CountMixed {
    read?: number;
    like?: number;
}
export type { ImageModel as TextImageRecordType };
