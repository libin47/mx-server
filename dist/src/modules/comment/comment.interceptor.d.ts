import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
export declare class CommentFilterEmailInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): import("rxjs").Observable<any>;
    get getRequest(): any;
}
