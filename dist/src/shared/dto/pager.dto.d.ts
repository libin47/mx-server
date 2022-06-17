declare class DbQueryDto {
    db_query?: any;
}
export declare class PagerDto extends DbQueryDto {
    size: number;
    page: number;
    select?: string;
    sortBy?: string;
    sortOrder?: 1 | -1;
    year?: number;
    state?: number;
}
export declare class OffsetDto {
    before?: string;
    after?: string;
    size?: number;
}
export {};
