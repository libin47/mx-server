/// <reference types="node" />
import { Observable } from 'rxjs';
import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class SpiderGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>;
    getRequest(context: ExecutionContext): import("fastify").FastifyRequest<import("fastify/types/route").RouteGenericInterface, import("http").Server, import("http").IncomingMessage, unknown, import("fastify").FastifyLoggerInstance> & {
        user?: import("../../modules/user/user.model").UserModel | undefined;
    } & Record<string, any>;
}
