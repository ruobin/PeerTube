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
var account_1 = require("../../../models/account/account");
var video_1 = require("../../../models/video/video");
var video_share_1 = require("../../../models/video/video-share");
var url_1 = require("../url");
var utils_1 = require("./utils");
var audience_1 = require("../audience");
var logger_1 = require("../../../helpers/logger");
var video_playlist_privacy_model_1 = require("../../../../shared/models/videos/playlist/video-playlist-privacy.model");
var utils_2 = require("../../../helpers/utils");
function sendUpdateVideo(video, t, overrodeByActor) {
    return __awaiter(this, void 0, void 0, function () {
        var byActor, url, _a, videoObject, audience, updateActivity, actorsInvolved;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (video.privacy === videos_1.VideoPrivacy.PRIVATE)
                        return [2 /*return*/, undefined];
                    logger_1.logger.info('Creating job to update video %s.', video.url);
                    byActor = overrodeByActor ? overrodeByActor : video.VideoChannel.Account.Actor;
                    url = url_1.getUpdateActivityPubUrl(video.url, video.updatedAt.toISOString());
                    if (!!video.VideoCaptions) return [3 /*break*/, 2];
                    _a = video;
                    return [4 /*yield*/, video.$get('VideoCaptions', { transaction: t })];
                case 1:
                    _a.VideoCaptions = (_b.sent());
                    _b.label = 2;
                case 2:
                    videoObject = video.toActivityPubObject();
                    audience = audience_1.getAudience(byActor, video.privacy === videos_1.VideoPrivacy.PUBLIC);
                    updateActivity = buildUpdateActivity(url, byActor, videoObject, audience);
                    return [4 /*yield*/, audience_1.getActorsInvolvedInVideo(video, t)];
                case 3:
                    actorsInvolved = _b.sent();
                    if (overrodeByActor)
                        actorsInvolved.push(overrodeByActor);
                    return [2 /*return*/, utils_1.broadcastToFollowers(updateActivity, byActor, actorsInvolved, t)];
            }
        });
    });
}
exports.sendUpdateVideo = sendUpdateVideo;
function sendUpdateActor(accountOrChannel, t) {
    return __awaiter(this, void 0, void 0, function () {
        var byActor, url, accountOrChannelObject, audience, updateActivity, actorsInvolved;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    byActor = accountOrChannel.Actor;
                    logger_1.logger.info('Creating job to update actor %s.', byActor.url);
                    url = url_1.getUpdateActivityPubUrl(byActor.url, byActor.updatedAt.toISOString());
                    accountOrChannelObject = accountOrChannel.toActivityPubObject();
                    audience = audience_1.getAudience(byActor);
                    updateActivity = buildUpdateActivity(url, byActor, accountOrChannelObject, audience);
                    if (!(accountOrChannel instanceof account_1.AccountModel)) return [3 /*break*/, 2];
                    return [4 /*yield*/, video_share_1.VideoShareModel.loadActorsWhoSharedVideosOf(byActor.id, t)];
                case 1:
                    // Actors that shared my videos are involved too
                    actorsInvolved = _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, video_share_1.VideoShareModel.loadActorsByVideoChannel(accountOrChannel.id, t)];
                case 3:
                    // Actors that shared videos of my channel are involved too
                    actorsInvolved = _a.sent();
                    _a.label = 4;
                case 4:
                    actorsInvolved.push(byActor);
                    return [2 /*return*/, utils_1.broadcastToFollowers(updateActivity, byActor, actorsInvolved, t)];
            }
        });
    });
}
exports.sendUpdateActor = sendUpdateActor;
function sendUpdateCacheFile(byActor, redundancyModel) {
    return __awaiter(this, void 0, void 0, function () {
        var video, activityBuilder;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.info('Creating job to update cache file %s.', redundancyModel.url);
                    return [4 /*yield*/, video_1.VideoModel.loadAndPopulateAccountAndServerAndTags(redundancyModel.getVideo().id)];
                case 1:
                    video = _a.sent();
                    activityBuilder = function (audience) {
                        var redundancyObject = redundancyModel.toActivityPubObject();
                        var url = url_1.getUpdateActivityPubUrl(redundancyModel.url, redundancyModel.updatedAt.toISOString());
                        return buildUpdateActivity(url, byActor, redundancyObject, audience);
                    };
                    return [2 /*return*/, utils_1.sendVideoRelatedActivity(activityBuilder, { byActor: byActor, video: video })];
            }
        });
    });
}
exports.sendUpdateCacheFile = sendUpdateCacheFile;
function sendUpdateVideoPlaylist(videoPlaylist, t) {
    return __awaiter(this, void 0, void 0, function () {
        var byActor, url, object, audience, updateActivity, serverActor, toFollowersOf;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (videoPlaylist.privacy === video_playlist_privacy_model_1.VideoPlaylistPrivacy.PRIVATE)
                        return [2 /*return*/, undefined];
                    byActor = videoPlaylist.OwnerAccount.Actor;
                    logger_1.logger.info('Creating job to update video playlist %s.', videoPlaylist.url);
                    url = url_1.getUpdateActivityPubUrl(videoPlaylist.url, videoPlaylist.updatedAt.toISOString());
                    return [4 /*yield*/, videoPlaylist.toActivityPubObject(null, t)];
                case 1:
                    object = _a.sent();
                    audience = audience_1.getAudience(byActor, videoPlaylist.privacy === video_playlist_privacy_model_1.VideoPlaylistPrivacy.PUBLIC);
                    updateActivity = buildUpdateActivity(url, byActor, object, audience);
                    return [4 /*yield*/, utils_2.getServerActor()];
                case 2:
                    serverActor = _a.sent();
                    toFollowersOf = [byActor, serverActor];
                    if (videoPlaylist.VideoChannel)
                        toFollowersOf.push(videoPlaylist.VideoChannel.Actor);
                    return [2 /*return*/, utils_1.broadcastToFollowers(updateActivity, byActor, toFollowersOf, t)];
            }
        });
    });
}
exports.sendUpdateVideoPlaylist = sendUpdateVideoPlaylist;
// ---------------------------------------------------------------------------
function buildUpdateActivity(url, byActor, object, audience) {
    if (!audience)
        audience = audience_1.getAudience(byActor);
    return audience_1.audiencify({
        type: 'Update',
        id: url,
        actor: byActor.url,
        object: audience_1.audiencify(object, audience)
    }, audience);
}
