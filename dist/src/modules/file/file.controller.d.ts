import { FastifyReply, FastifyRequest } from 'fastify';
import { UploadService } from '~/processors/helper/helper.upload.service';
import { PagerDto } from '~/shared/dto/pager.dto';
import { FileQueryDto, FileUploadDto } from './file.dto';
import { FileService } from './file.service';
export declare class FileController {
    private readonly service;
    private readonly uploadService;
    constructor(service: FileService, uploadService: UploadService);
    getTypes(query: PagerDto, params: FileUploadDto): Promise<{
        name: string;
        url: string;
    }[]>;
    get(params: FileQueryDto, reply: FastifyReply): Promise<void>;
    upload(query: FileUploadDto, req: FastifyRequest): Promise<{
        url: string;
        name: string;
    }>;
    delete(params: FileQueryDto): Promise<void>;
}
