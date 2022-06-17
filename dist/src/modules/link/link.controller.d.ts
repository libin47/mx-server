import mongoose from 'mongoose';
import { PagerDto } from '~/shared/dto/pager.dto';
import { BaseCrudModuleType } from '~/transformers/crud-factor.transformer';
import { LinkDto } from './link.dto';
import { LinkModel } from './link.model';
import { LinkService } from './link.service';
declare const LinkControllerCrud_base: import("@nestjs/common").Type<any>;
export declare class LinkControllerCrud extends LinkControllerCrud_base {
    gets(this: BaseCrudModuleType<LinkModel>, pager: PagerDto, isMaster: boolean): Promise<mongoose.PaginateResult<LinkModel & mongoose.Document<any, any, any> & {
        _id: any;
    }>>;
    getAll(this: BaseCrudModuleType<LinkModel>): Promise<Omit<mongoose._LeanDocument<mongoose.Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & LinkModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
        _id: any;
    }>, "validate" | "schema" | "set" | "get" | "update" | "delete" | "save" | "remove" | "populate" | "$getAllSubdocs" | "$ignore" | "$isDefault" | "$isDeleted" | "$getPopulatedDocs" | "$isEmpty" | "$isValid" | "$locals" | "$markValid" | "$model" | "$op" | "$session" | "$set" | "$where" | "baseModelName" | "collection" | "db" | "deleteOne" | "depopulate" | "directModifiedPaths" | "equals" | "errors" | "getChanges" | "increment" | "init" | "invalidate" | "isDirectModified" | "isDirectSelected" | "isInit" | "isModified" | "isNew" | "isSelected" | "markModified" | "modifiedPaths" | "modelName" | "overwrite" | "$parent" | "populated" | "replaceOne" | "toJSON" | "toObject" | "unmarkModified" | "updateOne" | "validateSync" | "$isSingleNested">[]>;
}
export declare class LinkController {
    private readonly linkService;
    constructor(linkService: LinkService);
    canApplyLink(): Promise<{
        can: boolean;
    }>;
    getLinkCount(): Promise<{
        audit: number;
        friends: number;
        collection: number;
        outdate: number;
        banned: number;
    }>;
    applyForLink(body: LinkDto): Promise<void>;
    approveLink(id: string): Promise<void>;
    checkHealth(): Promise<{}>;
}
export {};
