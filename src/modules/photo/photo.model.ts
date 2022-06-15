import { PartialType } from '@nestjs/mapped-types'
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger'
import { index, modelOptions, prop, Ref, Severity } 
from '@typegoose/typegoose'
import {
  ArrayUnique,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'
import { Query } from 'mongoose'
import {
  CountMixed as Count,
  PhotoBaseModel,
} from '~/shared/model/base.model'
import { Paginator } from '~/shared/interface/paginator.interface'
import {
  AlbumModel as Album,
  AlbumModel,
} from '../album/album.model'


@index({ slug: 1 })
@index({ modified: -1 })
@index({ text: 'text' })
@modelOptions({ options: { customName: 'Photo', allowMixed: Severity.ALLOW } })
export class PhotoModel extends PhotoBaseModel {
  @prop({ trim: true, unique: true, required: true })
  @IsString()
  @IsNotEmpty()
  slug!: string
  

  @prop({ ref: () => Album, required: true })
  @IsMongoId()
  @ApiProperty({ example: '5eb2c62a613a5ab0642f1f7a' })
  albumId: Ref<Album>

  @prop({
    ref: () => Album,
    foreignField: '_id',
    localField: 'albumId',
    justOne: true,
  })

  @ApiHideProperty()
  public album: Ref<Album>

  
  @prop({ default: false })
  @IsBoolean()
  @IsOptional()
  hide?: boolean

  @prop({ default: true })
  @IsBoolean()
  @IsOptional()
  copyright?: boolean

  @prop({ type: Count, default: { read: 0, like: 0 }, _id: false })
  @ApiHideProperty()
  count?: Count

  static get protectedKeys() {
    return ['count'].concat(super.protectedKeys)
  }
}

export class PartialPhotoModel extends PartialType(PhotoModel) {}

export class PhotoPaginatorModel {
  data: PhotoModel[]
  pagination: Paginator
}
