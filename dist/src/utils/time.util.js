"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMonthLength = exports.getMonthStart = exports.getWeekStart = exports.getTodayEarly = exports.getMediumDateTime = exports.getShortDateTime = exports.getShortDate = exports.getShortTime = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const getShortTime = (date) => {
    return Intl.DateTimeFormat('en-US', {
        timeStyle: 'medium',
        hour12: false,
    }).format(date);
};
exports.getShortTime = getShortTime;
const getShortDate = (date) => {
    return Intl.DateTimeFormat('en-US', {
        dateStyle: 'short',
    })
        .format(date)
        .replace(/\//g, '-');
};
exports.getShortDate = getShortDate;
const getShortDateTime = (date) => {
    return Intl.DateTimeFormat('en-US', {
        dateStyle: 'short',
        timeStyle: 'medium',
        hour12: false,
    })
        .format(date)
        .replace(/\//g, '-');
};
exports.getShortDateTime = getShortDateTime;
const getMediumDateTime = (date) => {
    return (0, dayjs_1.default)(date).format('YYYY-MM-DD_HH:mm:ss');
};
exports.getMediumDateTime = getMediumDateTime;
const getTodayEarly = (today) => (0, dayjs_1.default)(today).set('hour', 0).set('minute', 0).set('millisecond', 0).toDate();
exports.getTodayEarly = getTodayEarly;
const getWeekStart = (today) => (0, dayjs_1.default)(today)
    .set('day', 0)
    .set('hour', 0)
    .set('millisecond', 0)
    .set('minute', 0)
    .toDate();
exports.getWeekStart = getWeekStart;
const getMonthStart = (today) => (0, dayjs_1.default)(today)
    .set('date', 1)
    .set('hour', 0)
    .set('minute', 0)
    .set('millisecond', 0)
    .toDate();
exports.getMonthStart = getMonthStart;
function getMonthLength(month, year) {
    return new Date(year, month, 0).getDate();
}
exports.getMonthLength = getMonthLength;
