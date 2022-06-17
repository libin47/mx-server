import { PagerDto } from '~/shared/dto/pager.dto';
export declare class PageQueryDto extends PagerDto {
    readonly sortBy?: string;
    readonly sortOrder?: 1 | -1;
}
