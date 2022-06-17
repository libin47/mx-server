import { Type } from '@nestjs/common';
import { AnyParamConstructor } from '@typegoose/typegoose/lib/types';
import { BaseModel } from '~/shared/model/base.model';
export declare function BaseCrudFactory<T extends AnyParamConstructor<BaseModel & {
    id?: string;
}>>({ model }: {
    model: T;
}): Type<any>;
