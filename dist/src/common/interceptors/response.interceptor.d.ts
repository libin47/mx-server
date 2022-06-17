import { Observable } from 'rxjs';
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
export interface Response<T> {
    data: T;
}
export declare class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
    private readonly reflector;
    constructor(reflector: Reflector);
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>>;
}
