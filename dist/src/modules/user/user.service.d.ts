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
import { ReturnModelType } from '@typegoose/typegoose';
import { CacheService } from '~/processors/cache/cache.service';
import { AuthService } from '../auth/auth.service';
import { UserDocument, UserModel } from './user.model';
export declare class UserService {
    private readonly userModel;
    private readonly authService;
    private readonly redis;
    private Logger;
    constructor(userModel: ReturnModelType<typeof UserModel>, authService: AuthService, redis: CacheService);
    get model(): ReturnModelType<typeof UserModel, import("@typegoose/typegoose/lib/types").BeAnObject>;
    login(username: string, password: string): Promise<import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & UserModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
        _id: any;
    }>;
    getMasterInfo(getLoginIp?: boolean): Promise<{
        avatar: string;
        created?: Date | undefined;
        id?: any;
        _id: any;
        name: string;
        url?: string | undefined;
        __v?: any;
        typegooseName: () => string;
        mail: string;
        password: string;
        introduce?: string | undefined;
        username: string;
        lastLoginTime?: Date | undefined;
        lastLoginIp?: string | undefined;
        socialIds?: any;
        apiToken?: Omit<import("mongoose")._LeanDocument<import("./user.model").TokenModel>, "validate" | "schema" | "set" | "get" | "update" | "delete" | "save" | "remove" | "populate" | "$getAllSubdocs" | "$ignore" | "$isDefault" | "$isDeleted" | "$getPopulatedDocs" | "$isEmpty" | "$isValid" | "$locals" | "$markValid" | "$model" | "$op" | "$session" | "$set" | "$where" | "baseModelName" | "collection" | "db" | "deleteOne" | "depopulate" | "directModifiedPaths" | "equals" | "errors" | "getChanges" | "increment" | "init" | "invalidate" | "isDirectModified" | "isDirectSelected" | "isInit" | "isModified" | "isNew" | "isSelected" | "markModified" | "modifiedPaths" | "modelName" | "overwrite" | "$parent" | "populated" | "replaceOne" | "toJSON" | "toObject" | "unmarkModified" | "updateOne" | "validateSync" | "$isSingleNested">[] | undefined;
        oauth2?: Omit<import("mongoose")._LeanDocument<import("./user.model").OAuthModel>, "validate" | "schema" | "set" | "get" | "update" | "delete" | "save" | "remove" | "populate" | "$getAllSubdocs" | "$ignore" | "$isDefault" | "$isDeleted" | "$getPopulatedDocs" | "$isEmpty" | "$isValid" | "$locals" | "$markValid" | "$model" | "$op" | "$session" | "$set" | "$where" | "baseModelName" | "collection" | "db" | "deleteOne" | "depopulate" | "directModifiedPaths" | "equals" | "errors" | "getChanges" | "increment" | "init" | "invalidate" | "isDirectModified" | "isDirectSelected" | "isInit" | "isModified" | "isNew" | "isSelected" | "markModified" | "modifiedPaths" | "modelName" | "overwrite" | "$parent" | "populated" | "replaceOne" | "toJSON" | "toObject" | "unmarkModified" | "updateOne" | "validateSync" | "$isSingleNested">[] | undefined;
    }>;
    hasMaster(): Promise<boolean>;
    getMaster(): Promise<Omit<import("mongoose")._LeanDocument<import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & UserModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
        _id: any;
    }>, "validate" | "schema" | "set" | "get" | "update" | "delete" | "save" | "remove" | "populate" | "$getAllSubdocs" | "$ignore" | "$isDefault" | "$isDeleted" | "$getPopulatedDocs" | "$isEmpty" | "$isValid" | "$locals" | "$markValid" | "$model" | "$op" | "$session" | "$set" | "$where" | "baseModelName" | "collection" | "db" | "deleteOne" | "depopulate" | "directModifiedPaths" | "equals" | "errors" | "getChanges" | "increment" | "init" | "invalidate" | "isDirectModified" | "isDirectSelected" | "isInit" | "isModified" | "isNew" | "isSelected" | "markModified" | "modifiedPaths" | "modelName" | "overwrite" | "$parent" | "populated" | "replaceOne" | "toJSON" | "toObject" | "unmarkModified" | "updateOne" | "validateSync" | "$isSingleNested">>;
    createMaster(model: Pick<UserModel, 'username' | 'name' | 'password'> & Partial<Pick<UserModel, 'introduce' | 'avatar' | 'url'>>): Promise<{
        token: string;
        username: string;
    }>;
    patchUserData(user: UserDocument, data: Partial<UserModel>): Promise<import("mongodb").UpdateResult>;
    signout(token: string): Promise<void>;
    recordFootstep(ip: string): Promise<Record<string, Date | string>>;
}
