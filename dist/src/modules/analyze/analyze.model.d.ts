/// <reference types="ua-parser-js" />
import { BaseModel } from '~/shared/model/base.model';
export declare class AnalyzeModel extends BaseModel {
    ip?: string;
    ua: UAParser;
    path?: string;
    timestamp: Date;
}
