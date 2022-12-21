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
exports.HandleAddToFavourites = exports.HandleShareToTimeline = exports.HandleGetPosts = exports.HandleDeletePost = exports.HandleUpdatePost = exports.HandleCreatePost = void 0;
var herror_1 = require("../../pkg/herror/herror");
var status_codes_1 = require("../../pkg/herror/status_codes");
//TODO: Perform proper error handling.
var HandleCreatePost = function (req, res, next, app) { return __awaiter(void 0, void 0, void 0, function () {
    var user_id, content, images, image_buffer, i, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user_id = Number(req.context.user_id);
                content = String(req.body.content);
                images = req.files;
                image_buffer = [];
                for (i = 0; i < (images === null || images === void 0 ? void 0 : images.length); i++) {
                    image_buffer.push(images[i].buffer);
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, app.postManager.Create(user_id, content, image_buffer)];
            case 2:
                _a.sent();
                app.SendRes(res, {
                    status: 200,
                });
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                next(err_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.HandleCreatePost = HandleCreatePost;
var HandleUpdatePost = function (req, res, next, app) { return __awaiter(void 0, void 0, void 0, function () {
    var user_id, content, post_id, removed_images, edits, images, image_buffer, i, updated_post, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user_id = Number(req.context.user_id);
                content = String(req.body.content);
                post_id = BigInt(req.body.post_id);
                removed_images = String(req.body.removed_images);
                edits = Number(req.body.edits);
                images = req.files;
                image_buffer = [];
                for (i = 0; i < (images === null || images === void 0 ? void 0 : images.length); i++) {
                    image_buffer.push(images[i].buffer);
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, app.postManager.Update(user_id, post_id, removed_images, image_buffer, edits, content)];
            case 2:
                updated_post = _a.sent();
                app.SendRes(res, {
                    status: 200,
                    data: updated_post,
                });
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                next(err_2);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.HandleUpdatePost = HandleUpdatePost;
var HandleDeletePost = function (req, res, next, app) { return __awaiter(void 0, void 0, void 0, function () {
    var user_id, post_id, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user_id = Number(req.context.user_id);
                post_id = BigInt(req.body.post_id);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, app.postManager.Delete(user_id, post_id)];
            case 2:
                _a.sent();
                app.SendRes(res, {
                    status: 200,
                    message: "post_deleted",
                });
                return [3 /*break*/, 4];
            case 3:
                err_3 = _a.sent();
                next(err_3);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.HandleDeletePost = HandleDeletePost;
var HandleGetPosts = function (req, res, next, app) { return __awaiter(void 0, void 0, void 0, function () {
    var user_id, limit, offset, posts, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user_id = Number(req.context.user_id);
                limit = Number(req.query.limit);
                offset = Number(req.query.offset);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, app.postManager.GetUsersFeed(user_id, limit, offset)];
            case 2:
                posts = _a.sent();
                app.SendRes(res, {
                    status: 200,
                    data: posts,
                });
                return [3 /*break*/, 4];
            case 3:
                err_4 = _a.sent();
                next(err_4);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.HandleGetPosts = HandleGetPosts;
var HandleShareToTimeline = function (req, res, next, app) { return __awaiter(void 0, void 0, void 0, function () {
    var user_id, post_id, content, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user_id = Number(req.context.user_id);
                post_id = BigInt(req.body.post_id);
                content = String(req.body.content);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, app.postManager.ShareToTimeline(user_id, post_id, content)];
            case 2:
                _a.sent();
                app.SendRes(res, {
                    status: 200,
                });
                return [3 /*break*/, 4];
            case 3:
                err_5 = _a.sent();
                next(err_5);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.HandleShareToTimeline = HandleShareToTimeline;
var HandleAddToFavourites = function (req, res, next, app) { return __awaiter(void 0, void 0, void 0, function () {
    var user_id, post_id, data, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user_id = Number(req.context.user_id);
                post_id = BigInt(req.body.post_id);
                if (!(post_id === undefined || post_id === null)) return [3 /*break*/, 1];
                next(new herror_1.Herror("post_id missing", status_codes_1.HerrorStatus.StatusBadRequest));
                return [3 /*break*/, 4];
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, app.postManager.BookmarkPosts(user_id, post_id)];
            case 2:
                data = _a.sent();
                app.SendRes(res, {
                    status: 200,
                    data: data,
                });
                return [3 /*break*/, 4];
            case 3:
                err_6 = _a.sent();
                next(err_6);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.HandleAddToFavourites = HandleAddToFavourites;
