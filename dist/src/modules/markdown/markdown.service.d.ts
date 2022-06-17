/// <reference types="node" />
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
import JSZip from 'jszip';
import { ReturnModelType } from '@typegoose/typegoose';
import { DatabaseService } from '~/processors/database/database.service';
import { AssetService } from '~/processors/helper/helper.asset.service';
import { TextMacroService } from '~/processors/helper/helper.macro.service';
import { CategoryModel } from '../category/category.model';
import { NoteModel } from '../note/note.model';
import { PageModel } from '../page/page.model';
import { PostModel } from '../post/post.model';
import { DatatypeDto } from './markdown.dto';
import { MarkdownYAMLProperty } from './markdown.interface';
export declare class MarkdownService {
    private readonly assetService;
    private readonly categoryModel;
    private readonly postModel;
    private readonly noteModel;
    private readonly pageModel;
    private readonly databaseService;
    private readonly macroService;
    constructor(assetService: AssetService, categoryModel: ReturnModelType<typeof CategoryModel>, postModel: ReturnModelType<typeof PostModel>, noteModel: ReturnModelType<typeof NoteModel>, pageModel: ReturnModelType<typeof PageModel>, databaseService: DatabaseService, macroService: TextMacroService);
    insertPostsToDb(data: DatatypeDto[]): Promise<void | (import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & PostModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
        _id: any;
    })[]>;
    insertNotesToDb(data: DatatypeDto[]): Promise<(import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & NoteModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
        _id: any;
    })[]>;
    private readonly genDate;
    extractAllArticle(): Promise<{
        posts: Omit<import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & PostModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
            _id: any;
        }, never>[];
        notes: Omit<import("mongoose")._LeanDocument<import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & NoteModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
            _id: any;
        }>, "validate" | "schema" | "set" | "get" | "update" | "delete" | "save" | "remove" | "populate" | "$getAllSubdocs" | "$ignore" | "$isDefault" | "$isDeleted" | "$getPopulatedDocs" | "$isEmpty" | "$isValid" | "$locals" | "$markValid" | "$model" | "$op" | "$session" | "$set" | "$where" | "baseModelName" | "collection" | "db" | "deleteOne" | "depopulate" | "directModifiedPaths" | "equals" | "errors" | "getChanges" | "increment" | "init" | "invalidate" | "isDirectModified" | "isDirectSelected" | "isInit" | "isModified" | "isNew" | "isSelected" | "markModified" | "modifiedPaths" | "modelName" | "overwrite" | "$parent" | "populated" | "replaceOne" | "toJSON" | "toObject" | "unmarkModified" | "updateOne" | "validateSync" | "$isSingleNested">[];
        pages: Omit<import("mongoose")._LeanDocument<import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & PageModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
            _id: any;
        }>, "validate" | "schema" | "set" | "get" | "update" | "delete" | "save" | "remove" | "populate" | "$getAllSubdocs" | "$ignore" | "$isDefault" | "$isDeleted" | "$getPopulatedDocs" | "$isEmpty" | "$isValid" | "$locals" | "$markValid" | "$model" | "$op" | "$session" | "$set" | "$where" | "baseModelName" | "collection" | "db" | "deleteOne" | "depopulate" | "directModifiedPaths" | "equals" | "errors" | "getChanges" | "increment" | "init" | "invalidate" | "isDirectModified" | "isDirectSelected" | "isInit" | "isModified" | "isNew" | "isSelected" | "markModified" | "modifiedPaths" | "modelName" | "overwrite" | "$parent" | "populated" | "replaceOne" | "toJSON" | "toObject" | "unmarkModified" | "updateOne" | "validateSync" | "$isSingleNested">[];
    }>;
    generateArchive({ documents, options, }: {
        documents: MarkdownYAMLProperty[];
        options: {
            slug?: boolean;
        };
    }): Promise<JSZip>;
    markdownBuilder(property: MarkdownYAMLProperty, includeYAMLHeader?: boolean, showHeader?: boolean): string;
    renderArticle(id: string): Promise<{
        document: Omit<import("mongoose")._LeanDocument<import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & PostModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
            _id: any;
        }>, "validate" | "schema" | "set" | "get" | "update" | "delete" | "save" | "remove" | "populate" | "$getAllSubdocs" | "$ignore" | "$isDefault" | "$isDeleted" | "$getPopulatedDocs" | "$isEmpty" | "$isValid" | "$locals" | "$markValid" | "$model" | "$op" | "$session" | "$set" | "$where" | "baseModelName" | "collection" | "db" | "deleteOne" | "depopulate" | "directModifiedPaths" | "equals" | "errors" | "getChanges" | "increment" | "init" | "invalidate" | "isDirectModified" | "isDirectSelected" | "isInit" | "isModified" | "isNew" | "isSelected" | "markModified" | "modifiedPaths" | "modelName" | "overwrite" | "$parent" | "populated" | "replaceOne" | "toJSON" | "toObject" | "unmarkModified" | "updateOne" | "validateSync" | "$isSingleNested"> | Omit<import("mongoose")._LeanDocument<import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & NoteModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
            _id: any;
        }>, "validate" | "schema" | "set" | "get" | "update" | "delete" | "save" | "remove" | "populate" | "$getAllSubdocs" | "$ignore" | "$isDefault" | "$isDeleted" | "$getPopulatedDocs" | "$isEmpty" | "$isValid" | "$locals" | "$markValid" | "$model" | "$op" | "$session" | "$set" | "$where" | "baseModelName" | "collection" | "db" | "deleteOne" | "depopulate" | "directModifiedPaths" | "equals" | "errors" | "getChanges" | "increment" | "init" | "invalidate" | "isDirectModified" | "isDirectSelected" | "isInit" | "isModified" | "isNew" | "isSelected" | "markModified" | "modifiedPaths" | "modelName" | "overwrite" | "$parent" | "populated" | "replaceOne" | "toJSON" | "toObject" | "unmarkModified" | "updateOne" | "validateSync" | "$isSingleNested"> | Omit<import("mongoose")._LeanDocument<import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & PageModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
            _id: any;
        }>, "validate" | "schema" | "set" | "get" | "update" | "delete" | "save" | "remove" | "populate" | "$getAllSubdocs" | "$ignore" | "$isDefault" | "$isDeleted" | "$getPopulatedDocs" | "$isEmpty" | "$isValid" | "$locals" | "$markValid" | "$model" | "$op" | "$session" | "$set" | "$where" | "baseModelName" | "collection" | "db" | "deleteOne" | "depopulate" | "directModifiedPaths" | "equals" | "errors" | "getChanges" | "increment" | "init" | "invalidate" | "isDirectModified" | "isDirectSelected" | "isInit" | "isModified" | "isNew" | "isSelected" | "markModified" | "modifiedPaths" | "modelName" | "overwrite" | "$parent" | "populated" | "replaceOne" | "toJSON" | "toObject" | "unmarkModified" | "updateOne" | "validateSync" | "$isSingleNested">;
        type: string;
        html: string;
    }>;
    renderMarkdownContent(text: string): string;
    getRenderedMarkdownHtmlStructure(html: string, title: string, theme?: string): Promise<{
        body: string[];
        extraScripts: string[];
        script: string[];
        link: string[];
        style: (string | Buffer | null)[];
    }>;
    getMarkdownEjsRenderTemplate(): Promise<string>;
}
