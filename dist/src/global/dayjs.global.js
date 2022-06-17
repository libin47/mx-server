"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(require("dayjs"));
require("dayjs/locale/zh-cn");
const localizedFormat_1 = __importDefault(require("dayjs/plugin/localizedFormat"));
const relativeTime_1 = __importDefault(require("dayjs/plugin/relativeTime"));
dayjs_1.default.locale('zh-cn');
dayjs_1.default.extend(localizedFormat_1.default);
dayjs_1.default.extend(relativeTime_1.default);
