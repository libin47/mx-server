"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AggregateModule = void 0;
const common_1 = require("@nestjs/common");
const gateway_module_1 = require("../../processors/gateway/gateway.module");
const analyze_module_1 = require("../analyze/analyze.module");
const category_module_1 = require("../category/category.module");
const comment_module_1 = require("../comment/comment.module");
const link_module_1 = require("../link/link.module");
const note_module_1 = require("../note/note.module");
const page_module_1 = require("../page/page.module");
const post_module_1 = require("../post/post.module");
const photo_module_1 = require("../photo/photo.module");
const album_module_1 = require("../album/album.module");
const recently_module_1 = require("../recently/recently.module");
const say_module_1 = require("../say/say.module");
const aggregate_controller_1 = require("./aggregate.controller");
const aggregate_service_1 = require("./aggregate.service");
let AggregateModule = class AggregateModule {
};
AggregateModule = __decorate([
    (0, common_1.Module)({
        imports: [
            (0, common_1.forwardRef)(() => category_module_1.CategoryModule),
            (0, common_1.forwardRef)(() => post_module_1.PostModule),
            (0, common_1.forwardRef)(() => note_module_1.NoteModule),
            (0, common_1.forwardRef)(() => photo_module_1.PhotoModule),
            (0, common_1.forwardRef)(() => album_module_1.AlbumModule),
            (0, common_1.forwardRef)(() => page_module_1.PageModule),
            (0, common_1.forwardRef)(() => say_module_1.SayModule),
            (0, common_1.forwardRef)(() => comment_module_1.CommentModule),
            (0, common_1.forwardRef)(() => link_module_1.LinkModule),
            (0, common_1.forwardRef)(() => recently_module_1.RecentlyModule),
            analyze_module_1.AnalyzeModule,
            gateway_module_1.GatewayModule,
        ],
        providers: [aggregate_service_1.AggregateService],
        exports: [aggregate_service_1.AggregateService],
        controllers: [aggregate_controller_1.AggregateController],
    })
], AggregateModule);
exports.AggregateModule = AggregateModule;
