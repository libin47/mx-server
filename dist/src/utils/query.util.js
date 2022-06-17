"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addYearCondition = exports.addConditionCanSee = exports.addConditionToSeeHideContent = void 0;
function addConditionToSeeHideContent(canSee) {
    return canSee
        ? {
            $or: [{ hide: false }, { hide: true }],
        }
        : { hide: false };
}
exports.addConditionToSeeHideContent = addConditionToSeeHideContent;
function addConditionCanSee(canSee) {
    return canSee
        ? {
            $or: [{ hide: false }, { hide: true }],
        }
        : { hide: false };
}
exports.addConditionCanSee = addConditionCanSee;
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
