import { ReturnModelType, mongoose } from '@typegoose/typegoose';
import { NoteModel } from '~/modules/note/note.model';
import { PageModel } from '~/modules/page/page.model';
import { PostModel } from '~/modules/post/post.model';
export declare class DatabaseService {
    private readonly postModel;
    private readonly noteModel;
    private readonly pageModel;
    private connection;
    constructor(postModel: ReturnModelType<typeof PostModel>, noteModel: ReturnModelType<typeof NoteModel>, pageModel: ReturnModelType<typeof PageModel>, connection: mongoose.Connection);
    getModelByRefType(type: 'Post'): ReturnModelType<typeof PostModel>;
    getModelByRefType(type: 'post'): ReturnModelType<typeof PostModel>;
    getModelByRefType(type: 'Note'): ReturnModelType<typeof NoteModel>;
    getModelByRefType(type: 'note'): ReturnModelType<typeof NoteModel>;
    getModelByRefType(type: 'Page'): ReturnModelType<typeof PageModel>;
    getModelByRefType(type: 'page'): ReturnModelType<typeof PageModel>;
    findGlobalById(id: string): Promise<{
        document: null;
        type: null;
    } | {
        document: Omit<mongoose._LeanDocument<mongoose.Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & PostModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
            _id: any;
        }>, "validate" | "schema" | "set" | "get" | "update" | "delete" | "save" | "remove" | "populate" | "$getAllSubdocs" | "$ignore" | "$isDefault" | "$isDeleted" | "$getPopulatedDocs" | "$isEmpty" | "$isValid" | "$locals" | "$markValid" | "$model" | "$op" | "$session" | "$set" | "$where" | "baseModelName" | "collection" | "db" | "deleteOne" | "depopulate" | "directModifiedPaths" | "equals" | "errors" | "getChanges" | "increment" | "init" | "invalidate" | "isDirectModified" | "isDirectSelected" | "isInit" | "isModified" | "isNew" | "isSelected" | "markModified" | "modifiedPaths" | "modelName" | "overwrite" | "$parent" | "populated" | "replaceOne" | "toJSON" | "toObject" | "unmarkModified" | "updateOne" | "validateSync" | "$isSingleNested"> | Omit<mongoose._LeanDocument<mongoose.Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & NoteModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
            _id: any;
        }>, "validate" | "schema" | "set" | "get" | "update" | "delete" | "save" | "remove" | "populate" | "$getAllSubdocs" | "$ignore" | "$isDefault" | "$isDeleted" | "$getPopulatedDocs" | "$isEmpty" | "$isValid" | "$locals" | "$markValid" | "$model" | "$op" | "$session" | "$set" | "$where" | "baseModelName" | "collection" | "db" | "deleteOne" | "depopulate" | "directModifiedPaths" | "equals" | "errors" | "getChanges" | "increment" | "init" | "invalidate" | "isDirectModified" | "isDirectSelected" | "isInit" | "isModified" | "isNew" | "isSelected" | "markModified" | "modifiedPaths" | "modelName" | "overwrite" | "$parent" | "populated" | "replaceOne" | "toJSON" | "toObject" | "unmarkModified" | "updateOne" | "validateSync" | "$isSingleNested"> | Omit<mongoose._LeanDocument<mongoose.Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & PageModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
            _id: any;
        }>, "validate" | "schema" | "set" | "get" | "update" | "delete" | "save" | "remove" | "populate" | "$getAllSubdocs" | "$ignore" | "$isDefault" | "$isDeleted" | "$getPopulatedDocs" | "$isEmpty" | "$isValid" | "$locals" | "$markValid" | "$model" | "$op" | "$session" | "$set" | "$where" | "baseModelName" | "collection" | "db" | "deleteOne" | "depopulate" | "directModifiedPaths" | "equals" | "errors" | "getChanges" | "increment" | "init" | "invalidate" | "isDirectModified" | "isDirectSelected" | "isInit" | "isModified" | "isNew" | "isSelected" | "markModified" | "modifiedPaths" | "modelName" | "overwrite" | "$parent" | "populated" | "replaceOne" | "toJSON" | "toObject" | "unmarkModified" | "updateOne" | "validateSync" | "$isSingleNested"> | null;
        type: string;
    }>;
    get db(): import("mongodb").Db;
}
