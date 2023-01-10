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
var ALLOWED_IMAGES = 4;
var MAX_WIDTH = 1080;
var ExploreManager = /** @class */ (function () {
    function ExploreManager(store, imageResolver, imageStorage) {
        this.store = store;
        this.imageResolver = imageResolver,
            this.imageStorage = imageStorage;
    }
    ExploreManager.prototype.GetTrendingPosts = function (limit, offset) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.store.trendingPosts.findMany({
                        take: limit,
                        skip: offset
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
    ExploreManager.prototype.GetSuggestedUsers = function (user_id) {
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
    ExploreManager.prototype.GetRecommendedUsers = function (limit, offset, user_id) {
        return __awaiter(this, void 0, void 0, function () {
            var suggestedUsers, trendingUsers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.GetSuggestedUsers(user_id)];
                    case 1:
                        suggestedUsers = _a.sent();
                        return [4 /*yield*/, this.GetTrendingUsers(limit, offset)];
                    case 2:
                        trendingUsers = _a.sent();
                        return [2 /*return*/];
                }
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
                                    return [4 /*yield*/, this.GetSuggestedUsers(user_id)];
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
    ExploreManager.prototype.Delete = function (story_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.store.stories.delete({
                            where: {
                                story_id: story_id
                            }
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ExploreManager.prototype.UpdateMediaRef = function (user_id, story_id, added, removed, is_new) {
        return __awaiter(this, void 0, void 0, function () {
            var currentImagesRef, updatedMediaRef_1, err_2, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, , 9]);
                        return [4 /*yield*/, this.store.stories.findUnique({
                                where: { story_id: story_id },
                            })];
                    case 1:
                        currentImagesRef = _a.sent();
                        if (!currentImagesRef)
                            throw new Error("Story not found");
                        updatedMediaRef_1 = currentImagesRef.media !== null
                            ? JSON.parse(currentImagesRef.media)
                            : [];
                        // removing removed images from db array
                        updatedMediaRef_1 = updatedMediaRef_1.filter(function (item) {
                            if (removed.includes(item))
                                return false;
                            return true;
                        });
                        // adding the new images to the db array
                        added.forEach(function (item) {
                            if (!updatedMediaRef_1.includes(item))
                                updatedMediaRef_1.push(item);
                        });
                        if (!is_new) return [3 /*break*/, 6];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.store.stories.update({
                                data: { media: JSON.stringify(updatedMediaRef_1) },
                                where: { story_id: story_id },
                            })];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        err_2 = _a.sent();
                        throw err_2;
                    case 5: return [3 /*break*/, 7];
                    case 6: return [2 /*return*/, JSON.stringify(updatedMediaRef_1)];
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        err_3 = _a.sent();
                        throw err_3;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    ExploreManager.prototype.UploadMedias = function (user_id, story_id, medias, edits, removed_images, is_new) {
        return __awaiter(this, void 0, void 0, function () {
            var mediaRef, i, imagesMetadata, imageWidth, _a, _b, _c, err_4, err_5, removed, err_6, i, err_7;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        mediaRef = medias.map(function (_, index) {
                            console.log(edits, index);
                            return "media_".concat(story_id, "_").concat(edits * (ALLOWED_IMAGES - 1) + index, ".").concat(_this.imageResolver.defaultFormat);
                        });
                        i = 0;
                        _d.label = 1;
                    case 1:
                        if (!(i < Math.min(ALLOWED_IMAGES, medias.length))) return [3 /*break*/, 11];
                        _d.label = 2;
                    case 2:
                        _d.trys.push([2, 9, , 10]);
                        return [4 /*yield*/, this.imageResolver.Metadata(medias[i])];
                    case 3:
                        imagesMetadata = _d.sent();
                        imageWidth = imagesMetadata.width || 1080;
                        if (imageWidth > MAX_WIDTH)
                            imageWidth = MAX_WIDTH;
                        _d.label = 4;
                    case 4:
                        _d.trys.push([4, 7, , 8]);
                        _b = (_a = this.imageStorage).Put;
                        _c = [mediaRef[i]];
                        // converting image
                        return [4 /*yield*/, this.imageResolver.Convert(medias[i], { w: imageWidth })];
                    case 5: 
                    // uploading image
                    return [4 /*yield*/, _b.apply(_a, _c.concat([
                            // converting image
                            _d.sent()]))];
                    case 6:
                        // uploading image
                        _d.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        err_4 = _d.sent();
                        // media upload failed
                        throw err_4;
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        err_5 = _d.sent();
                        console.log(err_5);
                        return [3 /*break*/, 10];
                    case 10:
                        i++;
                        return [3 /*break*/, 1];
                    case 11:
                        _d.trys.push([11, 16, , 24]);
                        if (!is_new) return [3 /*break*/, 13];
                        return [4 /*yield*/, this.UpdateMediaRef(user_id, story_id, mediaRef, [], is_new)];
                    case 12:
                        _d.sent();
                        return [3 /*break*/, 15];
                    case 13:
                        removed = JSON.parse(removed_images);
                        return [4 /*yield*/, this.UpdateMediaRef(user_id, story_id, mediaRef, removed || [], is_new)];
                    case 14: return [2 /*return*/, _d.sent()];
                    case 15: return [3 /*break*/, 24];
                    case 16:
                        err_6 = _d.sent();
                        _d.label = 17;
                    case 17:
                        _d.trys.push([17, 22, , 23]);
                        i = 0;
                        _d.label = 18;
                    case 18:
                        if (!(i < ALLOWED_IMAGES)) return [3 /*break*/, 21];
                        return [4 /*yield*/, this.imageStorage.Delete("media_".concat(story_id, "_").concat(i, ".").concat(this.imageResolver.defaultFormat))];
                    case 19:
                        _d.sent();
                        _d.label = 20;
                    case 20:
                        i++;
                        return [3 /*break*/, 18];
                    case 21: return [3 /*break*/, 23];
                    case 22:
                        err_7 = _d.sent();
                        throw err_7;
                    case 23: throw err_6;
                    case 24: return [2 /*return*/];
                }
            });
        });
    };
    ExploreManager.prototype.GetStories = function (limit, offset) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.store.stories.findMany({
                        take: limit,
                        skip: offset
                    })];
            });
        });
    };
    ExploreManager.prototype.GetExplore = function (user_id) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            try {
                            }
                            catch (err) {
                            }
                            return [2 /*return*/];
                        });
                    }); })];
            });
        });
    };
    ExploreManager.prototype.CreateStories = function (user_id, content, medias) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var story, removed_images, err_8, err_9, err_10;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 10, , 11]);
                                    return [4 /*yield*/, this.store.stories.create({
                                            data: {
                                                content: content,
                                                user_id: user_id,
                                                media: JSON.stringify([]),
                                            },
                                        })];
                                case 1:
                                    story = _a.sent();
                                    _a.label = 2;
                                case 2:
                                    _a.trys.push([2, 4, , 9]);
                                    removed_images = "";
                                    return [4 /*yield*/, this.UploadMedias(user_id, story.story_id, medias, 0, removed_images, true // is_new
                                        )];
                                case 3:
                                    _a.sent();
                                    resolve("story_uploaded_succesfully");
                                    return [3 /*break*/, 9];
                                case 4:
                                    err_8 = _a.sent();
                                    _a.label = 5;
                                case 5:
                                    _a.trys.push([5, 7, , 8]);
                                    return [4 /*yield*/, this.Delete(story.story_id)];
                                case 6:
                                    _a.sent();
                                    resolve("unable_to_upload_media");
                                    return [3 /*break*/, 8];
                                case 7:
                                    err_9 = _a.sent();
                                    throw err_9;
                                case 8: throw err_8;
                                case 9: return [3 /*break*/, 11];
                                case 10:
                                    err_10 = _a.sent();
                                    throw err_10;
                                case 11: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    return ExploreManager;
}());
exports.default = ExploreManager;
