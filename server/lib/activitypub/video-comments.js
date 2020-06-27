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
var video_comments_1 = require("../../helpers/custom-validators/activitypub/video-comments");
var logger_1 = require("../../helpers/logger");
var requests_1 = require("../../helpers/requests");
var constants_1 = require("../../initializers/constants");
var video_comment_1 = require("../../models/video/video-comment");
var actor_1 = require("./actor");
var videos_1 = require("./videos");
var Bluebird = require("bluebird");
var activitypub_1 = require("../../helpers/activitypub");
function addVideoComments(commentUrls) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, Bluebird.map(commentUrls, function (commentUrl) {
                    return resolveThread({ url: commentUrl, isVideo: false });
                }, { concurrency: constants_1.CRAWL_REQUEST_CONCURRENCY })];
        });
    });
}
exports.addVideoComments = addVideoComments;
function resolveThread(params) {
    return __awaiter(this, void 0, void 0, function () {
        var url, isVideo, result, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = params.url, isVideo = params.isVideo;
                    if (params.commentCreated === undefined)
                        params.commentCreated = false;
                    if (params.comments === undefined)
                        params.comments = [];
                    if (!(isVideo !== true)) return [3 /*break*/, 2];
                    return [4 /*yield*/, resolveCommentFromDB(params)];
                case 1:
                    result = _a.sent();
                    if (result)
                        return [2 /*return*/, result];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 6]);
                    if (!(isVideo !== false)) return [3 /*break*/, 4];
                    return [4 /*yield*/, tryResolveThreadFromVideo(params)];
                case 3: return [2 /*return*/, _a.sent()];
                case 4: return [2 /*return*/, resolveParentComment(params)];
                case 5:
                    err_1 = _a.sent();
                    logger_1.logger.debug('Cannot get or create account and video and channel for reply %s, fetch comment', url, { err: err_1 });
                    return [2 /*return*/, resolveParentComment(params)];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.resolveThread = resolveThread;
// ---------------------------------------------------------------------------
function resolveCommentFromDB(params) {
    return __awaiter(this, void 0, void 0, function () {
        var url, comments, commentCreated, commentFromDatabase, parentComments, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = params.url, comments = params.comments, commentCreated = params.commentCreated;
                    return [4 /*yield*/, video_comment_1.VideoCommentModel.loadByUrlAndPopulateReplyAndVideoUrlAndAccount(url)];
                case 1:
                    commentFromDatabase = _a.sent();
                    if (!commentFromDatabase) return [3 /*break*/, 4];
                    parentComments = comments.concat([commentFromDatabase]);
                    if (!commentFromDatabase.InReplyToVideoComment) return [3 /*break*/, 3];
                    return [4 /*yield*/, video_comment_1.VideoCommentModel.listThreadParentComments(commentFromDatabase, undefined, 'DESC')];
                case 2:
                    data = _a.sent();
                    parentComments = parentComments.concat(data);
                    _a.label = 3;
                case 3: return [2 /*return*/, resolveThread({
                        url: commentFromDatabase.Video.url,
                        comments: parentComments,
                        isVideo: true,
                        commentCreated: commentCreated
                    })];
                case 4: return [2 /*return*/, undefined];
            }
        });
    });
}
function tryResolveThreadFromVideo(params) {
    return __awaiter(this, void 0, void 0, function () {
        var url, comments, commentCreated, syncParam, video, resultComment, firstReply, _a, _b, i, comment, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    url = params.url, comments = params.comments, commentCreated = params.commentCreated;
                    syncParam = { likes: true, dislikes: true, shares: true, comments: false, thumbnail: true, refreshVideo: false };
                    return [4 /*yield*/, videos_1.getOrCreateVideoAndAccountAndChannel({ videoObject: url, syncParam: syncParam })];
                case 1:
                    video = (_e.sent()).video;
                    if (!(comments.length !== 0)) return [3 /*break*/, 7];
                    firstReply = comments[comments.length - 1];
                    firstReply.inReplyToCommentId = null;
                    firstReply.originCommentId = null;
                    firstReply.videoId = video.id;
                    firstReply.changed('updatedAt', true);
                    firstReply.Video = video;
                    _a = comments;
                    _b = comments.length - 1;
                    return [4 /*yield*/, firstReply.save()];
                case 2:
                    _a[_b] = _e.sent();
                    i = comments.length - 2;
                    _e.label = 3;
                case 3:
                    if (!(i >= 0)) return [3 /*break*/, 6];
                    comment = comments[i];
                    comment.originCommentId = firstReply.id;
                    comment.inReplyToCommentId = comments[i + 1].id;
                    comment.videoId = video.id;
                    comment.changed('updatedAt', true);
                    comment.Video = video;
                    _c = comments;
                    _d = i;
                    return [4 /*yield*/, comment.save()];
                case 4:
                    _c[_d] = _e.sent();
                    _e.label = 5;
                case 5:
                    i--;
                    return [3 /*break*/, 3];
                case 6:
                    resultComment = comments[0];
                    _e.label = 7;
                case 7: return [2 /*return*/, { video: video, comment: resultComment, commentCreated: commentCreated }];
            }
        });
    });
}
function resolveParentComment(params) {
    return __awaiter(this, void 0, void 0, function () {
        var url, comments, body, actorUrl, actor, comment;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = params.url, comments = params.comments;
                    if (comments.length > constants_1.ACTIVITY_PUB.MAX_RECURSION_COMMENTS) {
                        throw new Error('Recursion limit reached when resolving a thread');
                    }
                    return [4 /*yield*/, requests_1.doRequest({
                            uri: url,
                            json: true,
                            activityPub: true
                        })];
                case 1:
                    body = (_a.sent()).body;
                    if (video_comments_1.sanitizeAndCheckVideoCommentObject(body) === false) {
                        throw new Error('Remote video comment JSON is not valid:' + JSON.stringify(body));
                    }
                    actorUrl = body.attributedTo;
                    if (!actorUrl)
                        throw new Error('Miss attributed to in comment');
                    if (activitypub_1.checkUrlsSameHost(url, actorUrl) !== true) {
                        throw new Error("Actor url " + actorUrl + " has not the same host than the comment url " + url);
                    }
                    if (activitypub_1.checkUrlsSameHost(body.id, url) !== true) {
                        throw new Error("Comment url " + url + " host is different from the AP object id " + body.id);
                    }
                    return [4 /*yield*/, actor_1.getOrCreateActorAndServerAndModel(actorUrl, 'all')];
                case 2:
                    actor = _a.sent();
                    comment = new video_comment_1.VideoCommentModel({
                        url: body.id,
                        text: body.content,
                        videoId: null,
                        accountId: actor.Account.id,
                        inReplyToCommentId: null,
                        originCommentId: null,
                        createdAt: new Date(body.published),
                        updatedAt: new Date(body.updated)
                    });
                    comment.Account = actor.Account;
                    return [2 /*return*/, resolveThread({
                            url: body.inReplyTo,
                            comments: comments.concat([comment]),
                            commentCreated: true
                        })];
            }
        });
    });
}
