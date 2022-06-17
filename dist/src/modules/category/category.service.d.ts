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
import { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import { PostModel } from '../post/post.model';
import { PostService } from '../post/post.service';
import { CategoryModel, CategoryType } from './category.model';
export declare class CategoryService {
    private readonly categoryModel;
    private readonly postService;
    constructor(categoryModel: ReturnModelType<typeof CategoryModel>, postService: PostService);
    findCategoryById(categoryId: string): Promise<{
        count: number;
        slug?: string | undefined;
        created?: Date | undefined;
        id?: any;
        type?: CategoryType | undefined;
        _id?: any;
        __v?: any;
        name?: string | undefined;
        typegooseName?: (() => string) | undefined;
    }>;
    findAllCategory(): Promise<Omit<import("mongoose")._LeanDocument<import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & CategoryModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
        _id: any;
    }>, "populate" | "init" | "validate" | "save" | "remove" | "update" | "updateOne" | "deleteOne" | "set" | "$getAllSubdocs" | "$ignore" | "$isDefault" | "$isDeleted" | "$getPopulatedDocs" | "$isEmpty" | "$isValid" | "$locals" | "$markValid" | "$model" | "$op" | "$session" | "$set" | "$where" | "baseModelName" | "collection" | "db" | "delete" | "depopulate" | "directModifiedPaths" | "equals" | "errors" | "get" | "getChanges" | "increment" | "invalidate" | "isDirectModified" | "isDirectSelected" | "isInit" | "isModified" | "isNew" | "isSelected" | "markModified" | "modifiedPaths" | "modelName" | "overwrite" | "$parent" | "populated" | "replaceOne" | "schema" | "toJSON" | "toObject" | "unmarkModified" | "validateSync" | "$isSingleNested">[]>;
    get model(): ReturnModelType<typeof CategoryModel, import("@typegoose/typegoose/lib/types").BeAnObject>;
    getPostTagsSum(): Promise<any[]>;
    findArticleWithTag(tag: string, condition?: FilterQuery<DocumentType<PostModel>>): Promise<null | any[]>;
    findCategoryPost(categoryId: string, condition?: any): Promise<(import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & PostModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
        _id: any;
    })[]>;
    findPostsInCategory(id: string): Promise<(import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & PostModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
        _id: any;
    })[]>;
    createDefaultCategory(): Promise<(import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & CategoryModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
        _id: any;
    }) | undefined>;
}
