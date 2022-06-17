import { Ref } from '@typegoose/typegoose';
import { CountMixed as Count, PhotoBaseModel } from '~/shared/model/base.model';
import { Paginator } from '~/shared/interface/paginator.interface';
import { AlbumModel as Album } from '../album/album.model';
export declare class PhotoModel extends PhotoBaseModel {
    slug: string;
    albumId: Ref<Album>;
    album: Ref<Album>;
    hide?: boolean;
    copyright?: boolean;
    count?: Count;
    static get protectedKeys(): string[];
}
declare const PartialPhotoModel_base: import("@nestjs/mapped-types").MappedType<Partial<PhotoModel>>;
export declare class PartialPhotoModel extends PartialPhotoModel_base {
}
export declare class PhotoPaginatorModel {
    data: PhotoModel[];
    pagination: Paginator;
}
export {};
