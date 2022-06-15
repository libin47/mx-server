import { forwardRef, Module } from '@nestjs/common'

import { PhotoModule } from '../photo/photo.module'
import { AlbumController } from './album.controller'
import { AlbumService } from './album.service'

@Module({
  imports: [forwardRef(() => PhotoModule)],
  controllers: [AlbumController],
  providers: [AlbumService],
  exports: [AlbumService],
})
export class AlbumModule {}
