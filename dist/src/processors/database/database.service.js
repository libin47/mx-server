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
exports.DatabaseService = void 0;
const common_1 = require("@nestjs/common");
const typegoose_1 = require("@typegoose/typegoose");
const system_constant_1 = require("../../constants/system.constant");
const note_model_1 = require("../../modules/note/note.model");
const page_model_1 = require("../../modules/page/page.model");
const post_model_1 = require("../../modules/post/post.model");
const model_transformer_1 = require("../../transformers/model.transformer");
let DatabaseService = class DatabaseService {
    constructor(postModel, noteModel, pageModel, connection) {
        this.postModel = postModel;
        this.noteModel = noteModel;
        this.pageModel = pageModel;
        this.connection = connection;
    }
    getModelByRefType(type) {
        type = type.toLowerCase();
        const map = new Map([
            ['post', this.postModel],
            ['note', this.noteModel],
            ['page', this.pageModel],
        ]);
        return map.get(type);
    }
    async findGlobalById(id) {
        const doc = await Promise.all([
            this.postModel.findById(id).populate('category').lean(),
            this.noteModel.findById(id).lean().select('+password'),
            this.pageModel.findById(id).lean(),
        ]);
        const index = doc.findIndex(Boolean);
        if (index == -1) {
            return {
                document: null,
                type: null,
            };
        }
        const document = doc[index];
        return {
            document,
            type: ['Post', 'Note', 'Page'][index],
        };
    }
    get db() {
        return this.connection.db;
    }
};
DatabaseService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, model_transformer_1.InjectModel)(post_model_1.PostModel)),
    __param(1, (0, model_transformer_1.InjectModel)(note_model_1.NoteModel)),
    __param(2, (0, model_transformer_1.InjectModel)(page_model_1.PageModel)),
    __param(3, (0, common_1.Inject)(system_constant_1.DB_CONNECTION_TOKEN)),
    __metadata("design:paramtypes", [Object, Object, Object, typegoose_1.mongoose.Connection])
], DatabaseService);
exports.DatabaseService = DatabaseService;
