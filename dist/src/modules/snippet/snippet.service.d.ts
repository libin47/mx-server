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
import { CacheService } from '~/processors/cache/cache.service';
import { ServerlessService } from '../serverless/serverless.service';
import { SnippetModel } from './snippet.model';
export declare class SnippetService {
    private readonly snippetModel;
    private readonly serverlessService;
    private readonly cacheService;
    constructor(snippetModel: MongooseModel<SnippetModel>, serverlessService: ServerlessService, cacheService: CacheService);
    get model(): MongooseModel<SnippetModel>;
    create(model: SnippetModel): Promise<import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & SnippetModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
        _id: any;
    }>;
    update(id: string, model: SnippetModel): Promise<(import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & SnippetModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
        _id: any;
    }) | null>;
    delete(id: string): Promise<void>;
    private validateType;
    getSnippetById(id: string): Promise<Omit<import("mongoose")._LeanDocument<import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & SnippetModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
        _id: any;
    }>, "validate" | "schema" | "set" | "get" | "update" | "delete" | "save" | "remove" | "populate" | "$getAllSubdocs" | "$ignore" | "$isDefault" | "$isDeleted" | "$getPopulatedDocs" | "$isEmpty" | "$isValid" | "$locals" | "$markValid" | "$model" | "$op" | "$session" | "$set" | "$where" | "baseModelName" | "collection" | "db" | "deleteOne" | "depopulate" | "directModifiedPaths" | "equals" | "errors" | "getChanges" | "increment" | "init" | "invalidate" | "isDirectModified" | "isDirectSelected" | "isInit" | "isModified" | "isNew" | "isSelected" | "markModified" | "modifiedPaths" | "modelName" | "overwrite" | "$parent" | "populated" | "replaceOne" | "toJSON" | "toObject" | "unmarkModified" | "updateOne" | "validateSync" | "$isSingleNested">>;
    getSnippetByName(name: string, reference: string): Promise<Omit<import("mongoose")._LeanDocument<import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & SnippetModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
        _id: any;
    }>, "validate" | "schema" | "set" | "get" | "update" | "delete" | "save" | "remove" | "populate" | "$getAllSubdocs" | "$ignore" | "$isDefault" | "$isDeleted" | "$getPopulatedDocs" | "$isEmpty" | "$isValid" | "$locals" | "$markValid" | "$model" | "$op" | "$session" | "$set" | "$where" | "baseModelName" | "collection" | "db" | "deleteOne" | "depopulate" | "directModifiedPaths" | "equals" | "errors" | "getChanges" | "increment" | "init" | "invalidate" | "isDirectModified" | "isDirectSelected" | "isInit" | "isModified" | "isNew" | "isSelected" | "markModified" | "modifiedPaths" | "modelName" | "overwrite" | "$parent" | "populated" | "replaceOne" | "toJSON" | "toObject" | "unmarkModified" | "updateOne" | "validateSync" | "$isSingleNested">>;
    attachSnippet(model: SnippetModel): Promise<SnippetModel & {
        data: any;
    }>;
    cacheSnippet(model: SnippetModel, value: any): Promise<void>;
    getCachedSnippet(reference: string, name: string, accessType: 'public' | 'private'): Promise<string | null>;
    deleteCachedSnippet(reference: string, name: string): Promise<void>;
}
