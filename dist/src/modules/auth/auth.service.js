"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const lodash_1 = require("lodash");
const async_1 = require("nanoid/async");
const common_1 = require("@nestjs/common");
const other_constant_1 = require("../../constants/other.constant");
const user_model_1 = require("../user/user.model");
const helper_jwt_service_1 = require("../../processors/helper/helper.jwt.service");
const model_transformer_1 = require("../../transformers/model.transformer");
let AuthService = class AuthService {
    constructor(userModel, jwtService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
    }
    get jwtServicePublic() {
        return this.jwtService;
    }
    async getAccessTokens() {
        var _a;
        return (_a = (await this.userModel.findOne().select('apiToken').lean())) === null || _a === void 0 ? void 0 : _a.apiToken;
    }
    async getAllAccessToken() {
        const tokens = await this.getAccessTokens();
        if (!tokens) {
            return [];
        }
        return tokens.map((token) => ({
            id: token._id,
            ...(0, lodash_1.omit)(token, ['_id', '__v']),
        }));
    }
    async getTokenSecret(id) {
        const tokens = await this.getAccessTokens();
        if (!tokens) {
            return null;
        }
        return tokens.find((token) => String(token._id) === id);
    }
    async generateAccessToken() {
        const ap = (0, async_1.customAlphabet)(other_constant_1.alphabet, 40);
        const nanoid = await ap();
        return `txo${nanoid}`;
    }
    isCustomToken(token) {
        return token.startsWith('txo') && token.length - 3 === 40;
    }
    async verifyCustomToken(token) {
        const user = await this.userModel.findOne({}).lean().select('+apiToken');
        if (!user) {
            return [false, null];
        }
        const tokens = user.apiToken;
        if (!tokens || !Array.isArray(tokens)) {
            return [false, null];
        }
        const valid = tokens.some((doc) => {
            if (doc.token === token) {
                if (typeof doc.expired === 'undefined') {
                    return true;
                }
                else if ((0, lodash_1.isDate)(doc.expired)) {
                    const isExpired = (0, dayjs_1.default)(new Date()).isAfter(doc.expired);
                    return isExpired ? false : true;
                }
            }
            return false;
        });
        return valid ? [true, user] : [false, null];
    }
    async saveToken(model) {
        await this.userModel.updateOne({}, {
            $push: {
                apiToken: { created: new Date(), ...model },
            },
        });
        return model;
    }
    async deleteToken(id) {
        await this.userModel.updateOne({}, {
            $pull: {
                apiToken: {
                    _id: id,
                },
            },
        });
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, model_transformer_1.InjectModel)(user_model_1.UserModel)),
    __metadata("design:paramtypes", [Object, helper_jwt_service_1.JWTService])
], AuthService);
exports.AuthService = AuthService;
