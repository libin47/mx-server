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
import { CacheService } from '~/processors/cache/cache.service';
import { PagerDto } from '~/shared/dto/pager.dto';
import { AnalyzeDto } from './analyze.dto';
import { AnalyzeService } from './analyze.service';
export declare class AnalyzeController {
    private readonly service;
    private readonly cacheService;
    constructor(service: AnalyzeService, cacheService: CacheService);
    getAnalyze(query: AnalyzeDto & Partial<PagerDto>): Promise<import("mongoose").PaginateResult<import("./analyze.model").AnalyzeModel & import("mongoose").Document<any, any, any> & {
        _id: any;
    }>>;
    getAnalyzeToday(query: Partial<PagerDto>): Promise<import("mongoose").PaginateResult<import("./analyze.model").AnalyzeModel & import("mongoose").Document<any, any, any> & {
        _id: any;
    }>>;
    getAnalyzeWeek(query: Partial<PagerDto>): Promise<import("mongoose").PaginateResult<import("./analyze.model").AnalyzeModel & import("mongoose").Document<any, any, any> & {
        _id: any;
    }>>;
    getFragment(): Promise<{
        today: {
            hour: string;
            key: string;
            value: any;
        }[];
        weeks: {
            day: string;
            key: string;
            value: any;
        }[];
        months: {
            date: any;
            key: string;
            value: any;
        }[];
        paths: any[];
        total: {
            callTime: any;
            uv: any;
        };
        today_ips: string[];
    }>;
    getTodayLikedArticle(): Promise<{
        id: string;
        ips: string[];
    }[]>;
    clearAnalyze(query: AnalyzeDto): Promise<void>;
}
