"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelperModule = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const schedule_1 = require("@nestjs/schedule");
const throttler_1 = require("@nestjs/throttler");
const aggregate_module_1 = require("../../modules/aggregate/aggregate.module");
const backup_module_1 = require("../../modules/backup/backup.module");
const note_module_1 = require("../../modules/note/note.module");
const page_module_1 = require("../../modules/page/page.module");
const post_module_1 = require("../../modules/post/post.module");
const search_module_1 = require("../../modules/search/search.module");
const helper_asset_service_1 = require("./helper.asset.service");
const helper_bark_service_1 = require("./helper.bark.service");
const helper_counting_service_1 = require("./helper.counting.service");
const helper_cron_service_1 = require("./helper.cron.service");
const helper_email_service_1 = require("./helper.email.service");
const helper_event_service_1 = require("./helper.event.service");
const helper_http_service_1 = require("./helper.http.service");
const helper_image_service_1 = require("./helper.image.service");
const helper_jwt_service_1 = require("./helper.jwt.service");
const helper_macro_service_1 = require("./helper.macro.service");
const helper_tq_service_1 = require("./helper.tq.service");
const helper_upload_service_1 = require("./helper.upload.service");
const providers = [
    helper_asset_service_1.AssetService,
    helper_bark_service_1.BarkPushService,
    helper_counting_service_1.CountingService,
    helper_cron_service_1.CronService,
    helper_email_service_1.EmailService,
    helper_event_service_1.EventManagerService,
    helper_http_service_1.HttpService,
    helper_jwt_service_1.JWTService,
    helper_image_service_1.ImageService,
    helper_tq_service_1.TaskQueueService,
    helper_macro_service_1.TextMacroService,
    helper_upload_service_1.UploadService,
];
let HelperModule = class HelperModule {
};
HelperModule = __decorate([
    (0, common_1.Module)({
        imports: [
            schedule_1.ScheduleModule.forRoot(),
            throttler_1.ThrottlerModule.forRoot({}),
            event_emitter_1.EventEmitterModule.forRoot({
                wildcard: false,
                delimiter: '.',
                newListener: false,
                removeListener: false,
                maxListeners: 10,
                verboseMemoryLeak: isDev,
                ignoreErrors: false,
            }),
            (0, common_1.forwardRef)(() => aggregate_module_1.AggregateModule),
            (0, common_1.forwardRef)(() => post_module_1.PostModule),
            (0, common_1.forwardRef)(() => note_module_1.NoteModule),
            (0, common_1.forwardRef)(() => page_module_1.PageModule),
            (0, common_1.forwardRef)(() => search_module_1.SearchModule),
            (0, common_1.forwardRef)(() => backup_module_1.BackupModule),
        ],
        providers,
        exports: providers,
    }),
    (0, common_1.Global)()
], HelperModule);
exports.HelperModule = HelperModule;
