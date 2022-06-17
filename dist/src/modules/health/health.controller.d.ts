import { FastifyReply } from 'fastify';
import { Reflector } from '@nestjs/core';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronService } from '~/processors/helper/helper.cron.service';
import { TaskQueueService } from '~/processors/helper/helper.tq.service';
import { LogQueryDto, LogTypeDto } from './health.dto';
export declare class HealthController {
    private schedulerRegistry;
    private readonly cronService;
    private readonly reflector;
    private readonly taskQueue;
    constructor(schedulerRegistry: SchedulerRegistry, cronService: CronService, reflector: Reflector, taskQueue: TaskQueueService);
    getAllCron(): Promise<{}>;
    runCron(name: string): Promise<void>;
    getCronTaskStatus(name: string): Promise<{
        status: "pending" | "fulfill" | "reject";
        updatedAt: Date;
        message?: string | undefined;
    }>;
    getPM2List(params: LogTypeDto): Promise<{
        size: string;
        filename: string;
        type: string;
        index: number;
    }[]>;
    getLog(query: LogQueryDto, params: LogTypeDto, reply: FastifyReply): Promise<void>;
    deleteLog(params: LogTypeDto, query: LogQueryDto): Promise<void>;
}
