import { ExecutionContext } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
export declare function getNestExecutionContextRequest(context: ExecutionContext): FastifyRequest & KV;
