import { PagerDto } from '~/shared/dto/pager.dto';
export declare class PhotoQueryDto extends PagerDto {
    readonly sortBy?: string;
    readonly sortOrder?: 1 | -1;
    readonly album?: string;
}
export declare class AlbumAndSlugDto {
    readonly album: string;
    readonly slug: string;
}
