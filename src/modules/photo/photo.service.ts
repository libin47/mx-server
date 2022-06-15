import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { isDefined } from 'class-validator'
import { omit } from 'lodash'
import { FilterQuery, PaginateOptions } from 'mongoose'
import { InjectModel } from 'nestjs-typegoose'
import { EventBusEvents } from '~/constants/event.constant'
import { EventTypes } from '~/processors/gateway/events.types'
import { WebEventsGateway } from '~/processors/gateway/web/events.gateway'
import { ImageService } from '~/processors/helper/helper.image.service'
import { AlbumService } from '../album/album.service'
import { CommentModel } from '../comment/comment.model'
import { PhotoModel } from './photo.model'

@Injectable()
export class PhotoService {
  constructor(
    @InjectModel(PhotoModel)
    private readonly photoModel: MongooseModel<PhotoModel>,
    @InjectModel(CommentModel)
    private readonly commentModel: MongooseModel<CommentModel>,

    @Inject(forwardRef(() => AlbumService))
    private albumService: AlbumService,
    private readonly webgateway: WebEventsGateway,
    private readonly imageService: ImageService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  get model() {
    return this.photoModel
  }
  findWithPaginator(
    condition?: FilterQuery<PhotoModel>,
    options?: PaginateOptions,
  ) {
    return this.photoModel.paginate(condition as any, options)
  }

  async create(photo: PhotoModel) {
    const { albumId } = photo

    const album = await this.albumService.findAlbumById(
      albumId as any as string,
    )
    if (!album) {
      throw new BadRequestException('分类丢失了 ಠ_ಠ')
    }
    if (await this.isAvailableSlug(photo.slug)) {
      throw new BadRequestException('slug 重复')
    }
    const res = await this.photoModel.create({
      ...photo,
      albumId: album.id,
      created: new Date(),
      modified: null,
    })

    process.nextTick(async () => {
      this.eventEmitter.emit(EventBusEvents.CleanAggregateCache)
      await Promise.all([
        this.webgateway.broadcast(EventTypes.PHOTO_CREATE, {
          ...res.toJSON(),
          album,
        }),
      ])
    })

    return res
  }

  async findById(id: string) {
    const doc = await this.photoModel.findById(id).populate('album')
    if (!doc) {
      throw new BadRequestException('文章不存在')
    }
    return doc
  }

  async updateById(id: string, data: Partial<PhotoModel>) {
    const oldDocument = await this.photoModel.findById(id).lean()
    if (!oldDocument) {
      throw new BadRequestException('文章不存在')
    }
    // 看看 album 改了没
    const { albumId } = data
    if (albumId && albumId !== oldDocument.albumId) {
      const album = await this.albumService.findAlbumById(
        albumId as any as string,
      )
      if (!album) {
        throw new BadRequestException('分类不存在')
      }
    }
    // 只有修改了 text title slug 的值才触发更新 modified 的时间
    if ([data.text, data.title, data.slug].some((i) => isDefined(i))) {
      const now = new Date()

      data.modified = now
    }

    const updated = await this.photoModel.updateOne(
      {
        _id: id,
      },
      omit(data, PhotoModel.protectedKeys),
      { new: true },
    )
    process.nextTick(async () => {
      this.eventEmitter.emit(EventBusEvents.CleanAggregateCache)
      // 更新图片信息缓存
      await Promise.all([
        this.imageService.recordImageDimensions(this.photoModel, id),
        this.webgateway.broadcast(
          EventTypes.PHOTO_UPDATE,
          await this.photoModel.findById(id),
        ),
      ])
    })
  }

  async deletePhoto(id: string) {
    await Promise.all([
      this.model.deleteOne({ _id: id }),
      this.commentModel.deleteMany({ pid: id }),
    ])
    process.nextTick(async () => {
      await this.webgateway.broadcast(EventTypes.PHOTO_DELETE, id)
    })
  }

  async getAlbumBySlug(slug: string) {
    return await this.albumService.model.findOne({ slug })
  }

  async isAvailableSlug(slug: string) {
    return !!(await this.photoModel.countDocuments({ slug }))
  }
}
