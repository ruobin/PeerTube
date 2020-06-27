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
var video_1 = require("../../../models/video/video");
var url_1 = require("../url");
var utils_1 = require("./utils");
var audience_1 = require("../audience");
var send_create_1 = require("./send-create");
var send_follow_1 = require("./send-follow");
var send_like_1 = require("./send-like");
var send_announce_1 = require("./send-announce");
var logger_1 = require("../../../helpers/logger");
var send_dislike_1 = require("./send-dislike");
function sendUndoFollow(actorFollow, t) {
    return __awaiter(this, void 0, void 0, function () {
        var me, following, followUrl, undoUrl, followActivity, undoActivity;
        return __generator(this, function (_a) {
            me = actorFollow.ActorFollower;
            following = actorFollow.ActorFollowing;
            // Same server as ours
            if (!following.serverId)
                return [2 /*return*/];
            logger_1.logger.info('Creating job to send an unfollow request to %s.', following.url);
            followUrl = url_1.getActorFollowActivityPubUrl(me, following);
            undoUrl = url_1.getUndoActivityPubUrl(followUrl);
            followActivity = send_follow_1.buildFollowActivity(followUrl, me, following);
            undoActivity = undoActivityData(undoUrl, me, followActivity);
            t.afterCommit(function () { return utils_1.unicastTo(undoActivity, me, following.inboxUrl); });
            return [2 /*return*/];
        });
    });
}
exports.sendUndoFollow = sendUndoFollow;
function sendUndoAnnounce(byActor, videoShare, video, t) {
    return __awaiter(this, void 0, void 0, function () {
        var undoUrl, _a, announceActivity, actorsInvolvedInVideo, undoActivity, followersException;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    logger_1.logger.info('Creating job to undo announce %s.', videoShare.url);
                    undoUrl = url_1.getUndoActivityPubUrl(videoShare.url);
                    return [4 /*yield*/, send_announce_1.buildAnnounceWithVideoAudience(byActor, videoShare, video, t)];
                case 1:
                    _a = _b.sent(), announceActivity = _a.activity, actorsInvolvedInVideo = _a.actorsInvolvedInVideo;
                    undoActivity = undoActivityData(undoUrl, byActor, announceActivity);
                    followersException = [byActor];
                    return [2 /*return*/, utils_1.broadcastToFollowers(undoActivity, byActor, actorsInvolvedInVideo, t, followersException)];
            }
        });
    });
}
exports.sendUndoAnnounce = sendUndoAnnounce;
function sendUndoLike(byActor, video, t) {
    return __awaiter(this, void 0, void 0, function () {
        var likeUrl, likeActivity;
        return __generator(this, function (_a) {
            logger_1.logger.info('Creating job to undo a like of video %s.', video.url);
            likeUrl = url_1.getVideoLikeActivityPubUrl(byActor, video);
            likeActivity = send_like_1.buildLikeActivity(likeUrl, byActor, video);
            return [2 /*return*/, sendUndoVideoRelatedActivity({ byActor: byActor, video: video, url: likeUrl, activity: likeActivity, transaction: t })];
        });
    });
}
exports.sendUndoLike = sendUndoLike;
function sendUndoDislike(byActor, video, t) {
    return __awaiter(this, void 0, void 0, function () {
        var dislikeUrl, dislikeActivity;
        return __generator(this, function (_a) {
            logger_1.logger.info('Creating job to undo a dislike of video %s.', video.url);
            dislikeUrl = url_1.getVideoDislikeActivityPubUrl(byActor, video);
            dislikeActivity = send_dislike_1.buildDislikeActivity(dislikeUrl, byActor, video);
            return [2 /*return*/, sendUndoVideoRelatedActivity({ byActor: byActor, video: video, url: dislikeUrl, activity: dislikeActivity, transaction: t })];
        });
    });
}
exports.sendUndoDislike = sendUndoDislike;
function sendUndoCacheFile(byActor, redundancyModel, t) {
    return __awaiter(this, void 0, void 0, function () {
        var videoId, video, createActivity;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.info('Creating job to undo cache file %s.', redundancyModel.url);
                    videoId = redundancyModel.getVideo().id;
                    return [4 /*yield*/, video_1.VideoModel.loadAndPopulateAccountAndServerAndTags(videoId)];
                case 1:
                    video = _a.sent();
                    createActivity = send_create_1.buildCreateActivity(redundancyModel.url, byActor, redundancyModel.toActivityPubObject());
                    return [2 /*return*/, sendUndoVideoRelatedActivity({ byActor: byActor, video: video, url: redundancyModel.url, activity: createActivity, transaction: t })];
            }
        });
    });
}
exports.sendUndoCacheFile = sendUndoCacheFile;
// ---------------------------------------------------------------------------
function undoActivityData(url, byActor, object, audience) {
    if (!audience)
        audience = audience_1.getAudience(byActor);
    return audience_1.audiencify({
        type: 'Undo',
        id: url,
        actor: byActor.url,
        object: object
    }, audience);
}
function sendUndoVideoRelatedActivity(options) {
    return __awaiter(this, void 0, void 0, function () {
        var activityBuilder;
        return __generator(this, function (_a) {
            activityBuilder = function (audience) {
                var undoUrl = url_1.getUndoActivityPubUrl(options.url);
                return undoActivityData(undoUrl, options.byActor, options.activity, audience);
            };
            return [2 /*return*/, utils_1.sendVideoRelatedActivity(activityBuilder, options)];
        });
    });
}
