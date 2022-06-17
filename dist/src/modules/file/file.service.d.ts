/// <reference types="node" />
/// <reference types="node" />
import { Readable } from 'stream';
import { ConfigsService } from '../configs/configs.service';
import { FileType } from './file.type';
export declare class FileService {
    private readonly configService;
    constructor(configService: ConfigsService);
    private resolveFilePath;
    private checkIsExist;
    getFile(type: FileType, name: string): Promise<Buffer>;
    writeFile(type: FileType, name: string, data: Readable, encoding?: BufferEncoding): Promise<unknown>;
    deleteFile(type: FileType, name: string): Promise<void | null>;
    getDir(type: FileType): Promise<string[]>;
    resolveFileUrl(type: FileType, name: string): Promise<string>;
}
