/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indizes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose" />
/// <reference types="mongoose-paginate-v2" />
import { DocumentType } from '@typegoose/typegoose';
import { BeAnObject } from '@typegoose/typegoose/lib/types';
import { DatabaseService } from '~/processors/database/database.service';
import { EmailService, ReplyMailType } from '~/processors/helper/helper.email.service';
import { ConfigsService } from '../configs/configs.service';
import { ToolService } from '../tool/tool.service';
import { UserService } from '../user/user.service';
import { CommentModel, CommentRefTypes } from './comment.model';
export declare class CommentService {
    private readonly commentModel;
    private readonly databaseService;
    private readonly configs;
    private readonly userService;
    private readonly mailService;
    private readonly toolService;
    private readonly configsService;
    private readonly logger;
    constructor(commentModel: MongooseModel<CommentModel>, databaseService: DatabaseService, configs: ConfigsService, userService: UserService, mailService: EmailService, toolService: ToolService, configsService: ConfigsService);
    get model(): MongooseModel<CommentModel>;
    private getModelByRefType;
    checkSpam(doc: CommentModel): Promise<boolean>;
    createComment(id: string, doc: Partial<CommentModel>, type?: CommentRefTypes): Promise<import("mongoose").Document<any, BeAnObject, any> & CommentModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
        _id: any;
    }>;
    ValidAuthorName(author: string): Promise<void>;
    deleteComments(id: string): Promise<void>;
    allowComment(id: string, type?: CommentRefTypes): Promise<boolean>;
    getComments({ page, size, state }?: {
        page: number;
        size: number;
        state: number;
    }): Promise<import("mongoose").PaginateResult<CommentModel & import("mongoose").Document<any, any, any> & {
        _id: any;
    }>>;
    sendEmail(model: DocumentType<CommentModel>, type: ReplyMailType): Promise<void>;
    resolveUrlByType(type: CommentRefTypes, model: any): Promise<string>;
    attachIpLocation(model: Partial<CommentModel>, ip: string): Promise<Partial<CommentModel>>;
}
