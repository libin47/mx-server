import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  HttpCode,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { ApiQuery } from '@nestjs/swagger'
import { Types } from 'mongoose'
import { Auth } from '~/common/decorator/auth.decorator'
import { ApiName } from '~/common/decorator/openapi.decorator'
import { IsMaster } from '~/common/decorator/role.decorator'
import { CannotFindException } from '~/common/exceptions/cant-find.exception'
import { MongoIdDto } from '~/shared/dto/id.dto'
import { addConditionToSeeHideContent } from '~/utils/query.util'
import { PhotoService } from '../photo/photo.service'
import {
  MultiAlbumsQueryDto,
  MultiQueryTagAndAlbumDto,
  SlugOrIdDto,
} from './album.dto'
import {
  AlbumModel,
  PartialAlbumModel,
} from './album.model'
import { AlbumService } from './album.service'

@Controller({ path: 'albums' })
@ApiName
export class AlbumController {
  constructor(
    private readonly albumService: AlbumService,
    @Inject(forwardRef(() => PhotoService))
    private readonly photoService: PhotoService,
  ) {}

  @Get('/')
  async getAlbums(
    @Query() query: MultiAlbumsQueryDto,
    @IsMaster() isMaster: boolean,
  ) {
    const { ids, joint} = query // categories is album's mongo id
    if (ids) {
      const ignoreKeys = '-text -summary -hide -images -commentsIndex'
      if (joint) {
        const map = new Object()

        await Promise.all(
          ids.map(async (id) => {
            const item = await this.photoService.model
              .find(
                { albumId: id, ...addConditionToSeeHideContent(isMaster) },
                ignoreKeys,
              )
              .sort({ created: -1 })
              .lean()

            map[id] = item
            return id
          }),
        )

        return { entries: map }
      } else {
        const map = new Object()

        await Promise.all(
          ids.map(async (id) => {
            const posts = await this.photoService.model
              .find(
                { albumId: id, ...addConditionToSeeHideContent(isMaster) },
                ignoreKeys,
              )
              .sort({ created: -1 })
              .lean()
            const album = await this.albumService.findAlbumById(id)
            map[id] = Object.assign({ ...album, children: posts })
            return id
          }),
        )

        return { entries: map }
      }
    }
    return await this.albumService.findAllAlbum()
  }

  @Get('/:query')
  @ApiQuery({
    description: '混合查询 分类 和 标签云',
    name: 'tag',
    enum: ['true', 'false'],
    required: false,
  })
  async getAlbumById(
    @Param() { query }: SlugOrIdDto,
    @IsMaster() isMaster: boolean,
  ) {
    if (!query) {
      throw new BadRequestException()
    }

    const isId = Types.ObjectId.isValid(query)
    const res = isId
      ? await this.albumService.model
          .findById(query)
          .sort({ created: -1 })
          .lean()
      : await this.albumService.model
          .findOne({ slug: query })
          .sort({ created: -1 })
          .lean()

    if (!res) {
      throw new CannotFindException()
    }

    const children =
      (await this.albumService.findAlbumPost(res._id, {
        $and: [
          addConditionToSeeHideContent(isMaster),
        ],
      })) || []
    return { data: { ...res, children } }
  }

  @Post('/')
  @Auth()
  async create(@Body() body: AlbumModel) {
    const { name, slug } = body
    return this.albumService.model.create({ name, slug: slug ?? name })
  }

  @Put('/:id')
  @Auth()
  async modify(@Param() params: MongoIdDto, @Body() body: AlbumModel) {
    const { slug, name } = body
    const { id } = params
    await this.albumService.model.updateOne(
      { _id: id },
      {
        slug,
        name,
      },
    )
    return await this.albumService.model.findById(id)
  }

  @Patch('/:id')
  @HttpCode(204)
  @Auth()
  async patch(@Param() params: MongoIdDto, @Body() body: PartialAlbumModel) {
    const { id } = params
    await this.albumService.model.updateOne({ _id: id }, body)
    return
  }

  @Delete('/:id')
  @Auth()
  async deleteAlbum(@Param() params: MongoIdDto) {
    const { id } = params
    const album = await this.albumService.model.findById(id)
    if (!album) {
      throw new CannotFindException()
    }
    const postsInAlbum = await this.albumService.findPostsInAlbum(
      album._id,
    )
    if (postsInAlbum.length > 0) {
      throw new BadRequestException('该分类中有其他文章, 无法被删除')
    }
    const res = await this.albumService.model.deleteOne({
      _id: album._id,
    })
    if ((await this.albumService.model.countDocuments({})) === 0) {
      await this.albumService.createDefaultAlbum()
    }
    return res
  }
}
