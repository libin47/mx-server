import { BaseModel } from '~/shared/model/base.model';
export declare enum SnippetType {
    JSON = "json",
    Function = "function",
    Text = "text",
    YAML = "yaml"
}
export declare class SnippetModel extends BaseModel {
    type: SnippetType;
    private: boolean;
    raw: string;
    name: string;
    reference: string;
    comment?: string;
    metatype?: string;
    schema?: string;
}
