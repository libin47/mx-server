import { FastifyRequest } from 'fastify';
import { MultipartFile } from '@fastify/multipart';
export declare class UploadService {
    getAndValidMultipartField(req: FastifyRequest): Promise<MultipartFile>;
}
