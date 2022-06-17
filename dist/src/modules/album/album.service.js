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
exports.AlbumService = void 0;
const common_1 = require("@nestjs/common");
const model_transformer_1 = require("../../transformers/model.transformer");
const photo_service_1 = require("../photo/photo.service");
const album_model_1 = require("./album.model");
let AlbumService = class AlbumService {
    constructor(albumModel, photoService) {
        this.albumModel = albumModel;
        this.photoService = photoService;
        this.createDefaultAlbum();
    }
    async findAlbumById(albumId) {
        const [album, count] = await Promise.all([
            this.model.findById(albumId).lean(),
            this.photoService.model.countDocuments({ albumId }),
        ]);
        return {
            ...album,
            count,
        };
    }
    async findAllAlbum() {
        const data = await this.model.find().lean();
        const counts = await Promise.all(data.map((item) => {
            const id = item._id;
            return this.photoService.model.countDocuments({ albumId: id });
        }));
        for (let i = 0; i < data.length; i++) {
            Reflect.set(data[i], 'count', counts[i]);
        }
        return data;
    }
    get model() {
        return this.albumModel;
    }
    async getPostTagsSum() {
        const data = await this.photoService.model.aggregate([
            { $project: { tags: 1 } },
            {
                $unwind: '$tags',
            },
            { $group: { _id: '$tags', count: { $sum: 1 } } },
            {
                $project: {
                    _id: 0,
                    name: '$_id',
                    count: 1,
                },
            },
        ]);
        return data;
    }
    async findAlbumPost(albumId, condition = {}) {
        return await this.photoService.model
            .find({
            albumId,
            ...condition,
        })
            .select('title created slug _id')
            .sort({ created: -1 });
    }
    async findPostsInAlbum(id) {
        return await this.photoService.model.find({
            albumId: id,
        });
    }
    async createDefaultAlbum() {
        if ((await this.model.countDocuments()) === 0) {
            return await this.model.create({
                name: '默认分类',
                slug: 'default',
            });
        }
    }
};
AlbumService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, model_transformer_1.InjectModel)(album_model_1.AlbumModel)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => photo_service_1.PhotoService))),
    __metadata("design:paramtypes", [Object, photo_service_1.PhotoService])
], AlbumService);
exports.AlbumService = AlbumService;
