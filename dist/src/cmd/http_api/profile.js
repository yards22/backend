"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandleGetLeaderBoard = exports.HandleGetCheckUsername = exports.HandleGetUserProfileInfo = exports.HandleGetUserPrimaryInfo = exports.HandleUpdateProfile = void 0;
var herror_1 = require("../../pkg/herror/herror");
var status_codes_1 = require("../../pkg/herror/status_codes");
var HandleUpdateProfile = function (req, res, next, app) { return __awaiter(void 0, void 0, void 0, function () {
    var user_id, token, bio, profile_buffer, updated_at, username, interests, _a, responseStatus, profileData;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                user_id = Number(req.context.user_id);
                token = req.context.token;
                bio = req.body.bio;
                profile_buffer = (_b = req.file) === null || _b === void 0 ? void 0 : _b.buffer;
                updated_at = new Date();
                username = req.body.username;
                interests = req.body.interests;
                console.log(user_id, token, bio, updated_at, username, profile_buffer);
                if (!(username != undefined && user_id != undefined)) return [3 /*break*/, 2];
                return [4 /*yield*/, app.profileManager.UpdateProfileDetails(user_id, username, updated_at, token, profile_buffer, bio, interests)];
            case 1:
                _a = _c.sent(), responseStatus = _a.responseStatus, profileData = _a.profileData;
                app.SendRes(res, {
                    status: responseStatus.statusCode,
                    data: profileData,
                    message: responseStatus.message,
                });
                return [3 /*break*/, 3];
            case 2:
                next(new herror_1.Herror("BadRequest", status_codes_1.HerrorStatus.StatusBadRequest));
                _c.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.HandleUpdateProfile = HandleUpdateProfile;
var HandleGetUserPrimaryInfo = function (req, res, next, app) { return __awaiter(void 0, void 0, void 0, function () {
    var user_id, userProfile;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user_id = Number(req.context.user_id);
                console.log(user_id);
                if (!(user_id != undefined)) return [3 /*break*/, 2];
                return [4 /*yield*/, app.profileManager.GetUserPrimaryInfoById(user_id)];
            case 1:
                userProfile = _a.sent();
                app.SendRes(res, {
                    status: status_codes_1.HerrorStatus.StatusOK,
                    data: userProfile,
                });
                return [3 /*break*/, 3];
            case 2:
                next(new herror_1.Herror("BadRequest", status_codes_1.HerrorStatus.StatusBadRequest));
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.HandleGetUserPrimaryInfo = HandleGetUserPrimaryInfo;
var HandleGetUserProfileInfo = function (req, res, next, app) { return __awaiter(void 0, void 0, void 0, function () {
    var user_id, limit, offset, userProfile;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user_id = Number(req.context.user_id);
                console.log(user_id);
                limit = Number(req.query.limit || 10);
                offset = Number(req.query.offset || 0);
                if (!(user_id != undefined)) return [3 /*break*/, 2];
                return [4 /*yield*/, app.profileManager.GetUserProfileById(user_id, offset, limit)];
            case 1:
                userProfile = _a.sent();
                app.SendRes(res, {
                    status: status_codes_1.HerrorStatus.StatusOK,
                    data: userProfile,
                });
                return [3 /*break*/, 3];
            case 2:
                next(new herror_1.Herror("BadRequest", status_codes_1.HerrorStatus.StatusBadRequest));
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.HandleGetUserProfileInfo = HandleGetUserProfileInfo;
var HandleGetCheckUsername = function (req, res, next, app) { return __awaiter(void 0, void 0, void 0, function () {
    var username, responseStatus, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                username = req.body.username;
                if (!(username != undefined)) return [3 /*break*/, 5];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, app.profileManager.CheckUsername(username)];
            case 2:
                responseStatus = (_a.sent()).responseStatus;
                app.SendRes(res, {
                    status: responseStatus.statusCode,
                    message: responseStatus.message,
                });
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                next(err_1);
                return [3 /*break*/, 4];
            case 4: return [3 /*break*/, 6];
            case 5:
                next(new herror_1.Herror("BadRequest", status_codes_1.HerrorStatus.StatusBadRequest));
                _a.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.HandleGetCheckUsername = HandleGetCheckUsername;
var HandleGetLeaderBoard = function (req, res, next, app) { return __awaiter(void 0, void 0, void 0, function () {
    var limit, offset, _a, responseStatus, leaderBoard, err_2;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                limit = Number((_b = req.query.limit) !== null && _b !== void 0 ? _b : 10);
                offset = Number((_c = req.query.offset) !== null && _c !== void 0 ? _c : 0);
                _d.label = 1;
            case 1:
                _d.trys.push([1, 3, , 4]);
                return [4 /*yield*/, app.profileManager.GetCommunityLeaderBoard(limit, offset)];
            case 2:
                _a = _d.sent(), responseStatus = _a.responseStatus, leaderBoard = _a.leaderBoard;
                app.SendRes(res, {
                    status: responseStatus.statusCode,
                    message: responseStatus.message,
                    data: leaderBoard,
                });
                return [3 /*break*/, 4];
            case 3:
                err_2 = _d.sent();
                next(err_2);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.HandleGetLeaderBoard = HandleGetLeaderBoard;
