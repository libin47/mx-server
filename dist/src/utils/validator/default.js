"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Default = void 0;
const class_transformer_1 = require("class-transformer");
function Default(defaultValue) {
    return (0, class_transformer_1.Transform)((value) => value !== null && value !== undefined ? value : defaultValue, { toClassOnly: true });
}
exports.Default = Default;
//# sourceMappingURL=default.js.map