"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Redis = /** @class */ (function () {
    function Redis(store) {
        this.store = store;
    }
    Redis.prototype.Set = function (key, value, expiryTime) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.store
                .set(key, value, {
                EX: expiryTime,
            })
                .then(function () {
                return resolve();
            })
                .catch(function (err) {
                console.log(err);
                return reject(err);
            });
        });
    };
    Redis.prototype.Get = function (key) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.store
                .get(key)
                .then(function (v) {
                return resolve(v);
            })
                .catch(function (err) {
                return reject(err);
            });
        });
    };
    Redis.prototype.Delete = function (key) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.store
                .del(key)
                .then(function () {
                return resolve();
            })
                .catch(function (err) {
                return reject(err);
            });
        });
    };
    Redis.prototype.Truncate = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.store
                .flushDb()
                .then(function () {
                return resolve();
            })
                .catch(function (err) {
                return reject(err);
            });
        });
    };
    Redis.prototype.Close = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.store.disconnect();
            return resolve();
        });
    };
    return Redis;
}());
exports.default = Redis;
