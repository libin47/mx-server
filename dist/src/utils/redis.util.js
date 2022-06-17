"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRedisKey = void 0;
const app_config_1 = require("../app.config");
const prefix = app_config_1.isInDemoMode ? 'mx-demo' : 'mx';
const getRedisKey = (key, ...concatKeys) => {
    return `${prefix}:${key}${concatKeys && concatKeys.length ? `:${concatKeys.join('_')}` : ''}`;
};
exports.getRedisKey = getRedisKey;
