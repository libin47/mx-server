import { PaginateResult } from 'mongoose';
import { Pagination } from '~/shared/interface/paginator.interface';
export declare function transformDataToPaginate<T = any>(data: PaginateResult<T>): Pagination<T>;
