export declare class LogQueryDto {
    type?: 'out' | 'error';
    index: number;
    filename: string;
}
export declare class LogTypeDto {
    type: 'pm2' | 'native';
}
