import { IPty } from 'node-pty';
import { Socket } from 'socket.io';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { AuthService } from '~/modules/auth/auth.service';
import { ConfigsService } from '~/modules/configs/configs.service';
import { CacheService } from '~/processors/cache/cache.service';
import { JWTService } from '~/processors/helper/helper.jwt.service';
declare const AuthGateway: new (...args: any[]) => import("~/processors/gateway/shared/auth.gateway").IAuthGateway;
export declare class PTYGateway extends AuthGateway implements OnGatewayConnection, OnGatewayDisconnect {
    protected readonly jwtService: JWTService;
    protected readonly authService: AuthService;
    protected readonly cacheService: CacheService;
    protected readonly configService: ConfigsService;
    constructor(jwtService: JWTService, authService: AuthService, cacheService: CacheService, configService: ConfigsService);
    socket2ptyMap: WeakMap<Socket<import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, any>, IPty>;
    pty(client: Socket, data?: {
        password?: string;
        cols: number;
        rows: number;
    }): Promise<void>;
    ptyInput(client: Socket, data: string): Promise<void>;
    ptyExit(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
}
export {};
