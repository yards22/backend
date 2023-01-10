"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowNotification = exports.CommentNotification = exports.LikeNotification = exports.BaseNotification = void 0;
var BaseNotification = /** @class */ (function () {
    function BaseNotification(type) {
        this.type = type;
    }
    return BaseNotification;
}());
exports.BaseNotification = BaseNotification;
var LikeNotification = /** @class */ (function (_super) {
    __extends(LikeNotification, _super);
    function LikeNotification(post_id, by) {
        var _this = _super.call(this, "LIKE") || this;
        _this.by = by;
        _this.post_id = post_id;
        return _this;
    }
    LikeNotification.prototype.ToJson = function () {
        return JSON.stringify({
            post_id: this.post_id,
            type: this.type,
            by: this.by,
        });
    };
    return LikeNotification;
}(BaseNotification));
exports.LikeNotification = LikeNotification;
var CommentNotification = /** @class */ (function (_super) {
    __extends(CommentNotification, _super);
    function CommentNotification(post_id, by) {
        var _this = _super.call(this, "COMMENT") || this;
        _this.by = by;
        _this.post_id = post_id;
        return _this;
    }
    CommentNotification.prototype.ToJson = function () {
        return JSON.stringify({
            post_id: this.post_id,
            type: this.type,
            by: this.by,
        });
    };
    return CommentNotification;
}(BaseNotification));
exports.CommentNotification = CommentNotification;
var FollowNotification = /** @class */ (function (_super) {
    __extends(FollowNotification, _super);
    function FollowNotification(by) {
        var _this = _super.call(this, "FOLLOW") || this;
        _this.by = by;
        return _this;
    }
    FollowNotification.prototype.ToJson = function () {
        return JSON.stringify({ type: this.type, by: this.by });
    };
    return FollowNotification;
}(BaseNotification));
exports.FollowNotification = FollowNotification;
