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
exports.ServerlessController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const auth_decorator_1 = require("../../common/decorator/auth.decorator");
const http_decorator_1 = require("../../common/decorator/http.decorator");
const openapi_decorator_1 = require("../../common/decorator/openapi.decorator");
const role_decorator_1 = require("../../common/decorator/role.decorator");
const snippet_model_1 = require("../snippet/snippet.model");
const mock_response_util_1 = require("./mock-response.util");
const serverless_dto_1 = require("./serverless.dto");
const serverless_service_1 = require("./serverless.service");
let ServerlessController = class ServerlessController {
    constructor(serverlessService) {
        this.serverlessService = serverlessService;
    }
    async getCodeDefined() {
        try {
            const text = await fs.readFile(path.join(cwd, 'assets', 'types', 'type.declare.ts'), {
                encoding: 'utf-8',
            });
            return text;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException('code defined file not found');
        }
    }
    async runServerlessFunctionWildcard(param, isMaster, req, reply) {
        return this.runServerlessFunction(param, isMaster, req, reply);
    }
    async runServerlessFunction(param, isMaster, req, reply) {
        const { name, reference } = param;
        const snippet = await this.serverlessService.model.findOne({
            name,
            reference,
            type: snippet_model_1.SnippetType.Function,
        });
        if (!snippet) {
            throw new common_1.NotFoundException('serverless function is not exist');
        }
        if (snippet.private && !isMaster) {
            throw new common_1.ForbiddenException('no permission to run this function');
        }
        const result = await this.serverlessService.injectContextIntoServerlessFunctionAndCall(snippet, { req, res: (0, mock_response_util_1.createMockedContextResponse)(reply) });
        if (!reply.sent) {
            reply.send(result);
        }
    }
};
__decorate([
    (0, common_1.Get)('/types'),
    (0, auth_decorator_1.Auth)(),
    http_decorator_1.HTTPDecorators.Bypass,
    (0, common_1.CacheTTL)(60 * 60 * 24),
    openapi.ApiResponse({ status: 200, type: String }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ServerlessController.prototype, "getCodeDefined", null);
__decorate([
    (0, common_1.Get)('/:reference/:name/*'),
    http_decorator_1.HTTPDecorators.Bypass,
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, role_decorator_1.IsMaster)()),
    __param(2, (0, common_1.Request)()),
    __param(3, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [serverless_dto_1.ServerlessReferenceDto, Boolean, Object, Object]),
    __metadata("design:returntype", Promise)
], ServerlessController.prototype, "runServerlessFunctionWildcard", null);
__decorate([
    (0, common_1.Get)('/:reference/:name'),
    http_decorator_1.HTTPDecorators.Bypass,
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, role_decorator_1.IsMaster)()),
    __param(2, (0, common_1.Request)()),
    __param(3, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [serverless_dto_1.ServerlessReferenceDto, Boolean, Object, Object]),
    __metadata("design:returntype", Promise)
], ServerlessController.prototype, "runServerlessFunction", null);
ServerlessController = __decorate([
    openapi_decorator_1.ApiName,
    (0, common_1.Controller)(['serverless', 'fn']),
    __metadata("design:paramtypes", [serverless_service_1.ServerlessService])
], ServerlessController);
exports.ServerlessController = ServerlessController;
