"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var InMKV = /** @class */ (function () {
    function InMKV() {
        this.store = new Map();
    }
    InMKV.prototype.Set = function (key, value, expiryTime) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.store.set(key, value);
            return resolve();
        });
    };
    InMKV.prototype.Get = function (key) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var v = _this.store.get(key);
            if (v) {
                return resolve(v);
            }
            return resolve(null);
        });
    };
    InMKV.prototype.Delete = function (key) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.store.delete(key);
            return resolve();
        });
    };
    InMKV.prototype.Truncate = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.store = new Map();
            return resolve();
        });
    };
    InMKV.prototype.Close = function () {
        return new Promise(function (resolve, reject) {
            return resolve();
        });
    };
    return InMKV;
}());
exports.default = InMKV;
