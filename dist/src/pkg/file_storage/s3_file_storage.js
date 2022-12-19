"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3FileStorage = void 0;
var aws_sdk_1 = require("aws-sdk");
var S3FileStorage = /** @class */ (function () {
    function S3FileStorage(bucket, accessKeyId, accessKeySecret, region) {
        this.defaultBucket = bucket;
        this.s3Client = new aws_sdk_1.S3({
            credentials: new aws_sdk_1.Credentials({
                accessKeyId: accessKeyId,
                secretAccessKey: accessKeySecret,
            }),
            region: region,
        });
    }
    S3FileStorage.prototype.Put = function (filePath, fileData, bucket) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.s3Client.putObject({
                Bucket: bucket || _this.defaultBucket,
                Key: filePath,
                Body: fileData,
            }, function (err, data) {
                if (err)
                    return reject(err);
                return resolve(data);
            });
        });
    };
    S3FileStorage.prototype.Get = function (filePath, bucket) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.s3Client.getObject({
                Bucket: bucket || _this.defaultBucket,
                Key: filePath,
            }, function (err, data) {
                if (err != null) {
                    return reject(err);
                }
                return resolve(data.Body);
            });
        });
    };
    S3FileStorage.prototype.Delete = function (filePath, bucket) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.s3Client.deleteObject({ Bucket: bucket || _this.defaultBucket, Key: filePath }, function (err, data) {
                if (err !== null) {
                    return reject(err);
                }
                return resolve();
            });
        });
    };
    S3FileStorage.prototype.IfFileExists = function (filePath, bucket) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.s3Client.headObject({ Bucket: bucket || _this.defaultBucket, Key: filePath }, function (err, data) {
                if (err !== null)
                    return resolve(false);
                return resolve(true);
            });
        });
    };
    return S3FileStorage;
}());
exports.S3FileStorage = S3FileStorage;
