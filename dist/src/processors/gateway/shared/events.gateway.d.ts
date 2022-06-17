import { BusinessEvents } from '~/constants/business-event.constant';
import { AdminEventsGateway } from '../admin/events.gateway';
import { WebEventsGateway } from '../web/events.gateway';
export declare class SharedGateway {
    private readonly admin;
    private readonly web;
    constructor(admin: AdminEventsGateway, web: WebEventsGateway);
    broadcast(event: BusinessEvents, data: any): void;
}
