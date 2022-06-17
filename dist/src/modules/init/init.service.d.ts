import { UserService } from '../user/user.service';
export declare class InitService {
    private readonly userService;
    private logger;
    constructor(userService: UserService);
    getTempdir(): string;
    getDatadir(): string;
    isInit(): Promise<boolean>;
}
