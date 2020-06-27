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
var videos_1 = require("../../../../shared/models/videos");
var video_comment_1 = require("../../../models/video/video-comment");
var utils_1 = require("./utils");
var audience_1 = require("../audience");
var logger_1 = require("../../../helpers/logger");
var video_playlist_privacy_model_1 = require("../../../../shared/models/videos/playlist/video-playlist-privacy.model");
var utils_2 = require("../../../helpers/utils");
function sendCreateVideo(video, t) {
    return __awaiter(this, void 0, void 0, function () {
        var byActor, videoObject, audience, createActivity;
        return __generator(this, function (_a) {
            if (video.privacy === videos_1.VideoPrivacy.PRIVATE)
                return [2 /*return*/, undefined];
            logger_1.logger.info('Creating job to send video creation of %s.', video.url);
            byActor = video.VideoChannel.Account.Actor;
            videoObject = video.toActivityPubObject();
            audience = audience_1.getAudience(byActor, video.privacy === videos_1.VideoPrivacy.PUBLIC);
            createActivity = buildCreateActivity(video.url, byActor, videoObject, audience);
            return [2 /*return*/, utils_1.broadcastToFollowers(createActivity, byActor, [byActor], t)];
        });
    });
}
exports.sendCreateVideo = sendCreateVideo;
function sendCreateCacheFile(byActor, video, fileRedundancy) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            logger_1.logger.info('Creating job to send file cache of %s.', fileRedundancy.url);
            return [2 /*return*/, sendVideoRelatedCreateActivity({
                    byActor: byActor,
                    video: video,
                    url: fileRedundancy.url,
                    object: fileRedundancy.toActivityPubObject()
                })];
        });
    });
}
exports.sendCreateCacheFile = sendCreateCacheFile;
function sendCreateVideoPlaylist(playlist, t) {
    return __awaiter(this, void 0, void 0, function () {
        var byActor, audience, object, createActivity, serverActor, toFollowersOf;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (playlist.privacy === video_playlist_privacy_model_1.VideoPlaylistPrivacy.PRIVATE)
                        return [2 /*return*/, undefined];
                    logger_1.logger.info('Creating job to send create video playlist of %s.', playlist.url);
                    byActor = playlist.OwnerAccount.Actor;
                    audience = audience_1.getAudience(byActor, playlist.privacy === video_playlist_privacy_model_1.VideoPlaylistPrivacy.PUBLIC);
                    return [4 /*yield*/, playlist.toActivityPubObject(null, t)];
                case 1:
                    object = _a.sent();
                    createActivity = buildCreateActivity(playlist.url, byActor, object, audience);
                    return [4 /*yield*/, utils_2.getServerActor()];
                case 2:
                    serverActor = _a.sent();
                    toFollowersOf = [byActor, serverActor];
                    if (playlist.VideoChannel)
                        toFollowersOf.push(playlist.VideoChannel.Actor);
                    return [2 /*return*/, utils_1.broadcastToFollowers(createActivity, byActor, toFollowersOf, t)];
            }
        });
    });
}
exports.sendCreateVideoPlaylist = sendCreateVideoPlaylist;
function sendCreateVideoComment(comment, t) {
    return __awaiter(this, void 0, void 0, function () {
        var isOrigin, byActor, threadParentComments, commentObject, actorsInvolvedInComment, parentsCommentActors, audience, createActivity, actorsException;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.info('Creating job to send comment %s.', comment.url);
                    isOrigin = comment.Video.isOwned();
                    byActor = comment.Account.Actor;
                    return [4 /*yield*/, video_comment_1.VideoCommentModel.listThreadParentComments(comment, t)];
                case 1:
                    threadParentComments = _a.sent();
                    commentObject = comment.toActivityPubObject(threadParentComments);
                    return [4 /*yield*/, audience_1.getActorsInvolvedInVideo(comment.Video, t)
                        // Add the actor that commented too
                    ];
                case 2:
                    actorsInvolvedInComment = _a.sent();
                    // Add the actor that commented too
                    actorsInvolvedInComment.push(byActor);
                    parentsCommentActors = threadParentComments.map(function (c) { return c.Account.Actor; });
                    if (isOrigin) {
                        audience = audience_1.getVideoCommentAudience(comment, threadParentComments, actorsInvolvedInComment, isOrigin);
                    }
                    else {
                        audience = audience_1.getAudienceFromFollowersOf(actorsInvolvedInComment.concat(parentsCommentActors));
                    }
                    createActivity = buildCreateActivity(comment.url, byActor, commentObject, audience);
                    actorsException = [byActor];
                    return [4 /*yield*/, utils_1.broadcastToActors(createActivity, byActor, parentsCommentActors, t, actorsException)
                        // Broadcast to our followers
                    ];
                case 3:
                    _a.sent();
                    // Broadcast to our followers
                    return [4 /*yield*/, utils_1.broadcastToFollowers(createActivity, byActor, [byActor], t)
                        // Send to actors involved in the comment
                    ];
                case 4:
                    // Broadcast to our followers
                    _a.sent();
                    // Send to actors involved in the comment
                    if (isOrigin)
                        return [2 /*return*/, utils_1.broadcastToFollowers(createActivity, byActor, actorsInvolvedInComment, t, actorsException)
                            // Send to origin
                        ];
                    // Send to origin
                    t.afterCommit(function () { return utils_1.unicastTo(createActivity, byActor, comment.Video.VideoChannel.Account.Actor.sharedInboxUrl); });
                    return [2 /*return*/];
            }
        });
    });
}
exports.sendCreateVideoComment = sendCreateVideoComment;
function buildCreateActivity(url, byActor, object, audience) {
    if (!audience)
        audience = audience_1.getAudience(byActor);
    return audience_1.audiencify({
        type: 'Create',
        id: url + '/activity',
        actor: byActor.url,
        object: audience_1.audiencify(object, audience)
    }, audience);
}
exports.buildCreateActivity = buildCreateActivity;
// ---------------------------------------------------------------------------
function sendVideoRelatedCreateActivity(options) {
    return __awaiter(this, void 0, void 0, function () {
        var activityBuilder;
        return __generator(this, function (_a) {
            activityBuilder = function (audience) {
                return buildCreateActivity(options.url, options.byActor, options.object, audience);
            };
            return [2 /*return*/, utils_1.sendVideoRelatedActivity(activityBuilder, options)];
        });
    });
}
