"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var ImageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageService = void 0;
const image_size_1 = __importDefault(require("image-size"));
const common_1 = require("@nestjs/common");
const configs_service_1 = require("../../modules/configs/configs.service");
const pic_util_1 = require("../../utils/pic.util");
const helper_http_service_1 = require("./helper.http.service");
let ImageService = ImageService_1 = class ImageService {
    constructor(httpService, configsService) {
        this.httpService = httpService;
        this.configsService = configsService;
        this.getOnlineImageSizeAndMeta = async (image) => {
            const { url: { webUrl }, } = await this.configsService.waitForConfigReady();
            const { data, headers } = await this.httpService.axiosRef.get(image, {
                responseType: 'arraybuffer',
                headers: {
                    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
                    referer: webUrl,
                },
            });
            const imageType = headers['content-type'];
            const buffer = Buffer.from(data);
            const size = (0, image_size_1.default)(buffer);
            const accent = await (0, pic_util_1.getAverageRGB)(buffer, imageType);
            return { size, accent };
        };
        this.logger = new common_1.Logger(ImageService_1.name);
    }
    async recordImageDimensions(_model, id) {
        const model = _model;
        const document = await model.findById(id).lean();
        if (!document) {
            throw new common_1.InternalServerErrorException(`document not found, can not record image dimensions`);
        }
        const { text } = document;
        const newImages = (0, pic_util_1.pickImagesFromMarkdown)(text);
        const result = [];
        const oldImages = document.images || [];
        const oldImagesMap = new Map(oldImages.map((image) => [image.src, image]));
        const task = [];
        for (const src of newImages) {
            const originImage = oldImagesMap.get(src);
            const keys = new Set(Object.keys(originImage || {}));
            if (originImage &&
                originImage.src === src &&
                ['height', 'width', 'type', 'accent'].every((key) => keys.has(key) && originImage[key])) {
                result.push(originImage);
                continue;
            }
            const promise = new Promise((resolve) => {
                this.logger.log(`Get --> ${src}`);
                this.getOnlineImageSizeAndMeta(src)
                    .then(({ size, accent }) => {
                    const filename = src.split('/').pop();
                    this.logger.debug(`[${filename}]: height: ${size.height}, width: ${size.width}, accent: ${accent}`);
                    resolve({ ...size, accent, src });
                })
                    .catch((e) => {
                    this.logger.error(`GET --> ${src} ${e.message}`);
                    const oldRecord = oldImagesMap.get(src);
                    if (oldRecord) {
                        resolve(oldRecord);
                    }
                    else
                        resolve({
                            width: undefined,
                            height: undefined,
                            type: undefined,
                            accent: undefined,
                            src: undefined,
                        });
                });
            });
            task.push(promise);
        }
        const images = await Promise.all(task);
        result.push(...images);
        await model.updateOne({ _id: id }, { images: result.filter(({ src }) => newImages.includes(src)) });
    }
};
ImageService = ImageService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [helper_http_service_1.HttpService,
        configs_service_1.ConfigsService])
], ImageService);
exports.ImageService = ImageService;
