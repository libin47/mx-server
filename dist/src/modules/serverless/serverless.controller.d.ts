import { FastifyReply, FastifyRequest } from 'fastify';
import { ServerlessReferenceDto } from './serverless.dto';
import { ServerlessService } from './serverless.service';
export declare class ServerlessController {
    private readonly serverlessService;
    constructor(serverlessService: ServerlessService);
    getCodeDefined(): Promise<string>;
    runServerlessFunctionWildcard(param: ServerlessReferenceDto, isMaster: boolean, req: FastifyRequest, reply: FastifyReply): Promise<void>;
    runServerlessFunction(param: ServerlessReferenceDto, isMaster: boolean, req: FastifyRequest, reply: FastifyReply): Promise<void>;
}
