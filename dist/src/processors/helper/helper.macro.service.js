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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var TextMacroService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextMacroService = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const common_1 = require("@nestjs/common");
const configs_service_1 = require("../../modules/configs/configs.service");
const utils_1 = require("../../utils");
const safe_eval_util_1 = require("../../utils/safe-eval.util");
const RegMap = {
    '#': /^#(.*?)$/g,
    $: /^\$(.*?)$/g,
    '?': /^\?\??(.*?)\??\?$/g,
};
let TextMacroService = TextMacroService_1 = class TextMacroService {
    constructor(configService) {
        this.configService = configService;
        this.generateFunctionContext = (variables) => {
            return {
                dayjs: (0, utils_1.deepCloneWithFunction)(dayjs_1.default),
                fromNow: (time) => (0, dayjs_1.default)(time).fromNow(),
                center: (text) => {
                    return `<p align="center">${text}</p>`;
                },
                right: (text) => {
                    return `<p align="right">${text}</p>`;
                },
                opacity: (text, opacity = 0.8) => {
                    return `<span style="opacity: ${opacity}">${text}</span>`;
                },
                blur: (text, blur = 1) => {
                    return `<span style="filter: blur(${blur}px)">${text}</span>`;
                },
                color: (text, color = '') => {
                    return `<span style="color: ${color}">${text}</span>`;
                },
                size: (text, size = '1em') => {
                    return `<span style="font-size: ${size}">${text}</span>`;
                },
                ...variables,
            };
        };
        this.logger = new common_1.Logger(TextMacroService_1.name);
    }
    ifConditionGrammar(text, model) {
        const conditionSplitter = text.split('|');
        conditionSplitter.forEach((item, index) => {
            conditionSplitter[index] = item.replace(/"/g, '');
            conditionSplitter[index] = conditionSplitter[index].replace(/\s/g, '');
            conditionSplitter[0] = conditionSplitter[0].replace(/\?/g, '');
            conditionSplitter[conditionSplitter.length - 1] = conditionSplitter[conditionSplitter.length - 1].replace(/\?/g, '');
        });
        let output;
        const condition = conditionSplitter[0].replace('$', '');
        const operator = condition.match(/>|==|<|\!=/g);
        if (!operator) {
            throw new common_1.BadRequestException('Invalid condition');
        }
        const left = condition.split(operator[0])[0];
        const right = condition.split(operator[0])[1];
        const Value = model[left];
        switch (operator[0]) {
            case '>':
                output = Value > right ? conditionSplitter[1] : conditionSplitter[2];
                break;
            case '==':
                output = Value == right ? conditionSplitter[1] : conditionSplitter[2];
                break;
            case '<':
                output = Value < right ? conditionSplitter[1] : conditionSplitter[2];
                break;
            case '!=':
                output = Value != right ? conditionSplitter[1] : conditionSplitter[2];
                break;
            case '&&':
                output = Value && right ? conditionSplitter[1] : conditionSplitter[2];
                break;
            case '||':
                output = Value || right ? conditionSplitter[1] : conditionSplitter[2];
                break;
            default:
                output = conditionSplitter[1];
                break;
        }
        return output;
    }
    async replaceTextMacro(text, model, extraContext = {}) {
        const { macros } = await this.configService.get('textOptions');
        if (!macros) {
            return text;
        }
        try {
            const matchedReg = /\[\[\s(.*?)\s\]\]/g;
            const matched = text.search(matchedReg) != -1;
            if (!matched) {
                return text;
            }
            const cacheMap = {};
            text = text.replace(matchedReg, (match, condition) => {
                var _a;
                condition = condition === null || condition === void 0 ? void 0 : condition.trim();
                if (condition.search(RegMap['?']) != -1) {
                    return this.ifConditionGrammar(condition, model);
                }
                if (condition.search(RegMap['$']) != -1) {
                    const variable = condition
                        .replace(RegMap['$'], '$1')
                        .replace(/\s/g, '');
                    return (_a = model[variable]) !== null && _a !== void 0 ? _a : extraContext[variable];
                }
                if (condition.search(RegMap['#']) != -1) {
                    const functions = condition.replace(RegMap['#'], '$1');
                    if (typeof cacheMap[functions] != 'undefined') {
                        return cacheMap[functions];
                    }
                    const variables = Object.keys(model).reduce((acc, key) => ({ [`$${key}`]: model[key], ...acc }), {});
                    try {
                        const result = (0, safe_eval_util_1.safeEval)(`return ${functions}`, this.generateFunctionContext({ ...variables, ...extraContext }), { timeout: 1000 });
                        cacheMap[functions] = result;
                        return result;
                    }
                    catch {
                        return match;
                    }
                }
            });
            return text;
        }
        catch (err) {
            this.logger.log(err.message);
            return text;
        }
    }
};
TextMacroService = TextMacroService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [configs_service_1.ConfigsService])
], TextMacroService);
exports.TextMacroService = TextMacroService;
