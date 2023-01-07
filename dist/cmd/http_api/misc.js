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
exports.HandlePostPolls = exports.HandleGetPolls = exports.HandleRecieveFeedback = void 0;
var status_codes_1 = require("../../pkg/herror/status_codes");
var herror_1 = require("../../pkg/herror/herror");
var HandleRecieveFeedback = function (req, res, next, app) { return __awaiter(void 0, void 0, void 0, function () {
    var user_id, content, username, images, image_buffer, responseStatus, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user_id = Number(req.context.user_id);
                content = String(req.body.content);
                username = String(req.body.username);
                images = req.files;
                image_buffer = images[0].buffer;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, app.miscManager.recieveFeedback(user_id, username, image_buffer, content)];
            case 2:
                responseStatus = (_a.sent()).responseStatus;
                app.SendRes(res, {
                    status: responseStatus.statusCode,
                    message: responseStatus.message,
                });
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                next(new herror_1.Herror("BadRequest", status_codes_1.HerrorStatus.StatusBadRequest));
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.HandleRecieveFeedback = HandleRecieveFeedback;
var HandleGetPolls = function (req, res, next, app) { return __awaiter(void 0, void 0, void 0, function () {
    var poll_id, limit, offset, poll_data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                poll_id = req.body.poll_id;
                limit = Number(req.query.limit || 1);
                offset = Number(req.query.offset || 0);
                if (!(poll_id != undefined)) return [3 /*break*/, 2];
                return [4 /*yield*/, app.miscManager.GetPolls(limit, offset)];
            case 1:
                poll_data = _a.sent();
                app.SendRes(res, {
                    status: 200,
                    data: poll_data
                });
                return [3 /*break*/, 3];
            case 2:
                next(new herror_1.Herror("BadRequest", status_codes_1.HerrorStatus.StatusBadRequest));
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.HandleGetPolls = HandleGetPolls;
var HandlePostPolls = function (req, res, next, app) { return __awaiter(void 0, void 0, void 0, function () {
    var poll_id, user_id, type, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                poll_id = req.body.poll_id;
                user_id = req.context.user_id;
                type = req.body.type;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, app.miscManager.PostPollReactions(poll_id, user_id, type)];
            case 2:
                _a.sent();
                app.SendRes(res, {
                    status: 200
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
exports.HandlePostPolls = HandlePostPolls;
