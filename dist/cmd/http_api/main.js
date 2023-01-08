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
var notification_manager_1 = __importDefault(require("../../internal/notification_manager/notification_manager"));
var auth_manager_1 = __importDefault(require("../../internal/auth_manager/auth_manager"));
var profile_manager_1 = __importDefault(require("../../internal/profile_manager/profile_manager"));
var handler_1 = __importDefault(require("./handler"));
var init_1 = require("./init");
var types_1 = require("./types");
var redis_1 = __importDefault(require("../../pkg/kv_store/redis"));
var image_resolver_1 = require("../../pkg/image_resolver/image_resolver_");
var local_file_storage_1 = require("../../pkg/file_storage/local_file_storage");
var like_manager_1 = __importDefault(require("../../internal/like_manager/like_manager"));
var post_manager_1 = __importDefault(require("../../internal/post_manager/post_manager"));
var comment_manager_1 = __importDefault(require("../../internal/comment_manager/comment_manager"));
var network_manager_1 = __importDefault(require("../../internal/network_manager/network_manager"));
var misc_manager_1 = __importDefault(require("../../internal/misc_manager/misc_manager"));
var explore_manager_1 = __importDefault(require("../../internal/explore_manager/explore_manager"));
function Init() {
    return __awaiter(this, void 0, void 0, function () {
        var srv, db, r, redis, imageResolver, localFileStorage, remoteFileStorage, notificationManager, authManager, profileManager, postManager, likeManager, commentManager, networkManager, miscManager, exploreManager, app;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    srv = (0, init_1.ServerInit)();
                    return [4 /*yield*/, (0, init_1.DBInit)()];
                case 1:
                    db = _a.sent();
                    return [4 /*yield*/, (0, init_1.RedisInit)()];
                case 2:
                    r = (_a.sent());
                    redis = new redis_1.default(r);
                    imageResolver = new image_resolver_1.ImageResolver({ h: 400, w: 400 }, "jpg");
                    localFileStorage = new local_file_storage_1.LocalFileStorage();
                    remoteFileStorage = (0, init_1.RemoteFileStorageInit)();
                    notificationManager = new notification_manager_1.default(db);
                    authManager = new auth_manager_1.default(db, redis);
                    profileManager = new profile_manager_1.default(db, imageResolver, remoteFileStorage, redis);
                    postManager = new post_manager_1.default(db, imageResolver, remoteFileStorage, redis);
                    likeManager = new like_manager_1.default(db, redis, notificationManager);
                    commentManager = new comment_manager_1.default(db, redis, notificationManager);
                    networkManager = new network_manager_1.default(db);
                    miscManager = new misc_manager_1.default(db, imageResolver, remoteFileStorage);
                    exploreManager = new explore_manager_1.default(db, imageResolver, remoteFileStorage);
                    app = new types_1.App(srv, authManager, notificationManager, profileManager, postManager, likeManager, commentManager, networkManager, miscManager, exploreManager, redis, db, imageResolver, localFileStorage, remoteFileStorage);
                    (0, handler_1.default)(app);
                    (0, init_1.SinkInit)(app);
                    return [2 /*return*/, app];
            }
        });
    });
}
//Listening
Init()
    .then(function (app) {
    app.srv.listen(4000, function () {
        console.log("Node app running at ".concat(4000));
    });
})
    .catch(function (err) {
    console.log(err);
});
