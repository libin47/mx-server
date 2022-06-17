/// <reference types="node" />
import fs from 'fs/promises';
import { HttpService } from './helper.http.service';
export declare class AssetService {
    private readonly httpService;
    private logger;
    constructor(httpService: HttpService);
    embedAssetPath: string;
    private onlineAssetPath;
    private checkRoot;
    private checkAssetPath;
    private getUserCustomAsset;
    getAsset(path: string, options: Parameters<typeof fs.readFile>[1]): Promise<string | Buffer | null>;
    writeUserCustomAsset(path: string, data: any, options: Parameters<typeof fs.writeFile>[2]): Promise<void>;
    removeUserCustomAsset(path: string): Promise<void>;
}
