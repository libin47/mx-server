"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiName = void 0;
const swagger_1 = require("@nestjs/swagger");
const ApiName = (target) => {
    if (!isDev) {
        return;
    }
    const [name] = target.name.split('Controller');
    (0, swagger_1.ApiTags)(`${name} Routes`).call(null, target);
};
exports.ApiName = ApiName;
