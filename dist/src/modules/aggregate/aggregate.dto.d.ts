export declare class TopQueryDto {
    size?: number;
}
export declare enum TimelineType {
    Post = 0,
    Note = 1,
    Photo = 2
}
export declare class TimelineQueryDto {
    sort?: -1 | 1;
    year?: number;
    type?: TimelineType;
}
