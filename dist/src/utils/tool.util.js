"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncPool = exports.hashString = exports.deepCloneWithFunction = exports.safePathJoin = exports.safeJSONParse = exports.deleteKeys = exports.hasChinese = exports.sleep = exports.getAvatar = exports.md5 = void 0;
const lodash_1 = require("lodash");
const path_1 = require("path");
const md5 = (text) => require('crypto').createHash('md5').update(text).digest('hex');
exports.md5 = md5;
function getAvatar(mail) {
    if (!mail) {
        return '';
    }
    return `https://sdn.geekzu.org/avatar/${(0, exports.md5)(mail)}?d=retro`;
}
exports.getAvatar = getAvatar;
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
exports.sleep = sleep;
function hasChinese(str) {
    return escape(str).indexOf('%u') < 0 ? false : true;
}
exports.hasChinese = hasChinese;
function deleteKeys(target, ...keys) {
    if (!(0, lodash_1.isObject)(target)) {
        throw new TypeError(`target must be Object, got ${target}`);
    }
    if (Array.isArray(keys[0])) {
        for (const key of keys[0]) {
            Reflect.deleteProperty(target, key);
        }
    }
    else {
        for (const key of keys) {
            Reflect.deleteProperty(target, key);
        }
    }
    return target;
}
exports.deleteKeys = deleteKeys;
const safeJSONParse = (p) => {
    try {
        return JSON.parse(p);
    }
    catch {
        return null;
    }
};
exports.safeJSONParse = safeJSONParse;
const safePathJoin = (...path) => {
    const newPathArr = path.map((p) => p
        .split('/')
        .map((o) => o.replace(/^(\.{2,}|~)$/, '.'))
        .join('/'));
    return (0, path_1.join)(...newPathArr);
};
exports.safePathJoin = safePathJoin;
const deepCloneWithFunction = (object) => {
    const clonedModule = (0, lodash_1.cloneDeep)(object);
    if (typeof object === 'function') {
        const newFunc = object.bind();
        Object.setPrototypeOf(newFunc, clonedModule);
        return newFunc;
    }
    return clonedModule;
};
exports.deepCloneWithFunction = deepCloneWithFunction;
const hashString = function (str, seed = 0) {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 =
        Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
            Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 =
        Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
            Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};
exports.hashString = hashString;
async function* asyncPool(concurrency, iterable, iteratorFn) {
    const executing = new Set();
    async function consume() {
        const [promise, value] = await Promise.race(executing);
        executing.delete(promise);
        return value;
    }
    for (const item of iterable) {
        const promise = (async () => await iteratorFn(item, iterable))().then((value) => [promise, value]);
        executing.add(promise);
        if (executing.size >= concurrency) {
            yield await consume();
        }
    }
    while (executing.size) {
        yield await consume();
    }
}
exports.asyncPool = asyncPool;
