"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const algoliasearch_1 = __importDefault(require("algoliasearch"));
const common_1 = require("@nestjs/common");
const http_decorator_1 = require("../../common/decorator/http.decorator");
const search_dto_1 = require("./search.dto");
const database_service_1 = require("../../processors/database/database.service");
const paginate_transformer_1 = require("../../transformers/paginate.transformer");
const configs_service_1 = require("../configs/configs.service");
const note_service_1 = require("../note/note.service");
const post_service_1 = require("../post/post.service");
let SearchService = class SearchService {
    constructor(noteService, postService, configs, databaseService) {
        this.noteService = noteService;
        this.postService = postService;
        this.configs = configs;
        this.databaseService = databaseService;
    }
    async searchNote(searchOption, showHidden) {
        const { keyword, page, size } = searchOption;
        const select = '_id title created modified nid';
        const keywordArr = keyword
            .split(/\s+/)
            .map((item) => new RegExp(String(item), 'ig'));
        return (0, paginate_transformer_1.transformDataToPaginate)(await this.noteService.model.paginate({
            $or: [{ title: { $in: keywordArr } }, { text: { $in: keywordArr } }],
            $and: [
                { password: { $in: [undefined, null] } },
                { hide: { $in: showHidden ? [false, true] : [false] } },
                {
                    $or: [
                        { secret: { $in: [undefined, null] } },
                        { secret: { $lte: new Date() } },
                    ],
                },
            ],
        }, {
            limit: size,
            page,
            select,
        }));
    }
    async searchPost(searchOption) {
        const { keyword, page, size } = searchOption;
        const select = '_id title created modified categoryId slug';
        const keywordArr = keyword
            .split(/\s+/)
            .map((item) => new RegExp(String(item), 'ig'));
        return await this.postService.model.paginate({
            $or: [{ title: { $in: keywordArr } }, { text: { $in: keywordArr } }],
        }, {
            limit: size,
            page,
            select,
        });
    }
    async getAlgoliaSearchIndex() {
        const { algoliaSearchOptions } = await this.configs.waitForConfigReady();
        if (!algoliaSearchOptions.enable) {
            throw new common_1.BadRequestException('algolia not enable.');
        }
        if (!algoliaSearchOptions.appId ||
            !algoliaSearchOptions.apiKey ||
            !algoliaSearchOptions.indexName) {
            throw new common_1.BadRequestException('algolia not config.');
        }
        const client = (0, algoliasearch_1.default)(algoliaSearchOptions.appId, algoliaSearchOptions.apiKey);
        const index = client.initIndex(algoliaSearchOptions.indexName);
        return index;
    }
    async searchAlgolia(searchOption) {
        const { keyword, size, page } = searchOption;
        const index = await this.getAlgoliaSearchIndex();
        const search = await index.search(keyword, {
            page: page - 1,
            hitsPerPage: size,
            attributesToRetrieve: ['*'],
            snippetEllipsisText: '...',
            responseFields: ['*'],
            facets: ['*'],
        });
        if (searchOption.rawAlgolia) {
            return search;
        }
        const data = [];
        const tasks = search.hits.map((hit) => {
            const { type, objectID } = hit;
            const model = this.databaseService.getModelByRefType(type);
            if (!model) {
                return;
            }
            return model
                .findById(objectID)
                .select('_id title created modified categoryId slug nid')
                .lean()
                .then((doc) => {
                if (doc) {
                    Reflect.set(doc, 'type', type);
                    data.push(doc);
                }
            });
        });
        await Promise.all(tasks);
        return {
            data,
            raw: search,
            pagination: {
                currentPage: page,
                total: search.nbHits,
                hasNextPage: search.nbPages > search.page,
                hasPrevPage: search.page > 1,
                size: search.hitsPerPage,
                totalPage: search.nbPages,
            },
        };
    }
};
__decorate([
    http_decorator_1.HTTPDecorators.Paginator,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_dto_1.SearchDto]),
    __metadata("design:returntype", Promise)
], SearchService.prototype, "searchPost", null);
SearchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => note_service_1.NoteService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => post_service_1.PostService))),
    __metadata("design:paramtypes", [note_service_1.NoteService,
        post_service_1.PostService,
        configs_service_1.ConfigsService,
        database_service_1.DatabaseService])
], SearchService);
exports.SearchService = SearchService;
