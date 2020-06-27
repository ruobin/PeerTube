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
var logger_1 = require("../../../helpers/logger");
var actor_1 = require("../../../models/activitypub/actor");
var actor_follow_1 = require("../../../models/activitypub/actor-follow");
var job_queue_1 = require("../../job-queue");
var audience_1 = require("../audience");
var utils_1 = require("../../../helpers/utils");
var database_utils_1 = require("../../../helpers/database-utils");
function sendVideoRelatedActivity(activityBuilder, options) {
    return __awaiter(this, void 0, void 0, function () {
        var byActor, video, transaction, actorsInvolvedInVideo, audience_2, activity_1, audience, activity, actorsException;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    byActor = options.byActor, video = options.video, transaction = options.transaction;
                    return [4 /*yield*/, audience_1.getActorsInvolvedInVideo(video, transaction)
                        // Send to origin
                    ];
                case 1:
                    actorsInvolvedInVideo = _a.sent();
                    // Send to origin
                    if (video.isOwned() === false) {
                        audience_2 = audience_1.getRemoteVideoAudience(video, actorsInvolvedInVideo);
                        activity_1 = activityBuilder(audience_2);
                        return [2 /*return*/, database_utils_1.afterCommitIfTransaction(transaction, function () {
                                return unicastTo(activity_1, byActor, video.VideoChannel.Account.Actor.sharedInboxUrl);
                            })];
                    }
                    audience = audience_1.getAudienceFromFollowersOf(actorsInvolvedInVideo);
                    activity = activityBuilder(audience);
                    actorsException = [byActor];
                    return [2 /*return*/, broadcastToFollowers(activity, byActor, actorsInvolvedInVideo, transaction, actorsException)];
            }
        });
    });
}
exports.sendVideoRelatedActivity = sendVideoRelatedActivity;
function forwardVideoRelatedActivity(activity, t, followersException, video) {
    if (followersException === void 0) { followersException = []; }
    return __awaiter(this, void 0, void 0, function () {
        var additionalActors, additionalFollowerUrls;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, audience_1.getActorsInvolvedInVideo(video, t)];
                case 1:
                    additionalActors = _a.sent();
                    additionalFollowerUrls = additionalActors.map(function (a) { return a.followersUrl; });
                    return [2 /*return*/, forwardActivity(activity, t, followersException, additionalFollowerUrls)];
            }
        });
    });
}
exports.forwardVideoRelatedActivity = forwardVideoRelatedActivity;
function forwardActivity(activity, t, followersException, additionalFollowerUrls) {
    if (followersException === void 0) { followersException = []; }
    if (additionalFollowerUrls === void 0) { additionalFollowerUrls = []; }
    return __awaiter(this, void 0, void 0, function () {
        var to, cc, followersUrls, _i, _a, dest, toActorFollowers, uris, payload;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    logger_1.logger.info('Forwarding activity %s.', activity.id);
                    to = activity.to || [];
                    cc = activity.cc || [];
                    followersUrls = additionalFollowerUrls;
                    for (_i = 0, _a = to.concat(cc); _i < _a.length; _i++) {
                        dest = _a[_i];
                        if (dest.endsWith('/followers')) {
                            followersUrls.push(dest);
                        }
                    }
                    return [4 /*yield*/, actor_1.ActorModel.listByFollowersUrls(followersUrls, t)];
                case 1:
                    toActorFollowers = _b.sent();
                    return [4 /*yield*/, computeFollowerUris(toActorFollowers, followersException, t)];
                case 2:
                    uris = _b.sent();
                    if (uris.length === 0) {
                        logger_1.logger.info('0 followers for %s, no forwarding.', toActorFollowers.map(function (a) { return a.id; }).join(', '));
                        return [2 /*return*/, undefined];
                    }
                    logger_1.logger.debug('Creating forwarding job.', { uris: uris });
                    payload = {
                        uris: uris,
                        body: activity
                    };
                    return [2 /*return*/, database_utils_1.afterCommitIfTransaction(t, function () { return job_queue_1.JobQueue.Instance.createJob({ type: 'activitypub-http-broadcast', payload: payload }); })];
            }
        });
    });
}
exports.forwardActivity = forwardActivity;
function broadcastToFollowers(data, byActor, toFollowersOf, t, actorsException) {
    if (actorsException === void 0) { actorsException = []; }
    return __awaiter(this, void 0, void 0, function () {
        var uris;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, computeFollowerUris(toFollowersOf, actorsException, t)];
                case 1:
                    uris = _a.sent();
                    return [2 /*return*/, database_utils_1.afterCommitIfTransaction(t, function () { return broadcastTo(uris, data, byActor); })];
            }
        });
    });
}
exports.broadcastToFollowers = broadcastToFollowers;
function broadcastToActors(data, byActor, toActors, t, actorsException) {
    if (actorsException === void 0) { actorsException = []; }
    return __awaiter(this, void 0, void 0, function () {
        var uris;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, computeUris(toActors, actorsException)];
                case 1:
                    uris = _a.sent();
                    return [2 /*return*/, database_utils_1.afterCommitIfTransaction(t, function () { return broadcastTo(uris, data, byActor); })];
            }
        });
    });
}
exports.broadcastToActors = broadcastToActors;
function broadcastTo(uris, data, byActor) {
    if (uris.length === 0)
        return undefined;
    logger_1.logger.debug('Creating broadcast job.', { uris: uris });
    var payload = {
        uris: uris,
        signatureActorId: byActor.id,
        body: data
    };
    return job_queue_1.JobQueue.Instance.createJob({ type: 'activitypub-http-broadcast', payload: payload });
}
function unicastTo(data, byActor, toActorUrl) {
    logger_1.logger.debug('Creating unicast job.', { uri: toActorUrl });
    var payload = {
        uri: toActorUrl,
        signatureActorId: byActor.id,
        body: data
    };
    job_queue_1.JobQueue.Instance.createJob({ type: 'activitypub-http-unicast', payload: payload });
}
exports.unicastTo = unicastTo;
// ---------------------------------------------------------------------------
function computeFollowerUris(toFollowersOf, actorsException, t) {
    return __awaiter(this, void 0, void 0, function () {
        var toActorFollowerIds, result, sharedInboxesException;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    toActorFollowerIds = toFollowersOf.map(function (a) { return a.id; });
                    return [4 /*yield*/, actor_follow_1.ActorFollowModel.listAcceptedFollowerSharedInboxUrls(toActorFollowerIds, t)];
                case 1:
                    result = _a.sent();
                    return [4 /*yield*/, buildSharedInboxesException(actorsException)];
                case 2:
                    sharedInboxesException = _a.sent();
                    return [2 /*return*/, result.data.filter(function (sharedInbox) { return sharedInboxesException.indexOf(sharedInbox) === -1; })];
            }
        });
    });
}
function computeUris(toActors, actorsException) {
    if (actorsException === void 0) { actorsException = []; }
    return __awaiter(this, void 0, void 0, function () {
        var serverActor, targetUrls, toActorSharedInboxesSet, sharedInboxesException;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, utils_1.getServerActor()];
                case 1:
                    serverActor = _a.sent();
                    targetUrls = toActors
                        .filter(function (a) { return a.id !== serverActor.id; }) // Don't send to ourselves
                        .map(function (a) { return a.sharedInboxUrl || a.inboxUrl; });
                    toActorSharedInboxesSet = new Set(targetUrls);
                    return [4 /*yield*/, buildSharedInboxesException(actorsException)];
                case 2:
                    sharedInboxesException = _a.sent();
                    return [2 /*return*/, Array.from(toActorSharedInboxesSet)
                            .filter(function (sharedInbox) { return sharedInboxesException.indexOf(sharedInbox) === -1; })];
            }
        });
    });
}
function buildSharedInboxesException(actorsException) {
    return __awaiter(this, void 0, void 0, function () {
        var serverActor;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, utils_1.getServerActor()];
                case 1:
                    serverActor = _a.sent();
                    return [2 /*return*/, actorsException
                            .map(function (f) { return f.sharedInboxUrl || f.inboxUrl; })
                            .concat([serverActor.sharedInboxUrl])];
            }
        });
    });
}
