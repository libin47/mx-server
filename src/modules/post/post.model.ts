import { Transform } from 'class-transformer'
import {
  ArrayUnique,
  IsBoolean,
  IsDate,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  isDateString,
} from 'class-validator'
import { Query } from 'mongoose'

import { UnprocessableEntityException } from '@nestjs/common'
import { PartialType } from '@nestjs/mapped-types'
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger'
import {
  DocumentType,
  Ref,
  Severity,
  index,
  modelOptions,
  pre,
  prop,
} from '@typegoose/typegoose'
import { BeAnObject } from '@typegoose/typegoose/lib/types'

import { Paginator } from '~/shared/interface/paginator.interface'
import { CountModel as Count } from '~/shared/model/count.model'
import { WriteBaseModel } from '~/shared/model/write-base.model'

import { CategoryModel as Category } from '../category/category.model'

function autoPopulateCategory(
  this: Query<
    any,
    DocumentType<PostModel, BeAnObject>,
    {},
    DocumentType<PostModel, BeAnObject>
  >,
  next: () => void,
) {
  this.populate({ path: 'category' })
  next()
}

@pre<PostModel>('findOne', autoPopulateCategory)
@pre<PostModel>('find', autoPopulateCategory)
@index({ slug: 1 })
@index({ modified: -1 })
@index({ text: 'text' })
@modelOptions({ options: { customName: 'Post', allowMixed: Severity.ALLOW } })
export class PostModel extends WriteBaseModel {
  @prop({ trim: true, unique: true, required: true })
  @IsString()
  @IsNotEmpty()
  slug!: string

  @prop()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  summary?: string

  @prop({ ref: () => Category, required: true })
  @IsMongoId()
  @ApiProperty({ example: '5eb2c62a613a5ab0642f1f7a' })
  categoryId: Ref<Category>

  @prop({
    ref: () => Category,
    foreignField: '_id',
    localField: 'categoryId',
    justOne: true,
  })
  @ApiHideProperty()
  public category: Ref<Category>

  @prop({ default: true })
  @IsBoolean()
  @IsOptional()
  copyright?: boolean

  @prop({
    type: String,
  })
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  @ArrayUnique()
  @IsOptional()
  tags?: string[]
  @prop({ type: Count, default: { read: 0, like: 0 }, _id: false })
  @ApiHideProperty()
  count?: Count

  @prop()
  @IsDate()
  @IsOptional()
  @Transform(({ value }) => {
    const isDateIsoString = isDateString(value)
    if (isDateIsoString) {
      return new Date(value)
    }
    if (typeof value != 'boolean') {
      throw new UnprocessableEntityException('pin value must be boolean')
    }

    if (value === true) {
      return new Date()
    } else {
      return null
    }
  })
  pin?: Date | null

  @prop()
  @IsPositive()
  @IsInt()
  @IsOptional()
  pinOrder?: number

  static get protectedKeys() {
    return ['count'].concat(super.protectedKeys)
  }
}

export class PartialPostModel extends PartialType(PostModel) {}

export class PostPaginatorModel {
  data: PostModel[]
  pagination: Paginator
}
