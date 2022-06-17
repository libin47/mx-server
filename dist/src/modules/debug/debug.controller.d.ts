import { BusinessEvents } from '~/constants/business-event.constant';
import { EventManagerService } from '~/processors/helper/helper.event.service';
import { ServerlessService } from '../serverless/serverless.service';
export declare class DebugController {
    private readonly serverlessService;
    private readonly eventManager;
    constructor(serverlessService: ServerlessService, eventManager: EventManagerService);
    ide(): Promise<{
        a: number;
    }>;
    sendEvent(type: 'web' | 'admin' | 'all', event: BusinessEvents, payload: any): Promise<void>;
    runFunction(functionString: string, req: any, res: any): Promise<void>;
}
