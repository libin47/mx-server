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
exports.PhotoService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const class_validator_1 = require("class-validator");
const lodash_1 = require("lodash");
const model_transformer_1 = require("../../transformers/model.transformer");
const event_bus_constant_1 = require("../../constants/event-bus.constant");
const business_event_constant_1 = require("../../constants/business-event.constant");
const events_gateway_1 = require("../../processors/gateway/web/events.gateway");
const helper_image_service_1 = require("../../processors/helper/helper.image.service");
const album_service_1 = require("../album/album.service");
const comment_model_1 = require("../comment/comment.model");
const photo_model_1 = require("./photo.model");
let PhotoService = class PhotoService {
    constructor(photoModel, commentModel, albumService, webgateway, imageService, eventEmitter) {
        this.photoModel = photoModel;
        this.commentModel = commentModel;
        this.albumService = albumService;
        this.webgateway = webgateway;
        this.imageService = imageService;
        this.eventEmitter = eventEmitter;
    }
    get model() {
        return this.photoModel;
    }
    findWithPaginator(condition, options) {
        return this.photoModel.paginate(condition, options);
    }
    async create(photo) {
        const { albumId } = photo;
        const album = await this.albumService.findAlbumById(albumId);
        if (!album) {
            throw new common_1.BadRequestException('分类丢失了 ಠ_ಠ');
        }
        if (await this.isAvailableSlug(photo.slug)) {
            throw new common_1.BadRequestException('slug 重复');
        }
        const res = await this.photoModel.create({
            ...photo,
            albumId: album.id,
            created: new Date(),
            modified: null,
        });
        process.nextTick(async () => {
            this.eventEmitter.emit(event_bus_constant_1.EventBusEvents.CleanAggregateCache);
            await Promise.all([
                this.webgateway.broadcast(business_event_constant_1.BusinessEvents.PHOTO_CREATE, {
                    ...res.toJSON(),
                    album,
                }),
            ]);
        });
        return res;
    }
    async findById(id) {
        const doc = await this.photoModel.findById(id).populate('album');
        if (!doc) {
            throw new common_1.BadRequestException('文章不存在');
        }
        return doc;
    }
    async updateById(id, data) {
        const oldDocument = await this.photoModel.findById(id).lean();
        if (!oldDocument) {
            throw new common_1.BadRequestException('文章不存在');
        }
        const { albumId } = data;
        if (albumId && albumId !== oldDocument.albumId) {
            const album = await this.albumService.findAlbumById(albumId);
            if (!album) {
                throw new common_1.BadRequestException('分类不存在');
            }
        }
        if ([data.text, data.title, data.slug].some((i) => (0, class_validator_1.isDefined)(i))) {
            const now = new Date();
            data.modified = now;
        }
        const updated = await this.photoModel.updateOne({
            _id: id,
        }, (0, lodash_1.omit)(data, photo_model_1.PhotoModel.protectedKeys), { new: true });
        process.nextTick(async () => {
            this.eventEmitter.emit(event_bus_constant_1.EventBusEvents.CleanAggregateCache);
            await Promise.all([
                this.imageService.recordImageDimensions(this.photoModel, id),
                this.webgateway.broadcast(business_event_constant_1.BusinessEvents.PHOTO_UPDATE, await this.photoModel.findById(id)),
            ]);
        });
    }
    async deletePhoto(id) {
        await Promise.all([
            this.model.deleteOne({ _id: id }),
            this.commentModel.deleteMany({ pid: id }),
        ]);
        process.nextTick(async () => {
            await this.webgateway.broadcast(business_event_constant_1.BusinessEvents.PHOTO_DELETE, id);
        });
    }
    async getAlbumBySlug(slug) {
        return await this.albumService.model.findOne({ slug });
    }
    async isAvailableSlug(slug) {
        return !!(await this.photoModel.countDocuments({ slug }));
    }
};
PhotoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, model_transformer_1.InjectModel)(photo_model_1.PhotoModel)),
    __param(1, (0, model_transformer_1.InjectModel)(comment_model_1.CommentModel)),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => album_service_1.AlbumService))),
    __metadata("design:paramtypes", [Object, Object, album_service_1.AlbumService,
        events_gateway_1.WebEventsGateway,
        helper_image_service_1.ImageService,
        event_emitter_1.EventEmitter2])
], PhotoService);
exports.PhotoService = PhotoService;
