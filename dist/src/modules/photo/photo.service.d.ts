/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indizes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose-paginate-v2" />
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FilterQuery, PaginateOptions } from 'mongoose';
import { WebEventsGateway } from '~/processors/gateway/web/events.gateway';
import { ImageService } from '~/processors/helper/helper.image.service';
import { AlbumService } from '../album/album.service';
import { CommentModel } from '../comment/comment.model';
import { PhotoModel } from './photo.model';
export declare class PhotoService {
    private readonly photoModel;
    private readonly commentModel;
    private albumService;
    private readonly webgateway;
    private readonly imageService;
    private readonly eventEmitter;
    constructor(photoModel: MongooseModel<PhotoModel>, commentModel: MongooseModel<CommentModel>, albumService: AlbumService, webgateway: WebEventsGateway, imageService: ImageService, eventEmitter: EventEmitter2);
    get model(): MongooseModel<PhotoModel>;
    findWithPaginator(condition?: FilterQuery<PhotoModel>, options?: PaginateOptions): Promise<import("mongoose").PaginateResult<PhotoModel & import("mongoose").Document<any, any, any> & {
        _id: any;
    }>>;
    create(photo: PhotoModel): Promise<import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & PhotoModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
        _id: any;
    }>;
    findById(id: string): Promise<import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & PhotoModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
        _id: any;
    }>;
    updateById(id: string, data: Partial<PhotoModel>): Promise<void>;
    deletePhoto(id: string): Promise<void>;
    getAlbumBySlug(slug: string): Promise<(import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & import("../album/album.model").AlbumModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
        _id: any;
    }) | null>;
    isAvailableSlug(slug: string): Promise<boolean>;
}
