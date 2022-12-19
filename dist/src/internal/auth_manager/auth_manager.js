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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bcrypt_1 = __importDefault(require("bcrypt"));
var random_1 = require("../../util/random");
var helper_1 = __importDefault(require("../../cmd/http_api/helper"));
var mail_dependencies_1 = require("../../util/mail_dependencies");
var status_codes_1 = require("../../pkg/herror/status_codes");
var SEC_IN_YEAR = 31536000;
var Token_Length = 64;
var AuthManager = /** @class */ (function () {
    function AuthManager(store, cache) {
        this.store = store;
        this.cache = cache;
    }
    AuthManager.prototype.CreateUser = function (mail_id, username, password, subject_id, identity_provider) {
        return this.store.users.create({
            data: {
                mail_id: mail_id,
                password: password,
                subject_id: subject_id,
                identity_provider: identity_provider,
                Profile: {
                    create: { username: username, email_id: mail_id },
                },
            },
        });
    };
    AuthManager.prototype.GetUserByMail = function (mail_id) {
        return this.store.users.findFirst({
            where: {
                mail_id: mail_id,
            },
        });
    };
    AuthManager.prototype.GetUserById = function (user_id) {
        return this.store.users.findFirst({
            where: {
                user_id: user_id,
            },
        });
    };
    AuthManager.prototype.DeleteScreen = function (user_id, accessToken) {
        return this.store.token.deleteMany({
            where: {
                AND: [{ user_id: user_id }, { token_id: accessToken }],
            },
        });
    };
    AuthManager.prototype.DeleteAllScreens = function (user_id) {
        return this.store.token.deleteMany({
            where: {
                user_id: user_id,
            },
        });
    };
    AuthManager.prototype.GetAllScreens = function (user_id) {
        return this.store.token.findMany({
            where: {
                user_id: user_id,
            },
        });
    };
    AuthManager.prototype.CreateScreen = function (user_id, accessToken, expiry) {
        return this.store.token.create({
            data: {
                user_id: user_id,
                token_id: accessToken,
                expired_at: expiry,
            },
        });
    };
    AuthManager.prototype.UpdatePassword = function (user_id, password) {
        return this.store.users.update({
            where: {
                user_id: user_id,
            },
            data: {
                password: password,
            },
        });
    };
    AuthManager.prototype.UserRegister = function (mail_id, otp, password) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var user, valid_otp, enc_password, username, user_1, accessToken, oneYearFromNow, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 11, , 12]);
                        return [4 /*yield*/, this.GetUserByMail(mail_id)];
                    case 1:
                        user = _a.sent();
                        if (!!user) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.CheckForOTPSession(mail_id)];
                    case 2:
                        valid_otp = _a.sent();
                        if (!(valid_otp === otp)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.HashPassword(password)];
                    case 3:
                        enc_password = _a.sent();
                        username = GenerateUsername(mail_id);
                        return [4 /*yield*/, this.CreateUser(mail_id, username, enc_password)];
                    case 4:
                        user_1 = _a.sent();
                        return [4 /*yield*/, this.CreateSession(Token_Length, user_1)];
                    case 5:
                        accessToken = _a.sent();
                        oneYearFromNow = new Date();
                        oneYearFromNow.setMonth(oneYearFromNow.getMonth() + 1);
                        return [4 /*yield*/, this.CreateScreen(user_1.user_id, accessToken, oneYearFromNow)];
                    case 6:
                        _a.sent();
                        resolve({
                            responseStatus: {
                                statusCode: status_codes_1.HerrorStatus.StatusCreated,
                                message: "successful_signup",
                            },
                            userData: user_1,
                            accessToken: accessToken,
                        });
                        return [3 /*break*/, 8];
                    case 7:
                        resolve({
                            responseStatus: {
                                statusCode: status_codes_1.HerrorStatus.StatusUnauthorized,
                                message: "otp_invalid",
                            },
                        });
                        _a.label = 8;
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        resolve({
                            responseStatus: {
                                statusCode: status_codes_1.HerrorStatus.StatusForbidden,
                                message: "user_already_exists",
                            },
                        });
                        _a.label = 10;
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        err_1 = _a.sent();
                        reject(err_1);
                        return [3 /*break*/, 12];
                    case 12: return [2 /*return*/];
                }
            });
        }); });
    };
    AuthManager.prototype.GoogleLogin = function (id_token) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var payload, _a, user, already_exists, accessToken, oneYearFromNow, err_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, (0, helper_1.default)(id_token)];
                    case 1:
                        payload = _b.sent();
                        return [4 /*yield*/, this.UpsertUser(payload.email, payload.sub)];
                    case 2:
                        _a = _b.sent(), user = _a.user, already_exists = _a.already_exists;
                        return [4 /*yield*/, this.CreateSession(Token_Length, user)];
                    case 3:
                        accessToken = _b.sent();
                        oneYearFromNow = new Date();
                        oneYearFromNow.setMonth(oneYearFromNow.getMonth() + 1);
                        return [4 /*yield*/, this.CreateScreen(user.user_id, accessToken, oneYearFromNow)];
                    case 4:
                        _b.sent();
                        resolve({
                            responseStatus: {
                                statusCode: status_codes_1.HerrorStatus.StatusOK,
                                message: "successful_login",
                            },
                            userData: user,
                            is_exists: already_exists,
                            accessToken: accessToken,
                        });
                        return [3 /*break*/, 6];
                    case 5:
                        err_2 = _b.sent();
                        reject(err_2);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        }); });
    };
    AuthManager.prototype.UpsertUser = function (email, sub) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var user, already_exists, username, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.GetUserByMail(email)];
                    case 1:
                        user = _a.sent();
                        already_exists = true;
                        if (!!user) return [3 /*break*/, 3];
                        username = GenerateUsername(email);
                        console.log("in upsert user about to create user");
                        return [4 /*yield*/, this.CreateUser(email, username, undefined, sub, "google")];
                    case 2:
                        user = _a.sent();
                        already_exists = false;
                        _a.label = 3;
                    case 3:
                        resolve({ user: user, already_exists: already_exists });
                        return [3 /*break*/, 5];
                    case 4:
                        err_3 = _a.sent();
                        reject(err_3);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
    };
    AuthManager.prototype.UserLogin = function (mail_id, password) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var user, validPassword, id, accessToken, oneYearFromNow, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 9, , 10]);
                        return [4 /*yield*/, this.GetUserByMail(mail_id)];
                    case 1:
                        user = _a.sent();
                        if (!user) return [3 /*break*/, 7];
                        return [4 /*yield*/, bcrypt_1.default.compare(password, user === null || user === void 0 ? void 0 : user.password)];
                    case 2:
                        validPassword = _a.sent();
                        if (!validPassword) return [3 /*break*/, 5];
                        id = user === null || user === void 0 ? void 0 : user.user_id;
                        return [4 /*yield*/, this.CreateSession(Token_Length, user)];
                    case 3:
                        accessToken = _a.sent();
                        oneYearFromNow = new Date();
                        oneYearFromNow.setMonth(oneYearFromNow.getMonth() + 1);
                        return [4 /*yield*/, this.CreateScreen(user.user_id, accessToken, oneYearFromNow)];
                    case 4:
                        _a.sent();
                        resolve({
                            responseStatus: {
                                statusCode: status_codes_1.HerrorStatus.StatusOK,
                                message: "successful_login",
                            },
                            userData: user,
                            accessToken: accessToken,
                        });
                        return [3 /*break*/, 6];
                    case 5:
                        reject({
                            responseStatus: {
                                statusCode: status_codes_1.HerrorStatus.StatusUnauthorized,
                                message: "password_invalid",
                            },
                        });
                        _a.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        reject({
                            responseStatus: {
                                statusCode: status_codes_1.HerrorStatus.StatusForbidden,
                                message: "no_user_with_given_mail_exists",
                            },
                        });
                        _a.label = 8;
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        err_4 = _a.sent();
                        reject(err_4);
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        }); });
    };
    AuthManager.prototype.OTPGenerationForSignUp = function (mail_id) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var user, otp, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, this.GetUserByMail(mail_id)];
                    case 1:
                        user = _a.sent();
                        if (!!user) return [3 /*break*/, 3];
                        otp = (0, random_1.GenerateOTP)();
                        return [4 /*yield*/, this.CreateOTPSession(mail_id, otp)];
                    case 2:
                        _a.sent();
                        (0, mail_dependencies_1.SendMail)(mail_id, otp);
                        resolve({
                            responseStatus: {
                                statusCode: status_codes_1.HerrorStatus.StatusOK,
                                message: "otp_generated",
                            },
                            userData: otp,
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        reject({
                            responseStatus: {
                                statusCode: status_codes_1.HerrorStatus.StatusForbidden,
                                message: "user_already_exists_in_db",
                            },
                        });
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        err_5 = _a.sent();
                        reject(err_5);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        }); });
    };
    AuthManager.prototype.OTPGenerationForForgot = function (mail_id) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var user, otp, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, this.GetUserByMail(mail_id)];
                    case 1:
                        user = _a.sent();
                        if (!user) return [3 /*break*/, 3];
                        otp = (0, random_1.GenerateOTP)();
                        return [4 /*yield*/, this.CreateOTPSession(mail_id, otp)];
                    case 2:
                        _a.sent();
                        (0, mail_dependencies_1.SendMail)(mail_id, otp);
                        resolve({
                            responseStatus: {
                                statusCode: status_codes_1.HerrorStatus.StatusOK,
                                message: "otp_generated",
                            },
                            userData: otp,
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        resolve({
                            responseStatus: {
                                statusCode: status_codes_1.HerrorStatus.StatusForbidden,
                                message: "user_doesnot_exist_in_db",
                            },
                        });
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        err_6 = _a.sent();
                        reject(err_6);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        }); });
    };
    AuthManager.prototype.OTPVerificationForSignup = function (mail_id, otp) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var user, valid_otp, err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, this.GetUserByMail(mail_id)];
                    case 1:
                        user = _a.sent();
                        if (!!user) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.CheckForOTPSession(mail_id)];
                    case 2:
                        valid_otp = _a.sent();
                        if (valid_otp == otp)
                            resolve({
                                responseStatus: {
                                    statusCode: status_codes_1.HerrorStatus.StatusOK,
                                    message: "successfully_verified",
                                },
                            });
                        else
                            resolve({
                                responseStatus: {
                                    statusCode: status_codes_1.HerrorStatus.StatusUnauthorized,
                                    message: "otp_invalid",
                                },
                            });
                        return [3 /*break*/, 4];
                    case 3:
                        resolve({
                            responseStatus: {
                                statusCode: status_codes_1.HerrorStatus.StatusForbidden,
                                message: "user_already_exists_in_db",
                            },
                        });
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        err_7 = _a.sent();
                        reject(err_7);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        }); });
    };
    AuthManager.prototype.OTPVerificationForForgot = function (mail_id, otp) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var user, valid_otp, err_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, this.GetUserByMail(mail_id)];
                    case 1:
                        user = _a.sent();
                        if (!user) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.CheckForOTPSession(mail_id)];
                    case 2:
                        valid_otp = _a.sent();
                        if (valid_otp === otp)
                            resolve({
                                responseStatus: {
                                    statusCode: status_codes_1.HerrorStatus.StatusOK,
                                    message: "successfully_verified",
                                },
                            });
                        else
                            resolve({
                                responseStatus: {
                                    statusCode: status_codes_1.HerrorStatus.StatusUnauthorized,
                                    message: "otp_invalid",
                                },
                            });
                        return [3 /*break*/, 4];
                    case 3:
                        resolve({
                            responseStatus: {
                                statusCode: status_codes_1.HerrorStatus.StatusForbidden,
                                message: "user_doesnot_exists_in_db",
                            },
                        });
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        err_8 = _a.sent();
                        reject(err_8);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        }); });
    };
    AuthManager.prototype.LogoutAllScreens = function (mail_id, otp) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var user, valid_otp, screens, i, accessToken, err_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 12, , 13]);
                        return [4 /*yield*/, this.GetUserByMail(mail_id)];
                    case 1:
                        user = _a.sent();
                        if (!user) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.CheckForOTPSession(mail_id)];
                    case 2:
                        valid_otp = _a.sent();
                        if (!(otp === valid_otp)) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.GetAllScreens(user.user_id)];
                    case 3:
                        screens = _a.sent();
                        i = 0;
                        _a.label = 4;
                    case 4:
                        if (!(i < screens.length)) return [3 /*break*/, 7];
                        accessToken = screens[i].token_id;
                        return [4 /*yield*/, this.cache.Delete("token_" + accessToken)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        i++;
                        return [3 /*break*/, 4];
                    case 7:
                        resolve({
                            responseStatus: {
                                statusCode: status_codes_1.HerrorStatus.StatusOK,
                                message: "logged out of all accounts",
                            },
                        });
                        return [3 /*break*/, 9];
                    case 8:
                        reject({
                            responseStatus: {
                                statusCode: status_codes_1.HerrorStatus.StatusUnauthorized,
                                message: "otp_invalid",
                            },
                        });
                        _a.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        reject({
                            responseStatus: {
                                statusCode: status_codes_1.HerrorStatus.StatusForbidden,
                                message: "user_doesnot_exists_in_db",
                            },
                        });
                        _a.label = 11;
                    case 11: return [3 /*break*/, 13];
                    case 12:
                        err_9 = _a.sent();
                        reject(err_9);
                        return [3 /*break*/, 13];
                    case 13: return [2 /*return*/];
                }
            });
        }); });
    };
    AuthManager.prototype.UpdateUserPassword = function (mail_id, otp, password) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var user, valid_otp, enc_password, updatedUser, accessToken, err_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 10, , 11]);
                        return [4 /*yield*/, this.GetUserByMail(mail_id)];
                    case 1:
                        user = _a.sent();
                        if (!user) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.CheckForOTPSession(mail_id)];
                    case 2:
                        valid_otp = _a.sent();
                        if (!(valid_otp == otp)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.HashPassword(password)];
                    case 3:
                        enc_password = _a.sent();
                        return [4 /*yield*/, this.UpdatePassword(user.user_id, enc_password)];
                    case 4:
                        updatedUser = _a.sent();
                        return [4 /*yield*/, this.CreateSession(Token_Length, user)];
                    case 5:
                        accessToken = _a.sent();
                        resolve({
                            responseStatus: {
                                statusCode: status_codes_1.HerrorStatus.StatusOK,
                                message: "successful_password_update",
                            },
                            userData: updatedUser,
                            accessToken: accessToken,
                        });
                        return [3 /*break*/, 7];
                    case 6:
                        reject({
                            responseStatus: {
                                statusCode: status_codes_1.HerrorStatus.StatusUnauthorized,
                                message: "otp_invalid",
                            },
                        });
                        _a.label = 7;
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        reject({
                            responseStatus: {
                                statusCode: status_codes_1.HerrorStatus.StatusForbidden,
                                message: "user_doesnot_exists_in_db",
                            },
                        });
                        _a.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        err_10 = _a.sent();
                        reject(err_10);
                        return [3 /*break*/, 11];
                    case 11: return [2 /*return*/];
                }
            });
        }); });
    };
    AuthManager.prototype.CreateOTPSession = function (mail_id, otp) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var err_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.cache.Set("otp_" + mail_id, otp, 300)];
                    case 1:
                        _a.sent();
                        resolve();
                        return [3 /*break*/, 3];
                    case 2:
                        err_11 = _a.sent();
                        reject(err_11);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    AuthManager.prototype.CheckForOTPSession = function (mail_id) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var otp, err_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.cache.Get("otp_" + mail_id)];
                    case 1:
                        otp = _a.sent();
                        resolve(otp);
                        return [3 /*break*/, 3];
                    case 2:
                        err_12 = _a.sent();
                        reject(err_12);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    AuthManager.prototype.CreateSession = function (n, user) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var token, isExists, userStringified, err_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        token = (0, random_1.RandomString)(n);
                        isExists = true;
                        _a.label = 1;
                    case 1:
                        if (!isExists) return [3 /*break*/, 3];
                        console.log("into create session ");
                        return [4 /*yield*/, this.cache.Get("token_" + token)];
                    case 2:
                        isExists = _a.sent();
                        token = (0, random_1.RandomString)(n);
                        return [3 /*break*/, 1];
                    case 3:
                        userStringified = JSON.stringify(user);
                        this.cache.Set("token_" + token, userStringified, SEC_IN_YEAR);
                        resolve(token);
                        return [3 /*break*/, 5];
                    case 4:
                        err_13 = _a.sent();
                        reject(err_13);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
    };
    AuthManager.prototype.LogoutUser = function (user_id, token) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var err_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.cache.Delete("token_" + token)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.DeleteScreen(user_id, token)];
                    case 2:
                        _a.sent();
                        resolve({
                            responseStatus: {
                                statusCode: status_codes_1.HerrorStatus.StatusOK,
                                message: "logged_out_successfully",
                            },
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        err_14 = _a.sent();
                        reject(err_14);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    };
    AuthManager.prototype.HashPassword = function (password) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var salt, enc_password, err_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, bcrypt_1.default.genSalt(10)];
                    case 1:
                        salt = _a.sent();
                        return [4 /*yield*/, bcrypt_1.default.hash(password, salt)];
                    case 2:
                        enc_password = _a.sent();
                        resolve(enc_password);
                        return [3 /*break*/, 4];
                    case 3:
                        err_15 = _a.sent();
                        reject(err_15);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    };
    return AuthManager;
}());
exports.default = AuthManager;
function GenerateUsername(mail_id) {
    var prefixUsername = mail_id.split("@")[0];
    var genRandomNumber = (0, random_1.RandomNumber)(100, 999);
    var username = prefixUsername + "_" + genRandomNumber.toString();
    return username;
}
