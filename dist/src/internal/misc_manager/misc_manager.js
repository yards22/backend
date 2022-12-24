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
var MiscManager = /** @class */ (function () {
    function MiscManager(store, imageResolver, imageStorage) {
        this.store = store;
        this.imageStorage = imageStorage;
        this.imageResolver = imageResolver;
    }
    MiscManager.prototype.recieveFeedback = function (user_id, username, rawImage, content) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var format, filePath, resolvedImage, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        format = "jpg";
                        filePath = username + "_fb." + format;
                        return [4 /*yield*/, this.imageResolver.Convert(rawImage, { h: 320, w: 512 }, format)];
                    case 1:
                        resolvedImage = _a.sent();
                        return [4 /*yield*/, this.imageStorage.Put(filePath, resolvedImage)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.store.feedback.create({
                                data: {
                                    content: content,
                                    user_id: user_id,
                                    image_uri: filePath,
                                },
                            })];
                    case 3:
                        _a.sent();
                        resolve({
                            responseStatus: {
                                statusCode: status_codes_1.HerrorStatus.StatusOK,
                                message: "feedback_received_successfully",
                            },
                        });
                        return [3 /*break*/, 5];
                    case 4:
                        err_1 = _a.sent();
                        reject(err_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
    };
    MiscManager.prototype.GetLeaderBoard = function (limit, offset) {
        return this.store.profile.findMany({
            skip: offset,
            take: limit,
            orderBy: {
                cric_index: "desc",
            },
        });
    };
    MiscManager.prototype.GetPolls = function (limit, offset) {
        return this.store.polls.findMany({
            take: limit,
            skip: offset,
            orderBy: [
                {
                    created_at: 'desc',
                },
            ]
        });
    };
    MiscManager.prototype.GetPollTypes = function (poll_id) {
        return this.store.polls.findUnique({
            where: {
                poll_id: poll_id
            }
        });
    };
    //TODO: upsert polls reacn ...
    MiscManager.prototype.UpsertReactions = function (poll_id, user_id, type) {
        return this.store.pollsReaction.upsert({
            where: {
                poll_id_user_id: {
                    poll_id: poll_id,
                    user_id: user_id
                }
            },
            update: {
                type: type
            },
            create: {
                poll_id: poll_id,
                user_id: user_id,
                type: type,
            },
        });
    };
    MiscManager.prototype.PostPollReactions = function (poll_id, user_id, type) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var poll, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, this.GetPollTypes(poll_id)];
                    case 1:
                        poll = _a.sent();
                        if (!((poll === null || poll === void 0 ? void 0 : poll.options_count) <= type && type > 0)) return [3 /*break*/, 3];
                        // if type is valid  ...
                        return [4 /*yield*/, this.PostPollReactions(poll_id, user_id, type)];
                    case 2:
                        // if type is valid  ...
                        _a.sent();
                        resolve("reaction_posted_successfully");
                        return [3 /*break*/, 4];
                    case 3:
                        resolve("type_invalid");
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        err_2 = _a.sent();
                        reject(err_2);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        }); });
    };
    return MiscManager;
}());
exports.default = MiscManager;
