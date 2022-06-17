import { AggregateService } from '~/modules/aggregate/aggregate.service';
import { AnalyzeModel } from '~/modules/analyze/analyze.model';
import { BackupService } from '~/modules/backup/backup.service';
import { ConfigsService } from '~/modules/configs/configs.service';
import { NoteService } from '~/modules/note/note.service';
import { PageService } from '~/modules/page/page.service';
import { PostService } from '~/modules/post/post.service';
import { SearchService } from '~/modules/search/search.service';
import { CacheService } from '../cache/cache.service';
import { HttpService } from './helper.http.service';
export declare class CronService {
    private readonly http;
    private readonly configs;
    private readonly analyzeModel;
    private readonly cacheService;
    private readonly aggregateService;
    private readonly postService;
    private readonly noteService;
    private readonly pageService;
    private readonly backupService;
    private readonly searchService;
    private logger;
    constructor(http: HttpService, configs: ConfigsService, analyzeModel: MongooseModel<AnalyzeModel>, cacheService: CacheService, aggregateService: AggregateService, postService: PostService, noteService: NoteService, pageService: PageService, backupService: BackupService, searchService: SearchService);
    backupDB({ uploadCOS }?: {
        uploadCOS?: boolean;
    }): Promise<void>;
    cleanAccessRecord(): Promise<void>;
    resetIPAccess(): Promise<void>;
    resetLikedOrReadArticleRecord(): Promise<void>;
    cleanTempDirectory(): Promise<void>;
    cleanLogFile(): Promise<void>;
    pushToBaiduSearch(): Promise<any>;
    pushToAlgoliaSearch(): Promise<void>;
}
