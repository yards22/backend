"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalFileStorage = void 0;
var fs_1 = require("fs");
var LocalFileStorage = /** @class */ (function () {
    function LocalFileStorage() {
    }
    LocalFileStorage.prototype.Put = function (filePath, fileData) {
        return new Promise(function (resolve, reject) {
            (0, fs_1.writeFile)(filePath, fileData, function (err) {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    };
    LocalFileStorage.prototype.Get = function (filePath) {
        return new Promise(function (resolve, reject) {
            (0, fs_1.readFile)(filePath, function (err, data) {
                if (err)
                    return reject(err);
                resolve(data);
            });
        });
    };
    LocalFileStorage.prototype.Delete = function (filePath) {
        return new Promise(function (resolve, reject) {
            (0, fs_1.unlink)(filePath, function (err) {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    };
    LocalFileStorage.prototype.IfFileExists = function (filePath) {
        return new Promise(function (resolve, reject) {
            (0, fs_1.access)(filePath, function (err) {
                if (err)
                    return resolve(false);
                resolve(true);
            });
        });
    };
    return LocalFileStorage;
}());
exports.LocalFileStorage = LocalFileStorage;
