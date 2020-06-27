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
var account_video_rate_1 = require("../../../models/account/account-video-rate");
var actor_1 = require("../../../models/activitypub/actor");
var actor_follow_1 = require("../../../models/activitypub/actor-follow");
var utils_1 = require("../send/utils");
var videos_1 = require("../videos");
var video_share_1 = require("../../../models/video/video-share");
var video_redundancy_1 = require("../../../models/redundancy/video-redundancy");
function processUndoActivity(options) {
    return __awaiter(this, void 0, void 0, function () {
        var activity, byActor, activityToUndo;
        return __generator(this, function (_a) {
            activity = options.activity, byActor = options.byActor;
            activityToUndo = activity.object;
            if (activityToUndo.type === 'Like') {
                return [2 /*return*/, database_utils_1.retryTransactionWrapper(processUndoLike, byActor, activity)];
            }
            if (activityToUndo.type === 'Create') {
                if (activityToUndo.object.type === 'Dislike') {
                    return [2 /*return*/, database_utils_1.retryTransactionWrapper(processUndoDislike, byActor, activity)];
                }
                else if (activityToUndo.object.type === 'CacheFile') {
                    return [2 /*return*/, database_utils_1.retryTransactionWrapper(processUndoCacheFile, byActor, activity)];
                }
            }
            if (activityToUndo.type === 'Dislike') {
                return [2 /*return*/, database_utils_1.retryTransactionWrapper(processUndoDislike, byActor, activity)];
            }
            if (activityToUndo.type === 'Follow') {
                return [2 /*return*/, database_utils_1.retryTransactionWrapper(processUndoFollow, byActor, activityToUndo)];
            }
            if (activityToUndo.type === 'Announce') {
                return [2 /*return*/, database_utils_1.retryTransactionWrapper(processUndoAnnounce, byActor, activityToUndo)];
            }
            logger_1.logger.warn('Unknown activity object type %s -> %s when undo activity.', activityToUndo.type, { activity: activity.id });
            return [2 /*return*/, undefined];
        });
    });
}
exports.processUndoActivity = processUndoActivity;
// ---------------------------------------------------------------------------
function processUndoLike(byActor, activity) {
    return __awaiter(this, void 0, void 0, function () {
        var likeActivity, video;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    likeActivity = activity.object;
                    return [4 /*yield*/, videos_1.getOrCreateVideoAndAccountAndChannel({ videoObject: likeActivity.object })];
                case 1:
                    video = (_a.sent()).video;
                    return [2 /*return*/, initializers_1.sequelizeTypescript.transaction(function (t) { return __awaiter(_this, void 0, void 0, function () {
                            var rate, exceptions;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!byActor.Account)
                                            throw new Error('Unknown account ' + byActor.url);
                                        return [4 /*yield*/, account_video_rate_1.AccountVideoRateModel.loadByAccountAndVideoOrUrl(byActor.Account.id, video.id, likeActivity.id, t)];
                                    case 1:
                                        rate = _a.sent();
                                        if (!rate || rate.type !== 'like')
                                            throw new Error("Unknown like by account " + byActor.Account.id + " for video " + video.id + ".");
                                        return [4 /*yield*/, rate.destroy({ transaction: t })];
                                    case 2:
                                        _a.sent();
                                        return [4 /*yield*/, video.decrement('likes', { transaction: t })];
                                    case 3:
                                        _a.sent();
                                        if (!video.isOwned()) return [3 /*break*/, 5];
                                        exceptions = [byActor];
                                        return [4 /*yield*/, utils_1.forwardVideoRelatedActivity(activity, t, exceptions, video)];
                                    case 4:
                                        _a.sent();
                                        _a.label = 5;
                                    case 5: return [2 /*return*/];
                                }
                            });
                        }); })];
            }
        });
    });
}
function processUndoDislike(byActor, activity) {
    return __awaiter(this, void 0, void 0, function () {
        var dislike, video;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dislike = activity.object.type === 'Dislike'
                        ? activity.object
                        : activity.object.object;
                    return [4 /*yield*/, videos_1.getOrCreateVideoAndAccountAndChannel({ videoObject: dislike.object })];
                case 1:
                    video = (_a.sent()).video;
                    return [2 /*return*/, initializers_1.sequelizeTypescript.transaction(function (t) { return __awaiter(_this, void 0, void 0, function () {
                            var rate, exceptions;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!byActor.Account)
                                            throw new Error('Unknown account ' + byActor.url);
                                        return [4 /*yield*/, account_video_rate_1.AccountVideoRateModel.loadByAccountAndVideoOrUrl(byActor.Account.id, video.id, dislike.id, t)];
                                    case 1:
                                        rate = _a.sent();
                                        if (!rate || rate.type !== 'dislike')
                                            throw new Error("Unknown dislike by account " + byActor.Account.id + " for video " + video.id + ".");
                                        return [4 /*yield*/, rate.destroy({ transaction: t })];
                                    case 2:
                                        _a.sent();
                                        return [4 /*yield*/, video.decrement('dislikes', { transaction: t })];
                                    case 3:
                                        _a.sent();
                                        if (!video.isOwned()) return [3 /*break*/, 5];
                                        exceptions = [byActor];
                                        return [4 /*yield*/, utils_1.forwardVideoRelatedActivity(activity, t, exceptions, video)];
                                    case 4:
                                        _a.sent();
                                        _a.label = 5;
                                    case 5: return [2 /*return*/];
                                }
                            });
                        }); })];
            }
        });
    });
}
function processUndoCacheFile(byActor, activity) {
    return __awaiter(this, void 0, void 0, function () {
        var cacheFileObject, video;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cacheFileObject = activity.object.object;
                    return [4 /*yield*/, videos_1.getOrCreateVideoAndAccountAndChannel({ videoObject: cacheFileObject.object })];
                case 1:
                    video = (_a.sent()).video;
                    return [2 /*return*/, initializers_1.sequelizeTypescript.transaction(function (t) { return __awaiter(_this, void 0, void 0, function () {
                            var cacheFile, exceptions;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, video_redundancy_1.VideoRedundancyModel.loadByUrl(cacheFileObject.id)];
                                    case 1:
                                        cacheFile = _a.sent();
                                        if (!cacheFile) {
                                            logger_1.logger.debug('Cannot undo unknown video cache %s.', cacheFileObject.id);
                                            return [2 /*return*/];
                                        }
                                        if (cacheFile.actorId !== byActor.id)
                                            throw new Error('Cannot delete redundancy ' + cacheFile.url + ' of another actor.');
                                        return [4 /*yield*/, cacheFile.destroy()];
                                    case 2:
                                        _a.sent();
                                        if (!video.isOwned()) return [3 /*break*/, 4];
                                        exceptions = [byActor];
                                        return [4 /*yield*/, utils_1.forwardVideoRelatedActivity(activity, t, exceptions, video)];
                                    case 3:
                                        _a.sent();
                                        _a.label = 4;
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); })];
            }
        });
    });
}
function processUndoFollow(follower, followActivity) {
    var _this = this;
    return initializers_1.sequelizeTypescript.transaction(function (t) { return __awaiter(_this, void 0, void 0, function () {
        var following, actorFollow;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, actor_1.ActorModel.loadByUrlAndPopulateAccountAndChannel(followActivity.object, t)];
                case 1:
                    following = _a.sent();
                    return [4 /*yield*/, actor_follow_1.ActorFollowModel.loadByActorAndTarget(follower.id, following.id, t)];
                case 2:
                    actorFollow = _a.sent();
                    if (!actorFollow)
                        throw new Error("'Unknown actor follow " + follower.id + " -> " + following.id + ".");
                    return [4 /*yield*/, actorFollow.destroy({ transaction: t })];
                case 3:
                    _a.sent();
                    return [2 /*return*/, undefined];
            }
        });
    }); });
}
function processUndoAnnounce(byActor, announceActivity) {
    var _this = this;
    return initializers_1.sequelizeTypescript.transaction(function (t) { return __awaiter(_this, void 0, void 0, function () {
        var share, exceptions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, video_share_1.VideoShareModel.loadByUrl(announceActivity.id, t)];
                case 1:
                    share = _a.sent();
                    if (!share)
                        throw new Error("Unknown video share " + announceActivity.id + ".");
                    if (share.actorId !== byActor.id)
                        throw new Error(share.url + " is not shared by " + byActor.url + ".");
                    return [4 /*yield*/, share.destroy({ transaction: t })];
                case 2:
                    _a.sent();
                    if (!share.Video.isOwned()) return [3 /*break*/, 4];
                    exceptions = [byActor];
                    return [4 /*yield*/, utils_1.forwardVideoRelatedActivity(announceActivity, t, exceptions, share.Video)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    }); });
}
