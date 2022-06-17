import { IpRecord } from '~/common/decorator/ip.decorator';
import { EventManagerService } from '~/processors/helper/helper.event.service';
import { MongoIdDto } from '~/shared/dto/id.dto';
import { PagerDto } from '~/shared/dto/pager.dto';
import { UserModel } from '../user/user.model';
import { CommentDto, CommentRefTypesDto, StateDto, TextOnlyDto } from './comment.dto';
import { CommentModel } from './comment.model';
import { CommentService } from './comment.service';
export declare class CommentController {
    private readonly commentService;
    private readonly eventManager;
    constructor(commentService: CommentService, eventManager: EventManagerService);
    getRecentlyComments(query: PagerDto): Promise<import("../../shared/interface/paginator.interface").Pagination<CommentModel & import("mongoose").Document<any, any, any> & {
        _id: any;
    }>>;
    getComments(params: MongoIdDto): Promise<import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & CommentModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
        _id: any;
    }>;
    getCommentsByRefId(params: MongoIdDto, query: PagerDto): Promise<import("../../shared/interface/paginator.interface").Pagination<CommentModel & import("mongoose").Document<any, any, any> & {
        _id: any;
    }>>;
    comment(params: MongoIdDto, body: CommentDto, isMaster: boolean, ipLocation: IpRecord, query: CommentRefTypesDto): Promise<import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & CommentModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
        _id: any;
    }>;
    replyByCid(params: MongoIdDto, body: CommentDto, author: string, isMaster: boolean, ipLocation: IpRecord): Promise<import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & CommentModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
        _id: any;
    }>;
    commentByMaster(user: UserModel, params: MongoIdDto, body: TextOnlyDto, ipLocation: IpRecord, query: CommentRefTypesDto): Promise<import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & CommentModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
        _id: any;
    }>;
    replyByMaster(req: any, params: MongoIdDto, body: TextOnlyDto, ipLocation: IpRecord): Promise<import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & CommentModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
        _id: any;
    }>;
    modifyCommentState(params: MongoIdDto, body: StateDto): Promise<void>;
    deleteComment(params: MongoIdDto): Promise<void>;
}
