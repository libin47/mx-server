import { Transform } from 'class-transformer'
import { IsEnum, IsOptional, IsString, ValidateIf} from 'class-validator'
import { PagerDto } from '~/shared/dto/pager.dto'

export class PhotoQueryDto extends PagerDto {
  @IsOptional()
  @IsEnum(['albumId', 'title', 'created', 'modified'])
  @Transform(({ value: v }) => (v === 'album' ? 'albumId' : v))
  readonly sortBy?: string

  @IsOptional()
  @IsEnum([1, -1])
  @ValidateIf((o) => o.sortBy)
  @Transform(({ value: v }) => v | 0)
  readonly sortOrder?: 1 | -1

  @IsOptional()
  readonly album?: string
}

export class AlbumAndSlugDto {
  @IsString()
  readonly album: string

  @IsString()
  @Transform(({ value: v }) => decodeURI(v))
  readonly slug: string
}
