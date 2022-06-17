"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMockedContextResponse = void 0;
const common_1 = require("@nestjs/common");
const createMockedContextResponse = (reply) => {
    const response = {
        throws(code, message) {
            throw new common_1.HttpException(common_1.HttpException.createBody({ message }, message, code), code);
        },
        type(type) {
            reply.type(type);
            return response;
        },
        send(data) {
            reply.send(data);
        },
        status(code, message) {
            reply.raw.statusCode = code;
            if (message) {
                reply.raw.statusMessage = message;
            }
            return response;
        },
    };
    return response;
};
exports.createMockedContextResponse = createMockedContextResponse;
