"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformDataToPaginate = void 0;
function transformDataToPaginate(data) {
    return {
        data: data.docs,
        pagination: {
            total: data.totalDocs,
            currentPage: data.page,
            totalPage: data.totalPages,
            size: data.limit,
            hasNextPage: data.hasNextPage,
            hasPrevPage: data.hasPrevPage,
        },
    };
}
exports.transformDataToPaginate = transformDataToPaginate;
