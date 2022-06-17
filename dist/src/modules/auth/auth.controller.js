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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = exports.TokenDto = void 0;
const openapi = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const swagger_1 = require("@nestjs/swagger");
const auth_decorator_1 = require("../../common/decorator/auth.decorator");
const openapi_decorator_1 = require("../../common/decorator/openapi.decorator");
const role_decorator_1 = require("../../common/decorator/role.decorator");
const event_bus_constant_1 = require("../../constants/event-bus.constant");
const id_dto_1 = require("../../shared/dto/id.dto");
const auth_service_1 = require("./auth.service");
class TokenDto {
}
__decorate([
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value: v }) => new Date(v)),
    __metadata("design:type", Date)
], TokenDto.prototype, "expired", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], TokenDto.prototype, "name", void 0);
exports.TokenDto = TokenDto;
let AuthController = class AuthController {
    constructor(authService, eventEmitter) {
        this.authService = authService;
        this.eventEmitter = eventEmitter;
    }
    checkLogged(isMaster) {
        return { ok: ~~isMaster, isGuest: !isMaster };
    }
    async getOrVerifyToken(token, id) {
        if (typeof token === 'string') {
            return await this.authService
                .verifyCustomToken(token)
                .then(([isValid]) => isValid);
        }
        if (id && typeof id === 'string' && (0, class_validator_1.isMongoId)(id)) {
            return await this.authService.getTokenSecret(id);
        }
        return await this.authService.getAllAccessToken();
    }
    async generateToken(body) {
        const { expired, name } = body;
        const token = await this.authService.generateAccessToken();
        const model = {
            expired,
            token,
            name,
        };
        await this.authService.saveToken(model);
        return model;
    }
    async deleteToken(query) {
        const { id } = query;
        const token = await this.authService
            .getAllAccessToken()
            .then((models) => models.find((model) => {
            return model.id === id;
        }))
            .then((model) => {
            return model === null || model === void 0 ? void 0 : model.token;
        });
        if (!token) {
            throw new common_1.NotFoundException(`token ${id} is not found`);
        }
        await this.authService.deleteToken(id);
        this.eventEmitter.emit(event_bus_constant_1.EventBusEvents.TokenExpired, token);
        return 'OK';
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: '判断当前 Token 是否有效 ' }),
    (0, swagger_1.ApiBearerAuth)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, role_decorator_1.IsMaster)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "checkLogged", null);
__decorate([
    (0, common_1.Get)('token'),
    (0, auth_decorator_1.Auth)(),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)('token')),
    __param(1, (0, common_1.Query)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getOrVerifyToken", null);
__decorate([
    (0, common_1.Post)('token'),
    (0, auth_decorator_1.Auth)(),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [TokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "generateToken", null);
__decorate([
    (0, common_1.Delete)('token'),
    (0, auth_decorator_1.Auth)(),
    openapi.ApiResponse({ status: 200, type: String }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.MongoIdDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "deleteToken", null);
AuthController = __decorate([
    (0, common_1.Controller)({
        path: 'auth',
    }),
    openapi_decorator_1.ApiName,
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        event_emitter_1.EventEmitter2])
], AuthController);
exports.AuthController = AuthController;
