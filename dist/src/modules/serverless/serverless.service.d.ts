import { CacheService } from '~/processors/cache/cache.service';
import { DatabaseService } from '~/processors/database/database.service';
import { AssetService } from '~/processors/helper/helper.asset.service';
import { HttpService } from '~/processors/helper/helper.http.service';
import { SnippetModel } from '../snippet/snippet.model';
import { FunctionContextRequest, FunctionContextResponse } from './function.types';
export declare class ServerlessService {
    private readonly snippetModel;
    private readonly assetService;
    private readonly httpService;
    private readonly databaseService;
    private readonly cacheService;
    constructor(snippetModel: MongooseModel<SnippetModel>, assetService: AssetService, httpService: HttpService, databaseService: DatabaseService, cacheService: CacheService);
    get model(): MongooseModel<SnippetModel>;
    private mockStorageCache;
    mockGetMaster(): Promise<import("mongodb").Document | null>;
    mockDb(namespace: string): {
        readonly get: (key: string) => Promise<any>;
        readonly find: (condition: KV) => Promise<import("mongodb").Document[]>;
        readonly set: (key: string, value: any) => Promise<import("mongodb").UpdateResult | import("mongodb").InsertOneResult<import("mongodb").Document>>;
        readonly insert: (key: string, value: any) => Promise<import("mongodb").InsertOneResult<import("mongodb").Document>>;
        readonly update: (key: string, value: any) => Promise<import("mongodb").UpdateResult>;
        readonly del: (key: string) => Promise<import("mongodb").DeleteResult>;
    };
    injectContextIntoServerlessFunctionAndCall(model: SnippetModel, context: {
        req: FunctionContextRequest;
        res: FunctionContextResponse;
    }): Promise<any>;
    private getBabelOptions;
    private convertTypescriptCode;
    private requireModuleIdSet;
    private cleanRequireCache;
    private resolvePath;
    private inNewContextRequire;
    isValidServerlessFunction(raw: string): Promise<any>;
}
