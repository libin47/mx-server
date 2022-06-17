import { AuthService } from './auth.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
declare const JwtStrategy_base: any;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly authService;
    constructor(authService: AuthService);
    validate(payload: JwtPayload): Promise<any>;
}
export {};
