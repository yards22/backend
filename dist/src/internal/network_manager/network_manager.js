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
var client_1 = require("@prisma/client");
var status_codes_1 = require("../../pkg/herror/status_codes");
var prisma = new client_1.PrismaClient();
var NetworkManager = /** @class */ (function () {
    function NetworkManager(store) {
        this.store = store;
    }
    NetworkManager.prototype.GetMyFollowers = function (user_id) {
        return this.store.networks.findMany({
            where: {
                following_id: user_id,
            },
            include: {
                follower: {
                    select: {
                        Profile: {
                            select: {
                                user_id: true,
                                profile_image_uri: true,
                                username: true,
                            },
                        },
                    },
                },
            },
        });
    };
    NetworkManager.prototype.GetWhoAmIFollowing = function (user_id) {
        return this.store.networks.findMany({
            where: {
                follower_id: user_id,
            },
            include: {
                following: {
                    select: {
                        Profile: {
                            select: {
                                user_id: true,
                                profile_image_uri: true,
                                username: true,
                            },
                        },
                    },
                },
            },
        });
    };
    NetworkManager.prototype.CreateConnection = function (follower_id, following_id) {
        return this.store.networks.create({
            data: {
                follower_id: follower_id,
                following_id: following_id,
            },
        });
    };
    NetworkManager.prototype.DeleteConnection = function (follower_id, following_id) {
        return this.store.networks.delete({
            where: {
                follower_id_following_id: {
                    follower_id: follower_id,
                    following_id: following_id,
                },
            },
        });
    };
    NetworkManager.prototype.FollowingUpdate = function (user_id) {
        return this.store.profile.update({
            where: {
                user_id: user_id,
            },
            data: {
                following: {
                    increment: 1,
                },
            },
        });
    };
    NetworkManager.prototype.FollowersUpdate = function (user_id) {
        return this.store.profile.update({
            where: {
                user_id: user_id,
            },
            data: {
                followers: {
                    increment: 1,
                },
            },
        });
    };
    NetworkManager.prototype.GetComputedRecommendations = function (user_id) {
        return this.store.userRecommendations.findUnique({
            where: {
                user_id: user_id,
            },
        });
    };
    NetworkManager.prototype.UpdateRecommendations = function (user_id, new_recommends) {
        this.store.userRecommendations.update({
            where: {
                user_id: user_id,
            },
            data: {
                recommend: new_recommends,
            },
        });
    };
    NetworkManager.prototype.SearchResults = function (search_content) {
        return this.store.profile.findMany({
            where: {
                username: {
                    contains: search_content,
                },
            },
        });
    };
    NetworkManager.prototype.GetRecommendedUsers = function (recommendations, limit, offset) {
        return this.store.users.findMany({
            take: limit,
            skip: offset,
            where: {
                user_id: {
                    in: recommendations,
                },
            },
            select: {
                Profile: {
                    select: {
                        username: true,
                        profile_image_uri: true,
                        user_id: true,
                    },
                },
            },
        });
    };
    NetworkManager.prototype.GetRecommendations = function (user_id, offset, limit) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var parsedRecommendations, truncatedRecommends, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.PickAndParseRecommends(user_id)];
                    case 1:
                        parsedRecommendations = _a.sent();
                        return [4 /*yield*/, this.GetRecommendedUsers(parsedRecommendations, limit, offset)];
                    case 2:
                        truncatedRecommends = _a.sent();
                        resolve({
                            responseStatus: {
                                statusCode: status_codes_1.HerrorStatus.StatusOK,
                                message: "recommendations",
                            },
                            recommended: truncatedRecommends,
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        reject(err_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    };
    NetworkManager.prototype.CreateNewConnection = function (user_id, following_id) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var prevRecommends, newRecommends, newStringifiedRecommends, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, prisma.$transaction([
                                this.CreateConnection(user_id, following_id),
                                this.FollowingUpdate(following_id),
                                this.FollowersUpdate(user_id),
                            ])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.PickAndParseRecommends(user_id)];
                    case 2:
                        prevRecommends = _a.sent();
                        newRecommends = prevRecommends.filter(function (user_id) { return user_id !== following_id; });
                        newStringifiedRecommends = JSON.stringify(newRecommends);
                        return [4 /*yield*/, this.UpdateRecommendations(user_id, newStringifiedRecommends)];
                    case 3:
                        _a.sent();
                        resolve({
                            responseStatus: {
                                statusCode: status_codes_1.HerrorStatus.StatusOK,
                                message: "started_following",
                            },
                        });
                        return [3 /*break*/, 5];
                    case 4:
                        err_2 = _a.sent();
                        reject(err_2);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
    };
    NetworkManager.prototype.UnfollowUser = function (user_id, following_id) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.DeleteConnection(user_id, following_id)];
                    case 1:
                        _a.sent();
                        resolve("successfully_deleted");
                        return [3 /*break*/, 3];
                    case 2:
                        err_3 = _a.sent();
                        reject(err_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    NetworkManager.prototype.GetFollowers = function (user_id) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var _followerList, followerList_1, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.GetMyFollowers(user_id)];
                    case 1:
                        _followerList = _a.sent();
                        followerList_1 = [];
                        _followerList.forEach(function (item, index) {
                            var _a;
                            if ((_a = item.follower.Profile) === null || _a === void 0 ? void 0 : _a.username)
                                followerList_1.push({
                                    username: item.follower.Profile.username,
                                    profile_pic_uri: item.follower.Profile.profile_image_uri,
                                    user_id: item.follower.Profile.user_id,
                                });
                        });
                        resolve(followerList_1);
                        return [3 /*break*/, 3];
                    case 2:
                        err_4 = _a.sent();
                        reject(err_4);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    NetworkManager.prototype.GetFollowing = function (user_id) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var _followingList, followingList_1, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.GetWhoAmIFollowing(user_id)];
                    case 1:
                        _followingList = _a.sent();
                        followingList_1 = [];
                        _followingList.forEach(function (item, index) {
                            var _a;
                            if ((_a = item.following.Profile) === null || _a === void 0 ? void 0 : _a.username)
                                followingList_1.push({
                                    username: item.following.Profile.username,
                                    profile_pic_uri: item.following.Profile.profile_image_uri,
                                    user_id: item.following.Profile.user_id,
                                });
                        });
                        resolve(followingList_1);
                        return [3 /*break*/, 3];
                    case 2:
                        err_5 = _a.sent();
                        reject(err_5);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    NetworkManager.prototype.GetSearchedUsers = function (search_content) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var searchResults, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.SearchResults(search_content)];
                    case 1:
                        searchResults = _a.sent();
                        resolve(searchResults);
                        return [3 /*break*/, 3];
                    case 2:
                        err_6 = _a.sent();
                        reject(err_6);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    NetworkManager.prototype.PickAndParseRecommends = function (user_id) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var recommendations, parsedRecommendations, err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.GetComputedRecommendations(user_id)];
                    case 1:
                        recommendations = _a.sent();
                        parsedRecommendations = JSON.parse(recommendations);
                        resolve(parsedRecommendations);
                        return [3 /*break*/, 3];
                    case 2:
                        err_7 = _a.sent();
                        reject(err_7);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    return NetworkManager;
}());
exports.default = NetworkManager;
