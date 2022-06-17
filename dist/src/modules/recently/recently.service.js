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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecentlyService = void 0;
const common_1 = require("@nestjs/common");
const business_event_constant_1 = require("../../constants/business-event.constant");
const helper_event_service_1 = require("../../processors/helper/helper.event.service");
const model_transformer_1 = require("../../transformers/model.transformer");
const recently_model_1 = require("./recently.model");
let RecentlyService = class RecentlyService {
    constructor(recentlyModel, eventManager) {
        this.recentlyModel = recentlyModel;
        this.eventManager = eventManager;
    }
    get model() {
        return this.recentlyModel;
    }
    async getAll() {
        return this.model.find().sort({ created: -1 }).lean();
    }
    async getOffset({ before, size, after, }) {
        size = size !== null && size !== void 0 ? size : 10;
        return await this.model
            .find(after
            ? {
                _id: {
                    $gt: after,
                },
            }
            : before
                ? { _id: { $lt: before } }
                : {})
            .limit(size)
            .sort({ _id: -1 })
            .lean();
    }
    async getLatestOne() {
        return await this.model.findOne().sort({ created: -1 }).lean();
    }
    async create(model) {
        const res = await this.model.create({
            content: model.content,
            language: model.language,
            project: model.project,
        });
        process.nextTick(async () => {
            await this.eventManager.broadcast(business_event_constant_1.BusinessEvents.RECENTLY_CREATE, res, {
                scope: business_event_constant_1.EventScope.TO_SYSTEM_VISITOR,
            });
        });
        return res;
    }
    async delete(id) {
        const { deletedCount } = await this.model.deleteOne({
            _id: id,
        });
        const isDeleted = deletedCount === 1;
        process.nextTick(async () => {
            if (isDeleted) {
                await this.eventManager.broadcast(business_event_constant_1.BusinessEvents.RECENTLY_DElETE, id, {
                    scope: business_event_constant_1.EventScope.TO_SYSTEM_VISITOR,
                });
            }
        });
        return isDeleted;
    }
};
RecentlyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, model_transformer_1.InjectModel)(recently_model_1.RecentlyModel)),
    __metadata("design:paramtypes", [Object, helper_event_service_1.EventManagerService])
], RecentlyService);
exports.RecentlyService = RecentlyService;
