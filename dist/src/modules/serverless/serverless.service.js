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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerlessService = void 0;
const class_validator_1 = require("class-validator");
const promises_1 = __importStar(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const process_1 = require("process");
const core_1 = require("@babel/core");
const t = __importStar(require("@babel/types"));
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const cache_constant_1 = require("../../constants/cache.constant");
const path_constant_1 = require("../../constants/path.constant");
const env_global_1 = require("../../global/env.global");
const cache_service_1 = require("../../processors/cache/cache.service");
const database_service_1 = require("../../processors/database/database.service");
const helper_asset_service_1 = require("../../processors/helper/helper.asset.service");
const helper_http_service_1 = require("../../processors/helper/helper.http.service");
const model_transformer_1 = require("../../transformers/model.transformer");
const utils_1 = require("../../utils");
const safe_eval_util_1 = require("../../utils/safe-eval.util");
const system_util_1 = require("../../utils/system.util");
const package_json_1 = __importDefault(require("../../../package.json"));
const snippet_model_1 = require("../snippet/snippet.model");
const serverless_model_1 = require("./serverless.model");
let ServerlessService = class ServerlessService {
    constructor(snippetModel, assetService, httpService, databaseService, cacheService) {
        this.snippetModel = snippetModel;
        this.assetService = assetService;
        this.httpService = httpService;
        this.databaseService = databaseService;
        this.cacheService = cacheService;
        this.requireModuleIdSet = new Set();
        (0, process_1.nextTick)(() => {
            (0, promises_1.mkdir)(path_constant_1.NODE_REQUIRE_PATH, { recursive: true }).then(async () => {
                const pkgPath = path_1.default.join(path_constant_1.NODE_REQUIRE_PATH, 'package.json');
                const isPackageFileExist = await (0, promises_1.stat)(pkgPath)
                    .then(() => true)
                    .catch(() => false);
                if (!isPackageFileExist) {
                    await promises_1.default.writeFile(pkgPath, JSON.stringify({ name: 'modules' }, null, 2));
                }
            });
        });
    }
    get model() {
        return this.snippetModel;
    }
    mockStorageCache() {
        return {
            get: async (key) => {
                const client = this.cacheService.getClient();
                return await client.hget((0, utils_1.getRedisKey)(cache_constant_1.RedisKeys.ServerlessStorage), key);
            },
            set: async (key, value) => {
                const client = this.cacheService.getClient();
                return await client.hset((0, utils_1.getRedisKey)(cache_constant_1.RedisKeys.ServerlessStorage), key, typeof value === 'string' ? value : JSON.stringify(value));
            },
            del: async (key) => {
                const client = this.cacheService.getClient();
                return await client.hdel((0, utils_1.getRedisKey)(cache_constant_1.RedisKeys.ServerlessStorage), key);
            },
        };
    }
    async mockGetMaster() {
        const collection = this.databaseService.db.collection('users');
        const cur = collection.aggregate([
            {
                $project: {
                    id: 1,
                    _id: 1,
                    username: 1,
                    name: 1,
                    introduce: 1,
                    avatar: 1,
                    mail: 1,
                    url: 1,
                    lastLoginTime: 1,
                    lastLoginIp: 1,
                    socialIds: 1,
                },
            },
        ]);
        return await cur.next().then((doc) => {
            cur.close();
            return doc;
        });
    }
    mockDb(namespace) {
        const db = this.databaseService.db;
        const collection = db.collection(serverless_model_1.ServerlessStorageCollectionName);
        const checkRecordIsExist = async (key) => {
            const has = await collection
                .countDocuments({
                namespace,
                key,
            })
                .then((count) => count > 0);
            return has;
        };
        const updateKey = async (key, value) => {
            if (!(await checkRecordIsExist(key))) {
                throw new common_1.InternalServerErrorException('key not exist');
            }
            return collection.updateOne({
                namespace,
                key,
            }, {
                $set: {
                    value,
                },
            });
        };
        return {
            async get(key) {
                return collection
                    .findOne({
                    namespace,
                    key,
                })
                    .then((doc) => {
                    var _a;
                    return (_a = doc === null || doc === void 0 ? void 0 : doc.value) !== null && _a !== void 0 ? _a : null;
                });
            },
            async find(condition) {
                if (typeof condition !== 'object') {
                    throw new common_1.InternalServerErrorException('condition must be object');
                }
                condition.namespace = namespace;
                return collection
                    .aggregate([
                    { $match: condition },
                    {
                        $project: {
                            value: 1,
                            key: 1,
                            _id: 1,
                        },
                    },
                ])
                    .toArray();
            },
            async set(key, value) {
                if (typeof key !== 'string') {
                    throw new common_1.InternalServerErrorException('key must be string');
                }
                if (await checkRecordIsExist(key)) {
                    return updateKey(key, value);
                }
                return collection.insertOne({
                    namespace,
                    key,
                    value,
                });
            },
            async insert(key, value) {
                const has = await collection
                    .countDocuments({
                    namespace,
                    key,
                })
                    .then((count) => count > 0);
                if (has) {
                    throw new common_1.InternalServerErrorException('key already exists');
                }
                return collection.insertOne({
                    namespace,
                    key,
                    value,
                });
            },
            update: updateKey,
            del(key) {
                return collection.deleteOne({
                    namespace,
                    key,
                });
            },
        };
    }
    async injectContextIntoServerlessFunctionAndCall(model, context) {
        const { raw: functionString } = model;
        const logger = new common_1.Logger(`ServerlessFunction/${model.name}`);
        const document = await this.model.findById(model.id);
        const globalContext = {
            context: {
                ...context,
                ...context.res,
                query: context.req.query,
                headers: context.req.headers,
                params: Object.assign({}, context.req.params),
                storage: {
                    cache: this.mockStorageCache(),
                    db: this.mockDb(`${model.reference || '#########debug######'}@${model.name}`),
                    dangerousAccessDbInstance: () => {
                        return this.databaseService.db;
                    },
                },
                model,
                document,
                name: model.name,
                reference: model.reference,
                getMaster: this.mockGetMaster.bind(this),
                writeAsset: async (path, data, options) => {
                    return await this.assetService.writeUserCustomAsset((0, utils_1.safePathJoin)(path), data, options);
                },
                readAsset: async (path, options) => {
                    return await this.assetService.getAsset((0, utils_1.safePathJoin)(path), options);
                },
            },
            __dirname: path_constant_1.DATA_DIR,
            __filename: '',
            fetch,
            Buffer,
            console: logger,
            logger,
            require: this.inNewContextRequire(),
            get import() {
                return this.require;
            },
            process: {
                env: Object.freeze({ ...process.env }),
                nextTick: process.nextTick,
            },
        };
        return await (0, safe_eval_util_1.safeEval)(`async function func() {
        ${await this.convertTypescriptCode(functionString)}; return handler(context, require)
      }
      return func()
      `, {
            ...globalContext,
            global: globalContext,
            globalThis: globalContext,
            exports: {},
            module: {
                exports: {},
            },
        });
    }
    getBabelOptions() {
        return {
            plugins: [
                require('@babel/plugin-transform-typescript'),
                [
                    require('@babel/plugin-transform-modules-commonjs'),
                    { allowTopLevelThis: false, importInterop: 'node' },
                ],
                function transformImport() {
                    return {
                        visitor: {
                            VariableDeclaration(path) {
                                var _a, _b;
                                const node = path.node;
                                if (node.kind === 'var' &&
                                    ((_a = node.declarations[0].init) === null || _a === void 0 ? void 0 : _a.type) === 'CallExpression' &&
                                    ((_b = node.declarations[0].init
                                        .callee) === null || _b === void 0 ? void 0 : _b.name) === 'require') {
                                    const callee = node.declarations[0].init;
                                    const _await = {
                                        argument: node.declarations[0].init,
                                        type: 'AwaitExpression',
                                        start: callee.start,
                                        end: callee.end,
                                        innerComments: [],
                                        loc: callee.loc,
                                        leadingComments: [],
                                        trailingComments: [],
                                    };
                                    node.declarations[0].init = _await;
                                }
                            },
                        },
                    };
                },
            ],
        };
    }
    async convertTypescriptCode(code) {
        const res = await (0, core_1.transformAsync)(code, this.getBabelOptions());
        if (!res) {
            throw new common_1.InternalServerErrorException('convert code error');
        }
        !env_global_1.isTest && console.debug(res.code);
        return res.code;
    }
    cleanRequireCache() {
        Array.from(this.requireModuleIdSet.values()).forEach((id) => {
            delete require.cache[id];
        });
        this.requireModuleIdSet.clear();
    }
    resolvePath(id) {
        try {
            return require.resolve(id);
        }
        catch {
            try {
                const modulePath = path_1.default.resolve(path_constant_1.NODE_REQUIRE_PATH, id);
                const resolvePath = require.resolve(modulePath);
                return resolvePath;
            }
            catch {
                throw new common_1.InternalServerErrorException(`module "${id}" not found.`);
            }
        }
    }
    inNewContextRequire() {
        const __require = (id) => {
            const isBuiltin = (0, system_util_1.isBuiltinModule)(id);
            const resolvePath = this.resolvePath(id);
            const module = require(resolvePath);
            if (Object.keys(package_json_1.default.dependencies).includes(id) || isBuiltin) {
            }
            else {
                this.requireModuleIdSet.add(resolvePath);
            }
            const clonedModule = (0, utils_1.deepCloneWithFunction)(module);
            return clonedModule;
        };
        const __requireNoCache = (id) => {
            delete require.cache[this.resolvePath(id)];
            const clonedModule = __require(id);
            return clonedModule;
        };
        async function $require(id, useCache = true) {
            if (!id || typeof id !== 'string') {
                throw new Error('require id is not valid');
            }
            if ((0, class_validator_1.isURL)(id, { protocols: ['http', 'https'], require_protocol: true })) {
                let text;
                try {
                    text = useCache
                        ? await this.httpService.getAndCacheRequest(id)
                        : await this.httpService.axiosRef.get(id).then((res) => res.data);
                }
                catch (err) {
                    throw new common_1.InternalServerErrorException('Failed to fetch remote module');
                }
                return await (0, safe_eval_util_1.safeEval)(`${text}; return module.exports ? module.exports : exports.default ? exports.default : exports`, {
                    exports: {},
                    module: {
                        exports: null,
                    },
                });
            }
            const allowedThirdPartLibs = [
                '@babel/core',
                '@babel/types',
                '@babel/plugin-transform-typescript',
                'class-validator-jsonschema',
                '@nestjs/event-emitter',
                'algoliasearch',
                'axios-retry',
                'axios',
                'class-transformer',
                'class-validator',
                'dayjs',
                'ejs',
                'image-size',
                'isbot',
                'js-yaml',
                'jszip',
                'lodash',
                'marked',
                'nanoid',
                'qs',
                'rxjs',
                'snakecase-keys',
                'ua-parser-js',
                'xss',
            ];
            const trustPackagePrefixes = ['@innei/', '@mx-space/', 'mx-function-'];
            if (allowedThirdPartLibs.includes(id) ||
                trustPackagePrefixes.some((prefix) => id.startsWith(prefix))) {
                return useCache ? __require(id) : __requireNoCache(id);
            }
            const module = (0, system_util_1.isBuiltinModule)(id, [
                'fs',
                'os',
                'child_process',
                'sys',
                'process',
                'vm',
                'v8',
                'cluster',
                'fs/promises',
            ]);
            if (!module) {
                throw new Error(`cannot require ${id}`);
            }
            else {
                return __require(id);
            }
        }
        return $require.bind(this);
    }
    async isValidServerlessFunction(raw) {
        var _a;
        try {
            const ast = (await (0, core_1.parseAsync)(raw, this.getBabelOptions()));
            const { body } = ast.program;
            const hasEntryFunction = body.some((node) => t.isFunction(node) && node.id && node.id.name === 'handler');
            return hasEntryFunction;
        }
        catch (e) {
            if (isDev) {
                console.error(e.message);
            }
            return (_a = e.message) === null || _a === void 0 ? void 0 : _a.split('\n').at(0);
        }
    }
};
__decorate([
    (0, schedule_1.Interval)(5 * 60 * 1000),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ServerlessService.prototype, "cleanRequireCache", null);
ServerlessService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, model_transformer_1.InjectModel)(snippet_model_1.SnippetModel)),
    __metadata("design:paramtypes", [Object, helper_asset_service_1.AssetService,
        helper_http_service_1.HttpService,
        database_service_1.DatabaseService,
        cache_service_1.CacheService])
], ServerlessService);
exports.ServerlessService = ServerlessService;
