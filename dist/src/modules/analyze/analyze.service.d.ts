/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indizes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose" />
/// <reference types="mongoose-paginate-v2" />
import { ReturnModelType } from '@typegoose/typegoose';
import { CacheService } from '~/processors/cache/cache.service';
import { OptionModel } from '../configs/configs.model';
import { AnalyzeModel } from './analyze.model';
export declare class AnalyzeService {
    private readonly options;
    private readonly analyzeModel;
    private readonly cacheService;
    constructor(options: ReturnModelType<typeof OptionModel>, analyzeModel: MongooseModel<AnalyzeModel>, cacheService: CacheService);
    get model(): MongooseModel<AnalyzeModel>;
    getRangeAnalyzeData(from?: Date, to?: Date, options?: {
        limit?: number;
        page?: number;
    }): Promise<import("mongoose").PaginateResult<AnalyzeModel & import("mongoose").Document<any, any, any> & {
        _id: any;
    }>>;
    getCallTime(): Promise<{
        callTime: any;
        uv: any;
    }>;
    cleanAnalyzeRange(range: {
        from?: Date;
        to?: Date;
    }): Promise<void>;
    getIpAndPvAggregate(type: 'day' | 'week' | 'month' | 'all', returnObj?: boolean): Promise<{}>;
    getRangeOfTopPathVisitor(from?: Date, to?: Date): Promise<any[]>;
    getTodayAccessIp(): Promise<string[]>;
}
