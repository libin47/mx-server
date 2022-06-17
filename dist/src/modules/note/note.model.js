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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartialNoteModel = exports.NoteModel = void 0;
const openapi = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const mapped_types_1 = require("@nestjs/mapped-types");
const auto_increment_1 = require("@typegoose/auto-increment");
const typegoose_1 = require("@typegoose/typegoose");
const count_model_1 = require("../../shared/model/count.model");
const write_base_model_1 = require("../../shared/model/write-base.model");
const topic_model_1 = require("../topic/topic.model");
const coordinate_model_1 = require("./models/coordinate.model");
const music_model_1 = require("./models/music.model");
let NoteModel = class NoteModel extends write_base_model_1.WriteBaseModel {
    static get protectedKeys() {
        return ['nid', 'count'].concat(super.protectedKeys);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: true, type: () => String }, nid: { required: true, type: () => Number }, hide: { required: true, type: () => Boolean }, password: { required: false, type: () => String }, qa: { required: false, type: () => String }, secret: { required: false, type: () => Date }, mood: { required: false, type: () => String }, weather: { required: false, type: () => String }, hasMemory: { required: false, type: () => Boolean }, coordinates: { required: false, type: () => require("./models/coordinate.model").Coordinate }, location: { required: false, type: () => String }, count: { required: false, type: () => require("../../shared/model/count.model").CountModel }, music: { required: false, type: () => [require("./models/music.model").NoteMusic] }, topicId: { required: false, type: () => Object }, topic: { required: false, type: () => require("../topic/topic.model").TopicModel } };
    }
};
__decorate([
    (0, typegoose_1.prop)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value: title }) => (title.length === 0 ? '无题' : title)),
    __metadata("design:type", String)
], NoteModel.prototype, "title", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: false, unique: true }),
    __metadata("design:type", Number)
], NoteModel.prototype, "nid", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], NoteModel.prototype, "hide", void 0);
__decorate([
    (0, typegoose_1.prop)({
        select: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Transform)(({ value: val }) => (String(val).length === 0 ? null : val)),
    __metadata("design:type", String)
], NoteModel.prototype, "password", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: false, }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Transform)(({ value: val }) => (String(val).length === 0 ? null : val)),
    __metadata("design:type", String)
], NoteModel.prototype, "qa", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Transform)(({ value }) => (value ? new Date(value) : null)),
    __metadata("design:type", Date)
], NoteModel.prototype, "secret", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], NoteModel.prototype, "mood", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NoteModel.prototype, "weather", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], NoteModel.prototype, "hasMemory", void 0);
__decorate([
    (0, typegoose_1.prop)({ select: false, type: coordinate_model_1.Coordinate }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => coordinate_model_1.Coordinate),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", coordinate_model_1.Coordinate)
], NoteModel.prototype, "coordinates", void 0);
__decorate([
    (0, typegoose_1.prop)({ select: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], NoteModel.prototype, "location", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: count_model_1.CountModel, default: { read: 0, like: 0 }, _id: false }),
    __metadata("design:type", count_model_1.CountModel)
], NoteModel.prototype, "count", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: [music_model_1.NoteMusic] }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => music_model_1.NoteMusic),
    __metadata("design:type", Array)
], NoteModel.prototype, "music", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => topic_model_1.TopicModel }),
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], NoteModel.prototype, "topicId", void 0);
__decorate([
    (0, typegoose_1.prop)({
        justOne: true,
        foreignField: '_id',
        localField: 'topicId',
        ref: () => topic_model_1.TopicModel,
    }),
    __metadata("design:type", topic_model_1.TopicModel)
], NoteModel.prototype, "topic", void 0);
NoteModel = __decorate([
    (0, typegoose_1.modelOptions)({
        options: {
            customName: 'Note',
        },
    }),
    (0, typegoose_1.plugin)(auto_increment_1.AutoIncrementID, {
        field: 'nid',
        startAt: 1,
    }),
    (0, typegoose_1.index)({ text: 'text' }),
    (0, typegoose_1.index)({ modified: -1 }),
    (0, typegoose_1.index)({ nid: -1 }),
    (0, typegoose_1.pre)('findOne', autoPopulateTopic),
    (0, typegoose_1.pre)('find', autoPopulateTopic)
], NoteModel);
exports.NoteModel = NoteModel;
class PartialNoteModel extends (0, mapped_types_1.PartialType)(NoteModel) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.PartialNoteModel = PartialNoteModel;
function autoPopulateTopic(next) {
    this.populate({ path: 'topic' });
    next();
}
