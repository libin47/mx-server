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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolService = void 0;
const camelcase_keys_1 = __importDefault(require("camelcase-keys"));
const net_1 = require("net");
const url_1 = require("url");
const common_1 = require("@nestjs/common");
const helper_http_service_1 = require("../../processors/helper/helper.http.service");
const configs_service_1 = require("../configs/configs.service");
let ToolService = class ToolService {
    constructor(httpService, configs) {
        this.httpService = httpService;
        this.configs = configs;
    }
    async getIp(ip, timeout = 3000) {
        const isV4 = (0, net_1.isIPv4)(ip);
        const isV6 = (0, net_1.isIPv6)(ip);
        if (!isV4 && !isV6) {
            throw new common_1.UnprocessableEntityException('Invalid IP');
        }
        if (isV4) {
            const { data } = await this.httpService.axiosRef.get(`https://api.i-meto.com/ip/v1/qqwry/${ip}`, {
                timeout,
            });
            return (0, camelcase_keys_1.default)(data, { deep: true });
        }
        else {
            const { data } = (await this.httpService.axiosRef.get(`http://ip-api.com/json/${ip}`, {
                timeout,
            }));
            const res = {
                cityName: data.city,
                countryName: data.country,
                ip: data.query,
                ispDomain: data.as,
                ownerDomain: data.org,
                regionName: data.region_name,
            };
            return res;
        }
    }
    async getGeoLocationByGaode(longitude, latitude) {
        const { adminExtra: { gaodemapKey }, } = await this.configs.waitForConfigReady();
        if (!gaodemapKey) {
            throw new common_1.BadRequestException('高德地图 API Key 未配置');
        }
        const data = await fetch(`https://restapi.amap.com/v3/geocode/regeo?key=${gaodemapKey}&location=` +
            `${longitude},${latitude}`)
            .then((response) => response.json())
            .catch((error) => { });
        if (!data) {
            throw new common_1.InternalServerErrorException('高德地图 API 调用失败');
        }
        return data;
    }
    async searchLocationByGaode(keywords) {
        const { adminExtra: { gaodemapKey }, } = await this.configs.waitForConfigReady();
        if (!gaodemapKey) {
            throw new common_1.BadRequestException('高德地图 API Key 未配置');
        }
        const params = new url_1.URLSearchParams([
            ['key', gaodemapKey],
            ['keywords', keywords],
        ]);
        const data = await fetch(`https://restapi.amap.com/v3/place/text?${params.toString()}`)
            .then((response) => response.json())
            .catch((error) => { });
        if (!data) {
            throw new common_1.InternalServerErrorException('高德地图 API 调用失败');
        }
        return data;
    }
};
ToolService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [helper_http_service_1.HttpService,
        configs_service_1.ConfigsService])
], ToolService);
exports.ToolService = ToolService;
