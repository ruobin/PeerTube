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
var videos_1 = require("../../../shared/models/videos");
var utils_1 = require("../../helpers/utils");
var video_share_1 = require("../../models/video/video-share");
var send_1 = require("./send");
var url_1 = require("./url");
var Bluebird = require("bluebird");
var requests_1 = require("../../helpers/requests");
var actor_1 = require("./actor");
var logger_1 = require("../../helpers/logger");
var constants_1 = require("../../initializers/constants");
var activitypub_1 = require("../../helpers/activitypub");
function shareVideoByServerAndChannel(video, t) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (video.privacy === videos_1.VideoPrivacy.PRIVATE)
                return [2 /*return*/, undefined];
            return [2 /*return*/, Promise.all([
                    shareByServer(video, t),
                    shareByVideoChannel(video, t)
                ])];
        });
    });
}
exports.shareVideoByServerAndChannel = shareVideoByServerAndChannel;
function changeVideoChannelShare(video, oldVideoChannel, t) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.info('Updating video channel of video %s: %s -> %s.', video.uuid, oldVideoChannel.name, video.VideoChannel.name);
                    return [4 /*yield*/, undoShareByVideoChannel(video, oldVideoChannel, t)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, shareByVideoChannel(video, t)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.changeVideoChannelShare = changeVideoChannelShare;
function addVideoShares(shareUrls, instance) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Bluebird.map(shareUrls, function (shareUrl) { return __awaiter(_this, void 0, void 0, function () {
                        var body, actorUrl, actor, entry, err_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 4, , 5]);
                                    return [4 /*yield*/, requests_1.doRequest({
                                            uri: shareUrl,
                                            json: true,
                                            activityPub: true
                                        })];
                                case 1:
                                    body = (_a.sent()).body;
                                    if (!body || !body.actor)
                                        throw new Error('Body or body actor is invalid');
                                    actorUrl = activitypub_1.getAPId(body.actor);
                                    if (activitypub_1.checkUrlsSameHost(shareUrl, actorUrl) !== true) {
                                        throw new Error("Actor url " + actorUrl + " has not the same host than the share url " + shareUrl);
                                    }
                                    return [4 /*yield*/, actor_1.getOrCreateActorAndServerAndModel(actorUrl)];
                                case 2:
                                    actor = _a.sent();
                                    entry = {
                                        actorId: actor.id,
                                        videoId: instance.id,
                                        url: shareUrl
                                    };
                                    return [4 /*yield*/, video_share_1.VideoShareModel.upsert(entry)];
                                case 3:
                                    _a.sent();
                                    return [3 /*break*/, 5];
                                case 4:
                                    err_1 = _a.sent();
                                    logger_1.logger.warn('Cannot add share %s.', shareUrl, { err: err_1 });
                                    return [3 /*break*/, 5];
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); }, { concurrency: constants_1.CRAWL_REQUEST_CONCURRENCY })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.addVideoShares = addVideoShares;
// ---------------------------------------------------------------------------
function shareByServer(video, t) {
    return __awaiter(this, void 0, void 0, function () {
        var serverActor, serverShareUrl, serverShare;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, utils_1.getServerActor()];
                case 1:
                    serverActor = _a.sent();
                    serverShareUrl = url_1.getVideoAnnounceActivityPubUrl(serverActor, video);
                    return [4 /*yield*/, video_share_1.VideoShareModel.findOrCreate({
                            defaults: {
                                actorId: serverActor.id,
                                videoId: video.id,
                                url: serverShareUrl
                            },
                            where: {
                                url: serverShareUrl
                            },
                            transaction: t
                        })];
                case 2:
                    serverShare = (_a.sent())[0];
                    return [2 /*return*/, send_1.sendVideoAnnounce(serverActor, serverShare, video, t)];
            }
        });
    });
}
function shareByVideoChannel(video, t) {
    return __awaiter(this, void 0, void 0, function () {
        var videoChannelShareUrl, videoChannelShare;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    videoChannelShareUrl = url_1.getVideoAnnounceActivityPubUrl(video.VideoChannel.Actor, video);
                    return [4 /*yield*/, video_share_1.VideoShareModel.findOrCreate({
                            defaults: {
                                actorId: video.VideoChannel.actorId,
                                videoId: video.id,
                                url: videoChannelShareUrl
                            },
                            where: {
                                url: videoChannelShareUrl
                            },
                            transaction: t
                        })];
                case 1:
                    videoChannelShare = (_a.sent())[0];
                    return [2 /*return*/, send_1.sendVideoAnnounce(video.VideoChannel.Actor, videoChannelShare, video, t)];
            }
        });
    });
}
function undoShareByVideoChannel(video, oldVideoChannel, t) {
    return __awaiter(this, void 0, void 0, function () {
        var oldShare;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, video_share_1.VideoShareModel.load(oldVideoChannel.actorId, video.id, t)];
                case 1:
                    oldShare = _a.sent();
                    if (!oldShare)
                        return [2 /*return*/, new Error('Cannot find old video channel share ' + oldVideoChannel.actorId + ' for video ' + video.id)];
                    return [4 /*yield*/, send_1.sendUndoAnnounce(oldVideoChannel.Actor, oldShare, video, t)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, oldShare.destroy({ transaction: t })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
