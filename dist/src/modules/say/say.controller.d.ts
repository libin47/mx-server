declare const SayController_base: import("@nestjs/common").Type<any>;
export declare class SayController extends SayController_base {
    getRandomOne(): Promise<{
        data: any;
    }>;
}
export {};
