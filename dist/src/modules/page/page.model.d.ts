import { WriteBaseModel } from '~/shared/model/write-base.model';
export declare enum PageType {
    'md' = "md",
    'html' = "html",
    'json' = "json"
}
export declare class PageModel extends WriteBaseModel {
    slug: string;
    subtitle?: string | null;
    order: number;
    type?: string;
}
declare const PartialPageModel_base: import("@nestjs/mapped-types").MappedType<Partial<PageModel>>;
export declare class PartialPageModel extends PartialPageModel_base {
}
export {};
