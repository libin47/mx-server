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
import { FilterQuery, PaginateOptions } from 'mongoose';
import { EventManagerService } from '~/processors/helper/helper.event.service';
import { ImageService } from '~/processors/helper/helper.image.service';
import { TextMacroService } from '~/processors/helper/helper.macro.service';
import { CategoryService } from '../category/category.service';
import { CommentModel } from '../comment/comment.model';
import { PostModel } from './post.model';
export declare class PostService {
    private readonly postModel;
    private readonly commentModel;
    private categoryService;
    private readonly imageService;
    private readonly eventManager;
    private readonly textMacroService;
    constructor(postModel: MongooseModel<PostModel>, commentModel: MongooseModel<CommentModel>, categoryService: CategoryService, imageService: ImageService, eventManager: EventManagerService, textMacroService: TextMacroService);
    get model(): MongooseModel<PostModel>;
    findWithPaginator(condition?: FilterQuery<PostModel>, options?: PaginateOptions): Promise<import("mongoose").PaginateResult<PostModel & import("mongoose").Document<any, any, any> & {
        _id: any;
    }>>;
    create(post: PostModel): Promise<import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & PostModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
        _id: any;
    }>;
    updateById(id: string, data: Partial<PostModel>): Promise<Omit<import("mongoose")._LeanDocument<any>, "populate" | "init" | "validate" | "save" | "remove" | "update" | "updateOne" | "deleteOne" | "set" | "$getAllSubdocs" | "$ignore" | "$isDefault" | "$isDeleted" | "$getPopulatedDocs" | "$isEmpty" | "$isValid" | "$locals" | "$markValid" | "$model" | "$op" | "$session" | "$set" | "$where" | "baseModelName" | "collection" | "db" | "delete" | "depopulate" | "directModifiedPaths" | "equals" | "errors" | "get" | "getChanges" | "increment" | "invalidate" | "isDirectModified" | "isDirectSelected" | "isInit" | "isModified" | "isNew" | "isSelected" | "markModified" | "modifiedPaths" | "modelName" | "overwrite" | "$parent" | "populated" | "replaceOne" | "schema" | "toJSON" | "toObject" | "unmarkModified" | "validateSync" | "$isSingleNested"> & {
        _id: any;
    }>;
    deletePost(id: string): Promise<void>;
    getCategoryBySlug(slug: string): Promise<(import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & import("../category/category.model").CategoryModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
        _id: any;
    }) | null>;
    isAvailableSlug(slug: string): Promise<boolean>;
}
