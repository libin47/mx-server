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
import { IpRecord } from '~/common/decorator/ip.decorator';
import { AuthService } from '../auth/auth.service';
import { LoginDto, UserDto, UserPatchDto } from './user.dto';
import { UserDocument } from './user.model';
import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    private readonly authService;
    constructor(userService: UserService, authService: AuthService);
    getMasterInfo(isMaster: boolean): Promise<{
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
    register(userDto: UserDto): Promise<{
        token: string;
        username: string;
    }>;
    login(dto: LoginDto, ipLocation: IpRecord): Promise<{
        name: string;
        username: string;
        created: Date | undefined;
        url: string | undefined;
        mail: string;
        avatar: string;
        id: any;
        token: string;
    }>;
    checkLogged(isMaster: boolean): {
        ok: number;
        isGuest: boolean;
    };
    patchMasterData(body: UserPatchDto, user: UserDocument): Promise<import("mongodb").UpdateResult>;
    singout(token: string): Promise<void>;
}
