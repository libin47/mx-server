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
exports.AggregateService = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const lodash_1 = require("lodash");
const url_1 = require("url");
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const cache_constant_1 = require("../../constants/cache.constant");
const event_bus_constant_1 = require("../../constants/event-bus.constant");
const cache_service_1 = require("../../processors/cache/cache.service");
const events_gateway_1 = require("../../processors/gateway/web/events.gateway");
const db_query_transformer_1 = require("../../transformers/db-query.transformer");
const redis_util_1 = require("../../utils/redis.util");
const time_util_1 = require("../../utils/time.util");
const category_service_1 = require("../category/category.service");
const comment_model_1 = require("../comment/comment.model");
const comment_service_1 = require("../comment/comment.service");
const configs_service_1 = require("../configs/configs.service");
const link_model_1 = require("../link/link.model");
const link_service_1 = require("../link/link.service");
const note_service_1 = require("../note/note.service");
const album_service_1 = require("../album/album.service");
const photo_service_1 = require("../photo/photo.service");
const page_service_1 = require("../page/page.service");
const post_service_1 = require("../post/post.service");
const recently_service_1 = require("../recently/recently.service");
const say_service_1 = require("../say/say.service");
const aggregate_dto_1 = require("./aggregate.dto");
let AggregateService = class AggregateService {
    constructor(postService, noteService, albumService, photoService, categoryService, pageService, sayService, commentService, linkService, recentlyService, configs, gateway, cacheService) {
        this.postService = postService;
        this.noteService = noteService;
        this.albumService = albumService;
        this.photoService = photoService;
        this.categoryService = categoryService;
        this.pageService = pageService;
        this.sayService = sayService;
        this.commentService = commentService;
        this.linkService = linkService;
        this.recentlyService = recentlyService;
        this.configs = configs;
        this.gateway = gateway;
        this.cacheService = cacheService;
    }
    getAllCategory() {
        return this.categoryService.findAllCategory();
    }
    getAllAlbum() {
        return this.albumService.findAllAlbum();
    }
    getAllPages() {
        return this.pageService.model
            .find({}, 'title _id slug order')
            .sort({
            order: -1,
            modified: -1,
        })
            .lean();
    }
    async getLatestNote(cond = {}) {
        return (await this.noteService.getLatestOne(cond)).latest;
    }
    findTop(model, condition = {}, size = 6) {
        return model
            .find(condition)
            .sort({ created: -1 })
            .limit(size)
            .select('_id title name slug avatar nid created photos');
    }
    async topActivity(size = 6, isMaster = false) {
        const [notes, photos, posts, says] = await Promise.all([
            this.findTop(this.noteService.model, !isMaster
                ? {
                    hide: false,
                    password: undefined,
                }
                : {}, size).lean(),
            this.findTop(this.photoService.model, !isMaster
                ? {
                    hide: false,
                    password: undefined,
                }
                : {}, size)
                .populate('albumId')
                .lean()
                .then((res) => {
                return res.map((photo) => {
                    photo.album = (0, lodash_1.pick)(photo.albumId, ['name', 'slug']);
                    delete photo.albumId;
                    return photo;
                });
            }),
            this.findTop(this.postService.model, !isMaster ? { hide: false } : {}, size)
                .populate('categoryId')
                .lean()
                .then((res) => {
                return res.map((post) => {
                    post.category = (0, lodash_1.pick)(post.categoryId, ['name', 'slug']);
                    delete post.categoryId;
                    return post;
                });
            }),
            this.sayService.model.find({}).sort({ create: -1 }).limit(size),
        ]);
        return { notes, photos, posts, says };
    }
    async getTimeline(year, type, sortBy = 1) {
        const data = {};
        const getPosts = () => this.postService.model
            .find({ ...(0, db_query_transformer_1.addYearCondition)(year) })
            .sort({ created: sortBy })
            .populate('category')
            .lean()
            .then((list) => list.map((item) => ({
            ...(0, lodash_1.pick)(item, ['_id', 'title', 'slug', 'created', 'modified']),
            category: item.category,
            url: encodeURI(`/posts/${item.category.slug}/${item.slug}`),
        })));
        const getNotes = () => this.noteService.model
            .find({
            hide: false,
            ...(0, db_query_transformer_1.addYearCondition)(year),
        }, '_id nid title weather mood created modified hasMemory')
            .sort({ created: sortBy })
            .lean();
        const getPhotos = () => this.photoService.model
            .find({
            hide: false,
            ...(0, db_query_transformer_1.addYearCondition)(year),
        }, '_id nid title weather mood created modified hasMemory')
            .sort({ created: sortBy })
            .lean();
        switch (type) {
            case aggregate_dto_1.TimelineType.Post: {
                data.posts = await getPosts();
                break;
            }
            case aggregate_dto_1.TimelineType.Note: {
                data.notes = await getNotes();
                break;
            }
            case aggregate_dto_1.TimelineType.Photo: {
                data.photos = await getPhotos();
                break;
            }
            default: {
                const tasks = await Promise.all([getPosts(), getNotes()]);
                data.posts = tasks[0];
                data.notes = tasks[1];
            }
        }
        return data;
    }
    async getSiteMapContent() {
        const { url: { webUrl: baseURL }, } = await this.configs.waitForConfigReady();
        const combineTasks = await Promise.all([
            this.pageService.model
                .find()
                .lean()
                .then((list) => list.map((doc) => ({
                url: new url_1.URL(`/${doc.slug}`, baseURL),
                published_at: doc.modified
                    ? new Date(doc.modified)
                    : new Date(doc.created),
            }))),
            this.noteService.model
                .find({
                hide: false,
                $or: [
                    { password: undefined },
                    { password: { $exists: false } },
                    { password: null },
                ],
                secret: {
                    $lte: new Date(),
                },
            })
                .lean()
                .then((list) => list.map((doc) => {
                return {
                    url: new url_1.URL(`/notes/${doc.nid}`, baseURL),
                    published_at: doc.modified
                        ? new Date(doc.modified)
                        : new Date(doc.created),
                };
            })),
            this.postService.model
                .find({
                hide: false,
            })
                .populate('category')
                .then((list) => list.map((doc) => {
                return {
                    url: new url_1.URL(`/posts/${doc.category.slug}/${doc.slug}`, baseURL),
                    published_at: doc.modified
                        ? new Date(doc.modified)
                        : new Date(doc.created),
                };
            })),
        ]);
        return combineTasks
            .flat(1)
            .sort((a, b) => -(a.published_at.getTime() - b.published_at.getTime()));
    }
    async buildRssStructure() {
        const data = await this.getRSSFeedContent();
        const title = (await this.configs.get('seo')).title;
        const author = (await this.configs.getMaster()).name;
        const url = (await this.configs.get('url')).webUrl;
        return {
            title,
            author,
            url,
            data,
        };
    }
    async getRSSFeedContent() {
        const { url: { webUrl: baseURL }, } = await this.configs.waitForConfigReady();
        const [posts, notes] = await Promise.all([
            this.postService.model
                .find({ hide: false })
                .limit(10)
                .sort({ created: -1 })
                .populate('category'),
            this.noteService.model
                .find({
                hide: false,
                $or: [
                    { password: undefined },
                    { password: { $exists: false } },
                    { password: null },
                ],
            })
                .limit(10)
                .sort({ created: -1 }),
        ]);
        const postsRss = posts.map((post) => {
            return {
                id: post._id,
                title: post.title,
                text: post.text,
                created: post.created,
                modified: post.modified,
                link: new url_1.URL('/posts' + `/${post.category.slug}/${post.slug}`, baseURL).toString(),
            };
        });
        const notesRss = notes.map((note) => {
            const isSecret = note.secret
                ? (0, dayjs_1.default)(note.secret).isAfter(new Date())
                : false;
            return {
                id: note._id,
                title: note.title,
                text: isSecret ? '这篇文章暂时没有公开呢' : note.text,
                created: note.created,
                modified: note.modified,
                link: new url_1.URL(`/notes/${note.nid}`, baseURL).toString(),
            };
        });
        return postsRss
            .concat(notesRss)
            .sort((a, b) => b.created.getTime() - a.created.getTime())
            .slice(0, 10);
    }
    async getCounts() {
        const redisClient = this.cacheService.getClient();
        const dateFormat = (0, time_util_1.getShortDate)(new Date());
        const [online, posts, notes, albums, photos, pages, says, comments, allComments, unreadComments, links, linkApply, categories, recently,] = await Promise.all([
            this.gateway.getcurrentClientCount(),
            this.postService.model.countDocuments(),
            this.noteService.model.countDocuments(),
            this.albumService.model.countDocuments({}),
            this.photoService.model.countDocuments(),
            this.categoryService.model.countDocuments(),
            this.sayService.model.countDocuments(),
            this.commentService.model.countDocuments({
                parent: null,
                $or: [{ state: comment_model_1.CommentState.Read }, { state: comment_model_1.CommentState.Unread }],
            }),
            this.commentService.model.countDocuments({
                $or: [{ state: comment_model_1.CommentState.Read }, { state: comment_model_1.CommentState.Unread }],
            }),
            this.commentService.model.countDocuments({
                state: comment_model_1.CommentState.Unread,
            }),
            this.linkService.model.countDocuments({
                state: link_model_1.LinkState.Pass,
            }),
            this.linkService.model.countDocuments({
                state: link_model_1.LinkState.Audit,
            }),
            this.categoryService.model.countDocuments({}),
            this.albumService.model.countDocuments({}),
            this.recentlyService.model.countDocuments({}),
        ]);
        const [todayMaxOnline, todayOnlineTotal] = await Promise.all([
            redisClient.hget((0, redis_util_1.getRedisKey)(cache_constant_1.RedisKeys.MaxOnlineCount), dateFormat),
            redisClient.hget((0, redis_util_1.getRedisKey)(cache_constant_1.RedisKeys.MaxOnlineCount, 'total'), dateFormat),
        ]);
        return {
            allComments,
            categories,
            albums,
            comments,
            linkApply,
            links,
            notes,
            pages,
            posts,
            photos,
            says,
            recently,
            unreadComments,
            online,
            todayMaxOnline: todayMaxOnline || 0,
            todayOnlineTotal: todayOnlineTotal || 0,
        };
    }
    clearAggregateCache() {
        return Promise.all([
            this.cacheService.getClient().del(cache_constant_1.CacheKeys.RSS),
            this.cacheService.getClient().del(cache_constant_1.CacheKeys.RSSXmlCatch),
            this.cacheService.getClient().del(cache_constant_1.CacheKeys.AggregateCatch),
            this.cacheService.getClient().del(cache_constant_1.CacheKeys.SiteMapCatch),
            this.cacheService.getClient().del(cache_constant_1.CacheKeys.SiteMapXmlCatch),
        ]);
    }
};
__decorate([
    (0, event_emitter_1.OnEvent)(event_bus_constant_1.EventBusEvents.CleanAggregateCache, { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AggregateService.prototype, "clearAggregateCache", null);
AggregateService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => post_service_1.PostService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => note_service_1.NoteService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => album_service_1.AlbumService))),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => photo_service_1.PhotoService))),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => category_service_1.CategoryService))),
    __param(5, (0, common_1.Inject)((0, common_1.forwardRef)(() => page_service_1.PageService))),
    __param(6, (0, common_1.Inject)((0, common_1.forwardRef)(() => say_service_1.SayService))),
    __param(7, (0, common_1.Inject)((0, common_1.forwardRef)(() => comment_service_1.CommentService))),
    __param(8, (0, common_1.Inject)((0, common_1.forwardRef)(() => link_service_1.LinkService))),
    __param(9, (0, common_1.Inject)((0, common_1.forwardRef)(() => recently_service_1.RecentlyService))),
    __metadata("design:paramtypes", [post_service_1.PostService,
        note_service_1.NoteService,
        album_service_1.AlbumService,
        photo_service_1.PhotoService,
        category_service_1.CategoryService,
        page_service_1.PageService,
        say_service_1.SayService,
        comment_service_1.CommentService,
        link_service_1.LinkService,
        recently_service_1.RecentlyService,
        configs_service_1.ConfigsService,
        events_gateway_1.WebEventsGateway,
        cache_service_1.CacheService])
], AggregateService);
exports.AggregateService = AggregateService;
