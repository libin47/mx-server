import { AlbumModel } from '~/modules/album/album.model'
import { AnalyzeModel } from '~/modules/analyze/analyze.model'
import { CategoryModel } from '~/modules/category/category.model'
import { CommentModel } from '~/modules/comment/comment.model'
import { OptionModel } from '~/modules/configs/configs.model'
import { LinkModel } from '~/modules/link/link.model'
import { NoteModel } from '~/modules/note/note.model'
import { PageModel } from '~/modules/page/page.model'
import { PhotoModel } from '~/modules/photo/photo.model'
import { PostModel } from '~/modules/post/post.model'
import { ProjectModel } from '~/modules/project/project.model'
import { QAModel } from '~/modules/qa/qa.model'
import { RecentlyModel } from '~/modules/recently/recently.model'
import { SayModel } from '~/modules/say/say.model'
import { ServerlessStorageModel } from '~/modules/serverless/serverless.model'
import { SnippetModel } from '~/modules/snippet/snippet.model'
import { TopicModel } from '~/modules/topic/topic.model'
import { UserModel } from '~/modules/user/user.model'
import { getProviderByTypegooseClass } from '~/transformers/model.transformer'

export const databaseModels = [
  AnalyzeModel,
  CategoryModel,
  CommentModel,
  LinkModel,
  NoteModel,
  OptionModel,
  PageModel,
  PostModel,
  ProjectModel,
  RecentlyModel,
  TopicModel,
  SayModel,
  ServerlessStorageModel,
  SnippetModel,
  UserModel,
  PhotoModel,
  AlbumModel,
  QAModel
].map((model) => getProviderByTypegooseClass(model))
