import { Socket } from 'socket.io';
import { BusinessEvents } from '~/constants/business-event.constant';
export declare abstract class BaseGateway {
    gatewayMessageFormat(type: BusinessEvents, message: any, code?: number): {
        type: BusinessEvents;
        data: any;
        code: number | undefined;
    };
    handleDisconnect(client: Socket): void;
    handleConnect(client: Socket): void;
}
export declare abstract class BoardcastBaseGateway extends BaseGateway {
    broadcast(event: BusinessEvents, data: any): void;
}
