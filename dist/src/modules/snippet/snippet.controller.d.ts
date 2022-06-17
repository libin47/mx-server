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
import { MongoIdDto } from '~/shared/dto/id.dto';
import { PagerDto } from '~/shared/dto/pager.dto';
import { SnippetMoreDto } from './snippet.dto';
import { SnippetModel } from './snippet.model';
import { SnippetService } from './snippet.service';
export declare class SnippetController {
    private readonly snippetService;
    constructor(snippetService: SnippetService);
    getList(query: PagerDto): Promise<import("../../shared/interface/paginator.interface").Pagination<SnippetModel & import("mongoose").Document<any, any, any> & {
        _id: any;
    }>>;
    createMore(body: SnippetMoreDto): Promise<void>;
    create(body: SnippetModel): Promise<import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & SnippetModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
        _id: any;
    }>;
    getSnippetById(param: MongoIdDto): Promise<Omit<import("mongoose")._LeanDocument<import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & SnippetModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
        _id: any;
    }>, "validate" | "schema" | "set" | "get" | "update" | "delete" | "save" | "remove" | "populate" | "$getAllSubdocs" | "$ignore" | "$isDefault" | "$isDeleted" | "$getPopulatedDocs" | "$isEmpty" | "$isValid" | "$locals" | "$markValid" | "$model" | "$op" | "$session" | "$set" | "$where" | "baseModelName" | "collection" | "db" | "deleteOne" | "depopulate" | "directModifiedPaths" | "equals" | "errors" | "getChanges" | "increment" | "init" | "invalidate" | "isDirectModified" | "isDirectSelected" | "isInit" | "isModified" | "isNew" | "isSelected" | "markModified" | "modifiedPaths" | "modelName" | "overwrite" | "$parent" | "populated" | "replaceOne" | "toJSON" | "toObject" | "unmarkModified" | "updateOne" | "validateSync" | "$isSingleNested">>;
    aggregate(body: any): Promise<any[]>;
    getSnippetByName(name: string, reference: string, isMaster: boolean): Promise<any>;
    update(param: MongoIdDto, body: SnippetModel): Promise<(import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & SnippetModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
        _id: any;
    }) | null>;
    delete(param: MongoIdDto): Promise<void>;
}
