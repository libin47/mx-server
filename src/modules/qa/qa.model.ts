import { PartialType } from '@nestjs/mapped-types'
import { DocumentType, index, modelOptions, prop, Severity } from '@typegoose/typegoose'
import { IsNotEmpty, IsString } from 'class-validator'
import { BaseModel } from '~/shared/model/base.model'
import { IsMongoId } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

// export type QADocument = DocumentType<QAModel>



@modelOptions({ options: { customName: 'QA', allowMixed: Severity.ALLOW }  })
export class QAModel extends BaseModel {
  @prop({ unique: true, trim: true, required: true })
  @IsString()
  @IsNotEmpty()
  question!: string

  @prop({ unique: true, required: true })
  @IsNotEmpty()
  answer!: string[]
}

export class AnswerModel {
  @IsString()
  answer: string

  @IsMongoId()
  @ApiProperty({ example: '62845a778378069102ca28a6' })
  id: string
}

export class PartialQAModel extends PartialType(QAModel) {}
