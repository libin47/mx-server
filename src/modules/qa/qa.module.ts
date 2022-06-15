import { Module } from '@nestjs/common'
import { QAController } from './qa.controller'
import { QAService } from './qa.service'

@Module({
  providers: [QAService],
  exports: [QAService],
  controllers: [QAController],
})  

export class QAModule {}
