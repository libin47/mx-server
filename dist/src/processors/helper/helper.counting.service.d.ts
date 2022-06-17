import { ArticleType } from '~/constants/article.constant';
import { NoteModel } from '~/modules/note/note.model';
import { PostModel } from '~/modules/post/post.model';
import { CacheService } from '../cache/cache.service';
import { DatabaseService } from '../database/database.service';
export declare class CountingService {
    private readonly postModel;
    private readonly noteModel;
    private readonly redis;
    private readonly databaseService;
    private logger;
    constructor(postModel: MongooseModel<PostModel>, noteModel: MongooseModel<NoteModel>, redis: CacheService, databaseService: DatabaseService);
    private checkIdAndIp;
    updateReadCount(type: keyof typeof ArticleType, id: string, ip: string): Promise<void>;
    updateLikeCount(type: keyof typeof ArticleType, id: string, ip: string): Promise<boolean>;
}
