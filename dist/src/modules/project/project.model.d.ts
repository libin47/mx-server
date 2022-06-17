import { BaseModel } from '~/shared/model/base.model';
export declare class ProjectModel extends BaseModel {
    name: string;
    previewUrl?: string;
    docUrl?: string;
    projectUrl?: string;
    images?: string[];
    description: string;
    avatar?: string;
    text: string;
}
declare const PartialProjectModel_base: import("@nestjs/common").Type<Partial<ProjectModel>>;
export declare class PartialProjectModel extends PartialProjectModel_base {
}
export {};
