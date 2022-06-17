/// <reference types="node" />
/// <reference types="node" />
/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indizes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose" />
/// <reference types="mongoose-paginate-v2" />
import { Readable } from 'stream';
import { MongoIdDto } from '~/shared/dto/id.dto';
import { ConfigsService } from '../configs/configs.service';
import { NoteModel } from '../note/note.model';
import { PostModel } from '../post/post.model';
import { DataListDto, ExportMarkdownQueryDto, MarkdownPreviewDto } from './markdown.dto';
import { MarkdownService } from './markdown.service';
export declare class MarkdownController {
    private readonly service;
    private readonly configs;
    constructor(service: MarkdownService, configs: ConfigsService);
    importArticle(body: DataListDto): Promise<void | (import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & PostModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
        _id: any;
    })[] | (import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & NoteModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
        _id: any;
    })[]>;
    exportArticleToMarkdown(query: ExportMarkdownQueryDto): Promise<Readable>;
    renderArticle(params: MongoIdDto, theme: string, isMaster: boolean): Promise<string>;
    markdownPreview(body: MarkdownPreviewDto, theme: string): Promise<string>;
    getRenderedMarkdownHtmlStructure(params: MongoIdDto): Promise<{
        body: string[];
        extraScripts: string[];
        script: string[];
        link: string[];
        style: (string | Buffer | null)[];
    }>;
}
