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
var status_codes_1 = require("../../pkg/herror/status_codes");
var SEC_IN_YEAR = 31536000;
var ProfileManager = /** @class */ (function () {
    function ProfileManager(store, imageResolver, imageStorage, cache) {
        this.store = store;
        this.imageStorage = imageStorage;
        this.imageResolver = imageResolver;
        this.cache = cache;
    }
    ProfileManager.prototype.GetUserByUsername = function (username) {
        return this.store.profile.findUnique({
            where: {
                username: username,
            },
        });
    };
    ProfileManager.prototype.GetUserByUsernameBulk = function (username, offset, limit) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.store.profile.findUnique({
                            where: {
                                username: username,
                            },
                            include: {
                                user: {
                                    select: {
                                        Post: {
                                            take: limit,
                                            skip: offset,
                                            include: {
                                                _count: {
                                                    select: {
                                                        Likes: true,
                                                        ParentComments: true,
                                                    },
                                                },
                                            },
                                        },
                                        Favourites: {
                                            take: limit,
                                            skip: offset,
                                            include: {
                                                user: {
                                                    select: {
                                                        Post: {
                                                            include: {
                                                                _count: {
                                                                    select: {
                                                                        Likes: true,
                                                                        ParentComments: true,
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ProfileManager.prototype.GetUserPrimaryInfoById = function (user_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.store.profile.findUnique({
                            where: {
                                user_id: user_id,
                            },
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ProfileManager.prototype.GetUserProfileById = function (user_id, offset, limit) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.store.profile.findUnique({
                            where: {
                                user_id: user_id,
                            },
                            include: {
                                user: {
                                    select: {
                                        Post: {
                                            take: limit,
                                            skip: offset,
                                            include: {
                                                _count: {
                                                    select: {
                                                        Likes: true,
                                                        ParentComments: true,
                                                    },
                                                },
                                            },
                                        },
                                        Favourites: {
                                            take: limit,
                                            skip: offset,
                                            include: {
                                                user: {
                                                    select: {
                                                        Post: {
                                                            include: {
                                                                _count: {
                                                                    select: {
                                                                        Likes: true,
                                                                        ParentComments: true,
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ProfileManager.prototype.GetLeaderBoard = function (limit, offset) {
        return this.store.profile.findMany({
            skip: offset,
            take: limit,
            orderBy: {
                cric_index: "desc",
            },
        });
    };
    ProfileManager.prototype.UpdateProfileDetails = function (user_id, username, token, rawImage, bio, interests) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var format, filePath, resolvedImage, updatedProfile, UpdatedProfileDetails, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        format = "jpg";
                        filePath = undefined;
                        if (rawImage == undefined)
                            console.log("no image");
                        if (!(rawImage !== undefined)) return [3 /*break*/, 3];
                        filePath = user_id + "_dp." + format;
                        return [4 /*yield*/, this.imageResolver.Convert(rawImage, { h: 320, w: 512 }, format)];
                    case 1:
                        resolvedImage = _a.sent();
                        console.log(filePath);
                        return [4 /*yield*/, this.imageStorage.Put(filePath, resolvedImage)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [4 /*yield*/, this.store.profile.update({
                            where: {
                                user_id: user_id,
                            },
                            data: {
                                username: username === "" ? undefined : username,
                                profile_image_uri: filePath,
                                bio: bio,
                                interests: interests,
                            },
                        })];
                    case 4:
                        updatedProfile = _a.sent();
                        UpdatedProfileDetails = JSON.stringify(updatedProfile);
                        // also change the profile details in redis for this particular token .
                        // but there a raises a problem with expiry TTL.
                        return [4 /*yield*/, this.cache.Set(token, UpdatedProfileDetails, SEC_IN_YEAR)];
                    case 5:
                        // also change the profile details in redis for this particular token .
                        // but there a raises a problem with expiry TTL.
                        _a.sent();
                        resolve({
                            responseStatus: {
                                statusCode: status_codes_1.HerrorStatus.StatusOK,
                                message: "successful_Updation",
                            },
                            profileData: updatedProfile,
                        });
                        return [3 /*break*/, 7];
                    case 6:
                        err_1 = _a.sent();
                        reject(err_1);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        }); });
    };
    ProfileManager.prototype.GetCommunityLeaderBoard = function (limit, offset) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var leaderBoard, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.GetCommunityLeaderBoard(limit, offset)];
                    case 1:
                        leaderBoard = _a.sent();
                        resolve({
                            responseStatus: {
                                statusCode: status_codes_1.HerrorStatus.StatusOK,
                                message: "community_leaderboard",
                            },
                            leaderBoard: leaderBoard,
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        err_2 = _a.sent();
                        reject(err_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    ProfileManager.prototype.CheckUsername = function (username) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var user, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.GetUserByUsername(username)];
                    case 1:
                        user = _a.sent();
                        if (user === undefined || user === null) {
                            resolve({
                                responseStatus: {
                                    statusCode: status_codes_1.HerrorStatus.StatusOK,
                                    message: "u_can_pick_this",
                                },
                            });
                        }
                        else {
                            resolve({
                                responseStatus: {
                                    statusCode: status_codes_1.HerrorStatus.StatusUnauthorized,
                                    message: "username_already_taken",
                                },
                            });
                        }
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
    ProfileManager.prototype.GetUserPostsById = function (user_id, limit, offset) {
        return this.store.posts.findMany({
            where: {
                user_id: user_id
            },
            include: { _count: { select: { Likes: true } } },
        });
    };
    ProfileManager.prototype.GetUserPostsByUsername = function (username, limit, offset) {
        return this.store.profile.findUnique({
            where: {
                username: username
            },
            include: {
                user: {
                    select: {
                        Post: {
                            include: {
                                _count: {
                                    select: {
                                        Likes: true,
                                        ParentComments: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
    };
    ProfileManager.prototype.GetStaredPostsById = function (user_id, limit, offset) {
        return this.store.posts.findMany({
            take: limit,
            skip: offset,
            where: {
                user_id: user_id,
            },
        });
    };
    ProfileManager.prototype.GetStaredPostsByUsername = function (username, limit, offset) {
        return this.store.profile.findUnique({
            where: {
                username: username
            },
            include: {
                user: {
                    select: {
                        Favourites: {
                            include: {
                                post: {
                                    include: {
                                        _count: {
                                            select: {
                                                Likes: true,
                                                ParentComments: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
    };
    return ProfileManager;
}());
exports.default = ProfileManager;
