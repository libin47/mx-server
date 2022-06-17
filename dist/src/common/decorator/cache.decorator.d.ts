interface ICacheOption {
    ttl?: number;
    key?: string;
    disable?: boolean;
}
export declare function HttpCache(option: ICacheOption): MethodDecorator;
export declare namespace HttpCache {
    var disable: (_: any, __: any, descriptor: any) => void;
}
export {};
