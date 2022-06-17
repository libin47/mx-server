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
var CommentModel_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentModel = exports.CommentState = exports.CommentRefTypes = void 0;
const openapi = require("@nestjs/swagger");
const mongoose_1 = require("mongoose");
const url_1 = require("url");
const typegoose_1 = require("@typegoose/typegoose");
const base_model_1 = require("../../shared/model/base.model");
const utils_1 = require("../../utils");
const note_model_1 = require("../note/note.model");
const page_model_1 = require("../page/page.model");
const post_model_1 = require("../post/post.model");
const photo_model_1 = require("../photo/photo.model");
function autoPopulateSubs(next) {
    this.populate({ options: { sort: { created: -1 } }, path: 'children' });
    next();
}
var CommentRefTypes;
(function (CommentRefTypes) {
    CommentRefTypes["Post"] = "Post";
    CommentRefTypes["Note"] = "Note";
    CommentRefTypes["Page"] = "Page";
})(CommentRefTypes = exports.CommentRefTypes || (exports.CommentRefTypes = {}));
var CommentState;
(function (CommentState) {
    CommentState[CommentState["Unread"] = 0] = "Unread";
    CommentState[CommentState["Read"] = 1] = "Read";
    CommentState[CommentState["Junk"] = 2] = "Junk";
})(CommentState = exports.CommentState || (exports.CommentState = {}));
let CommentModel = CommentModel_1 = class CommentModel extends base_model_1.BaseModel {
    get avatar() {
        if (!this.avatars) {
            return (0, utils_1.getAvatar)(this.mail);
        }
        else {
            return this.avatars;
        }
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { ref: { required: true, type: () => Object }, refType: { required: true, enum: require("./comment.model").CommentRefTypes }, author: { required: true, type: () => String }, mail: { required: true, type: () => String }, url: { required: false, type: () => String }, text: { required: true, type: () => String }, state: { required: false, enum: require("./comment.model").CommentState }, parent: { required: false, type: () => Object }, children: { required: false, type: () => [Object] }, commentsIndex: { required: false, type: () => Number }, key: { required: false, type: () => String }, ip: { required: false, type: () => String }, agent: { required: false, type: () => String }, post: { required: true, type: () => Object }, note: { required: true, type: () => Object }, photo: { required: true, type: () => Object }, page: { required: true, type: () => Object }, location: { required: false, type: () => String }, avatars: { required: false, type: () => String } };
    }
};
__decorate([
    (0, typegoose_1.prop)({ refPath: 'refType' }),
    __metadata("design:type", Object)
], CommentModel.prototype, "ref", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, default: 'Post', enum: CommentRefTypes }),
    __metadata("design:type", String)
], CommentModel.prototype, "refType", void 0);
__decorate([
    (0, typegoose_1.prop)({ trim: true, required: true }),
    __metadata("design:type", String)
], CommentModel.prototype, "author", void 0);
__decorate([
    (0, typegoose_1.prop)({ trim: true }),
    __metadata("design:type", String)
], CommentModel.prototype, "mail", void 0);
__decorate([
    (0, typegoose_1.prop)({
        trim: true,
        set(val) {
            return new url_1.URL(val).origin;
        },
    }),
    __metadata("design:type", String)
], CommentModel.prototype, "url", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], CommentModel.prototype, "text", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: 0 }),
    __metadata("design:type", Number)
], CommentModel.prototype, "state", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => CommentModel_1 }),
    __metadata("design:type", Object)
], CommentModel.prototype, "parent", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => CommentModel_1, type: mongoose_1.Types.ObjectId }),
    __metadata("design:type", Array)
], CommentModel.prototype, "children", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: 1 }),
    __metadata("design:type", Number)
], CommentModel.prototype, "commentsIndex", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], CommentModel.prototype, "key", void 0);
__decorate([
    (0, typegoose_1.prop)({ select: false }),
    __metadata("design:type", String)
], CommentModel.prototype, "ip", void 0);
__decorate([
    (0, typegoose_1.prop)({ select: false }),
    __metadata("design:type", String)
], CommentModel.prototype, "agent", void 0);
__decorate([
    (0, typegoose_1.prop)({
        ref: () => post_model_1.PostModel,
        foreignField: '_id',
        localField: 'ref',
        justOne: true,
    }),
    __metadata("design:type", Object)
], CommentModel.prototype, "post", void 0);
__decorate([
    (0, typegoose_1.prop)({
        ref: () => note_model_1.NoteModel,
        foreignField: '_id',
        localField: 'ref',
        justOne: true,
    }),
    __metadata("design:type", Object)
], CommentModel.prototype, "note", void 0);
__decorate([
    (0, typegoose_1.prop)({
        ref: () => photo_model_1.PhotoModel,
        foreignField: '_id',
        localField: 'ref',
        justOne: true,
    }),
    __metadata("design:type", Object)
], CommentModel.prototype, "photo", void 0);
__decorate([
    (0, typegoose_1.prop)({
        ref: () => page_model_1.PageModel,
        foreignField: '_id',
        localField: 'ref',
        justOne: true,
    }),
    __metadata("design:type", Object)
], CommentModel.prototype, "page", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], CommentModel.prototype, "location", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], CommentModel.prototype, "avatars", void 0);
CommentModel = CommentModel_1 = __decorate([
    (0, typegoose_1.pre)('findOne', autoPopulateSubs),
    (0, typegoose_1.pre)('find', autoPopulateSubs),
    (0, typegoose_1.modelOptions)({
        options: {
            customName: 'Comment',
        },
    })
], CommentModel);
exports.CommentModel = CommentModel;
