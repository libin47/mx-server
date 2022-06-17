/// <reference types="node" />
import { FastifyRequest } from 'fastify';
import { Readable } from 'stream';
import { UploadService } from '~/processors/helper/helper.upload.service';
import { BackupService } from './backup.service';
export declare class BackupController {
    private readonly backupService;
    private readonly uploadService;
    constructor(backupService: BackupService, uploadService: UploadService);
    createNewBackup(): Promise<Readable>;
    get(): Promise<{
        size: string;
        filename: string;
        path: string;
    }[]>;
    download(dirname: string): Promise<Readable>;
    uploadAndRestore(req: FastifyRequest): Promise<void>;
    rollback(dirname: string): Promise<void>;
    deleteBackups(files: string): Promise<void>;
    delete(filename: string): Promise<void>;
}
