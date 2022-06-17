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
exports.AlbumController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const mongoose_1 = require("mongoose");
const auth_decorator_1 = require("../../common/decorator/auth.decorator");
const openapi_decorator_1 = require("../../common/decorator/openapi.decorator");
const role_decorator_1 = require("../../common/decorator/role.decorator");
const cant_find_exception_1 = require("../../common/exceptions/cant-find.exception");
const id_dto_1 = require("../../shared/dto/id.dto");
const query_util_1 = require("../../utils/query.util");
const photo_service_1 = require("../photo/photo.service");
const album_dto_1 = require("./album.dto");
const album_model_1 = require("./album.model");
const album_service_1 = require("./album.service");
let AlbumController = class AlbumController {
    constructor(albumService, photoService) {
        this.albumService = albumService;
        this.photoService = photoService;
    }
    async getAlbums(query, isMaster) {
        const { ids, joint } = query;
        if (ids) {
            const ignoreKeys = '-text -summary -hide -images -commentsIndex';
            if (joint) {
                const map = new Object();
                await Promise.all(ids.map(async (id) => {
                    const item = await this.photoService.model
                        .find({ albumId: id, ...(0, query_util_1.addConditionToSeeHideContent)(isMaster) }, ignoreKeys)
                        .sort({ created: -1 })
                        .lean();
                    map[id] = item;
                    return id;
                }));
                return { entries: map };
            }
            else {
                const map = new Object();
                await Promise.all(ids.map(async (id) => {
                    const posts = await this.photoService.model
                        .find({ albumId: id, ...(0, query_util_1.addConditionToSeeHideContent)(isMaster) }, ignoreKeys)
                        .sort({ created: -1 })
                        .lean();
                    const album = await this.albumService.findAlbumById(id);
                    map[id] = Object.assign({ ...album, children: posts });
                    return id;
                }));
                return { entries: map };
            }
        }
        return await this.albumService.findAllAlbum();
    }
    async getAlbumById({ query }, isMaster) {
        if (!query) {
            throw new common_1.BadRequestException();
        }
        const isId = mongoose_1.Types.ObjectId.isValid(query);
        const res = isId
            ? await this.albumService.model
                .findById(query)
                .sort({ created: -1 })
                .lean()
            : await this.albumService.model
                .findOne({ slug: query })
                .sort({ created: -1 })
                .lean();
        if (!res) {
            throw new cant_find_exception_1.CannotFindException();
        }
        const children = (await this.albumService.findAlbumPost(res._id, {
            $and: [
                (0, query_util_1.addConditionToSeeHideContent)(isMaster),
            ],
        })) || [];
        return { data: { ...res, children } };
    }
    async create(body) {
        const { name, slug } = body;
        return this.albumService.model.create({ name, slug: slug !== null && slug !== void 0 ? slug : name });
    }
    async modify(params, body) {
        const { slug, name } = body;
        const { id } = params;
        await this.albumService.model.updateOne({ _id: id }, {
            slug,
            name,
        });
        return await this.albumService.model.findById(id);
    }
    async patch(params, body) {
        const { id } = params;
        await this.albumService.model.updateOne({ _id: id }, body);
        return;
    }
    async deleteAlbum(params) {
        const { id } = params;
        const album = await this.albumService.model.findById(id);
        if (!album) {
            throw new cant_find_exception_1.CannotFindException();
        }
        const postsInAlbum = await this.albumService.findPostsInAlbum(album._id);
        if (postsInAlbum.length > 0) {
            throw new common_1.BadRequestException('该分类中有其他文章, 无法被删除');
        }
        const res = await this.albumService.model.deleteOne({
            _id: album._id,
        });
        if ((await this.albumService.model.countDocuments({})) === 0) {
            await this.albumService.createDefaultAlbum();
        }
        return res;
    }
};
__decorate([
    (0, common_1.Get)('/'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, role_decorator_1.IsMaster)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [album_dto_1.MultiAlbumsQueryDto, Boolean]),
    __metadata("design:returntype", Promise)
], AlbumController.prototype, "getAlbums", null);
__decorate([
    (0, common_1.Get)('/:query'),
    (0, swagger_1.ApiQuery)({
        description: '混合查询 分类 和 标签云',
        name: 'tag',
        enum: ['true', 'false'],
        required: false,
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, role_decorator_1.IsMaster)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [album_dto_1.SlugOrIdDto, Boolean]),
    __metadata("design:returntype", Promise)
], AlbumController.prototype, "getAlbumById", null);
__decorate([
    (0, common_1.Post)('/'),
    (0, auth_decorator_1.Auth)(),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [album_model_1.AlbumModel]),
    __metadata("design:returntype", Promise)
], AlbumController.prototype, "create", null);
__decorate([
    (0, common_1.Put)('/:id'),
    (0, auth_decorator_1.Auth)(),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.MongoIdDto, album_model_1.AlbumModel]),
    __metadata("design:returntype", Promise)
], AlbumController.prototype, "modify", null);
__decorate([
    (0, common_1.Patch)('/:id'),
    (0, common_1.HttpCode)(204),
    (0, auth_decorator_1.Auth)(),
    openapi.ApiResponse({ status: 204 }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.MongoIdDto, album_model_1.PartialAlbumModel]),
    __metadata("design:returntype", Promise)
], AlbumController.prototype, "patch", null);
__decorate([
    (0, common_1.Delete)('/:id'),
    (0, auth_decorator_1.Auth)(),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.MongoIdDto]),
    __metadata("design:returntype", Promise)
], AlbumController.prototype, "deleteAlbum", null);
AlbumController = __decorate([
    (0, common_1.Controller)({ path: 'albums' }),
    openapi_decorator_1.ApiName,
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => photo_service_1.PhotoService))),
    __metadata("design:paramtypes", [album_service_1.AlbumService,
        photo_service_1.PhotoService])
], AlbumController);
exports.AlbumController = AlbumController;
