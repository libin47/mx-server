import { PTYService } from './pty.service';
export declare class PTYController {
    private readonly service;
    constructor(service: PTYService);
    getPtyLoginRecord(): Promise<{
        startTime: Date;
        ip: string;
        endTime: string | null | undefined;
    }[]>;
}
