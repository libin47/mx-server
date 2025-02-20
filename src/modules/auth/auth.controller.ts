import { Transform } from 'class-transformer'
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  isMongoId,
} from 'class-validator'

import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Post,
  Query,
} from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger'

import { Auth } from '~/common/decorator/auth.decorator'
import { ApiName } from '~/common/decorator/openapi.decorator'
import { IsMaster as Master } from '~/common/decorator/role.decorator'
import { EventBusEvents } from '~/constants/event-bus.constant'
import { MongoIdDto } from '~/shared/dto/id.dto'

import { AuthService } from './auth.service'

export class TokenDto {
  @IsDate()
  @IsOptional()
  @Transform(({ value: v }) => new Date(v))
  expired?: Date

  @IsString()
  @IsNotEmpty()
  name: string
}

@Controller({
  path: 'auth',
})
@ApiName
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Get()
  @ApiOperation({ summary: '判断当前 Token 是否有效 ' })
  @ApiBearerAuth()
  checkLogged(@Master() isMaster: boolean) {
    return { ok: ~~isMaster, isGuest: !isMaster }
  }

  @Get('token')
  @Auth()
  async getOrVerifyToken(
    @Query('token') token?: string,
    @Query('id') id?: string,
  ) {
    if (typeof token === 'string') {
      return await this.authService
        .verifyCustomToken(token)
        .then(([isValid]) => isValid)
    }
    if (id && typeof id === 'string' && isMongoId(id)) {
      return await this.authService.getTokenSecret(id)
    }
    return await this.authService.getAllAccessToken()
  }

  @Post('token')
  @Auth()
  async generateToken(@Body() body: TokenDto) {
    const { expired, name } = body
    const token = await this.authService.generateAccessToken()
    const model = {
      expired,
      token,
      name,
    }
    await this.authService.saveToken(model)
    return model
  }
  @Delete('token')
  @Auth()
  async deleteToken(@Query() query: MongoIdDto) {
    const { id } = query
    const token = await this.authService
      .getAllAccessToken()
      .then((models) =>
        models.find((model) => {
          return (model as any).id === id
        }),
      )
      .then((model) => {
        return model?.token
      })

    if (!token) {
      throw new NotFoundException(`token ${id} is not found`)
    }
    await this.authService.deleteToken(id)

    this.eventEmitter.emit(EventBusEvents.TokenExpired, token)
    return 'OK'
  }
}
