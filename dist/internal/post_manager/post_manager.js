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
var prisma = new client_1.PrismaClient();
var ALLOWED_IMAGES = 3;
var MAX_WIDTH = 1080;
var PostManager = /** @class */ (function () {
    function PostManager(store, imageResolver, imageStorage, cache) {
        this.store = store;
        this.imageStorage = imageStorage;
        this.imageResolver = imageResolver;
        this.cache = cache;
    }
    PostManager.prototype.GetByID = function (id, limit, offset, includeLikeCount) {
        return this.store.posts.findMany({
            where: { user_id: id },
            include: { _count: { select: { Likes: includeLikeCount } } },
            skip: offset,
            take: limit,
        });
    };
    PostManager.prototype.Create = function (user_id, content, medias) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var post, removed_images, err_1, err_2, err_3;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 10, , 11]);
                                    return [4 /*yield*/, this.store.posts.create({
                                            data: {
                                                content: content,
                                                user_id: user_id,
                                                media: JSON.stringify([]),
                                            },
                                        })];
                                case 1:
                                    post = _a.sent();
                                    _a.label = 2;
                                case 2:
                                    _a.trys.push([2, 4, , 9]);
                                    removed_images = "";
                                    return [4 /*yield*/, this.UploadMedias(user_id, post.post_id, medias, 0, removed_images, true // is_new
                                        )];
                                case 3:
                                    _a.sent();
                                    resolve("post_uploaded_succesfully");
                                    return [3 /*break*/, 9];
                                case 4:
                                    err_1 = _a.sent();
                                    _a.label = 5;
                                case 5:
                                    _a.trys.push([5, 7, , 8]);
                                    return [4 /*yield*/, this.Delete(user_id, post.post_id)];
                                case 6:
                                    _a.sent();
                                    resolve("unable_to_upload_media");
                                    return [3 /*break*/, 8];
                                case 7:
                                    err_2 = _a.sent();
                                    throw err_2;
                                case 8: throw err_1;
                                case 9: return [3 /*break*/, 11];
                                case 10:
                                    err_3 = _a.sent();
                                    throw err_3;
                                case 11: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    PostManager.prototype.Update = function (user_id, post_id, removed_images, medias, edits, content) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var images, data, err_4, err_5;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 6, , 7]);
                                    return [4 /*yield*/, this.UploadMedias(user_id, post_id, medias, edits + 1, removed_images, false // is_new
                                        )];
                                case 1:
                                    images = _a.sent();
                                    _a.label = 2;
                                case 2:
                                    _a.trys.push([2, 4, , 5]);
                                    return [4 /*yield*/, this.store.posts.update({
                                            where: { user_id_post_id: { post_id: post_id, user_id: user_id } },
                                            data: {
                                                content: content,
                                                media: images,
                                                edits: {
                                                    increment: 1,
                                                },
                                            },
                                        })];
                                case 3:
                                    data = _a.sent();
                                    resolve(data);
                                    return [3 /*break*/, 5];
                                case 4:
                                    err_4 = _a.sent();
                                    reject(err_4);
                                    return [3 /*break*/, 5];
                                case 5: return [3 /*break*/, 7];
                                case 6:
                                    err_5 = _a.sent();
                                    resolve("unable_to_upload_media");
                                    return [3 /*break*/, 7];
                                case 7: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    PostManager.prototype.Delete = function (user_id, post_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.store.posts.deleteMany({
                            where: { AND: { user_id: user_id, post_id: post_id } },
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // TODO: what if the post which is shared contains of images as well.
    PostManager.prototype.ShareToTimeline = function (user_id, original_id, content) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.store.posts.create({
                        data: { content: content, user_id: user_id, original_id: original_id },
                    })];
            });
        });
    };
    PostManager.prototype.UpdateMediaRef = function (user_id, post_id, added, removed, is_new) {
        return __awaiter(this, void 0, void 0, function () {
            var currentImagesRef, updatedMediaRef_1, err_6, err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, , 9]);
                        return [4 /*yield*/, this.store.posts.findUnique({
                                where: { user_id_post_id: { post_id: post_id, user_id: user_id } },
                            })];
                    case 1:
                        currentImagesRef = _a.sent();
                        if (!currentImagesRef)
                            throw new Error("post not found");
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
                        return [4 /*yield*/, this.store.posts.update({
                                data: { media: JSON.stringify(updatedMediaRef_1) },
                                where: { user_id_post_id: { user_id: user_id, post_id: post_id } },
                            })];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        err_6 = _a.sent();
                        throw err_6;
                    case 5: return [3 /*break*/, 7];
                    case 6: return [2 /*return*/, JSON.stringify(updatedMediaRef_1)];
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        err_7 = _a.sent();
                        throw err_7;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    PostManager.prototype.UploadMedias = function (user_id, post_id, medias, edits, removed_images, is_new) {
        return __awaiter(this, void 0, void 0, function () {
            var mediaRef, i, imagesMetadata, imageWidth, _a, _b, _c, err_8, err_9, removed, err_10, i, err_11;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        mediaRef = medias.map(function (_, index) {
                            console.log(edits, index);
                            return "media_".concat(post_id, "_").concat(edits * 3 + index, ".").concat(_this.imageResolver.defaultFormat);
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
                        err_8 = _d.sent();
                        // media upload failed
                        throw err_8;
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        err_9 = _d.sent();
                        console.log(err_9);
                        return [3 /*break*/, 10];
                    case 10:
                        i++;
                        return [3 /*break*/, 1];
                    case 11:
                        _d.trys.push([11, 16, , 24]);
                        if (!is_new) return [3 /*break*/, 13];
                        return [4 /*yield*/, this.UpdateMediaRef(user_id, post_id, mediaRef, [], is_new)];
                    case 12:
                        _d.sent();
                        return [3 /*break*/, 15];
                    case 13:
                        removed = JSON.parse(removed_images);
                        return [4 /*yield*/, this.UpdateMediaRef(user_id, post_id, mediaRef, removed || [], is_new)];
                    case 14: return [2 /*return*/, _d.sent()];
                    case 15: return [3 /*break*/, 24];
                    case 16:
                        err_10 = _d.sent();
                        _d.label = 17;
                    case 17:
                        _d.trys.push([17, 22, , 23]);
                        i = 0;
                        _d.label = 18;
                    case 18:
                        if (!(i < ALLOWED_IMAGES)) return [3 /*break*/, 21];
                        return [4 /*yield*/, this.imageStorage.Delete("media_".concat(post_id, "_").concat(i, ".").concat(this.imageResolver.defaultFormat))];
                    case 19:
                        _d.sent();
                        _d.label = 20;
                    case 20:
                        i++;
                        return [3 /*break*/, 18];
                    case 21: return [3 /*break*/, 23];
                    case 22:
                        err_11 = _d.sent();
                        throw err_11;
                    case 23: throw err_10;
                    case 24: return [2 /*return*/];
                }
            });
        });
    };
    PostManager.prototype.BookmarkPosts = function (user_id, post_id) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var data, err_12;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, this.store.favourites.create({
                                            data: {
                                                user_id: user_id,
                                                post_id: post_id,
                                            },
                                        })];
                                case 1:
                                    data = _a.sent();
                                    resolve(data);
                                    return [3 /*break*/, 3];
                                case 2:
                                    err_12 = _a.sent();
                                    reject(err_12);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    PostManager.prototype.DeleteBookmarkedPosts = function (user_id, post_id) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var data, err_13;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, this.store.favourites.delete({
                                            where: {
                                                user_id_post_id: { user_id: user_id, post_id: post_id },
                                            },
                                        })];
                                case 1:
                                    data = _a.sent();
                                    resolve(data);
                                    return [3 /*break*/, 3];
                                case 2:
                                    err_13 = _a.sent();
                                    reject(err_13);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    PostManager.prototype.GetFollowing = function (user_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.store.networks.findMany({
                        where: {
                            follower_id: user_id,
                        },
                        select: {
                            following_id: true,
                        },
                    })];
            });
        });
    };
    PostManager.prototype.GetPostsOfUsers = function (users, limit, offset) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.store.posts.findMany({
                        take: limit,
                        skip: offset,
                        where: {
                            user_id: {
                                in: users,
                            },
                        },
                        include: { _count: { select: { Likes: true } } },
                    })];
            });
        });
    };
    PostManager.prototype.GetPostRecommendations = function (user_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.store.postRecommendations.findUnique({
                        where: {
                            user_id: user_id,
                        },
                    })];
            });
        });
    };
    PostManager.prototype.GetPostsById = function (post_id, limit, offset) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.store.posts.findMany({
                        take: limit,
                        skip: offset,
                        where: {
                            post_id: {
                                in: post_id,
                            },
                        },
                        include: { _count: { select: { Likes: true } } },
                    })];
            });
        });
    };
    PostManager.prototype.GetUsersFeed = function (user_id, limit, offset) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var posts_1, following_, following, recommended_posts, rec_posts, err_14;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 5, , 6]);
                                    posts_1 = [];
                                    following_ = [];
                                    return [4 /*yield*/, this.GetFollowing(user_id)];
                                case 1:
                                    following_ = _a.sent();
                                    following = following_.forEach(function (item) {
                                        item.following_id;
                                    });
                                    return [4 /*yield*/, this.GetPostsOfUsers(following, limit, offset)];
                                case 2:
                                    // get posts of these users.
                                    posts_1 = _a.sent();
                                    recommended_posts = [];
                                    return [4 /*yield*/, this.GetPostRecommendations(user_id)];
                                case 3:
                                    // recommendation of posts by lcm service..
                                    recommended_posts = _a.sent();
                                    recommended_posts = JSON.parse(recommended_posts);
                                    return [4 /*yield*/, this.GetPostsById(recommended_posts, limit, offset)];
                                case 4:
                                    rec_posts = _a.sent();
                                    rec_posts.forEach(function (post) {
                                        posts_1.push(post);
                                    });
                                    // posts contains all the posts to be displayed
                                    resolve(posts_1);
                                    return [3 /*break*/, 6];
                                case 5:
                                    err_14 = _a.sent();
                                    reject(err_14);
                                    return [3 /*break*/, 6];
                                case 6: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    return PostManager;
}());
exports.default = PostManager;
