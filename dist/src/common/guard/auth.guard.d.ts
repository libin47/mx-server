/// <reference types="node" />
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthService } from '~/modules/auth/auth.service';
import { ConfigsService } from '~/modules/configs/configs.service';
export declare class AuthGuard implements CanActivate {
    protected readonly authService: AuthService;
    protected readonly configs: ConfigsService;
    constructor(authService: AuthService, configs: ConfigsService);
    canActivate(context: ExecutionContext): Promise<any>;
    getRequest(context: ExecutionContext): import("fastify").FastifyRequest<import("fastify/types/route").RouteGenericInterface, import("http").Server, import("http").IncomingMessage, unknown, import("fastify").FastifyLoggerInstance> & {
        user?: import("../../modules/user/user.model").UserModel | undefined;
    } & Record<string, any>;
}
