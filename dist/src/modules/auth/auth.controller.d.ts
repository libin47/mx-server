import { EventEmitter2 } from '@nestjs/event-emitter';
import { MongoIdDto } from '~/shared/dto/id.dto';
import { AuthService } from './auth.service';
export declare class TokenDto {
    expired?: Date;
    name: string;
}
export declare class AuthController {
    private readonly authService;
    private readonly eventEmitter;
    constructor(authService: AuthService, eventEmitter: EventEmitter2);
    checkLogged(isMaster: boolean): {
        ok: number;
        isGuest: boolean;
    };
    getOrVerifyToken(token?: string, id?: string): Promise<boolean | import("../user/user.model").TokenModel | import("../user/user.model").TokenModel[] | null | undefined>;
    generateToken(body: TokenDto): Promise<{
        expired: Date | undefined;
        token: string;
        name: string;
    }>;
    deleteToken(query: MongoIdDto): Promise<string>;
}
