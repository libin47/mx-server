import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { ReturnModelType } from '@typegoose/typegoose'
import { InjectModel } from '~/transformers/model.transformer'
import { PhotoService } from '../photo/photo.service'
import { AlbumModel } from './album.model'

@Injectable()
export class AlbumService {
  constructor(
    @InjectModel(AlbumModel)
    private readonly albumModel: ReturnModelType<typeof AlbumModel>,
    @Inject(forwardRef(() => PhotoService))
    private readonly photoService: PhotoService,
  ) {
    this.createDefaultAlbum()
  }

  async findAlbumById(albumId: string) {
    const [album, count] = await Promise.all([
      this.model.findById(albumId).lean(),
      this.photoService.model.countDocuments({ albumId }),
    ])
    return {
      ...album,
      count,
    }
  }

  async findAllAlbum() {
    const data = await this.model.find().lean()
    const counts = await Promise.all(
      data.map((item) => {
        const id = item._id
        return this.photoService.model.countDocuments({ albumId: id })
      }),
    )

    for (let i = 0; i < data.length; i++) {
      Reflect.set(data[i], 'count', counts[i])
    }

    return data
  }

  get model() {
    return this.albumModel
  }

  async getPostTagsSum() {
    const data = await this.photoService.model.aggregate([
      { $project: { tags: 1 } },
      {
        $unwind: '$tags',
      },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      {
        $project: {
          _id: 0,
          name: '$_id',
          count: 1,
        },
      },
    ])
    return data
  }


  async findAlbumPost(albumId: string, condition: any = {}) {
    return await this.photoService.model
      .find({
        albumId,
        ...condition,
      })
      .select('title created slug _id')
      .sort({ created: -1 })
  }

  async findPostsInAlbum(id: string) {
    return await this.photoService.model.find({
      albumId: id,
    })
  }

  async createDefaultAlbum() {
    if ((await this.model.countDocuments()) === 0) {
      return await this.model.create({
        name: '默认分类',
        slug: 'default',
      })
    }
  }
}
