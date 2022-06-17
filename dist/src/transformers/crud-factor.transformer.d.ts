import { Type } from '@nestjs/common';
import { AnyParamConstructor } from '@typegoose/typegoose/lib/types';
import { BaseModel } from '~/shared/model/base.model';
export declare type BaseCrudModuleType<T> = {
    _model: MongooseModel<T>;
};
export declare type ClassType<T> = new (...args: any[]) => T;
export declare function BaseCrudFactory<T extends AnyParamConstructor<BaseModel & {
    id?: string;
}>>({ model, classUpper }: {
    model: T;
    classUpper?: ClassType<any>;
}): Type<any>;
