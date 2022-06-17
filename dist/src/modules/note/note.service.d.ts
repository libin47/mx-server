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
import { DocumentType } from '@typegoose/typegoose';
import { EventManagerService } from '~/processors/helper/helper.event.service';
import { ImageService } from '~/processors/helper/helper.image.service';
import { TextMacroService } from '~/processors/helper/helper.macro.service';
import { CommentService } from '../comment/comment.service';
import { NoteModel } from './note.model';
import { QAService } from '../qa//qa.service';
export declare class NoteService {
    private readonly noteModel;
    private readonly imageService;
    private readonly eventManager;
    private readonly commentService;
    private readonly textMacrosService;
    private readonly qaService;
    constructor(noteModel: MongooseModel<NoteModel>, imageService: ImageService, eventManager: EventManagerService, commentService: CommentService, textMacrosService: TextMacroService, qaService: QAService);
    get model(): MongooseModel<NoteModel>;
    getLatestOne(condition?: FilterQuery<DocumentType<NoteModel>>, projection?: any): Promise<{
        latest: Omit<import("mongoose")._LeanDocument<import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & NoteModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
            _id: any;
        }>, "populate" | "init" | "validate" | "save" | "remove" | "update" | "updateOne" | "deleteOne" | "set" | "$getAllSubdocs" | "$ignore" | "$isDefault" | "$isDeleted" | "$getPopulatedDocs" | "$isEmpty" | "$isValid" | "$locals" | "$markValid" | "$model" | "$op" | "$session" | "$set" | "$where" | "baseModelName" | "collection" | "db" | "delete" | "depopulate" | "directModifiedPaths" | "equals" | "errors" | "get" | "getChanges" | "increment" | "invalidate" | "isDirectModified" | "isDirectSelected" | "isInit" | "isModified" | "isNew" | "isSelected" | "markModified" | "modifiedPaths" | "modelName" | "overwrite" | "$parent" | "populated" | "replaceOne" | "schema" | "toJSON" | "toObject" | "unmarkModified" | "validateSync" | "$isSingleNested">;
        next: Omit<import("mongoose")._LeanDocument<import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & NoteModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
            _id: any;
        }>, "populate" | "init" | "validate" | "save" | "remove" | "update" | "updateOne" | "deleteOne" | "set" | "$getAllSubdocs" | "$ignore" | "$isDefault" | "$isDeleted" | "$getPopulatedDocs" | "$isEmpty" | "$isValid" | "$locals" | "$markValid" | "$model" | "$op" | "$session" | "$set" | "$where" | "baseModelName" | "collection" | "db" | "delete" | "depopulate" | "directModifiedPaths" | "equals" | "errors" | "get" | "getChanges" | "increment" | "invalidate" | "isDirectModified" | "isDirectSelected" | "isInit" | "isModified" | "isNew" | "isSelected" | "markModified" | "modifiedPaths" | "modelName" | "overwrite" | "$parent" | "populated" | "replaceOne" | "schema" | "toJSON" | "toObject" | "unmarkModified" | "validateSync" | "$isSingleNested"> | null;
    }>;
    checkPasswordToAccess<T extends NoteModel>(doc: T, password?: string): boolean;
    checkQAOK<T extends NoteModel>(doc: T, answer?: string): boolean | Promise<boolean>;
    create(document: NoteModel): Promise<import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & NoteModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
        _id: any;
    }>;
    updateById(id: string, doc: Partial<NoteModel>): Promise<(import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & NoteModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
        _id: any;
    }) | null>;
    deleteById(id: string): Promise<void>;
    getIdByNid(nid: number): Promise<any>;
    findOneByIdOrNid(unique: any): Promise<(import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & NoteModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
        _id: any;
    }) | null>;
    getNotePaginationByTopicId(topicId: string, pagination?: PaginateOptions, condition?: FilterQuery<NoteModel>): Promise<import("mongoose").PaginateResult<NoteModel & import("mongoose").Document<any, any, any> & {
        _id: any;
    }>>;
    needCreateDefult(): Promise<void>;
}
