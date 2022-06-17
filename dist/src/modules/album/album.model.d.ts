import { DocumentType } from '@typegoose/typegoose';
import { BaseModel } from '~/shared/model/base.model';
export declare type AlbumDocument = DocumentType<AlbumModel>;
export declare class AlbumModel extends BaseModel {
    name: string;
    slug: string;
}
declare const PartialAlbumModel_base: import("@nestjs/mapped-types").MappedType<Partial<AlbumModel>>;
export declare class PartialAlbumModel extends PartialAlbumModel_base {
}
export {};
