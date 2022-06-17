import { FastifyRequest } from 'fastify';
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CacheService } from '~/processors/cache/cache.service';
export declare type IdempotenceOption = {
    errorMessage?: string;
    pendingMessage?: string;
    handler?: (req: FastifyRequest) => any;
    expired?: number;
    generateKey?: (req: FastifyRequest) => string;
    disableGenerateKey?: boolean;
};
export declare class IdempotenceInterceptor implements NestInterceptor {
    private readonly cacheService;
    private readonly reflector;
    constructor(cacheService: CacheService, reflector: Reflector);
    intercept(context: ExecutionContext, next: CallHandler): Promise<any>;
    private generateKey;
}
