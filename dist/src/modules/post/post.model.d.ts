import { Ref } from '@typegoose/typegoose';
import { Paginator } from '~/shared/interface/paginator.interface';
import { CountModel as Count } from '~/shared/model/count.model';
import { WriteBaseModel } from '~/shared/model/write-base.model';
import { CategoryModel as Category } from '../category/category.model';
export declare class PostModel extends WriteBaseModel {
    slug: string;
    summary?: string;
    categoryId: Ref<Category>;
    category: Ref<Category>;
    copyright?: boolean;
    tags?: string[];
    count?: Count;
    pin?: Date | null;
    pinOrder?: number;
    static get protectedKeys(): string[];
}
declare const PartialPostModel_base: import("@nestjs/mapped-types").MappedType<Partial<PostModel>>;
export declare class PartialPostModel extends PartialPostModel_base {
}
export declare class PostPaginatorModel {
    data: PostModel[];
    pagination: Paginator;
}
export {};
