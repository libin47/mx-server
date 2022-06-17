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
import { EventManagerService } from '~/processors/helper/helper.event.service';
import { ImageService } from '~/processors/helper/helper.image.service';
import { TextMacroService } from '~/processors/helper/helper.macro.service';
import { PageModel } from './page.model';
export declare class PageService {
    private readonly pageModel;
    private readonly imageService;
    private readonly eventManager;
    private readonly macroService;
    constructor(pageModel: MongooseModel<PageModel>, imageService: ImageService, eventManager: EventManagerService, macroService: TextMacroService);
    get model(): MongooseModel<PageModel>;
    create(doc: PageModel): Promise<import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & PageModel & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
        _id: any;
    }>;
    updateById(id: string, doc: Partial<PageModel>): Promise<void>;
}
