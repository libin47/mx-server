"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerJSONGlobal = void 0;
const registerJSONGlobal = () => {
    JSON.safeParse = (...rest) => {
        try {
            return JSON.parse(...rest);
        }
        catch (error) {
            return null;
        }
    };
};
exports.registerJSONGlobal = registerJSONGlobal;
