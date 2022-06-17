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
/// <reference types="mongoose-paginate-v2" />
import { FilterQuery } from 'mongoose';
import { URL } from 'url';
import { DocumentType } from '@typegoose/typegoose';
import { CacheService } from '~/processors/cache/cache.service';
import { WebEventsGateway } from '~/processors/gateway/web/events.gateway';
import { CategoryModel } from '../category/category.model';
import { CategoryService } from '../category/category.service';
import { CommentService } from '../comment/comment.service';
import { ConfigsService } from '../configs/configs.service';
import { LinkService } from '../link/link.service';
import { NoteModel } from '../note/note.model';
import { NoteService } from '../note/note.service';
import { AlbumService } from '../album/album.service';
import { PhotoService } from '../photo/photo.service';
import { PageService } from '../page/page.service';
import { PostService } from '../post/post.service';
import { RecentlyService } from '../recently/recently.service';
import { SayService } from '../say/say.service';
import { TimelineType } from './aggregate.dto';
import { RSSProps } from './aggregate.interface';
export declare class AggregateService {
    private readonly postService;
    private readonly noteService;
    private readonly albumService;
    private readonly photoService;
    private readonly categoryService;
    private readonly pageService;
    private readonly sayService;
    private readonly commentService;
    private readonly linkService;
    private readonly recentlyService;
    private readonly configs;
    private readonly gateway;
    private readonly cacheService;
    constructor(postService: PostService, noteService: NoteService, albumService: AlbumService, photoService: PhotoService, categoryService: CategoryService, pageService: PageService, sayService: SayService, commentService: CommentService, linkService: LinkService, recentlyService: RecentlyService, configs: ConfigsService, gateway: WebEventsGateway, cacheService: CacheService);
    getAllCategory(): Promise<Omit<import("mongoose")._LeanDocument<import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & CategoryModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
        _id: any;
    }>, "populate" | "init" | "validate" | "save" | "remove" | "update" | "updateOne" | "deleteOne" | "set" | "$getAllSubdocs" | "$ignore" | "$isDefault" | "$isDeleted" | "$getPopulatedDocs" | "$isEmpty" | "$isValid" | "$locals" | "$markValid" | "$model" | "$op" | "$session" | "$set" | "$where" | "baseModelName" | "collection" | "db" | "delete" | "depopulate" | "directModifiedPaths" | "equals" | "errors" | "get" | "getChanges" | "increment" | "invalidate" | "isDirectModified" | "isDirectSelected" | "isInit" | "isModified" | "isNew" | "isSelected" | "markModified" | "modifiedPaths" | "modelName" | "overwrite" | "$parent" | "populated" | "replaceOne" | "schema" | "toJSON" | "toObject" | "unmarkModified" | "validateSync" | "$isSingleNested">[]>;
    getAllAlbum(): Promise<Omit<import("mongoose")._LeanDocument<import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & import("../album/album.model").AlbumModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
        _id: any;
    }>, "populate" | "init" | "validate" | "save" | "remove" | "update" | "updateOne" | "deleteOne" | "set" | "$getAllSubdocs" | "$ignore" | "$isDefault" | "$isDeleted" | "$getPopulatedDocs" | "$isEmpty" | "$isValid" | "$locals" | "$markValid" | "$model" | "$op" | "$session" | "$set" | "$where" | "baseModelName" | "collection" | "db" | "delete" | "depopulate" | "directModifiedPaths" | "equals" | "errors" | "get" | "getChanges" | "increment" | "invalidate" | "isDirectModified" | "isDirectSelected" | "isInit" | "isModified" | "isNew" | "isSelected" | "markModified" | "modifiedPaths" | "modelName" | "overwrite" | "$parent" | "populated" | "replaceOne" | "schema" | "toJSON" | "toObject" | "unmarkModified" | "validateSync" | "$isSingleNested">[]>;
    getAllPages(): import("mongoose").QueryWithHelpers<Omit<import("mongoose")._LeanDocument<import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & import("../page/page.model").PageModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
        _id: any;
    }>, "populate" | "init" | "validate" | "save" | "remove" | "update" | "updateOne" | "deleteOne" | "set" | "$getAllSubdocs" | "$ignore" | "$isDefault" | "$isDeleted" | "$getPopulatedDocs" | "$isEmpty" | "$isValid" | "$locals" | "$markValid" | "$model" | "$op" | "$session" | "$set" | "$where" | "baseModelName" | "collection" | "db" | "delete" | "depopulate" | "directModifiedPaths" | "equals" | "errors" | "get" | "getChanges" | "increment" | "invalidate" | "isDirectModified" | "isDirectSelected" | "isInit" | "isModified" | "isNew" | "isSelected" | "markModified" | "modifiedPaths" | "modelName" | "overwrite" | "$parent" | "populated" | "replaceOne" | "schema" | "toJSON" | "toObject" | "unmarkModified" | "validateSync" | "$isSingleNested">[], import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & import("../page/page.model").PageModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
        _id: any;
    }, import("@typegoose/typegoose/lib/types").BeAnObject, DocumentType<import("../page/page.model").PageModel, import("@typegoose/typegoose/lib/types").BeAnObject>>;
    getLatestNote(cond?: FilterQuery<DocumentType<NoteModel>>): Promise<Omit<import("mongoose")._LeanDocument<import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & NoteModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
        _id: any;
    }>, "populate" | "init" | "validate" | "save" | "remove" | "update" | "updateOne" | "deleteOne" | "set" | "$getAllSubdocs" | "$ignore" | "$isDefault" | "$isDeleted" | "$getPopulatedDocs" | "$isEmpty" | "$isValid" | "$locals" | "$markValid" | "$model" | "$op" | "$session" | "$set" | "$where" | "baseModelName" | "collection" | "db" | "delete" | "depopulate" | "directModifiedPaths" | "equals" | "errors" | "get" | "getChanges" | "increment" | "invalidate" | "isDirectModified" | "isDirectSelected" | "isInit" | "isModified" | "isNew" | "isSelected" | "markModified" | "modifiedPaths" | "modelName" | "overwrite" | "$parent" | "populated" | "replaceOne" | "schema" | "toJSON" | "toObject" | "unmarkModified" | "validateSync" | "$isSingleNested">>;
    private findTop;
    topActivity(size?: number, isMaster?: boolean): Promise<{
        notes: Omit<import("mongoose")._LeanDocument<any>, "populate" | "init" | "validate" | "save" | "remove" | "update" | "updateOne" | "deleteOne" | "set" | "$getAllSubdocs" | "$ignore" | "$isDefault" | "$isDeleted" | "$getPopulatedDocs" | "$isEmpty" | "$isValid" | "$locals" | "$markValid" | "$model" | "$op" | "$session" | "$set" | "$where" | "baseModelName" | "collection" | "db" | "delete" | "depopulate" | "directModifiedPaths" | "equals" | "errors" | "get" | "getChanges" | "increment" | "invalidate" | "isDirectModified" | "isDirectSelected" | "isInit" | "isModified" | "isNew" | "isSelected" | "markModified" | "modifiedPaths" | "modelName" | "overwrite" | "$parent" | "populated" | "replaceOne" | "schema" | "toJSON" | "toObject" | "unmarkModified" | "validateSync" | "$isSingleNested">[] | Omit<import("mongoose")._LeanDocument<any>, "populate" | "init" | "validate" | "save" | "remove" | "update" | "updateOne" | "deleteOne" | "set" | "$getAllSubdocs" | "$ignore" | "$isDefault" | "$isDeleted" | "$getPopulatedDocs" | "$isEmpty" | "$isValid" | "$locals" | "$markValid" | "$model" | "$op" | "$session" | "$set" | "$where" | "baseModelName" | "collection" | "db" | "delete" | "depopulate" | "directModifiedPaths" | "equals" | "errors" | "get" | "getChanges" | "increment" | "invalidate" | "isDirectModified" | "isDirectSelected" | "isInit" | "isModified" | "isNew" | "isSelected" | "markModified" | "modifiedPaths" | "modelName" | "overwrite" | "$parent" | "populated" | "replaceOne" | "schema" | "toJSON" | "toObject" | "unmarkModified" | "validateSync" | "$isSingleNested">[];
        photos: Omit<import("mongoose")._LeanDocument<Omit<any, never>>, "populate" | "init" | "validate" | "save" | "remove" | "update" | "updateOne" | "deleteOne" | "set" | "$getAllSubdocs" | "$ignore" | "$isDefault" | "$isDeleted" | "$getPopulatedDocs" | "$isEmpty" | "$isValid" | "$locals" | "$markValid" | "$model" | "$op" | "$session" | "$set" | "$where" | "baseModelName" | "collection" | "db" | "delete" | "depopulate" | "directModifiedPaths" | "equals" | "errors" | "get" | "getChanges" | "increment" | "invalidate" | "isDirectModified" | "isDirectSelected" | "isInit" | "isModified" | "isNew" | "isSelected" | "markModified" | "modifiedPaths" | "modelName" | "overwrite" | "$parent" | "populated" | "replaceOne" | "schema" | "toJSON" | "toObject" | "unmarkModified" | "validateSync" | "$isSingleNested">[];
        posts: Omit<import("mongoose")._LeanDocument<Omit<any, never>>, "populate" | "init" | "validate" | "save" | "remove" | "update" | "updateOne" | "deleteOne" | "set" | "$getAllSubdocs" | "$ignore" | "$isDefault" | "$isDeleted" | "$getPopulatedDocs" | "$isEmpty" | "$isValid" | "$locals" | "$markValid" | "$model" | "$op" | "$session" | "$set" | "$where" | "baseModelName" | "collection" | "db" | "delete" | "depopulate" | "directModifiedPaths" | "equals" | "errors" | "get" | "getChanges" | "increment" | "invalidate" | "isDirectModified" | "isDirectSelected" | "isInit" | "isModified" | "isNew" | "isSelected" | "markModified" | "modifiedPaths" | "modelName" | "overwrite" | "$parent" | "populated" | "replaceOne" | "schema" | "toJSON" | "toObject" | "unmarkModified" | "validateSync" | "$isSingleNested">[];
        says: (import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & import("../say/say.model").SayModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
            _id: any;
        })[];
    }>;
    getTimeline(year: number | undefined, type: TimelineType | undefined, sortBy?: 1 | -1): Promise<any>;
    getSiteMapContent(): Promise<({
        url: URL;
        published_at: Date;
    } | {
        url: URL;
        published_at: Date;
    } | {
        url: URL;
        published_at: Date;
    })[]>;
    buildRssStructure(): Promise<RSSProps>;
    getRSSFeedContent(): Promise<{
        created: Date | null;
        modified: Date | null;
        link: string;
        title: string;
        text: string;
        id: string;
    }[]>;
    getCounts(): Promise<{
        allComments: number;
        categories: number;
        albums: number;
        comments: number;
        linkApply: number;
        links: number;
        notes: number;
        pages: number;
        posts: number;
        photos: number;
        says: number;
        recently: number;
        unreadComments: number;
        online: number;
        todayMaxOnline: string | number;
        todayOnlineTotal: string | number;
    }>;
    clearAggregateCache(): Promise<[number, number, number, number, number]>;
}
