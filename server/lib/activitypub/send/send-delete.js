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
var video_comment_1 = require("../../../models/video/video-comment");
var video_share_1 = require("../../../models/video/video-share");
var url_1 = require("../url");
var utils_1 = require("./utils");
var audience_1 = require("../audience");
var logger_1 = require("../../../helpers/logger");
var utils_2 = require("../../../helpers/utils");
function sendDeleteVideo(video, transaction) {
    return __awaiter(this, void 0, void 0, function () {
        var byActor, activityBuilder;
        return __generator(this, function (_a) {
            logger_1.logger.info('Creating job to broadcast delete of video %s.', video.url);
            byActor = video.VideoChannel.Account.Actor;
            activityBuilder = function (audience) {
                var url = url_1.getDeleteActivityPubUrl(video.url);
                return buildDeleteActivity(url, video.url, byActor, audience);
            };
            return [2 /*return*/, utils_1.sendVideoRelatedActivity(activityBuilder, { byActor: byActor, video: video, transaction: transaction })];
        });
    });
}
exports.sendDeleteVideo = sendDeleteVideo;
function sendDeleteActor(byActor, t) {
    return __awaiter(this, void 0, void 0, function () {
        var url, activity, actorsInvolved, serverActor;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.info('Creating job to broadcast delete of actor %s.', byActor.url);
                    url = url_1.getDeleteActivityPubUrl(byActor.url);
                    activity = buildDeleteActivity(url, byActor.url, byActor);
                    return [4 /*yield*/, video_share_1.VideoShareModel.loadActorsWhoSharedVideosOf(byActor.id, t)
                        // In case the actor did not have any videos
                    ];
                case 1:
                    actorsInvolved = _a.sent();
                    return [4 /*yield*/, utils_2.getServerActor()];
                case 2:
                    serverActor = _a.sent();
                    actorsInvolved.push(serverActor);
                    actorsInvolved.push(byActor);
                    return [2 /*return*/, utils_1.broadcastToFollowers(activity, byActor, actorsInvolved, t)];
            }
        });
    });
}
exports.sendDeleteActor = sendDeleteActor;
function sendDeleteVideoComment(videoComment, t) {
    return __awaiter(this, void 0, void 0, function () {
        var isVideoOrigin, url, byActor, threadParentComments, actorsInvolvedInComment, audience, activity, actorsException;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.info('Creating job to send delete of comment %s.', videoComment.url);
                    isVideoOrigin = videoComment.Video.isOwned();
                    url = url_1.getDeleteActivityPubUrl(videoComment.url);
                    byActor = videoComment.isOwned()
                        ? videoComment.Account.Actor
                        : videoComment.Video.VideoChannel.Account.Actor;
                    return [4 /*yield*/, video_comment_1.VideoCommentModel.listThreadParentComments(videoComment, t)];
                case 1:
                    threadParentComments = _a.sent();
                    return [4 /*yield*/, audience_1.getActorsInvolvedInVideo(videoComment.Video, t)];
                case 2:
                    actorsInvolvedInComment = _a.sent();
                    actorsInvolvedInComment.push(byActor); // Add the actor that commented the video
                    audience = audience_1.getVideoCommentAudience(videoComment, threadParentComments, actorsInvolvedInComment, isVideoOrigin);
                    activity = buildDeleteActivity(url, videoComment.url, byActor, audience);
                    actorsException = [byActor];
                    return [4 /*yield*/, utils_1.broadcastToActors(activity, byActor, threadParentComments.map(function (c) { return c.Account.Actor; }), t, actorsException)
                        // Broadcast to our followers
                    ];
                case 3:
                    _a.sent();
                    // Broadcast to our followers
                    return [4 /*yield*/, utils_1.broadcastToFollowers(activity, byActor, [byActor], t)
                        // Send to actors involved in the comment
                    ];
                case 4:
                    // Broadcast to our followers
                    _a.sent();
                    // Send to actors involved in the comment
                    if (isVideoOrigin)
                        return [2 /*return*/, utils_1.broadcastToFollowers(activity, byActor, actorsInvolvedInComment, t, actorsException)
                            // Send to origin
                        ];
                    // Send to origin
                    t.afterCommit(function () { return utils_1.unicastTo(activity, byActor, videoComment.Video.VideoChannel.Account.Actor.sharedInboxUrl); });
                    return [2 /*return*/];
            }
        });
    });
}
exports.sendDeleteVideoComment = sendDeleteVideoComment;
function sendDeleteVideoPlaylist(videoPlaylist, t) {
    return __awaiter(this, void 0, void 0, function () {
        var byActor, url, activity, serverActor, toFollowersOf;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.info('Creating job to send delete of playlist %s.', videoPlaylist.url);
                    byActor = videoPlaylist.OwnerAccount.Actor;
                    url = url_1.getDeleteActivityPubUrl(videoPlaylist.url);
                    activity = buildDeleteActivity(url, videoPlaylist.url, byActor);
                    return [4 /*yield*/, utils_2.getServerActor()];
                case 1:
                    serverActor = _a.sent();
                    toFollowersOf = [byActor, serverActor];
                    if (videoPlaylist.VideoChannel)
                        toFollowersOf.push(videoPlaylist.VideoChannel.Actor);
                    return [2 /*return*/, utils_1.broadcastToFollowers(activity, byActor, toFollowersOf, t)];
            }
        });
    });
}
exports.sendDeleteVideoPlaylist = sendDeleteVideoPlaylist;
// ---------------------------------------------------------------------------
function buildDeleteActivity(url, object, byActor, audience) {
    var activity = {
        type: 'Delete',
        id: url,
        actor: byActor.url,
        object: object
    };
    if (audience)
        return audience_1.audiencify(activity, audience);
    return activity;
}
