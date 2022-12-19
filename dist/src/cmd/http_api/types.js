"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
var json_1 = require("../../util/json");
var App = /** @class */ (function () {
    function App(srv, authManager, notificationManager, profileManager, postManager, likeManager, commentManager, networkManager, miscManager, kvStore, db, imageResolver, localFileStore, remoteFileStorage) {
        this.srv = srv;
        this.notificationManager = notificationManager;
        this.authManager = authManager;
        this.profileManager = profileManager;
        this.postManager = postManager;
        this.likeManager = likeManager;
        this.commentManager = commentManager;
        this.networkManager = networkManager;
        this.miscManager = miscManager;
        this.db = db;
        this.kvStore = kvStore;
        this.imageResolver = imageResolver;
        this.localFileStorage = localFileStore;
        this.remoteFileStorage = remoteFileStorage;
    }
    App.prototype.InHandler = function (handler) {
        var _this = this;
        return function (req, res, next) {
            return handler(req, res, next, _this);
        };
    };
    App.prototype.SendRes = function (res, resData) {
        res.setHeader("Content-Type", "application/json");
        res.status(resData.status).send((0, json_1.ToJson)({
            data: resData.data,
            message: resData.message,
            is_error: false,
        }));
    };
    App.prototype.ShutDown = function () { };
    return App;
}());
exports.App = App;
