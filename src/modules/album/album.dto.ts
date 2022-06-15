import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'
import { uniq } from 'lodash'
import { IsBooleanOrString } from '~/utils/validator/isBooleanOrString'

export class SlugOrIdDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  query?: string
}

export class MultiQueryTagAndAlbumDto {
  @IsOptional()
  @Transform(({ value: val }) => {
    if (val === '1' || val === 'true') {
      return true
    } else {
      return val
    }
  })
  @IsBooleanOrString()
  tag?: boolean | string
}
export class MultiAlbumsQueryDto {
  @IsOptional()
  @IsMongoId({
    each: true,
    message: '多分类查询使用逗号分隔, 应为 mongoID',
  })
  @Transform(({ value: v }) => uniq(v.split(',')))
  ids?: Array<string>

  @IsOptional()
  @IsBoolean()
  @Transform((b) => Boolean(b))
  @ApiProperty({ enum: [1, 0] })
  joint?: boolean
}
