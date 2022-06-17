import { ArticleTypeEnum } from '~/constants/article.constant';
export declare class MetaDto {
    title: string;
    date: Date;
    updated?: Date;
    categories?: Array<string>;
    tags?: string[];
    slug: string;
}
export declare class DatatypeDto {
    meta: MetaDto;
    text: string;
}
export declare class DataListDto {
    type: ArticleTypeEnum;
    data: DatatypeDto[];
}
export declare class ExportMarkdownQueryDto {
    yaml: boolean;
    slug: boolean;
    show_title: boolean;
}
export declare class MarkdownPreviewDto {
    title: string;
    md: string;
}
