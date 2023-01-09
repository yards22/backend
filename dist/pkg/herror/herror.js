"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Herror = void 0;
var Herror = /** @class */ (function () {
    function Herror(message, status, extra) {
        this.status = status;
        this.message = message;
        this.extra = extra;
    }
    return Herror;
}());
exports.Herror = Herror;
