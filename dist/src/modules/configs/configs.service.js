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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var ConfigsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigsService = void 0;
const camelcase_keys_1 = __importDefault(require("camelcase-keys"));
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const cluster_1 = __importDefault(require("cluster"));
const lodash_1 = require("lodash");
const common_1 = require("@nestjs/common");
const business_event_constant_1 = require("../../constants/business-event.constant");
const cache_constant_1 = require("../../constants/cache.constant");
const event_bus_constant_1 = require("../../constants/event-bus.constant");
const cache_service_1 = require("../../processors/cache/cache.service");
const helper_event_service_1 = require("../../processors/helper/helper.event.service");
const model_transformer_1 = require("../../transformers/model.transformer");
const utils_1 = require("../../utils");
const redis_util_1 = require("../../utils/redis.util");
const optionDtos = __importStar(require("../configs/configs.dto"));
const user_service_1 = require("../user/user.service");
const configs_default_1 = require("./configs.default");
const configs_dto_1 = require("./configs.dto");
const configs_interface_1 = require("./configs.interface");
const configs_model_1 = require("./configs.model");
const allOptionKeys = new Set();
const map = Object.entries(optionDtos).reduce((obj, [key, value]) => {
    const optionKey = (key.charAt(0).toLowerCase() +
        key.slice(1).replace(/Dto$/, ''));
    allOptionKeys.add(optionKey);
    return {
        ...obj,
        [`${optionKey}`]: value,
    };
}, {});
let ConfigsService = ConfigsService_1 = class ConfigsService {
    constructor(optionModel, userService, redis, eventManager) {
        this.optionModel = optionModel;
        this.userService = userService;
        this.redis = redis;
        this.eventManager = eventManager;
        this.configInitd = false;
        this.validOptions = {
            whitelist: true,
            forbidNonWhitelisted: true,
        };
        this.validate = new common_1.ValidationPipe(this.validOptions);
        this.configInit().then(() => {
            this.logger.log('Config 已经加载完毕！');
        });
        this.logger = new common_1.Logger(ConfigsService_1.name);
    }
    async setConfig(config) {
        const redis = this.redis.getClient();
        await redis.set((0, redis_util_1.getRedisKey)(cache_constant_1.RedisKeys.ConfigCache), JSON.stringify(config));
    }
    async waitForConfigReady() {
        if (this.configInitd) {
            return await this.getConfig();
        }
        const maxCount = 10;
        let curCount = 0;
        do {
            if (this.configInitd) {
                return await this.getConfig();
            }
            await (0, utils_1.sleep)(100);
            curCount += 1;
        } while (curCount < maxCount);
        throw `重试 ${curCount} 次获取配置失败, 请检查数据库连接`;
    }
    get defaultConfig() {
        return (0, configs_default_1.generateDefaultConfig)();
    }
    async configInit() {
        const configs = await this.optionModel.find().lean();
        const mergedConfig = (0, configs_default_1.generateDefaultConfig)();
        configs.forEach((field) => {
            const name = field.name;
            if (!allOptionKeys.has(name)) {
                return;
            }
            const value = field.value;
            mergedConfig[name] = { ...mergedConfig[name], ...value };
        });
        await this.setConfig(mergedConfig);
        this.configInitd = true;
    }
    get(key) {
        return new Promise((resolve, reject) => {
            this.waitForConfigReady()
                .then((config) => {
                resolve(config[key]);
            })
                .catch(reject);
        });
    }
    async getConfig() {
        const redis = this.redis.getClient();
        const configCache = await redis.get((0, redis_util_1.getRedisKey)(cache_constant_1.RedisKeys.ConfigCache));
        if (configCache) {
            try {
                try {
                    return (0, class_transformer_1.plainToInstance)(configs_interface_1.IConfig, JSON.parse(configCache));
                }
                catch {
                    return JSON.parse(configCache);
                }
            }
            catch {
                await this.configInit();
                return await this.getConfig();
            }
        }
        else {
            await this.configInit();
            return await this.getConfig();
        }
    }
    async patch(key, data) {
        const config = await this.getConfig();
        const updatedConfigRow = await this.optionModel
            .findOneAndUpdate({ name: key }, {
            value: (0, lodash_1.mergeWith)((0, lodash_1.cloneDeep)(config[key]), data, (old, newer) => {
                if (Array.isArray(old)) {
                    return newer;
                }
                if (typeof old === 'object' && typeof newer === 'object') {
                    return { ...old, ...newer };
                }
            }),
        }, { upsert: true, new: true })
            .lean();
        const newData = updatedConfigRow.value;
        const mergedFullConfig = Object.assign({}, config, { [key]: newData });
        await this.setConfig(mergedFullConfig);
        this.eventManager.emit(event_bus_constant_1.EventBusEvents.ConfigChanged, { ...newData }, {
            scope: business_event_constant_1.EventScope.TO_SYSTEM,
        });
        return newData;
    }
    async patchAndValid(key, value) {
        value = (0, camelcase_keys_1.default)(value, { deep: true });
        switch (key) {
            case 'mailOptions': {
                const option = await this.patch('mailOptions', this.validWithDto(configs_dto_1.MailOptionsDto, value));
                if (option.enable) {
                    if (cluster_1.default.isPrimary) {
                        this.eventManager.emit(event_bus_constant_1.EventBusEvents.EmailInit, null, {
                            scope: business_event_constant_1.EventScope.TO_SYSTEM,
                        });
                    }
                    else {
                        this.redis.publish(event_bus_constant_1.EventBusEvents.EmailInit, '');
                    }
                }
                return option;
            }
            case 'algoliaSearchOptions': {
                const option = await this.patch('algoliaSearchOptions', this.validWithDto(configs_dto_1.AlgoliaSearchOptionsDto, value));
                if (option.enable) {
                    this.eventManager.emit(event_bus_constant_1.EventBusEvents.PushSearch, null, {
                        scope: business_event_constant_1.EventScope.TO_SYSTEM,
                    });
                }
                return option;
            }
            default: {
                const dto = map[key];
                if (!dto) {
                    throw new common_1.BadRequestException('设置不存在');
                }
                return this.patch(key, this.validWithDto(dto, value));
            }
        }
    }
    validWithDto(dto, value) {
        const validModel = (0, class_transformer_1.plainToInstance)(dto, value);
        const errors = (0, class_validator_1.validateSync)(validModel, this.validOptions);
        if (errors.length > 0) {
            const error = this.validate.createExceptionFactory()(errors);
            throw error;
        }
        return validModel;
    }
    get getMaster() {
        return this.userService.getMaster.bind(this.userService);
    }
};
ConfigsService = ConfigsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, model_transformer_1.InjectModel)(configs_model_1.OptionModel)),
    __metadata("design:paramtypes", [Object, user_service_1.UserService,
        cache_service_1.CacheService,
        helper_event_service_1.EventManagerService])
], ConfigsService);
exports.ConfigsService = ConfigsService;
