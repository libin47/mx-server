import { HttpException } from '@nestjs/common';
import { ErrorCodeEnum } from '~/constants/error-code.constant';
export declare class BusinessException extends HttpException {
    constructor(code: ErrorCodeEnum);
}
