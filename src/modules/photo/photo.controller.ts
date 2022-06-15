import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { Types } from 'mongoose'
import { Auth } from '~/common/decorator/auth.decorator'
import { Paginator } from '~/common/decorator/http.decorator'
import { IpLocation, IpRecord } from '~/common/decorator/ip.decorator'
import { ApiName } from '~/common/decorator/openapi.decorator'
import { IsMaster } from '~/common/decorator/role.decorator'
import { VisitDocument } from '~/common/decorator/update-count.decorator'
import { CannotFindException } from '~/common/exceptions/cant-find.exception'
import { CountingService } from '~/processors/helper/helper.counting.service'
import { MongoIdDto } from '~/shared/dto/id.dto'
import {
  addConditionToSeeHideContent,
  addYearCondition,
} from '~/utils/query.util'
import { AlbumAndSlugDto, PhotoQueryDto } from './photo.dto'
import { PartialPhotoModel, PhotoModel } from './photo.model'
import { PhotoService } from './photo.service'

@Controller('photos')
@ApiName
export class PhotoController {
  constructor(
    private readonly photoService: PhotoService,
    private readonly countingService: CountingService,
  ) {}

  @Get('/')
  @Paginator
  async getPaginate(@Query() query: PhotoQueryDto, @IsMaster() master: boolean) {
    const { size, select, page, year, sortBy, sortOrder, album } = query

    return await this.photoService.findWithPaginator(
      {
        ...addYearCondition(year),
        ...addConditionToSeeHideContent(master),
        albumId: album,
      },
      {
        limit: size,
        page,
        select,
        sort: sortBy ? { [sortBy]: sortOrder || -1 } : { created: -1 },
        populate: 'album',
      },
    )
  }

  @Get('/:id')
  @VisitDocument('Post')
  async getById(@Param() params: MongoIdDto, @IsMaster() isMaster: boolean) {
    const { id } = params
    const doc = await this.photoService.model.findById(id)
    if (!doc) {
      throw new CannotFindException()
    }
    return doc
  }

  @Get('/latest')
  @VisitDocument('Post')
  async getLatest(@IsMaster() isMaster: boolean) {
    return this.photoService.model
      .findOne({ ...addConditionToSeeHideContent(isMaster) })
      .sort({ created: -1 })
      .lean()
  }

  @Get('/:album/:slug')
  @ApiOperation({ summary: '根据分类名和自定义别名获取' })
  @VisitDocument('Post')
  async getByCateAndSlug(
    @Param() params: AlbumAndSlugDto,
    @IsMaster() isMaster: boolean,
  ) {
    const { album, slug } = params

    const albumDocument = await this.photoService.getAlbumBySlug(album)
    if (!albumDocument) {
      throw new NotFoundException('该分类未找到 (｡•́︿•̀｡)')
    }

    const photoDocument = await this.photoService.model
      .findOne({
        slug,
        albumId: albumDocument._id,
        // ...condition,
      })
      .populate('album')

    if (!photoDocument) {
      throw new CannotFindException()
    }
    return photoDocument.toJSON()
  }

  @Post('/')
  @Auth()
  @HttpCode(201)
  async create(@Body() body: PhotoModel) {
    const _id = new Types.ObjectId()

    return await this.photoService.create({
      ...body,
      created: new Date(),
      modified: null,
      slug: body.slug ?? _id.toHexString(),
    })
  }

  @Put('/:id')
  @Auth()
  async update(@Param() params: MongoIdDto, @Body() body: PhotoModel) {
    await this.photoService.updateById(params.id, body)
    return this.photoService.findById(params.id)
  }

  @Patch('/:id')
  @Auth()
  async patch(@Param() params: MongoIdDto, @Body() body: PartialPhotoModel) {
    return await this.photoService.updateById(params.id, body)
  }

  @Delete('/:id')
  @Auth()
  @HttpCode(204)
  async deletePhoto(@Param() params: MongoIdDto) {
    const { id } = params
    await this.photoService.deletePhoto(id)

    return
  }

  @Get('/_thumbs-up')
  @HttpCode(204)
  async thumbsUpArticle(
    @Query() query: MongoIdDto,
    @IpLocation() location: IpRecord,
  ) {
    const { ip } = location
    const { id } = query
    try {
      const res = await this.countingService.updateLikeCount('Post', id, ip)
      if (!res) {
        throw new BadRequestException('你已经支持过啦!')
      }
    } catch (e: any) {
      throw new BadRequestException(e)
    }

    return
  }
}
