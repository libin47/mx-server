/// <reference types="node" />
/// <reference types="node" />
import { Readable } from 'stream';
import { CacheService } from '~/processors/cache/cache.service';
import { EventManagerService } from '~/processors/helper/helper.event.service';
import { ConfigsService } from '../configs/configs.service';
export declare class BackupService {
    private readonly eventManager;
    private readonly configs;
    private readonly cacheService;
    private logger;
    constructor(eventManager: EventManagerService, configs: ConfigsService, cacheService: CacheService);
    list(): Promise<{
        size: string;
        filename: string;
        path: string;
    }[]>;
    backup(): Promise<{
        buffer: Buffer;
        path: string;
    } | undefined>;
    getFileStream(dirname: string): Promise<Readable>;
    checkBackupExist(dirname: string): string;
    saveTempBackupByUpload(buffer: Buffer): Promise<void>;
    restore(restoreFilePath: string): Promise<void>;
    rollbackTo(dirname: string): Promise<void>;
    deleteBackup(filename: any): Promise<boolean>;
}
