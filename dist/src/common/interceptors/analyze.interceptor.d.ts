import { Observable } from 'rxjs';
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { AnalyzeModel } from '~/modules/analyze/analyze.model';
import { OptionModel } from '~/modules/configs/configs.model';
import { CacheService } from '~/processors/cache/cache.service';
export declare class AnalyzeInterceptor implements NestInterceptor {
    private readonly model;
    private readonly options;
    private readonly cacheService;
    private parser;
    constructor(model: ReturnModelType<typeof AnalyzeModel>, options: ReturnModelType<typeof OptionModel>, cacheService: CacheService);
    init(): Promise<void>;
    intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>>;
}
