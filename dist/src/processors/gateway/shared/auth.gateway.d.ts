import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { BoardcastBaseGateway } from '../base.gateway';
export declare type AuthGatewayOptions = {
    namespace: string;
    authway?: 'jwt' | 'custom-token' | 'all';
};
export interface IAuthGateway extends OnGatewayConnection, OnGatewayDisconnect, BoardcastBaseGateway {
}
export declare const createAuthGateway: (options: AuthGatewayOptions) => new (...args: any[]) => IAuthGateway;
