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
var constants_1 = require("../../initializers/constants");
var actor_1 = require("../../models/activitypub/actor");
var video_share_1 = require("../../models/video/video-share");
function getRemoteVideoAudience(video, actorsInvolvedInVideo) {
    return {
        to: [video.VideoChannel.Account.Actor.url],
        cc: actorsInvolvedInVideo.map(function (a) { return a.followersUrl; })
    };
}
exports.getRemoteVideoAudience = getRemoteVideoAudience;
function getVideoCommentAudience(videoComment, threadParentComments, actorsInvolvedInVideo, isOrigin) {
    if (isOrigin === void 0) { isOrigin = false; }
    var to = [constants_1.ACTIVITY_PUB.PUBLIC];
    var cc = [];
    // Owner of the video we comment
    if (isOrigin === false) {
        cc.push(videoComment.Video.VideoChannel.Account.Actor.url);
    }
    // Followers of the poster
    cc.push(videoComment.Account.Actor.followersUrl);
    // Send to actors we reply to
    for (var _i = 0, threadParentComments_1 = threadParentComments; _i < threadParentComments_1.length; _i++) {
        var parentComment = threadParentComments_1[_i];
        cc.push(parentComment.Account.Actor.url);
    }
    return {
        to: to,
        cc: cc.concat(actorsInvolvedInVideo.map(function (a) { return a.followersUrl; }))
    };
}
exports.getVideoCommentAudience = getVideoCommentAudience;
function getAudienceFromFollowersOf(actorsInvolvedInObject) {
    return {
        to: [constants_1.ACTIVITY_PUB.PUBLIC].concat(actorsInvolvedInObject.map(function (a) { return a.followersUrl; })),
        cc: []
    };
}
exports.getAudienceFromFollowersOf = getAudienceFromFollowersOf;
function getActorsInvolvedInVideo(video, t) {
    return __awaiter(this, void 0, void 0, function () {
        var actors, videoActor, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, video_share_1.VideoShareModel.loadActorsByShare(video.id, t)];
                case 1:
                    actors = _b.sent();
                    if (!(video.VideoChannel && video.VideoChannel.Account)) return [3 /*break*/, 2];
                    _a = video.VideoChannel.Account.Actor;
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, actor_1.ActorModel.loadAccountActorByVideoId(video.id, t)];
                case 3:
                    _a = _b.sent();
                    _b.label = 4;
                case 4:
                    videoActor = _a;
                    actors.push(videoActor);
                    return [2 /*return*/, actors];
            }
        });
    });
}
exports.getActorsInvolvedInVideo = getActorsInvolvedInVideo;
function getAudience(actorSender, isPublic) {
    if (isPublic === void 0) { isPublic = true; }
    return buildAudience([actorSender.followersUrl], isPublic);
}
exports.getAudience = getAudience;
function buildAudience(followerUrls, isPublic) {
    if (isPublic === void 0) { isPublic = true; }
    var to = [];
    var cc = [];
    if (isPublic) {
        to = [constants_1.ACTIVITY_PUB.PUBLIC];
        cc = followerUrls;
    }
    else { // Unlisted
        to = [];
        cc = [];
    }
    return { to: to, cc: cc };
}
exports.buildAudience = buildAudience;
function audiencify(object, audience) {
    return Object.assign(object, audience);
}
exports.audiencify = audiencify;
