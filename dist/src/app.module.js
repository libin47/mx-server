"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_config_1 = require("./app.config");
const app_controller_1 = require("./app.controller");
const any_exception_filter_1 = require("./common/filters/any-exception.filter");
const roles_guard_1 = require("./common/guard/roles.guard");
const analyze_interceptor_1 = require("./common/interceptors/analyze.interceptor");
const cache_interceptor_1 = require("./common/interceptors/cache.interceptor");
const counting_interceptor_1 = require("./common/interceptors/counting.interceptor");
const idempotence_interceptor_1 = require("./common/interceptors/idempotence.interceptor");
const json_serialize_interceptor_1 = require("./common/interceptors/json-serialize.interceptor");
const query_interceptor_1 = require("./common/interceptors/query.interceptor");
const response_interceptor_1 = require("./common/interceptors/response.interceptor");
const aggregate_module_1 = require("./modules/aggregate/aggregate.module");
const analyze_module_1 = require("./modules/analyze/analyze.module");
const auth_module_1 = require("./modules/auth/auth.module");
const backup_module_1 = require("./modules/backup/backup.module");
const category_module_1 = require("./modules/category/category.module");
const album_module_1 = require("./modules/album/album.module");
const comment_module_1 = require("./modules/comment/comment.module");
const configs_module_1 = require("./modules/configs/configs.module");
const debug_module_1 = require("./modules/debug/debug.module");
const demo_module_1 = require("./modules/demo/demo.module");
const feed_module_1 = require("./modules/feed/feed.module");
const file_module_1 = require("./modules/file/file.module");
const health_module_1 = require("./modules/health/health.module");
const init_module_1 = require("./modules/init/init.module");
const link_module_1 = require("./modules/link/link.module");
const markdown_module_1 = require("./modules/markdown/markdown.module");
const note_module_1 = require("./modules/note/note.module");
const option_module_1 = require("./modules/option/option.module");
const page_module_1 = require("./modules/page/page.module");
const pageproxy_module_1 = require("./modules/pageproxy/pageproxy.module");
const post_module_1 = require("./modules/post/post.module");
const photo_module_1 = require("./modules/photo/photo.module");
const project_module_1 = require("./modules/project/project.module");
const pty_module_1 = require("./modules/pty/pty.module");
const recently_module_1 = require("./modules/recently/recently.module");
const say_module_1 = require("./modules/say/say.module");
const search_module_1 = require("./modules/search/search.module");
const serverless_module_1 = require("./modules/serverless/serverless.module");
const sitemap_module_1 = require("./modules/sitemap/sitemap.module");
const snippet_module_1 = require("./modules/snippet/snippet.module");
const tool_module_1 = require("./modules/tool/tool.module");
const topic_module_1 = require("./modules/topic/topic.module");
const user_module_1 = require("./modules/user/user.module");
const cache_module_1 = require("./processors/cache/cache.module");
const database_module_1 = require("./processors/database/database.module");
const gateway_module_1 = require("./processors/gateway/gateway.module");
const helper_module_1 = require("./processors/helper/helper.module");
const logger_module_1 = require("./processors/logger/logger.module");
let AppModule = class AppModule {
    configure(consumer) { }
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            logger_module_1.LoggerModule,
            database_module_1.DatabaseModule,
            cache_module_1.CacheModule,
            aggregate_module_1.AggregateModule,
            analyze_module_1.AnalyzeModule,
            auth_module_1.AuthModule,
            backup_module_1.BackupModule,
            category_module_1.CategoryModule,
            album_module_1.AlbumModule,
            comment_module_1.CommentModule,
            configs_module_1.ConfigsModule,
            app_config_1.isInDemoMode && demo_module_1.DemoModule,
            feed_module_1.FeedModule,
            file_module_1.FileModule,
            health_module_1.HealthModule,
            init_module_1.InitModule,
            link_module_1.LinkModule,
            markdown_module_1.MarkdownModule,
            note_module_1.NoteModule,
            option_module_1.OptionModule,
            page_module_1.PageModule,
            post_module_1.PostModule,
            photo_module_1.PhotoModule,
            project_module_1.ProjectModule,
            pty_module_1.PTYModule,
            recently_module_1.RecentlyModule,
            topic_module_1.TopicModule,
            say_module_1.SayModule,
            search_module_1.SearchModule,
            serverless_module_1.ServerlessModule,
            sitemap_module_1.SitemapModule,
            snippet_module_1.SnippetModule,
            tool_module_1.ToolModule,
            user_module_1.UserModule,
            pageproxy_module_1.PageProxyModule,
            gateway_module_1.GatewayModule,
            helper_module_1.HelperModule,
            isDev ? debug_module_1.DebugModule : undefined,
        ].filter(Boolean),
        controllers: [app_controller_1.AppController],
        providers: [
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: query_interceptor_1.QueryInterceptor,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: cache_interceptor_1.HttpCacheInterceptor,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: analyze_interceptor_1.AnalyzeInterceptor,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: counting_interceptor_1.CountingInterceptor,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: json_serialize_interceptor_1.JSONSerializeInterceptor,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: response_interceptor_1.ResponseInterceptor,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: idempotence_interceptor_1.IdempotenceInterceptor,
            },
            {
                provide: core_1.APP_FILTER,
                useClass: any_exception_filter_1.AllExceptionsFilter,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: roles_guard_1.RolesGuard,
            },
        ],
    })
], AppModule);
exports.AppModule = AppModule;
