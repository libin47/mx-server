import { DocumentType } from '@typegoose/typegoose';
import { BaseModel } from '~/shared/model/base.model';
export declare type UserDocument = DocumentType<UserModel>;
export declare class OAuthModel {
    platform: string;
    id: string;
}
export declare class TokenModel {
    created: Date;
    token: string;
    expired?: Date;
    name: string;
}
export declare class UserModel extends BaseModel {
    username: string;
    name: string;
    introduce?: string;
    avatar?: string;
    password: string;
    mail: string;
    url?: string;
    lastLoginTime?: Date;
    lastLoginIp?: string;
    socialIds?: any;
    apiToken?: TokenModel[];
    oauth2?: OAuthModel[];
}
