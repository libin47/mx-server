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
exports.SearchController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const cache_decorator_1 = require("../../common/decorator/cache.decorator");
const openapi_decorator_1 = require("../../common/decorator/openapi.decorator");
const role_decorator_1 = require("../../common/decorator/role.decorator");
const search_dto_1 = require("./search.dto");
const search_service_1 = require("./search.service");
let SearchController = class SearchController {
    constructor(searchService) {
        this.searchService = searchService;
    }
    searchByType(query, isMaster, type) {
        type = type.toLowerCase();
        switch (type) {
            case 'post': {
                return this.searchService.searchPost(query);
            }
            case 'note':
                return this.searchService.searchNote(query, isMaster);
            default:
                throw new common_1.BadRequestException(`Invalid search type: ${type}`);
        }
    }
    async search(query) {
        return this.searchService.searchAlgolia(query);
    }
};
__decorate([
    (0, common_1.Get)('/:type'),
    cache_decorator_1.HttpCache.disable,
    __param(0, (0, common_1.Query)()),
    __param(1, (0, role_decorator_1.IsMaster)()),
    __param(2, (0, common_1.Param)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_dto_1.SearchDto, Boolean, String]),
    __metadata("design:returntype", void 0)
], SearchController.prototype, "searchByType", null);
__decorate([
    (0, common_1.Get)('/algolia'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_dto_1.SearchDto]),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "search", null);
SearchController = __decorate([
    (0, common_1.Controller)('search'),
    openapi_decorator_1.ApiName,
    __metadata("design:paramtypes", [search_service_1.SearchService])
], SearchController);
exports.SearchController = SearchController;
