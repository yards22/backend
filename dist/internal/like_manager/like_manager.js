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
var types_1 = require("../notification_manager/types");
var LikeManager = /** @class */ (function () {
    function LikeManager(store, cache, notificationManager) {
        this.store = store;
        this.cache = cache;
        this.notificationManager = notificationManager;
    }
    LikeManager.prototype.GetLikesCount = function (post_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.store.likes.count({ where: { post_id: post_id } })];
            });
        });
    };
    LikeManager.prototype.GetLikesForPost = function (post_id, limit, offset) {
        return __awaiter(this, void 0, void 0, function () {
            var _likes, likes_1, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.store.likes.findMany({
                                where: { post_id: post_id },
                                take: limit,
                                skip: offset,
                                include: {
                                    user: {
                                        select: {
                                            Profile: {
                                                select: {
                                                    username: true,
                                                    profile_image_uri: true,
                                                    user_id: true,
                                                },
                                            },
                                        },
                                    },
                                },
                            })];
                    case 1:
                        _likes = _a.sent();
                        likes_1 = [];
                        _likes.forEach(function (item, index) {
                            var _a;
                            if ((_a = item.user.Profile) === null || _a === void 0 ? void 0 : _a.username)
                                likes_1.push({
                                    create_at: item.created_at,
                                    username: item.user.Profile.username,
                                    type: item.type,
                                    profile_pic_uri: item.user.Profile.profile_image_uri,
                                    user_id: item.user.Profile.user_id,
                                });
                        });
                        return [2 /*return*/, likes_1];
                    case 2:
                        err_1 = _a.sent();
                        throw err_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // updates the like type or creates one
    LikeManager.prototype.Like = function (post_id, user_id, type) {
        return __awaiter(this, void 0, void 0, function () {
            var creator;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.store.likes.upsert({
                            where: { user_id_post_id: { post_id: post_id, user_id: user_id } },
                            update: { type: type },
                            create: { type: type, user_id: user_id, post_id: post_id },
                        })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.store.posts.findUnique({ where: { post_id: post_id } })];
                    case 2:
                        creator = _a.sent();
                        if (creator)
                            this.notificationManager.Create(creator.user_id, new types_1.LikeNotification(post_id, user_id));
                        return [2 /*return*/];
                }
            });
        });
    };
    LikeManager.prototype.Unlike = function (post_id, user_id) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var err_2;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, this.store.likes.delete({
                                            where: { user_id_post_id: { user_id: user_id, post_id: post_id } },
                                        })];
                                case 1:
                                    _a.sent();
                                    resolve("Succesful_deletetion");
                                    return [3 /*break*/, 3];
                                case 2:
                                    err_2 = _a.sent();
                                    reject(err_2);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    return LikeManager;
}());
exports.default = LikeManager;
