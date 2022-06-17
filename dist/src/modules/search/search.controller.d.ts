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
import { SearchDto } from '~/modules/search/search.dto';
import { SearchService } from './search.service';
export declare class SearchController {
    private readonly searchService;
    constructor(searchService: SearchService);
    searchByType(query: SearchDto, isMaster: boolean, type: string): Promise<import("mongoose").PaginateResult<import("../post/post.model").PostModel & import("mongoose").Document<any, any, any> & {
        _id: any;
    }>> | Promise<import("../../shared/interface/paginator.interface").Pagination<import("../note/note.model").NoteModel & import("mongoose").Document<any, any, any> & {
        _id: any;
    }>>;
    search(query: SearchDto): Promise<import("@algolia/client-search").SearchResponse<{
        id: string;
        text: string;
        title: string;
        type: "post" | "note" | "page";
    }> | (import("../../shared/interface/paginator.interface").Pagination<any> & {
        raw: import("@algolia/client-search").SearchResponse<{
            id: string;
            text: string;
            title: string;
            type: "post" | "note" | "page";
        }>;
    })>;
}
