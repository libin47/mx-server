"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseRelativeUrl = exports.getIp = void 0;
const url_1 = require("url");
const getIp = (request) => {
    var _a, _b, _c, _d;
    const req = request;
    let ip = request.headers['x-forwarded-for'] ||
        request.headers['X-Forwarded-For'] ||
        request.headers['X-Real-IP'] ||
        request.headers['x-real-ip'] ||
        (req === null || req === void 0 ? void 0 : req.ip) ||
        ((_b = (_a = req === null || req === void 0 ? void 0 : req.raw) === null || _a === void 0 ? void 0 : _a.connection) === null || _b === void 0 ? void 0 : _b.remoteAddress) ||
        ((_d = (_c = req === null || req === void 0 ? void 0 : req.raw) === null || _c === void 0 ? void 0 : _c.socket) === null || _d === void 0 ? void 0 : _d.remoteAddress) ||
        undefined;
    if (ip && ip.split(',').length > 0) {
        ip = ip.split(',')[0];
    }
    return ip;
};
exports.getIp = getIp;
const parseRelativeUrl = (path) => {
    if (!path || !path.startsWith('/')) {
        return new url_1.URL('http://a.com');
    }
    return new url_1.URL(`http://a.com${path}`);
};
exports.parseRelativeUrl = parseRelativeUrl;
