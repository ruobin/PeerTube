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
var database_utils_1 = require("../../../helpers/database-utils");
var logger_1 = require("../../../helpers/logger");
var initializers_1 = require("../../../initializers");
var video_comments_1 = require("../video-comments");
var videos_1 = require("../videos");
var utils_1 = require("../send/utils");
var cache_file_1 = require("../cache-file");
var notifier_1 = require("../../notifier");
var playlist_1 = require("../playlist");
function processCreateActivity(options) {
    return __awaiter(this, void 0, void 0, function () {
        var activity, byActor, notify, activityObject, activityType;
        return __generator(this, function (_a) {
            activity = options.activity, byActor = options.byActor;
            notify = options.fromFetch !== true;
            activityObject = activity.object;
            activityType = activityObject.type;
            if (activityType === 'Video') {
                return [2 /*return*/, processCreateVideo(activity, notify)];
            }
            if (activityType === 'Note') {
                return [2 /*return*/, database_utils_1.retryTransactionWrapper(processCreateVideoComment, activity, byActor, notify)];
            }
            if (activityType === 'CacheFile') {
                return [2 /*return*/, database_utils_1.retryTransactionWrapper(processCreateCacheFile, activity, byActor)];
            }
            if (activityType === 'Playlist') {
                return [2 /*return*/, database_utils_1.retryTransactionWrapper(processCreatePlaylist, activity, byActor)];
            }
            logger_1.logger.warn('Unknown activity object type %s when creating activity.', activityType, { activity: activity.id });
            return [2 /*return*/, Promise.resolve(undefined)];
        });
    });
}
exports.processCreateActivity = processCreateActivity;
// ---------------------------------------------------------------------------
function processCreateVideo(activity, notify) {
    return __awaiter(this, void 0, void 0, function () {
        var videoToCreateData, _a, video, created;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    videoToCreateData = activity.object;
                    return [4 /*yield*/, videos_1.getOrCreateVideoAndAccountAndChannel({ videoObject: videoToCreateData })];
                case 1:
                    _a = _b.sent(), video = _a.video, created = _a.created;
                    if (created && notify)
                        notifier_1.Notifier.Instance.notifyOnNewVideoIfNeeded(video);
                    return [2 /*return*/, video];
            }
        });
    });
}
function processCreateCacheFile(activity, byActor) {
    return __awaiter(this, void 0, void 0, function () {
        var cacheFile, video, exceptions;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cacheFile = activity.object;
                    return [4 /*yield*/, videos_1.getOrCreateVideoAndAccountAndChannel({ videoObject: cacheFile.object })];
                case 1:
                    video = (_a.sent()).video;
                    return [4 /*yield*/, initializers_1.sequelizeTypescript.transaction(function (t) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, cache_file_1.createOrUpdateCacheFile(cacheFile, video, byActor, t)];
                            });
                        }); })];
                case 2:
                    _a.sent();
                    if (!video.isOwned()) return [3 /*break*/, 4];
                    exceptions = [byActor];
                    return [4 /*yield*/, utils_1.forwardVideoRelatedActivity(activity, undefined, exceptions, video)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function processCreateVideoComment(activity, byActor, notify) {
    return __awaiter(this, void 0, void 0, function () {
        var commentObject, byAccount, video, created, comment, resolveThreadResult, err_1, exceptions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    commentObject = activity.object;
                    byAccount = byActor.Account;
                    if (!byAccount)
                        throw new Error('Cannot create video comment with the non account actor ' + byActor.url);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, video_comments_1.resolveThread({ url: commentObject.id, isVideo: false })];
                case 2:
                    resolveThreadResult = _a.sent();
                    video = resolveThreadResult.video;
                    created = resolveThreadResult.commentCreated;
                    comment = resolveThreadResult.comment;
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    logger_1.logger.debug('Cannot process video comment because we could not resolve thread %s. Maybe it was not a video thread, so skip it.', commentObject.inReplyTo, { err: err_1 });
                    return [2 /*return*/];
                case 4:
                    if (!(video.isOwned() && created === true)) return [3 /*break*/, 6];
                    exceptions = [byActor];
                    return [4 /*yield*/, utils_1.forwardVideoRelatedActivity(activity, undefined, exceptions, video)];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6:
                    if (created && notify)
                        notifier_1.Notifier.Instance.notifyOnNewComment(comment);
                    return [2 /*return*/];
            }
        });
    });
}
function processCreatePlaylist(activity, byActor) {
    return __awaiter(this, void 0, void 0, function () {
        var playlistObject, byAccount;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    playlistObject = activity.object;
                    byAccount = byActor.Account;
                    if (!byAccount)
                        throw new Error('Cannot create video playlist with the non account actor ' + byActor.url);
                    return [4 /*yield*/, playlist_1.createOrUpdateVideoPlaylist(playlistObject, byAccount, activity.to)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
