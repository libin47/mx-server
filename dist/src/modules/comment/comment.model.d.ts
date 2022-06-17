import { Ref } from '@typegoose/typegoose';
import { BaseModel } from '~/shared/model/base.model';
import { NoteModel } from '../note/note.model';
import { PageModel } from '../page/page.model';
import { PostModel } from '../post/post.model';
import { PhotoModel } from '../photo/photo.model';
export declare enum CommentRefTypes {
    Post = "Post",
    Note = "Note",
    Page = "Page"
}
export declare enum CommentState {
    Unread = 0,
    Read = 1,
    Junk = 2
}
export declare class CommentModel extends BaseModel {
    ref: Ref<PostModel | NoteModel | PageModel | PhotoModel>;
    refType: CommentRefTypes;
    author: string;
    mail: string;
    url?: string;
    text: string;
    state?: CommentState;
    parent?: Ref<CommentModel>;
    children?: Ref<CommentModel>[];
    commentsIndex?: number;
    key?: string;
    ip?: string;
    agent?: string;
    post: Ref<PostModel>;
    note: Ref<NoteModel>;
    photo: Ref<PhotoModel>;
    page: Ref<PageModel>;
    location?: string;
    avatars?: string;
    get avatar(): string;
}
