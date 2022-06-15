import LeanId from 'mongoose-lean-id'
import { default as mongooseLeanVirtuals } from 'mongoose-lean-virtuals'
import Paginate from 'mongoose-paginate-v2'

import { ApiHideProperty } from '@nestjs/swagger'
import { index, modelOptions, plugin, prop , Severity} from '@typegoose/typegoose'

import { ImageModel } from './image.model'
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
} from 'class-validator'

const mongooseLeanGetters = require('mongoose-lean-getters')
@plugin(mongooseLeanVirtuals)
@plugin(Paginate)
@plugin(mongooseLeanGetters)
@plugin(LeanId)
@modelOptions({
  schemaOptions: {
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
    timestamps: {
      createdAt: 'created',
      updatedAt: false,
    },
    versionKey: false,
  },
})
@index({ created: -1 })
@index({ created: 1 })
export class BaseModel {
  @ApiHideProperty()
  created?: Date

  @ApiHideProperty()
  id?: string

  static get protectedKeys() {
    return ['created', 'id', '_id']
  }
}


export abstract class BaseCommentIndexModel extends BaseModel {
  @prop({ default: 0 })
  @ApiHideProperty()
  commentsIndex?: number

  @prop({ default: true })
  @IsBoolean()
  @IsOptional()
  allowComment: boolean

  static get protectedKeys() {
    return ['commentsIndex'].concat(super.protectedKeys)
  }
}

@modelOptions({ options: { customName: 'PhotoBase', allowMixed: Severity.ALLOW } })
export class PhotoBaseModel extends BaseCommentIndexModel {
  @prop({ trim: true, index: true, required: true })
  @IsString()
  @IsNotEmpty()
  title: string

  @prop({ trim: true })
  @IsString()
  text: string

  @prop({ required: true })
  @IsNotEmpty()
  photos: string[]

  @prop({ default: null })
  @ApiHideProperty()
  modified: Date | null

  static get protectedKeys() {
    return super.protectedKeys
  }
}

@modelOptions({
  schemaOptions: { id: false, _id: false },
  options: { customName: 'count' },
})
export class CountMixed {
  @prop({ default: 0 })
  read?: number

  @prop({ default: 0 })
  like?: number
}

export type { ImageModel as TextImageRecordType }
