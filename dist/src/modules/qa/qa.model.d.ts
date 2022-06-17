import { BaseModel } from '~/shared/model/base.model';
export declare class QAModel extends BaseModel {
    question: string;
    answer: string[];
}
export declare class AnswerModel {
    answer: string;
    id: string;
}
declare const PartialQAModel_base: import("@nestjs/mapped-types").MappedType<Partial<QAModel>>;
export declare class PartialQAModel extends PartialQAModel_base {
}
export {};
