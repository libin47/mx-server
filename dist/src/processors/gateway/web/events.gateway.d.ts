import SocketIO from 'socket.io';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { BusinessEvents } from '~/constants/business-event.constant';
import { CacheService } from '~/processors/cache/cache.service';
import { BoardcastBaseGateway } from '../base.gateway';
import { DanmakuDto } from './dtos/danmaku.dto';
export declare class WebEventsGateway extends BoardcastBaseGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly cacheService;
    constructor(cacheService: CacheService);
    private namespace;
    sendOnlineNumber(): Promise<{
        online: number;
        timestamp: string;
    }>;
    createNewDanmaku(data: DanmakuDto, client: SocketIO.Socket): void;
    getcurrentClientCount(): Promise<number>;
    handleConnection(socket: SocketIO.Socket): Promise<void>;
    handleDisconnect(client: SocketIO.Socket): Promise<void>;
    broadcast(event: BusinessEvents, data: any): void;
}
