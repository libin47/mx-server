/// <reference types="node" />
import { Observable } from 'rxjs';
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
export declare class LoggingInterceptor implements NestInterceptor {
    private logger;
    constructor();
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any>;
    getRequest(context: ExecutionContext): import("fastify").FastifyRequest<import("fastify/types/route").RouteGenericInterface, import("http").Server, import("http").IncomingMessage, unknown, import("fastify").FastifyLoggerInstance> & {
        user?: import("../../modules/user/user.model").UserModel | undefined;
    } & Record<string, any>;
}
