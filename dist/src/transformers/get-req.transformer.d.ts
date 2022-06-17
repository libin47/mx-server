import { FastifyRequest } from 'fastify';
import { ExecutionContext } from '@nestjs/common';
import { UserModel } from '~/modules/user/user.model';
export declare function getNestExecutionContextRequest(context: ExecutionContext): FastifyRequest & {
    user?: UserModel;
} & Record<string, any>;
