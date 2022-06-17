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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpCache = void 0;
const common_1 = require("@nestjs/common");
const META = __importStar(require("../../constants/meta.constant"));
function HttpCache(option) {
    const { disable, key, ttl = 60 } = option;
    return (_, __, descriptor) => {
        if (disable) {
            (0, common_1.SetMetadata)(META.HTTP_CACHE_DISABLE, true)(descriptor.value);
            return descriptor;
        }
        if (key) {
            (0, common_1.CacheKey)(key)(descriptor.value);
        }
        if (typeof ttl === 'number' && !isNaN(ttl)) {
            (0, common_1.CacheTTL)(ttl)(descriptor.value);
        }
        return descriptor;
    };
}
exports.HttpCache = HttpCache;
HttpCache.disable = (_, __, descriptor) => {
    (0, common_1.SetMetadata)(META.HTTP_CACHE_DISABLE, true)(descriptor.value);
};
