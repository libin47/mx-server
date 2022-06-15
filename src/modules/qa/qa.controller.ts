import {
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  HttpCode,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { Auth } from '~/common/decorator/auth.decorator'
import { ApiName } from '~/common/decorator/openapi.decorator'
import { IsMaster } from '~/common/decorator/role.decorator'
import { CannotFindException } from '~/common/exceptions/cant-find.exception'
import { MongoIdDto } from '~/shared/dto/id.dto'
import { addConditionCanSee } from '~/utils/query.util'
import {
  QAModel,
  AnswerModel,
  PartialQAModel,
} from './qa.model'
import { QAService } from './qa.service'

@Controller({ path: 'QA' })
@ApiName
export class QAController {
  constructor(
    private readonly qaService: QAService
  ) {}

  @Get('/')
  @Auth()
  async getQAs(
    @IsMaster() isMaster: boolean,
  ) {
        return await this.qaService.model
          .find(
            { ...addConditionCanSee(isMaster) },
          )
          .sort({ created: -1 })
          .lean()
  }


  @Get('/:id')
  async getQbyId(
    @Param() params: MongoIdDto,
  ) { 
    const { id } = params
    const QA = await this.qaService.findQAById(id)
    if (!QA) {
      throw new CannotFindException()
    }
    return {'question': QA.question}
  }

  @Post('/:id')
  async checkQAById(
    @Body() body: AnswerModel
  ) { 
    const { id, answer } = body
    return await this.qaService.checkAnswer(id, answer)
  }

  @Post('/')
  @Auth()
  async create(@Body() body: QAModel) {
    const { question, answer } = body
    return this.qaService.model.create({ question:question, answer:answer})
  }

  @Put('/:id')
  @Auth()
  async modify(@Param() params: MongoIdDto, @Body() body: QAModel) {
    const { question, answer } = body
    const { id } = params
    await this.qaService.model.updateOne(
      { _id: id },
      {
        question,
        answer,
      },
    )
    return await this.qaService.model.findById(id)
  }

  @Patch('/:id')
  @HttpCode(204)
  @Auth()
  async patch(@Param() params: MongoIdDto, @Body() body: PartialQAModel) {
    const { id } = params
    await this.qaService.model.updateOne({ _id: id }, body)
    return
  }

  @Delete('/:id')
  @Auth()
  async deleteAlbum(@Param() params: MongoIdDto) {
    const { id } = params
    const qa = await this.qaService.model.findById(id)
    if (!qa) {
      throw new CannotFindException()
    }
    const res = await this.qaService.model.deleteOne({
      _id: qa._id,
    })
    if ((await this.qaService.model.countDocuments({})) === 0) {
      await this.qaService.createDefaultQA()
    }
    return res
  }
}
