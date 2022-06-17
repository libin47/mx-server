import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { EventManagerService } from '~/processors/helper/helper.event.service';
export declare class AllExceptionsFilter implements ExceptionFilter {
    private reflector;
    private readonly eventManager;
    private readonly logger;
    private errorLogPipe;
    constructor(reflector: Reflector, eventManager: EventManagerService);
    catch(exception: unknown, host: ArgumentsHost): void;
}
