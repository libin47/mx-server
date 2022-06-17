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
/// <reference types="mongoose" />
/// <reference types="mongoose-paginate-v2" />
import { MongoIdDto } from '~/shared/dto/id.dto';
import { PhotoService } from '../photo/photo.service';
import { MultiAlbumsQueryDto, SlugOrIdDto } from './album.dto';
import { AlbumModel, PartialAlbumModel } from './album.model';
import { AlbumService } from './album.service';
export declare class AlbumController {
    private readonly albumService;
    private readonly photoService;
    constructor(albumService: AlbumService, photoService: PhotoService);
    getAlbums(query: MultiAlbumsQueryDto, isMaster: boolean): Promise<Omit<import("mongoose")._LeanDocument<import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & AlbumModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
        _id: any;
    }>, "populate" | "init" | "validate" | "save" | "remove" | "update" | "updateOne" | "deleteOne" | "set" | "$getAllSubdocs" | "$ignore" | "$isDefault" | "$isDeleted" | "$getPopulatedDocs" | "$isEmpty" | "$isValid" | "$locals" | "$markValid" | "$model" | "$op" | "$session" | "$set" | "$where" | "baseModelName" | "collection" | "db" | "delete" | "depopulate" | "directModifiedPaths" | "equals" | "errors" | "get" | "getChanges" | "increment" | "invalidate" | "isDirectModified" | "isDirectSelected" | "isInit" | "isModified" | "isNew" | "isSelected" | "markModified" | "modifiedPaths" | "modelName" | "overwrite" | "$parent" | "populated" | "replaceOne" | "schema" | "toJSON" | "toObject" | "unmarkModified" | "validateSync" | "$isSingleNested">[] | {
        entries: Object;
    }>;
    getAlbumById({ query }: SlugOrIdDto, isMaster: boolean): Promise<{
        data: {
            children: (import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & import("../photo/photo.model").PhotoModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
                _id: any;
            })[];
            slug: string;
            created?: Date | undefined;
            id?: any;
            _id: any;
            __v?: any;
            name: string;
            typegooseName: () => string;
        };
    }>;
    create(body: AlbumModel): Promise<import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & AlbumModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
        _id: any;
    }>;
    modify(params: MongoIdDto, body: AlbumModel): Promise<(import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & AlbumModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
        _id: any;
    }) | null>;
    patch(params: MongoIdDto, body: PartialAlbumModel): Promise<void>;
    deleteAlbum(params: MongoIdDto): Promise<import("mongodb").DeleteResult>;
}
