"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseModels = void 0;
const album_model_1 = require("../../modules/album/album.model");
const analyze_model_1 = require("../../modules/analyze/analyze.model");
const category_model_1 = require("../../modules/category/category.model");
const comment_model_1 = require("../../modules/comment/comment.model");
const configs_model_1 = require("../../modules/configs/configs.model");
const link_model_1 = require("../../modules/link/link.model");
const note_model_1 = require("../../modules/note/note.model");
const page_model_1 = require("../../modules/page/page.model");
const photo_model_1 = require("../../modules/photo/photo.model");
const post_model_1 = require("../../modules/post/post.model");
const project_model_1 = require("../../modules/project/project.model");
const qa_model_1 = require("../../modules/qa/qa.model");
const recently_model_1 = require("../../modules/recently/recently.model");
const say_model_1 = require("../../modules/say/say.model");
const serverless_model_1 = require("../../modules/serverless/serverless.model");
const snippet_model_1 = require("../../modules/snippet/snippet.model");
const topic_model_1 = require("../../modules/topic/topic.model");
const user_model_1 = require("../../modules/user/user.model");
const model_transformer_1 = require("../../transformers/model.transformer");
exports.databaseModels = [
    analyze_model_1.AnalyzeModel,
    category_model_1.CategoryModel,
    comment_model_1.CommentModel,
    link_model_1.LinkModel,
    note_model_1.NoteModel,
    configs_model_1.OptionModel,
    page_model_1.PageModel,
    post_model_1.PostModel,
    project_model_1.ProjectModel,
    recently_model_1.RecentlyModel,
    topic_model_1.TopicModel,
    say_model_1.SayModel,
    serverless_model_1.ServerlessStorageModel,
    snippet_model_1.SnippetModel,
    user_model_1.UserModel,
    photo_model_1.PhotoModel,
    album_model_1.AlbumModel,
    qa_model_1.QAModel
].map((model) => (0, model_transformer_1.getProviderByTypegooseClass)(model));
