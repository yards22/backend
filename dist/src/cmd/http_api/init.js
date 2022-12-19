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
exports.SinkInit = exports.TimerInit = exports.RemoteFileStorageInit = exports.RedisInit = exports.DBInit = exports.ServerInit = void 0;
var express_1 = __importDefault(require("express"));
var client_1 = require("@prisma/client");
var status_codes_1 = require("../../pkg/herror/status_codes");
var herror_1 = require("../../pkg/herror/herror");
var config_1 = __importDefault(require("config"));
var cors_1 = __importDefault(require("cors"));
var redis_1 = require("redis");
var node_cron_1 = __importDefault(require("node-cron"));
var s3_file_storage_1 = require("../../pkg/file_storage/s3_file_storage");
// server init
function ServerInit() {
    var srv = (0, express_1.default)();
    srv.use(function (req, res, next) {
        res.setHeader("X-Powered-By", "Java Spring");
        next();
    });
    srv.enable("trust proxy");
    srv.use((0, cors_1.default)({
        origin: config_1.default.get("origin"),
        credentials: true,
    }));
    srv.use(express_1.default.json());
    srv.use(express_1.default.urlencoded({ extended: true }));
    return srv;
}
exports.ServerInit = ServerInit;
// DB init
function DBInit() {
    return __awaiter(this, void 0, void 0, function () {
        var client, i, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    client = new client_1.PrismaClient();
                    i = 0;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client.$connect()];
                case 2:
                    _a.sent();
                    console.log("connected to db...");
                    return [2 /*return*/, client];
                case 3:
                    err_1 = _a.sent();
                    throw err_1;
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.DBInit = DBInit;
// Redis init
function RedisInit() {
    return __awaiter(this, void 0, void 0, function () {
        var store, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    store = (0, redis_1.createClient)({
                        url: "redis://localhost:6379",
                    });
                    return [4 /*yield*/, store.connect()];
                case 1:
                    _a.sent();
                    return [2 /*return*/, store];
                case 2:
                    err_2 = _a.sent();
                    throw err_2;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.RedisInit = RedisInit;
function RemoteFileStorageInit() {
    return new s3_file_storage_1.S3FileStorage(process.env.S3_BUCKET, process.env.ACCESS_KEY_ID, process.env.ACCESS_KEY_SECRET, process.env.S3_REGION);
}
exports.RemoteFileStorageInit = RemoteFileStorageInit;
function TimerInit() {
    return __awaiter(this, void 0, void 0, function () {
        var cronJob;
        return __generator(this, function (_a) {
            try {
                cronJob = node_cron_1.default.schedule("0 0 0 * * *", function () {
                    // perform db cleanup periodically.
                    console.info("cron job in background");
                });
                cronJob.start();
            }
            catch (err) {
                throw err;
            }
            return [2 /*return*/];
        });
    });
}
exports.TimerInit = TimerInit;
// Sink init
function SinkInit(app) {
    app.srv.use(function (req, res, next) {
        next(new herror_1.Herror("not found", status_codes_1.HerrorStatus.StatusNotFound));
    });
    app.srv.use(function (err, req, res, next) {
        console.log(err);
        var status = err.status || err.responseStatus.statusCode || 500;
        var message = err.message || err.responseStatus.message || "error";
        res.status(status);
        res.send({
            isError: true,
            status: status,
            message: message,
        });
    });
}
exports.SinkInit = SinkInit;
