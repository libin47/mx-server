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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnippetService = void 0;
const js_yaml_1 = require("js-yaml");
const common_1 = require("@nestjs/common");
const cache_constant_1 = require("../../constants/cache.constant");
const cache_service_1 = require("../../processors/cache/cache.service");
const model_transformer_1 = require("../../transformers/model.transformer");
const utils_1 = require("../../utils");
const serverless_service_1 = require("../serverless/serverless.service");
const snippet_model_1 = require("./snippet.model");
let SnippetService = class SnippetService {
    constructor(snippetModel, serverlessService, cacheService) {
        this.snippetModel = snippetModel;
        this.serverlessService = serverlessService;
        this.cacheService = cacheService;
    }
    get model() {
        return this.snippetModel;
    }
    async create(model) {
        const isExist = await this.model.countDocuments({
            name: model.name,
            reference: model.reference || 'root',
        });
        if (isExist) {
            throw new common_1.BadRequestException('snippet is exist');
        }
        await this.validateType(model);
        return await this.model.create({ ...model, created: new Date() });
    }
    async update(id, model) {
        await this.validateType(model);
        delete model.created;
        const old = await this.model.findById(id).lean();
        if (!old) {
            throw new common_1.NotFoundException();
        }
        await this.deleteCachedSnippet(old.reference, old.name);
        return await this.model.findByIdAndUpdate(id, { ...model, modified: new Date() }, { new: true });
    }
    async delete(id) {
        const doc = await this.model.findOneAndDelete({ _id: id }).lean();
        if (!doc) {
            throw new common_1.NotFoundException();
        }
        await this.deleteCachedSnippet(doc.reference, doc.name);
    }
    async validateType(model) {
        switch (model.type) {
            case snippet_model_1.SnippetType.JSON: {
                try {
                    JSON.parse(model.raw);
                }
                catch {
                    throw new common_1.BadRequestException('content is not valid json');
                }
                break;
            }
            case snippet_model_1.SnippetType.YAML: {
                try {
                    (0, js_yaml_1.load)(model.raw);
                }
                catch {
                    throw new common_1.BadRequestException('content is not valid yaml');
                }
                break;
            }
            case snippet_model_1.SnippetType.Function: {
                const isValid = await this.serverlessService.isValidServerlessFunction(model.raw);
                if (typeof isValid === 'string') {
                    throw new common_1.BadRequestException(isValid);
                }
                if (!isValid) {
                    throw new common_1.BadRequestException('serverless function is not valid');
                }
                break;
            }
            case snippet_model_1.SnippetType.Text:
            default: {
                break;
            }
        }
    }
    async getSnippetById(id) {
        const doc = await this.model.findById(id).lean();
        if (!doc) {
            throw new common_1.NotFoundException();
        }
        return doc;
    }
    async getSnippetByName(name, reference) {
        const doc = await this.model
            .findOne({ name, reference, type: { $ne: snippet_model_1.SnippetType.Function } })
            .lean();
        if (!doc) {
            throw new common_1.NotFoundException('snippet is not found');
        }
        return doc;
    }
    async attachSnippet(model) {
        if (!model) {
            throw new common_1.NotFoundException();
        }
        switch (model.type) {
            case snippet_model_1.SnippetType.JSON: {
                Reflect.set(model, 'data', JSON.parse(model.raw));
                break;
            }
            case snippet_model_1.SnippetType.YAML: {
                Reflect.set(model, 'data', (0, js_yaml_1.load)(model.raw));
                break;
            }
            case snippet_model_1.SnippetType.Text: {
                Reflect.set(model, 'data', model.raw);
                break;
            }
        }
        return model;
    }
    async cacheSnippet(model, value) {
        const { reference, name } = model;
        const key = `${reference}:${name}:${model.private ? 'private' : ''}`;
        const client = this.cacheService.getClient();
        await client.hset((0, utils_1.getRedisKey)(cache_constant_1.RedisKeys.SnippetCache), key, typeof value !== 'string' ? JSON.stringify(value) : value);
    }
    async getCachedSnippet(reference, name, accessType) {
        const key = `${reference}:${name}:${accessType === 'private' ? 'private' : ''}`;
        const client = this.cacheService.getClient();
        const value = await client.hget((0, utils_1.getRedisKey)(cache_constant_1.RedisKeys.SnippetCache), key);
        return value;
    }
    async deleteCachedSnippet(reference, name) {
        const keyBase = `${reference}:${name}`;
        const key1 = `${keyBase}:`;
        const key2 = `${keyBase}:private`;
        const client = this.cacheService.getClient();
        await Promise.all([key1, key2].map((key) => {
            return client.hdel((0, utils_1.getRedisKey)(cache_constant_1.RedisKeys.SnippetCache), key);
        }));
    }
};
SnippetService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, model_transformer_1.InjectModel)(snippet_model_1.SnippetModel)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => serverless_service_1.ServerlessService))),
    __metadata("design:paramtypes", [Object, serverless_service_1.ServerlessService,
        cache_service_1.CacheService])
], SnippetService);
exports.SnippetService = SnippetService;
