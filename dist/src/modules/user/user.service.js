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
var UserService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcrypt_1 = require("bcrypt");
const common_1 = require("@nestjs/common");
const master_lost_exception_1 = require("../../common/exceptions/master-lost.exception");
const cache_constant_1 = require("../../constants/cache.constant");
const cache_service_1 = require("../../processors/cache/cache.service");
const model_transformer_1 = require("../../transformers/model.transformer");
const utils_1 = require("../../utils");
const redis_util_1 = require("../../utils/redis.util");
const auth_service_1 = require("../auth/auth.service");
const user_model_1 = require("./user.model");
let UserService = UserService_1 = class UserService {
    constructor(userModel, authService, redis) {
        this.userModel = userModel;
        this.authService = authService;
        this.redis = redis;
        this.Logger = new common_1.Logger(UserService_1.name);
    }
    get model() {
        return this.userModel;
    }
    async login(username, password) {
        const user = await this.userModel.findOne({ username }).select('+password');
        if (!user) {
            await (0, utils_1.sleep)(3000);
            throw new common_1.ForbiddenException('用户名不正确');
        }
        if (!(0, bcrypt_1.compareSync)(password, user.password)) {
            await (0, utils_1.sleep)(3000);
            throw new common_1.ForbiddenException('密码不正确');
        }
        return user;
    }
    async getMasterInfo(getLoginIp = false) {
        var _a;
        const user = await this.userModel
            .findOne()
            .select(`${getLoginIp ? ' +lastLoginIp' : ''}`)
            .lean({ virtuals: true });
        if (!user) {
            throw new common_1.BadRequestException('没有完成初始化!');
        }
        const avatar = (_a = user.avatar) !== null && _a !== void 0 ? _a : (0, utils_1.getAvatar)(user.mail);
        return { ...user, avatar };
    }
    async hasMaster() {
        return !!(await this.userModel.countDocuments());
    }
    async getMaster() {
        const master = await this.userModel.findOne().lean();
        if (!master) {
            throw new common_1.BadRequestException('我还没有主人');
        }
        return master;
    }
    async createMaster(model) {
        const hasMaster = await this.hasMaster();
        if (hasMaster) {
            throw new common_1.BadRequestException('我已经有一个主人了哦');
        }
        const res = await this.userModel.create({ ...model });
        const token = this.authService.jwtServicePublic.sign(res._id);
        return { token, username: res.username };
    }
    async patchUserData(user, data) {
        const { password } = data;
        const doc = { ...data };
        if (password !== undefined) {
            const { _id } = user;
            const currentUser = await this.userModel
                .findById(_id)
                .select('+password +apiToken');
            if (!currentUser) {
                throw new master_lost_exception_1.MasterLostException();
            }
            const isSamePassword = (0, bcrypt_1.compareSync)(password, currentUser.password);
            if (isSamePassword) {
                throw new common_1.UnprocessableEntityException('密码可不能和原来的一样哦');
            }
            await this.authService.jwtServicePublic.revokeAll();
        }
        return await this.userModel.updateOne({ _id: user._id }, doc);
    }
    signout(token) {
        return this.authService.jwtServicePublic.revokeToken(token);
    }
    async recordFootstep(ip) {
        const master = await this.userModel.findOne();
        if (!master) {
            throw new master_lost_exception_1.MasterLostException();
        }
        const PrevFootstep = {
            lastLoginTime: master.lastLoginTime || new Date(1586090559569),
            lastLoginIp: master.lastLoginIp || null,
        };
        await master.updateOne({
            lastLoginTime: new Date(),
            lastLoginIp: ip,
        });
        process.nextTick(async () => {
            const redisClient = this.redis.getClient();
            await redisClient.sadd((0, redis_util_1.getRedisKey)(cache_constant_1.RedisKeys.LoginRecord), JSON.stringify({ date: new Date().toISOString(), ip }));
        });
        this.Logger.warn(`主人已登录, IP: ${ip}`);
        return PrevFootstep;
    }
};
UserService = UserService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, model_transformer_1.InjectModel)(user_model_1.UserModel)),
    __metadata("design:paramtypes", [Object, auth_service_1.AuthService,
        cache_service_1.CacheService])
], UserService);
exports.UserService = UserService;
