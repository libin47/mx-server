"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var AssetService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetService = void 0;
const fs_1 = require("fs");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importStar(require("path"));
const common_1 = require("@nestjs/common");
const path_constant_1 = require("../../constants/path.constant");
const helper_http_service_1 = require("./helper.http.service");
let AssetService = AssetService_1 = class AssetService {
    constructor(httpService) {
        this.httpService = httpService;
        this.embedAssetPath = path_1.default.resolve(cwd, 'assets');
        this.onlineAssetPath = 'https://cdn.jsdelivr.net/gh/mx-space/assets@master/';
        this.logger = new common_1.Logger(AssetService_1.name);
    }
    checkRoot() {
        if (!(0, fs_1.existsSync)(this.embedAssetPath)) {
            return false;
        }
        return true;
    }
    checkAssetPath(path) {
        if (!this.checkRoot()) {
            return false;
        }
        path = (0, path_1.join)(this.embedAssetPath, path);
        if (!(0, fs_1.existsSync)(path)) {
            return false;
        }
        return true;
    }
    async getUserCustomAsset(path, options) {
        if ((0, fs_1.existsSync)((0, path_1.join)(path_constant_1.USER_ASSET_DIR, path))) {
            return await promises_1.default.readFile((0, path_1.join)(path_constant_1.USER_ASSET_DIR, path), options);
        }
        return null;
    }
    async getAsset(path, options) {
        if (await this.getUserCustomAsset(path, options)) {
            return this.getUserCustomAsset(path, options);
        }
        if (!this.checkAssetPath(path)) {
            try {
                const { data } = await this.httpService.axiosRef.get(this.onlineAssetPath + path);
                await promises_1.default.mkdir((() => {
                    const p = (0, path_1.join)(this.embedAssetPath, path).split('/');
                    return p.slice(0, p.length - 1).join('/');
                })(), { recursive: true });
                await promises_1.default.writeFile((0, path_1.join)(this.embedAssetPath, path), data, options);
                return data;
            }
            catch (e) {
                this.logger.error('本地资源不存在，线上资源无法拉取');
                throw e;
            }
        }
        return promises_1.default.readFile((0, path_1.join)(this.embedAssetPath, path), options);
    }
    async writeUserCustomAsset(path, data, options) {
        await promises_1.default.mkdir((() => {
            const p = (0, path_1.join)(path_constant_1.USER_ASSET_DIR, path).split('/');
            return p.slice(0, p.length - 1).join('/');
        })(), { recursive: true });
        return promises_1.default.writeFile((0, path_1.join)(path_constant_1.USER_ASSET_DIR, path), data, options);
    }
    async removeUserCustomAsset(path) {
        return promises_1.default.unlink((0, path_1.join)(path_constant_1.USER_ASSET_DIR, path));
    }
};
AssetService = AssetService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [helper_http_service_1.HttpService])
], AssetService);
exports.AssetService = AssetService;
