import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { AuthService } from '~/modules/auth/auth.service';
import { BaseGateway } from '../base.gateway';
export declare abstract class AuthGateway extends BaseGateway implements OnGatewayConnection, OnGatewayDisconnect {
    protected readonly jwtService: JwtService;
    protected readonly authService: AuthService;
    constructor(jwtService: JwtService, authService: AuthService);
    protected namespace: Namespace;
    authFailed(client: Socket): Promise<void>;
    authToken(token: string): Promise<boolean>;
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    tokenSocketIdMap: Map<string, string>;
    handleTokenExpired(token: string): boolean;
}
