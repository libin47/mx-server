"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedModule = void 0;
const common_1 = require("@nestjs/common");
const aggregate_module_1 = require("../aggregate/aggregate.module");
const markdown_module_1 = require("../markdown/markdown.module");
const feed_controller_1 = require("./feed.controller");
let FeedModule = class FeedModule {
};
FeedModule = __decorate([
    (0, common_1.Module)({
        controllers: [feed_controller_1.FeedController],
        providers: [],
        imports: [aggregate_module_1.AggregateModule, markdown_module_1.MarkdownModule],
    })
], FeedModule);
exports.FeedModule = FeedModule;
