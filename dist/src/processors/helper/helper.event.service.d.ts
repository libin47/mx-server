import { EventEmitter2 } from '@nestjs/event-emitter';
import { BusinessEvents, EventScope } from '~/constants/business-event.constant';
import { EventBusEvents } from '~/constants/event-bus.constant';
import { AdminEventsGateway } from '../gateway/admin/events.gateway';
import { SystemEventsGateway } from '../gateway/system/events.gateway';
import { WebEventsGateway } from '../gateway/web/events.gateway';
export declare type EventManagerOptions = {
    scope?: EventScope;
    nextTick?: boolean;
};
export declare type IEventManagerHandlerDisposer = () => void;
export declare class EventManagerService {
    #private;
    private readonly webGateway;
    private readonly adminGateway;
    private readonly systemGateway;
    private readonly emitter2;
    private readonly logger;
    private readonly defaultOptions;
    constructor(webGateway: WebEventsGateway, adminGateway: AdminEventsGateway, systemGateway: SystemEventsGateway, emitter2: EventEmitter2);
    private mapScopeToInstance;
    emit(event: BusinessEvents, data?: any, options?: EventManagerOptions): Promise<void>;
    emit(event: EventBusEvents, data?: any, options?: EventManagerOptions): Promise<void>;
    on(event: BusinessEvents, handler: (data: any) => void, options?: Pick<EventManagerOptions, 'scope'>): IEventManagerHandlerDisposer;
    on(event: EventBusEvents, handler: (data: any) => void, options?: Pick<EventManagerOptions, 'scope'>): IEventManagerHandlerDisposer;
    registerHandler(handler: (type: EventBusEvents, data: any) => void): IEventManagerHandlerDisposer;
    registerHandler(handler: (type: BusinessEvents, data: any) => void): IEventManagerHandlerDisposer;
    private listenSystemEvents;
    get broadcast(): {
        (event: BusinessEvents, data?: any, options?: EventManagerOptions | undefined): Promise<void>;
        (event: EventBusEvents, data?: any, options?: EventManagerOptions | undefined): Promise<void>;
    };
}
