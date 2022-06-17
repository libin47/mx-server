export declare const ServerlessStorageCollectionName = "serverlessstorages";
export declare class ServerlessStorageModel {
    namespace: string;
    key: string;
    value: any;
    get uniqueKey(): string;
}
