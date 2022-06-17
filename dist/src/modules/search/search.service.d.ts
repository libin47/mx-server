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
import { SearchResponse } from '@algolia/client-search';
import { SearchDto } from '~/modules/search/search.dto';
import { DatabaseService } from '~/processors/database/database.service';
import { Pagination } from '~/shared/interface/paginator.interface';
import { ConfigsService } from '../configs/configs.service';
import { NoteService } from '../note/note.service';
import { PostService } from '../post/post.service';
export declare class SearchService {
    private readonly noteService;
    private readonly postService;
    private readonly configs;
    private readonly databaseService;
    constructor(noteService: NoteService, postService: PostService, configs: ConfigsService, databaseService: DatabaseService);
    searchNote(searchOption: SearchDto, showHidden: boolean): Promise<Pagination<import("../note/note.model").NoteModel & import("mongoose").Document<any, any, any> & {
        _id: any;
    }>>;
    searchPost(searchOption: SearchDto): Promise<import("mongoose").PaginateResult<import("../post/post.model").PostModel & import("mongoose").Document<any, any, any> & {
        _id: any;
    }>>;
    getAlgoliaSearchIndex(): Promise<import("algoliasearch").SearchIndex>;
    searchAlgolia(searchOption: SearchDto): Promise<SearchResponse<{
        id: string;
        text: string;
        title: string;
        type: 'post' | 'note' | 'page';
    }> | (Pagination<any> & {
        raw: SearchResponse<{
            id: string;
            text: string;
            title: string;
            type: 'post' | 'note' | 'page';
        }>;
    })>;
}
