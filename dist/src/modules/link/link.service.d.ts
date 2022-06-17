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
import { EmailService, LinkApplyEmailType } from '~/processors/helper/helper.email.service';
import { EventManagerService } from '~/processors/helper/helper.event.service';
import { HttpService } from '~/processors/helper/helper.http.service';
import { ConfigsService } from '../configs/configs.service';
import { LinkModel } from './link.model';
export declare class LinkService {
    private readonly linkModel;
    private readonly emailService;
    private readonly configs;
    private readonly eventManager;
    private readonly http;
    private readonly configsService;
    constructor(linkModel: MongooseModel<LinkModel>, emailService: EmailService, configs: ConfigsService, eventManager: EventManagerService, http: HttpService, configsService: ConfigsService);
    get model(): MongooseModel<LinkModel>;
    applyForLink(model: LinkModel): Promise<void>;
    approveLink(id: string): Promise<Omit<import("mongoose")._LeanDocument<import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & LinkModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
        _id: any;
    }>, "validate" | "schema" | "set" | "get" | "update" | "delete" | "save" | "remove" | "populate" | "$getAllSubdocs" | "$ignore" | "$isDefault" | "$isDeleted" | "$getPopulatedDocs" | "$isEmpty" | "$isValid" | "$locals" | "$markValid" | "$model" | "$op" | "$session" | "$set" | "$where" | "baseModelName" | "collection" | "db" | "deleteOne" | "depopulate" | "directModifiedPaths" | "equals" | "errors" | "getChanges" | "increment" | "init" | "invalidate" | "isDirectModified" | "isDirectSelected" | "isInit" | "isModified" | "isNew" | "isSelected" | "markModified" | "modifiedPaths" | "modelName" | "overwrite" | "$parent" | "populated" | "replaceOne" | "toJSON" | "toObject" | "unmarkModified" | "updateOne" | "validateSync" | "$isSingleNested">>;
    getCount(): Promise<{
        audit: number;
        friends: number;
        collection: number;
        outdate: number;
        banned: number;
    }>;
    sendToCandidate(model: LinkModel): Promise<void>;
    sendToMaster(authorName: string, model: LinkModel): Promise<void>;
    sendLinkApplyEmail({ to, model, authorName, template, }: {
        authorName?: string;
        to: string;
        model: LinkModel;
        template: LinkApplyEmailType;
    }): Promise<void>;
    checkLinkHealth(): Promise<{}>;
    canApplyLink(): Promise<boolean>;
}
