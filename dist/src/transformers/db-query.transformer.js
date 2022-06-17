"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addYearCondition = exports.addHidePasswordAndHideCondition = void 0;
function addHidePasswordAndHideCondition(canSee) {
    return canSee
        ? {
            $or: [{ hide: false }, { hide: true }],
        }
        : { hide: false, password: undefined };
}
exports.addHidePasswordAndHideCondition = addHidePasswordAndHideCondition;
const addYearCondition = (year) => {
    if (!year) {
        return {};
    }
    return {
        created: {
            $gte: new Date(year, 1, 1),
            $lte: new Date(year + 1, 1, 1),
        },
    };
};
exports.addYearCondition = addYearCondition;
