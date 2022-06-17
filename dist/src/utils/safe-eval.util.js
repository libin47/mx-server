"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeEval = void 0;
const vm2_1 = __importDefault(require("vm2"));
function safeEval(code, context = {}, options) {
    const sandbox = {
        global: {},
    };
    code = `((() => { ${code} })())`;
    if (context) {
        Object.keys(context).forEach((key) => {
            sandbox[key] = context[key];
        });
    }
    const VM = new vm2_1.default.VM({
        timeout: 600000,
        sandbox,
        eval: false,
        ...options,
    });
    return VM.run(code);
}
exports.safeEval = safeEval;
