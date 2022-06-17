import { PagerDto } from '~/shared/dto/pager.dto';
export declare class NoteQueryDto extends PagerDto {
    sortBy?: string;
    sortOrder?: 1 | -1;
}
export declare class NotePasswordQueryDto {
    password?: string;
}
export declare class QAQueryDto {
    answer?: string;
}
export declare class ListQueryDto {
    size: number;
}
export declare class NidType {
    nid: number;
}
