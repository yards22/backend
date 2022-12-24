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
var ExploreManager = /** @class */ (function () {
    function ExploreManager(store) {
        this.store = store;
    }
    ExploreManager.prototype.GetTrendingPosts = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.store.trendingPosts.findMany({
                        take: 10,
                        skip: 0
                    })];
            });
        });
    };
    ExploreManager.prototype.GetTrendingUsers = function (limit, offset) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.store.trendingUsers.findMany({
                        take: limit,
                        skip: offset
                    })];
            });
        });
    };
    ExploreManager.prototype.GetRecommendedUsers = function (user_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.store.userRecommendations.findUnique({
                        where: {
                            user_id: user_id
                        }
                    })];
            });
        });
    };
    ExploreManager.prototype.GetFollowing = function (user_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.store.networks.findMany({
                        where: {
                            follower_id: user_id
                        }
                    })];
            });
        });
    };
    ExploreManager.prototype.ParseRU = function (str) {
        // let parsed_id:number[] = [];
        var stringified_id = str.split('-');
        var parsed_id = stringified_id.map(function (id) { return parseInt(id); });
        return parsed_id;
    };
    ExploreManager.prototype.GetUserSuggestions = function (limit, offset, user_id) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var ru, parsed_ru, tu, parsed_tu, following_, following, mySet_1, followingSet_1, err_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 4, , 5]);
                                    return [4 /*yield*/, this.GetRecommendedUsers(user_id)];
                                case 1:
                                    ru = _a.sent();
                                    parsed_ru = this.ParseRU(ru === null || ru === void 0 ? void 0 : ru.recommend);
                                    return [4 /*yield*/, this.GetTrendingUsers(limit, offset)];
                                case 2:
                                    tu = _a.sent();
                                    parsed_tu = tu.map(function (user) { return user.user_id; });
                                    return [4 /*yield*/, this.GetFollowing(user_id)];
                                case 3:
                                    following_ = _a.sent();
                                    following = following_.map(function (f) { return f.following_id; });
                                    mySet_1 = new Set();
                                    followingSet_1 = new Set();
                                    parsed_ru.forEach(function (item) { return mySet_1.add(item); });
                                    parsed_tu.forEach(function (item) { return mySet_1.add(item); });
                                    following.forEach(function (item) {
                                        if (mySet_1.has(item)) {
                                            mySet_1.delete(item);
                                            followingSet_1.add(item);
                                        }
                                    });
                                    return [3 /*break*/, 5];
                                case 4:
                                    err_1 = _a.sent();
                                    reject(err_1);
                                    return [3 /*break*/, 5];
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    return ExploreManager;
}());
exports.default = ExploreManager;
