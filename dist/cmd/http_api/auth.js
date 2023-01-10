"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.HandleMe = exports.HandleLogoutAllScreen = exports.HandleOTPVerification = exports.HandlePasswordUpdate = exports.HandleOTPGeneration = exports.HandleLogout = exports.HandleOTPVerificationForSignUp = exports.HandleOTPGenerationForSignUp = exports.HandleGoogleOauth = exports.HandleLogin = exports.HandleSignUp = void 0;
var herror_1 = require("../../pkg/herror/herror");
var mail_dependencies_1 = require("../../util/mail_dependencies");
var status_codes_1 = require("../../pkg/herror/status_codes");
var HandleSignUp = function (req, res, next, app) { return __awaiter(void 0, void 0, void 0, function () {
    var mail_id, password, otp, _a, responseStatus, userData, accessToken, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                mail_id = req.body.mail_id;
                password = req.body.password;
                otp = req.body.OTP;
                if (!(mail_id === undefined || password === undefined)) return [3 /*break*/, 1];
                next(new herror_1.Herror("BadRequest", status_codes_1.HerrorStatus.StatusBadRequest));
                return [3 /*break*/, 4];
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, app.authManager.UserRegister(mail_id, otp, password)];
            case 2:
                _a = _b.sent(), responseStatus = _a.responseStatus, userData = _a.userData, accessToken = _a.accessToken;
                app.SendRes(res, {
                    status: responseStatus.statusCode,
                    data: { user_data: userData, token: accessToken },
                    message: responseStatus.message,
                });
                return [3 /*break*/, 4];
            case 3:
                err_1 = _b.sent();
                next(err_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.HandleSignUp = HandleSignUp;
var HandleLogin = function (req, res, next, app) { return __awaiter(void 0, void 0, void 0, function () {
    var mail_id, password, _a, responseStatus, userData, accessToken, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                mail_id = req.body.mail_id;
                password = req.body.password;
                if (!(mail_id === undefined || password === undefined)) return [3 /*break*/, 1];
                next(new herror_1.Herror("mail_id/password_missing", status_codes_1.HerrorStatus.StatusBadRequest));
                return [3 /*break*/, 4];
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, app.authManager.UserLogin(mail_id, password)];
            case 2:
                _a = _b.sent(), responseStatus = _a.responseStatus, userData = _a.userData, accessToken = _a.accessToken;
                app.SendRes(res, {
                    status: responseStatus.statusCode,
                    data: { user_data: userData, token: accessToken },
                    message: responseStatus.message,
                });
                return [3 /*break*/, 4];
            case 3:
                err_2 = _b.sent();
                next(err_2);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.HandleLogin = HandleLogin;
var HandleGoogleOauth = function (req, res, next, app) { return __awaiter(void 0, void 0, void 0, function () {
    var id_token, _a, responseStatus, userData, is_exists, accessToken, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                id_token = req.body.id_token;
                if (!(id_token != undefined)) return [3 /*break*/, 5];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, app.authManager.GoogleLogin(id_token)];
            case 2:
                _a = _b.sent(), responseStatus = _a.responseStatus, userData = _a.userData, is_exists = _a.is_exists, accessToken = _a.accessToken;
                app.SendRes(res, {
                    status: responseStatus.statusCode,
                    data: { user_data: userData, token: accessToken, is_exists: is_exists },
                    message: responseStatus.message,
                });
                return [3 /*break*/, 4];
            case 3:
                err_3 = _b.sent();
                next(err_3);
                return [3 /*break*/, 4];
            case 4: return [3 /*break*/, 6];
            case 5:
                next(new herror_1.Herror("BadRequest", status_codes_1.HerrorStatus.StatusBadRequest));
                _b.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.HandleGoogleOauth = HandleGoogleOauth;
var HandleOTPGenerationForSignUp = function (req, res, next, app) { return __awaiter(void 0, void 0, void 0, function () {
    var mail_id, valid, _a, responseStatus, userData, err_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                mail_id = req.body.mail_id;
                console.log("Hello");
                console.log(mail_id);
                valid = (0, mail_dependencies_1.MailValidator)(mail_id);
                if (!valid) return [3 /*break*/, 5];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, app.authManager.OTPGenerationForSignUp(mail_id)];
            case 2:
                _a = _b.sent(), responseStatus = _a.responseStatus, userData = _a.userData;
                app.SendRes(res, {
                    status: responseStatus.statusCode,
                    message: responseStatus.message,
                });
                return [3 /*break*/, 4];
            case 3:
                err_4 = _b.sent();
                next(err_4);
                return [3 /*break*/, 4];
            case 4: return [3 /*break*/, 6];
            case 5:
                next(new herror_1.Herror("invalid_email", status_codes_1.HerrorStatus.StatusBadRequest));
                _b.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.HandleOTPGenerationForSignUp = HandleOTPGenerationForSignUp;
var HandleOTPVerificationForSignUp = function (req, res, next, app) { return __awaiter(void 0, void 0, void 0, function () {
    var mail_id, OTP, valid, responseStatus, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                mail_id = req.body.mail_id;
                OTP = req.body.OTP;
                valid = (0, mail_dependencies_1.MailValidator)(mail_id);
                if (!valid) return [3 /*break*/, 5];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, app.authManager.OTPVerificationForSignup(mail_id, OTP)];
            case 2:
                responseStatus = (_a.sent()).responseStatus;
                app.SendRes(res, {
                    status: responseStatus.statusCode,
                    message: responseStatus.message,
                });
                return [3 /*break*/, 4];
            case 3:
                err_5 = _a.sent();
                next(err_5);
                return [3 /*break*/, 4];
            case 4: return [3 /*break*/, 6];
            case 5:
                next(new herror_1.Herror("BadRequest", status_codes_1.HerrorStatus.StatusBadRequest));
                _a.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.HandleOTPVerificationForSignUp = HandleOTPVerificationForSignUp;
var HandleOTPVerification = function (req, res, next, app) { return __awaiter(void 0, void 0, void 0, function () {
    var mail_id, OTP, valid, responseStatus, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                mail_id = req.body.mail_id;
                OTP = req.body.OTP;
                valid = (0, mail_dependencies_1.MailValidator)(mail_id);
                if (!valid) return [3 /*break*/, 5];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, app.authManager.OTPVerificationForForgot(mail_id, OTP)];
            case 2:
                responseStatus = (_a.sent()).responseStatus;
                app.SendRes(res, {
                    status: responseStatus.statusCode,
                    message: responseStatus.message,
                });
                return [3 /*break*/, 4];
            case 3:
                err_6 = _a.sent();
                next(err_6);
                return [3 /*break*/, 4];
            case 4: return [3 /*break*/, 6];
            case 5:
                next(new herror_1.Herror("BadRequest", status_codes_1.HerrorStatus.StatusBadRequest));
                _a.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.HandleOTPVerification = HandleOTPVerification;
var HandleLogout = function (req, res, next, app) { return __awaiter(void 0, void 0, void 0, function () {
    var token, user_id, responseStatus, err_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                token = req.context.token;
                user_id = req.context.user_id;
                console.log(user_id, token);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, app.authManager.LogoutUser(user_id, token)];
            case 2:
                responseStatus = (_a.sent()).responseStatus;
                app.SendRes(res, {
                    status: responseStatus.statusCode,
                    message: responseStatus.message,
                });
                return [3 /*break*/, 4];
            case 3:
                err_7 = _a.sent();
                next(err_7);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.HandleLogout = HandleLogout;
var HandleOTPGeneration = function (req, res, next, app) { return __awaiter(void 0, void 0, void 0, function () {
    var mail_id, valid, responseStatus, err_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                mail_id = req.body.mail_id;
                valid = (0, mail_dependencies_1.MailValidator)(mail_id);
                if (!valid) return [3 /*break*/, 5];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, app.authManager.OTPGenerationForForgot(mail_id)];
            case 2:
                responseStatus = (_a.sent()).responseStatus;
                app.SendRes(res, {
                    status: responseStatus.statusCode,
                    message: responseStatus.message,
                });
                return [3 /*break*/, 4];
            case 3:
                err_8 = _a.sent();
                next(err_8);
                return [3 /*break*/, 4];
            case 4: return [3 /*break*/, 6];
            case 5:
                next(new herror_1.Herror("BadRequest", status_codes_1.HerrorStatus.StatusBadRequest));
                _a.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.HandleOTPGeneration = HandleOTPGeneration;
var HandlePasswordUpdate = function (req, res, next, app) { return __awaiter(void 0, void 0, void 0, function () {
    var password, mail_id, OTP, _a, responseStatus, userData, accessToken, err_9;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                password = req.body.password;
                mail_id = req.body.mail_id;
                OTP = req.body.OTP;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, app.authManager.UpdateUserPassword(mail_id, OTP, password)];
            case 2:
                _a = _b.sent(), responseStatus = _a.responseStatus, userData = _a.userData, accessToken = _a.accessToken;
                app.SendRes(res, {
                    status: responseStatus.statusCode,
                    data: { user_data: userData, token: accessToken },
                    message: responseStatus.message,
                });
                return [3 /*break*/, 4];
            case 3:
                err_9 = _b.sent();
                next(err_9);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.HandlePasswordUpdate = HandlePasswordUpdate;
var HandleLogoutAllScreen = function (req, res, next, app) { return __awaiter(void 0, void 0, void 0, function () {
    var mail_id, OTP, responseStatus, err_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                mail_id = req.body.mail_id;
                OTP = req.body.OTP;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, app.authManager.LogoutAllScreens(mail_id, OTP)];
            case 2:
                responseStatus = (_a.sent()).responseStatus;
                app.SendRes(res, {
                    status: responseStatus.statusCode,
                    message: responseStatus.message,
                });
                return [3 /*break*/, 4];
            case 3:
                err_10 = _a.sent();
                next(err_10);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.HandleLogoutAllScreen = HandleLogoutAllScreen;
var HandleMe = function (req, res, next, app) { return __awaiter(void 0, void 0, void 0, function () {
    var data;
    return __generator(this, function (_a) {
        data = __assign({}, req.context);
        delete data.token;
        delete data.password;
        app.SendRes(res, { status: status_codes_1.HerrorStatus.StatusOK, data: data });
        return [2 /*return*/];
    });
}); };
exports.HandleMe = HandleMe;
