import { DocumentType } from '@typegoose/typegoose';
import { BaseModel } from '~/shared/model/base.model';
export declare type CategoryDocument = DocumentType<CategoryModel>;
export declare enum CategoryType {
    Category = 0,
    Tag = 1
}
export declare class CategoryModel extends BaseModel {
    name: string;
    type?: CategoryType;
    slug: string;
}
declare const PartialCategoryModel_base: import("@nestjs/mapped-types").MappedType<Partial<CategoryModel>>;
export declare class PartialCategoryModel extends PartialCategoryModel_base {
}
export {};
