import { PartialType } from '@nestjs/mapped-types'
import { DocumentType, index, modelOptions, prop } from '@typegoose/typegoose'
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { BaseModel } from '~/shared/model/base.model'

export type AlbumDocument = DocumentType<AlbumModel>


@index({ slug: -1 })
@modelOptions({ options: { customName: 'Album' } })
export class AlbumModel extends BaseModel {
  @prop({ unique: true, trim: true, required: true })
  @IsString()
  @IsNotEmpty()
  name!: string

  @prop({ unique: true, required: true })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  slug!: string
}

export class PartialAlbumModel extends PartialType(AlbumModel) {}
