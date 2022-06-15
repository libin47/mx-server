import { Module, forwardRef } from '@nestjs/common'

import { GatewayModule } from '~/processors/gateway/gateway.module'

import { QAModule } from '../qa/qa.module'
import { CommentModule } from '../comment/comment.module'
import { TopicModule } from '../topic/topic.module'
import { NoteController } from './note.controller'
import { NoteService } from './note.service'

@Module({
  controllers: [NoteController],
  providers: [NoteService],
  exports: [NoteService],
  imports: [
    GatewayModule,
    QAModule,
    forwardRef(() => CommentModule),

    forwardRef(() => TopicModule),
  ],
})
export class NoteModule {}
