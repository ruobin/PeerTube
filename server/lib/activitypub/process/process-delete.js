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
var actor_1 = require("../../../models/activitypub/actor");
var video_1 = require("../../../models/video/video");
var video_comment_1 = require("../../../models/video/video-comment");
var utils_1 = require("../send/utils");
var video_playlist_1 = require("../../../models/video/video-playlist");
function processDeleteActivity(options) {
    return __awaiter(this, void 0, void 0, function () {
        var activity, byActor, objectUrl, byActorFull, _a, _b, videoCommentInstance, videoInstance, videoPlaylist;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    activity = options.activity, byActor = options.byActor;
                    objectUrl = typeof activity.object === 'string' ? activity.object : activity.object.id;
                    if (!(activity.actor === objectUrl)) return [3 /*break*/, 5];
                    return [4 /*yield*/, actor_1.ActorModel.loadByUrlAndPopulateAccountAndChannel(byActor.url)];
                case 1:
                    byActorFull = _c.sent();
                    if (!(byActorFull.type === 'Person')) return [3 /*break*/, 3];
                    if (!byActorFull.Account)
                        throw new Error('Actor ' + byActorFull.url + ' is a person but we cannot find it in database.');
                    _a = byActorFull.Account;
                    return [4 /*yield*/, byActorFull.Account.$get('Actor')];
                case 2:
                    _a.Actor = (_c.sent());
                    return [2 /*return*/, database_utils_1.retryTransactionWrapper(processDeleteAccount, byActorFull.Account)];
                case 3:
                    if (!(byActorFull.type === 'Group')) return [3 /*break*/, 5];
                    if (!byActorFull.VideoChannel)
                        throw new Error('Actor ' + byActorFull.url + ' is a group but we cannot find it in database.');
                    _b = byActorFull.VideoChannel;
                    return [4 /*yield*/, byActorFull.VideoChannel.$get('Actor')];
                case 4:
                    _b.Actor = (_c.sent());
                    return [2 /*return*/, database_utils_1.retryTransactionWrapper(processDeleteVideoChannel, byActorFull.VideoChannel)];
                case 5: return [4 /*yield*/, video_comment_1.VideoCommentModel.loadByUrlAndPopulateAccountAndVideo(objectUrl)];
                case 6:
                    videoCommentInstance = _c.sent();
                    if (videoCommentInstance) {
                        return [2 /*return*/, database_utils_1.retryTransactionWrapper(processDeleteVideoComment, byActor, videoCommentInstance, activity)];
                    }
                    return [4 /*yield*/, video_1.VideoModel.loadByUrlAndPopulateAccount(objectUrl)];
                case 7:
                    videoInstance = _c.sent();
                    if (videoInstance) {
                        if (videoInstance.isOwned())
                            throw new Error("Remote instance cannot delete owned video " + videoInstance.url + ".");
                        return [2 /*return*/, database_utils_1.retryTransactionWrapper(processDeleteVideo, byActor, videoInstance)];
                    }
                    return [4 /*yield*/, video_playlist_1.VideoPlaylistModel.loadByUrlAndPopulateAccount(objectUrl)];
                case 8:
                    videoPlaylist = _c.sent();
                    if (videoPlaylist) {
                        if (videoPlaylist.isOwned())
                            throw new Error("Remote instance cannot delete owned playlist " + videoPlaylist.url + ".");
                        return [2 /*return*/, database_utils_1.retryTransactionWrapper(processDeleteVideoPlaylist, byActor, videoPlaylist)];
                    }
                    return [2 /*return*/, undefined];
            }
        });
    });
}
exports.processDeleteActivity = processDeleteActivity;
// ---------------------------------------------------------------------------
function processDeleteVideo(actor, videoToDelete) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.debug('Removing remote video "%s".', videoToDelete.uuid);
                    return [4 /*yield*/, initializers_1.sequelizeTypescript.transaction(function (t) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (videoToDelete.VideoChannel.Account.Actor.id !== actor.id) {
                                            throw new Error('Account ' + actor.url + ' does not own video channel ' + videoToDelete.VideoChannel.Actor.url);
                                        }
                                        return [4 /*yield*/, videoToDelete.destroy({ transaction: t })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _a.sent();
                    logger_1.logger.info('Remote video with uuid %s removed.', videoToDelete.uuid);
                    return [2 /*return*/];
            }
        });
    });
}
function processDeleteVideoPlaylist(actor, playlistToDelete) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.debug('Removing remote video playlist "%s".', playlistToDelete.uuid);
                    return [4 /*yield*/, initializers_1.sequelizeTypescript.transaction(function (t) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (playlistToDelete.OwnerAccount.Actor.id !== actor.id) {
                                            throw new Error('Account ' + actor.url + ' does not own video playlist ' + playlistToDelete.url);
                                        }
                                        return [4 /*yield*/, playlistToDelete.destroy({ transaction: t })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _a.sent();
                    logger_1.logger.info('Remote video playlist with uuid %s removed.', playlistToDelete.uuid);
                    return [2 /*return*/];
            }
        });
    });
}
function processDeleteAccount(accountToRemove) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.debug('Removing remote account "%s".', accountToRemove.Actor.url);
                    return [4 /*yield*/, initializers_1.sequelizeTypescript.transaction(function (t) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, accountToRemove.destroy({ transaction: t })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _a.sent();
                    logger_1.logger.info('Remote account %s removed.', accountToRemove.Actor.url);
                    return [2 /*return*/];
            }
        });
    });
}
function processDeleteVideoChannel(videoChannelToRemove) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.debug('Removing remote video channel "%s".', videoChannelToRemove.Actor.url);
                    return [4 /*yield*/, initializers_1.sequelizeTypescript.transaction(function (t) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, videoChannelToRemove.destroy({ transaction: t })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _a.sent();
                    logger_1.logger.info('Remote video channel %s removed.', videoChannelToRemove.Actor.url);
                    return [2 /*return*/];
            }
        });
    });
}
function processDeleteVideoComment(byActor, videoComment, activity) {
    var _this = this;
    logger_1.logger.debug('Removing remote video comment "%s".', videoComment.url);
    return initializers_1.sequelizeTypescript.transaction(function (t) { return __awaiter(_this, void 0, void 0, function () {
        var exceptions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (byActor.Account.id !== videoComment.Account.id && byActor.Account.id !== videoComment.Video.VideoChannel.accountId) {
                        throw new Error("Account " + byActor.url + " does not own video comment " + videoComment.url + " or video " + videoComment.Video.url);
                    }
                    return [4 /*yield*/, videoComment.destroy({ transaction: t })];
                case 1:
                    _a.sent();
                    if (!videoComment.Video.isOwned()) return [3 /*break*/, 3];
                    exceptions = [byActor];
                    return [4 /*yield*/, utils_1.forwardVideoRelatedActivity(activity, t, exceptions, videoComment.Video)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    logger_1.logger.info('Remote video comment %s removed.', videoComment.url);
                    return [2 /*return*/];
            }
        });
    }); });
}
