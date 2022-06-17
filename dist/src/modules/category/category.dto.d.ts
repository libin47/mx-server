import { CategoryType } from './category.model';
export declare class SlugOrIdDto {
    query?: string;
}
export declare class MultiQueryTagAndCategoryDto {
    tag?: boolean | string;
}
export declare class MultiCategoriesQueryDto {
    ids?: Array<string>;
    joint?: boolean;
    type: CategoryType;
}
