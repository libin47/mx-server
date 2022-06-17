import SocketIO, { Socket } from 'socket.io';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { CacheService } from '~/processors/cache/cache.service';
import { JWTService } from '~/processors/helper/helper.jwt.service';
import { AuthService } from '../../../modules/auth/auth.service';
declare const AuthGateway: new (...args: any[]) => import("../shared/auth.gateway").IAuthGateway;
export declare class AdminEventsGateway extends AuthGateway implements OnGatewayConnection, OnGatewayDisconnect {
    protected readonly jwtService: JWTService;
    protected readonly authService: AuthService;
    private readonly cacheService;
    constructor(jwtService: JWTService, authService: AuthService, cacheService: CacheService);
    subscribeSocketToHandlerMap: WeakMap<SocketIO.Socket<import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, any>, Function>;
    subscribeStdOut(client: Socket, data?: {
        prevLog?: boolean;
    }): Promise<void>;
    unsubscribeStdOut(client: Socket): void;
    handleDisconnect(client: SocketIO.Socket): void;
}
export {};
