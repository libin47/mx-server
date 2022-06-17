import { mongoose } from '@typegoose/typegoose';
import { Pagination } from '~/shared/interface/paginator.interface';
export declare function transformDataToPaginate<T = any>(data: mongoose.PaginateResult<T>): Pagination<T>;
