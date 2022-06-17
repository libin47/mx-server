import { CommentRefTypes } from './comment.model';
export declare class CommentDto {
    author: string;
    text: string;
    mail: string;
    url?: string;
    avatars?: string;
}
export declare class TextOnlyDto {
    text: string;
}
export declare class CommentRefTypesDto {
    ref?: CommentRefTypes;
}
export declare class StateDto {
    state: number;
}
