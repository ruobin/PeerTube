"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
exports.__esModule = true;
var shared_1 = require("../../../../shared");
var database_utils_1 = require("../../../helpers/database-utils");
var logger_1 = require("../../../helpers/logger");
var initializers_1 = require("../../../initializers");
var video_abuse_1 = require("../../../models/video/video-abuse");
var videos_1 = require("../videos");
var notifier_1 = require("../../notifier");
var activitypub_1 = require("../../../helpers/activitypub");
function processFlagActivity(options) {
    return __awaiter(this, void 0, void 0, function () {
        var activity, byActor;
        return __generator(this, function (_a) {
            activity = options.activity, byActor = options.byActor;
            return [2 /*return*/, database_utils_1.retryTransactionWrapper(processCreateVideoAbuse, activity, byActor)];
        });
    });
}
exports.processFlagActivity = processFlagActivity;
// ---------------------------------------------------------------------------
function processCreateVideoAbuse(activity, byActor) {
    return __awaiter(this, void 0, void 0, function () {
        var flag, account, video, videoAbuse;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    flag = activity.type === 'Flag' ? activity : activity.object;
                    logger_1.logger.debug('Reporting remote abuse for video %s.', activitypub_1.getAPId(flag.object));
                    account = byActor.Account;
                    if (!account)
                        throw new Error('Cannot create video abuse with the non account actor ' + byActor.url);
                    return [4 /*yield*/, videos_1.getOrCreateVideoAndAccountAndChannel({ videoObject: flag.object })];
                case 1:
                    video = (_a.sent()).video;
                    return [4 /*yield*/, initializers_1.sequelizeTypescript.transaction(function (t) { return __awaiter(_this, void 0, void 0, function () {
                            var videoAbuseData, videoAbuseInstance;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        videoAbuseData = {
                                            reporterAccountId: account.id,
                                            reason: flag.content,
                                            videoId: video.id,
                                            state: shared_1.VideoAbuseState.PENDING
                                        };
                                        return [4 /*yield*/, video_abuse_1.VideoAbuseModel.create(videoAbuseData, { transaction: t })];
                                    case 1:
                                        videoAbuseInstance = _a.sent();
                                        videoAbuseInstance.Video = video;
                                        logger_1.logger.info('Remote abuse for video uuid %s created', flag.object);
                                        return [2 /*return*/, videoAbuseInstance];
                                }
                            });
                        }); })];
                case 2:
                    videoAbuse = _a.sent();
                    notifier_1.Notifier.Instance.notifyOnNewVideoAbuse(videoAbuse);
                    return [2 /*return*/];
            }
        });
    });
}
