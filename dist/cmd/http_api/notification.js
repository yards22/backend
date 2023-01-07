"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandleUpdateNotificationStatus = exports.HandleGetNotification = void 0;
var herror_1 = require("../../pkg/herror/herror");
var status_codes_1 = require("../../pkg/herror/status_codes");
var HandleGetNotification = function (req, res, next, app) {
    var _a, _b, _c;
    var forId = Number(req.context.user_id);
    var id = req.query.id ? BigInt(Number((_a = req.query.id) !== null && _a !== void 0 ? _a : -1)) : -1;
    // looking for many notifications
    if (id == -1) {
        var limit = Number((_b = req.query.limit) !== null && _b !== void 0 ? _b : 10);
        var offset = Number((_c = req.query.offset) !== null && _c !== void 0 ? _c : 0);
        var status_1 = req.query.status;
        if (!(status_1 == "Unseen" || status_1 == "Read" || status_1 == "Seen")) {
            status_1 = "All";
        }
        app.notificationManager
            .GetManyByForID(forId, status_1, limit, offset)
            .then(function (notifications) {
            app.SendRes(res, { status: 200, data: notifications });
        })
            .catch(function (err) {
            next(err);
        });
        return;
    }
    // looking for a particular notification with notification id
    app.notificationManager
        .GetByIDAndForID(forId, id)
        .then(function (notification) {
        app.SendRes(res, { status: 200, data: notification });
    })
        .catch(function (err) {
        next(err);
    });
};
exports.HandleGetNotification = HandleGetNotification;
var HandleUpdateNotificationStatus = function (req, res, next, app) {
    var forId = Number(req.context.userId);
    var _ids = req.body.ids;
    var ids = _ids.map(function (item) {
        return BigInt(item);
    });
    if (ids.length == 0) {
        next(new herror_1.Herror("empty_ids", status_codes_1.HerrorStatus.StatusBadRequest));
        return;
    }
    var status = req.query.status;
    if (!(status == "Unseen" || status == "Read" || status == "Seen")) {
        next(new herror_1.Herror("invalid_status", status_codes_1.HerrorStatus.StatusBadRequest));
        return;
    }
    app.notificationManager
        .UpdateStatus(forId, ids, status)
        .then(function (notification) {
        app.SendRes(res, { status: 200, data: notification });
    })
        .catch(function (err) {
        next(err);
    });
};
exports.HandleUpdateNotificationStatus = HandleUpdateNotificationStatus;
