import { isDefined } from 'class-validator'
import { omit } from 'lodash'
import { FilterQuery, PaginateOptions } from 'mongoose'
import slugify from 'slugify'

import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common'

import { BusinessException } from '~/common/exceptions/business.exception'
import { CannotFindException } from '~/common/exceptions/cant-find.exception'
import { BusinessEvents, EventScope } from '~/constants/business-event.constant'
import { ErrorCodeEnum } from '~/constants/error-code.constant'
import { EventBusEvents } from '~/constants/event-bus.constant'
import { EventManagerService } from '~/processors/helper/helper.event.service'
import { ImageService } from '~/processors/helper/helper.image.service'
import { TextMacroService } from '~/processors/helper/helper.macro.service'
import { InjectModel } from '~/transformers/model.transformer'

import { CategoryService } from '../category/category.service'
import { CommentModel, CommentRefTypes } from '../comment/comment.model'
import { PostModel } from './post.model'

@Injectable()
export class PostService {
  constructor(
    @InjectModel(PostModel)
    private readonly postModel: MongooseModel<PostModel>,
    @InjectModel(CommentModel)
    private readonly commentModel: MongooseModel<CommentModel>,

    @Inject(forwardRef(() => CategoryService))
    private categoryService: CategoryService,
    private readonly imageService: ImageService,
    private readonly eventManager: EventManagerService,
    private readonly textMacroService: TextMacroService,
  ) {}

  get model() {
    return this.postModel
  }
  findWithPaginator(
    condition?: FilterQuery<PostModel>,
    options?: PaginateOptions,
  ) {
    return this.postModel.paginate(condition as any, options)
  }

  async create(post: PostModel) {
    const { categoryId } = post

    const category = await this.categoryService.findCategoryById(
      categoryId as any as string,
    )
    if (!category) {
      throw new BadRequestException('分类丢失了 ಠ_ಠ')
    }

    const slug = post.slug ? slugify(post.slug) : slugify(post.title)
    if (!(await this.isAvailableSlug(slug))) {
      throw new BusinessException(ErrorCodeEnum.SlugNotAvailable)
    }
    const res = await this.postModel.create({
      ...post,
      slug,
      categoryId: category.id,
      created: new Date(),
      modified: null,
    })

    process.nextTick(async () => {
      const doc = res.toJSON()
      await Promise.all([
        this.eventManager.emit(EventBusEvents.CleanAggregateCache, null, {
          scope: EventScope.TO_SYSTEM,
        }),
        this.eventManager.broadcast(
          BusinessEvents.POST_CREATE,
          {
            ...doc,
            category,
          },
          {
            scope: EventScope.TO_SYSTEM,
          },
        ),
        this.eventManager.broadcast(
          BusinessEvents.POST_CREATE,
          {
            ...doc,
            category,
            text: await this.textMacroService.replaceTextMacro(doc.text, doc),
          },
          {
            scope: EventScope.TO_SYSTEM,
          },
        ),
        this.imageService.recordImageDimensions(this.postModel, res._id),
      ])
    })

    return res
  }

  async updateById(id: string, data: Partial<PostModel>) {
    const oldDocument = await this.postModel.findById(id).lean()
    if (!oldDocument) {
      throw new BadRequestException('文章不存在')
    }
    // 看看 category 改了没
    const { categoryId } = data
    if (categoryId && categoryId !== oldDocument.categoryId) {
      const category = await this.categoryService.findCategoryById(
        categoryId as any as string,
      )
      if (!category) {
        throw new BadRequestException('分类不存在')
      }
    }
    // 只有修改了 text title slug 的值才触发更新 modified 的时间
    if ([data.text, data.title, data.slug].some((i) => isDefined(i))) {
      const now = new Date()

      data.modified = now
    }

    const originDocument = await this.postModel.findById(id)

    if (!originDocument) {
      throw new CannotFindException()
    }

    if (data.slug && data.slug !== originDocument.slug) {
      data.slug = slugify(data.slug)
      const isAvailableSlug = await this.isAvailableSlug(data.slug)

      if (!isAvailableSlug) {
        throw new BusinessException(ErrorCodeEnum.SlugNotAvailable)
      }
    }

    Object.assign(originDocument, omit(data, PostModel.protectedKeys))
    await originDocument.save()
    process.nextTick(async () => {
      const doc = await this.postModel.findById(id).lean({ getters: true })
      // 更新图片信息缓存
      await Promise.all([
        this.eventManager.emit(EventBusEvents.CleanAggregateCache, null, {
          scope: EventScope.TO_SYSTEM,
        }),
        data.text &&
          this.imageService.recordImageDimensions(this.postModel, id),
        doc &&
          this.eventManager.broadcast(
            BusinessEvents.POST_UPDATE,
            {
              ...doc,
              text: await this.textMacroService.replaceTextMacro(doc.text, doc),
            },
            {
              scope: EventScope.TO_VISITOR,
            },
          ),
        this.eventManager.broadcast(BusinessEvents.POST_UPDATE, doc, {
          scope: EventScope.TO_SYSTEM,
        }),
      ])
    })

    return originDocument.toObject()
  }

  async deletePost(id: string) {
    await Promise.all([
      this.model.deleteOne({ _id: id }),
      this.commentModel.deleteMany({ ref: id, refType: CommentRefTypes.Post }),
    ])
    await this.eventManager.broadcast(BusinessEvents.POST_DELETE, id, {
      scope: EventScope.TO_SYSTEM_VISITOR,
      nextTick: true,
    })
  }

  async getCategoryBySlug(slug: string) {
    return await this.categoryService.model.findOne({ slug })
  }

  async isAvailableSlug(slug: string) {
    return (await this.postModel.countDocuments({ slug })) === 0
  }
}
