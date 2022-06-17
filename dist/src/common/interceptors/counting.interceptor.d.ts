import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CountingService } from '~/processors/helper/helper.counting.service';
export declare class CountingInterceptor<T> implements NestInterceptor<T, any> {
    private readonly countingService;
    private readonly reflector;
    constructor(countingService: CountingService, reflector: Reflector);
    intercept(context: ExecutionContext, next: CallHandler): import("rxjs").Observable<any>;
    get getRequest(): any;
}
