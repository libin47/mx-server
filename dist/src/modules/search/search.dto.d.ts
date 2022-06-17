import { PagerDto } from '../../shared/dto/pager.dto';
export declare class SearchDto extends PagerDto {
    keyword: string;
    orderBy: string;
    order: number;
    rawAlgolia?: boolean;
}
