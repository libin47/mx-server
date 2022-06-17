/// <reference types="node" />
import { NestMiddleware } from '@nestjs/common';
import { IncomingMessage, ServerResponse } from 'http';
export declare class AttachHeaderTokenMiddleware implements NestMiddleware {
    use(req: IncomingMessage, res: ServerResponse, next: () => void): Promise<void>;
}
