"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisitDocument = void 0;
const common_1 = require("@nestjs/common");
const meta_constant_1 = require("../../constants/meta.constant");
const VisitDocument = (type) => {
    return (_, __, descriptor) => {
        (0, common_1.SetMetadata)(meta_constant_1.HTTP_RES_UPDATE_DOC_COUNT_TYPE, type)(descriptor.value);
    };
};
exports.VisitDocument = VisitDocument;
