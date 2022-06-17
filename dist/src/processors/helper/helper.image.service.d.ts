import { ConfigsService } from '~/modules/configs/configs.service';
import { WriteBaseModel } from '~/shared/model/write-base.model';
import { HttpService } from './helper.http.service';
export declare class ImageService {
    private readonly httpService;
    private readonly configsService;
    private logger;
    constructor(httpService: HttpService, configsService: ConfigsService);
    recordImageDimensions<T extends WriteBaseModel>(_model: MongooseModel<T>, id: string): Promise<void>;
    getOnlineImageSizeAndMeta: (image: string) => Promise<{
        size: import("image-size/dist/types/interface").ISizeCalculationResult;
        accent: string | undefined;
    }>;
}
