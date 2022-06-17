"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCode = exports.ErrorCodeEnum = void 0;
var ErrorCodeEnum;
(function (ErrorCodeEnum) {
    ErrorCodeEnum["SlugNotAvailable"] = "slug_not_available";
    ErrorCodeEnum["BanInDemo"] = "ban_in_demo";
})(ErrorCodeEnum = exports.ErrorCodeEnum || (exports.ErrorCodeEnum = {}));
exports.ErrorCode = Object.freeze({
    [ErrorCodeEnum.SlugNotAvailable]: ['slug 不可用', 400],
    [ErrorCodeEnum.BanInDemo]: ['Demo 模式下此操作不可用', 400],
});
