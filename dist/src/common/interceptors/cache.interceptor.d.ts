import { Observable } from 'rxjs';
import { CallHandler, ExecutionContext, HttpAdapterHost, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CacheService } from '~/processors/cache/cache.service';
export declare class HttpCacheInterceptor implements NestInterceptor {
    private readonly cacheManager;
    private readonly reflector;
    private readonly httpAdapterHost;
    constructor(cacheManager: CacheService, reflector: Reflector, httpAdapterHost: HttpAdapterHost);
    intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>>;
    trackBy(context: ExecutionContext): string | undefined;
    get getRequest(): any;
}
