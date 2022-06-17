/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indizes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose" />
/// <reference types="mongoose-paginate-v2" />
import { MongoIdDto } from '~/shared/dto/id.dto';
import { PostService } from '../post/post.service';
import { MultiCategoriesQueryDto, MultiQueryTagAndCategoryDto, SlugOrIdDto } from './category.dto';
import { CategoryModel, CategoryType, PartialCategoryModel } from './category.model';
import { CategoryService } from './category.service';
export declare class CategoryController {
    private readonly categoryService;
    private readonly postService;
    constructor(categoryService: CategoryService, postService: PostService);
    getCategories(query: MultiCategoriesQueryDto): Promise<any[] | {
        entries: Object;
    }>;
    getCategoryById({ query }: SlugOrIdDto, { tag }: MultiQueryTagAndCategoryDto): Promise<{
        tag: string;
        data: any[] | null;
    } | {
        data: {
            children: (import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & import("../post/post.model").PostModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
                _id: any;
            })[];
            slug: string;
            created?: Date | undefined;
            id?: any;
            type?: CategoryType | undefined;
            _id: any;
            __v?: any;
            name: string;
            typegooseName: () => string;
        };
        tag?: undefined;
    }>;
    create(body: CategoryModel): Promise<import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & CategoryModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
        _id: any;
    }>;
    modify(params: MongoIdDto, body: CategoryModel): Promise<(import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & CategoryModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
        _id: any;
    }) | null>;
    patch(params: MongoIdDto, body: PartialCategoryModel): Promise<void>;
    deleteCategory(params: MongoIdDto): Promise<import("mongodb").DeleteResult>;
}
