import { ReturnModelType } from '@typegoose/typegoose';
import { TokenModel, UserModel as User, UserModel } from '~/modules/user/user.model';
import { JWTService } from '~/processors/helper/helper.jwt.service';
import { TokenDto } from './auth.controller';
export declare class AuthService {
    private readonly userModel;
    private readonly jwtService;
    constructor(userModel: ReturnModelType<typeof User>, jwtService: JWTService);
    get jwtServicePublic(): JWTService;
    private getAccessTokens;
    getAllAccessToken(): Promise<TokenModel[]>;
    getTokenSecret(id: string): Promise<TokenModel | null | undefined>;
    generateAccessToken(): Promise<string>;
    isCustomToken(token: string): boolean;
    verifyCustomToken(token: string): Promise<[true, UserModel] | [false, null]>;
    saveToken(model: TokenDto & {
        token: string;
    }): Promise<TokenDto & {
        token: string;
    }>;
    deleteToken(id: string): Promise<void>;
}
