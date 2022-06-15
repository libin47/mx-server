import { forwardRef, Module } from '@nestjs/common'
import { PhotoModule } from '../photo/photo.module'
import { AlbumController } from './album.controller'
import { AlbumService } from './album.service'

@Module({
  providers: [AlbumService],
  exports: [AlbumService],
  controllers: [AlbumController],
  imports: [forwardRef(() => PhotoModule)],
})
export class AlbumModule {}
