import { ConsoleLogger, ConsoleLoggerOptions } from '@nestjs/common';
export declare class MyLogger extends ConsoleLogger {
    constructor(context: string, options: ConsoleLoggerOptions);
    private _getColorByLogLevel;
    private lastTimestampAt;
    private _updateAndGetTimestampDiff;
    protected formatMessage(message: any, logLevel?: string): any;
    log(message: any, context?: string, ...argv: any[]): void;
    warn(message: any, context?: string, ...argv: any[]): void;
    debug(message: any, context?: string, ...argv: any[]): void;
    verbose(message: any, context?: string, ...argv: any[]): void;
    error(message: any, context?: string, ...argv: any[]): void;
    private print;
    private defaultContextPrefix;
}
