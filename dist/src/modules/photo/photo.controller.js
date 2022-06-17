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
exports.PhotoController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const mongoose_1 = require("mongoose");
const auth_decorator_1 = require("../../common/decorator/auth.decorator");
const http_decorator_1 = require("../../common/decorator/http.decorator");
const ip_decorator_1 = require("../../common/decorator/ip.decorator");
const openapi_decorator_1 = require("../../common/decorator/openapi.decorator");
const role_decorator_1 = require("../../common/decorator/role.decorator");
const update_count_decorator_1 = require("../../common/decorator/update-count.decorator");
const cant_find_exception_1 = require("../../common/exceptions/cant-find.exception");
const helper_counting_service_1 = require("../../processors/helper/helper.counting.service");
const id_dto_1 = require("../../shared/dto/id.dto");
const query_util_1 = require("../../utils/query.util");
const photo_dto_1 = require("./photo.dto");
const photo_model_1 = require("./photo.model");
const photo_service_1 = require("./photo.service");
let PhotoController = class PhotoController {
    constructor(photoService, countingService) {
        this.photoService = photoService;
        this.countingService = countingService;
    }
    async getPaginate(query, master) {
        const { size, select, page, year, sortBy, sortOrder, album } = query;
        return await this.photoService.findWithPaginator({
            ...(0, query_util_1.addYearCondition)(year),
            ...(0, query_util_1.addConditionToSeeHideContent)(master),
            albumId: album,
        }, {
            limit: size,
            page,
            select,
            sort: sortBy ? { [sortBy]: sortOrder || -1 } : { created: -1 },
            populate: 'album',
        });
    }
    async getById(params, isMaster) {
        const { id } = params;
        const doc = await this.photoService.model.findById(id);
        if (!doc) {
            throw new cant_find_exception_1.CannotFindException();
        }
        return doc;
    }
    async getLatest(isMaster) {
        return this.photoService.model
            .findOne({ ...(0, query_util_1.addConditionToSeeHideContent)(isMaster) })
            .sort({ created: -1 })
            .lean();
    }
    async getByCateAndSlug(params, isMaster) {
        const { album, slug } = params;
        const albumDocument = await this.photoService.getAlbumBySlug(album);
        if (!albumDocument) {
            throw new common_1.NotFoundException('该分类未找到 (｡•́︿•̀｡)');
        }
        const photoDocument = await this.photoService.model
            .findOne({
            slug,
            albumId: albumDocument._id,
        })
            .populate('album');
        if (!photoDocument) {
            throw new cant_find_exception_1.CannotFindException();
        }
        return photoDocument.toJSON();
    }
    async create(body) {
        var _a;
        const _id = new mongoose_1.Types.ObjectId();
        return await this.photoService.create({
            ...body,
            created: new Date(),
            modified: null,
            slug: (_a = body.slug) !== null && _a !== void 0 ? _a : _id.toHexString(),
        });
    }
    async update(params, body) {
        await this.photoService.updateById(params.id, body);
        return this.photoService.findById(params.id);
    }
    async patch(params, body) {
        return await this.photoService.updateById(params.id, body);
    }
    async deletePhoto(params) {
        const { id } = params;
        await this.photoService.deletePhoto(id);
        return;
    }
    async thumbsUpArticle(query, location) {
        const { ip } = location;
        const { id } = query;
        try {
            const res = await this.countingService.updateLikeCount('Post', id, ip);
            if (!res) {
                throw new common_1.BadRequestException('你已经支持过啦!');
            }
        }
        catch (e) {
            throw new common_1.BadRequestException(e);
        }
        return;
    }
};
__decorate([
    (0, common_1.Get)('/'),
    http_decorator_1.Paginator,
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, role_decorator_1.IsMaster)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [photo_dto_1.PhotoQueryDto, Boolean]),
    __metadata("design:returntype", Promise)
], PhotoController.prototype, "getPaginate", null);
__decorate([
    (0, common_1.Get)('/:id'),
    (0, update_count_decorator_1.VisitDocument)('Post'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, role_decorator_1.IsMaster)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.MongoIdDto, Boolean]),
    __metadata("design:returntype", Promise)
], PhotoController.prototype, "getById", null);
__decorate([
    (0, common_1.Get)('/latest'),
    (0, update_count_decorator_1.VisitDocument)('Post'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, role_decorator_1.IsMaster)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean]),
    __metadata("design:returntype", Promise)
], PhotoController.prototype, "getLatest", null);
__decorate([
    (0, common_1.Get)('/:album/:slug'),
    (0, swagger_1.ApiOperation)({ summary: '根据分类名和自定义别名获取' }),
    (0, update_count_decorator_1.VisitDocument)('Post'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, role_decorator_1.IsMaster)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [photo_dto_1.AlbumAndSlugDto, Boolean]),
    __metadata("design:returntype", Promise)
], PhotoController.prototype, "getByCateAndSlug", null);
__decorate([
    (0, common_1.Post)('/'),
    (0, auth_decorator_1.Auth)(),
    (0, common_1.HttpCode)(201),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [photo_model_1.PhotoModel]),
    __metadata("design:returntype", Promise)
], PhotoController.prototype, "create", null);
__decorate([
    (0, common_1.Put)('/:id'),
    (0, auth_decorator_1.Auth)(),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.MongoIdDto, photo_model_1.PhotoModel]),
    __metadata("design:returntype", Promise)
], PhotoController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)('/:id'),
    (0, auth_decorator_1.Auth)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.MongoIdDto, photo_model_1.PartialPhotoModel]),
    __metadata("design:returntype", Promise)
], PhotoController.prototype, "patch", null);
__decorate([
    (0, common_1.Delete)('/:id'),
    (0, auth_decorator_1.Auth)(),
    (0, common_1.HttpCode)(204),
    openapi.ApiResponse({ status: 204 }),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.MongoIdDto]),
    __metadata("design:returntype", Promise)
], PhotoController.prototype, "deletePhoto", null);
__decorate([
    (0, common_1.Get)('/_thumbs-up'),
    (0, common_1.HttpCode)(204),
    openapi.ApiResponse({ status: 204 }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, ip_decorator_1.IpLocation)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.MongoIdDto, Object]),
    __metadata("design:returntype", Promise)
], PhotoController.prototype, "thumbsUpArticle", null);
PhotoController = __decorate([
    (0, common_1.Controller)('photos'),
    openapi_decorator_1.ApiName,
    __metadata("design:paramtypes", [photo_service_1.PhotoService,
        helper_counting_service_1.CountingService])
], PhotoController);
exports.PhotoController = PhotoController;
