import { MongoIdDto } from '~/shared/dto/id.dto';
import { QAModel, AnswerModel, PartialQAModel } from './qa.model';
import { QAService } from './qa.service';
export declare class QAController {
    private readonly qaService;
    constructor(qaService: QAService);
    getQAs(isMaster: boolean): Promise<Omit<import("mongoose")._LeanDocument<import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & QAModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
        _id: any;
    }>, "populate" | "$getAllSubdocs" | "$ignore" | "$isDefault" | "$isDeleted" | "$getPopulatedDocs" | "$isEmpty" | "$isValid" | "$locals" | "$markValid" | "$model" | "$op" | "$session" | "$set" | "$where" | "baseModelName" | "collection" | "db" | "delete" | "deleteOne" | "depopulate" | "directModifiedPaths" | "equals" | "errors" | "get" | "getChanges" | "increment" | "init" | "invalidate" | "isDirectModified" | "isDirectSelected" | "isInit" | "isModified" | "isNew" | "isSelected" | "markModified" | "modifiedPaths" | "modelName" | "overwrite" | "$parent" | "populated" | "remove" | "replaceOne" | "save" | "schema" | "set" | "toJSON" | "toObject" | "unmarkModified" | "update" | "updateOne" | "validate" | "validateSync" | "$isSingleNested">[]>;
    getQbyId(params: MongoIdDto): Promise<{
        question: string;
    }>;
    checkQAById(body: AnswerModel): Promise<boolean>;
    create(body: QAModel): Promise<import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & QAModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
        _id: any;
    }>;
    modify(params: MongoIdDto, body: QAModel): Promise<(import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & QAModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
        _id: any;
    }) | null>;
    patch(params: MongoIdDto, body: PartialQAModel): Promise<void>;
    deleteAlbum(params: MongoIdDto): Promise<import("mongodb").DeleteResult>;
}
