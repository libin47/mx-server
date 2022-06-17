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
exports.DebugController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const http_decorator_1 = require("../../common/decorator/http.decorator");
const openapi_decorator_1 = require("../../common/decorator/openapi.decorator");
const business_event_constant_1 = require("../../constants/business-event.constant");
const helper_event_service_1 = require("../../processors/helper/helper.event.service");
const mock_response_util_1 = require("../serverless/mock-response.util");
const serverless_service_1 = require("../serverless/serverless.service");
const snippet_model_1 = require("../snippet/snippet.model");
let DebugController = class DebugController {
    constructor(serverlessService, eventManager) {
        this.serverlessService = serverlessService;
        this.eventManager = eventManager;
    }
    async ide() {
        await sleep(11111);
        return { a: 1 };
    }
    async sendEvent(type, event, payload) {
        switch (type) {
            case 'web':
                this.eventManager.broadcast(event, payload, {
                    scope: business_event_constant_1.EventScope.TO_SYSTEM_VISITOR,
                });
                break;
            case 'admin':
                this.eventManager.broadcast(event, payload, {
                    scope: business_event_constant_1.EventScope.TO_SYSTEM_ADMIN,
                });
                break;
            case 'all':
                this.eventManager.broadcast(event, payload, { scope: business_event_constant_1.EventScope.ALL });
                break;
        }
    }
    async runFunction(functionString, req, res) {
        const model = new snippet_model_1.SnippetModel();
        model.name = 'debug';
        model.raw = functionString;
        model.private = false;
        model.type = snippet_model_1.SnippetType.Function;
        const result = await this.serverlessService.injectContextIntoServerlessFunctionAndCall(model, { req, res: (0, mock_response_util_1.createMockedContextResponse)(res) });
        if (!res.sent) {
            res.send(result);
        }
    }
};
__decorate([
    (0, common_1.Post)('/ide'),
    http_decorator_1.HTTPDecorators.Idempotence(),
    openapi.ApiResponse({ status: 201 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DebugController.prototype, "ide", null);
__decorate([
    (0, common_1.Post)('/events'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Query)('type')),
    __param(1, (0, common_1.Query)('event')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], DebugController.prototype, "sendEvent", null);
__decorate([
    (0, common_1.Post)('/function'),
    http_decorator_1.HTTPDecorators.Bypass,
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)('function')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], DebugController.prototype, "runFunction", null);
DebugController = __decorate([
    openapi_decorator_1.ApiName,
    (0, common_1.Controller)('debug'),
    __metadata("design:paramtypes", [serverless_service_1.ServerlessService,
        helper_event_service_1.EventManagerService])
], DebugController);
exports.DebugController = DebugController;
