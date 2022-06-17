"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNestExecutionContextRequest = void 0;
function getNestExecutionContextRequest(context) {
    return context.switchToHttp().getRequest();
}
exports.getNestExecutionContextRequest = getNestExecutionContextRequest;
