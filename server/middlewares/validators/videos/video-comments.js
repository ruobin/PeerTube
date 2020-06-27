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
var _this = this;
exports.__esModule = true;
var express_validator_1 = require("express-validator");
var shared_1 = require("../../../../shared");
var misc_1 = require("../../../helpers/custom-validators/misc");
var video_comments_1 = require("../../../helpers/custom-validators/video-comments");
var logger_1 = require("../../../helpers/logger");
var video_comment_1 = require("../../../models/video/video-comment");
var utils_1 = require("../utils");
var hooks_1 = require("../../../lib/plugins/hooks");
var moderation_1 = require("../../../lib/moderation");
var middlewares_1 = require("../../../helpers/middlewares");
var listVideoCommentThreadsValidator = [
    express_validator_1.param('videoId').custom(misc_1.isIdOrUUIDValid).not().isEmpty().withMessage('Should have a valid videoId'),
    function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.debug('Checking listVideoCommentThreads parameters.', { parameters: req.params });
                    if (utils_1.areValidationErrors(req, res))
                        return [2 /*return*/];
                    return [4 /*yield*/, middlewares_1.doesVideoExist(req.params.videoId, res, 'only-video')];
                case 1:
                    if (!(_a.sent()))
                        return [2 /*return*/];
                    return [2 /*return*/, next()];
            }
        });
    }); }
];
exports.listVideoCommentThreadsValidator = listVideoCommentThreadsValidator;
var listVideoThreadCommentsValidator = [
    express_validator_1.param('videoId').custom(misc_1.isIdOrUUIDValid).not().isEmpty().withMessage('Should have a valid videoId'),
    express_validator_1.param('threadId').custom(misc_1.isIdValid).not().isEmpty().withMessage('Should have a valid threadId'),
    function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.debug('Checking listVideoThreadComments parameters.', { parameters: req.params });
                    if (utils_1.areValidationErrors(req, res))
                        return [2 /*return*/];
                    return [4 /*yield*/, middlewares_1.doesVideoExist(req.params.videoId, res, 'only-video')];
                case 1:
                    if (!(_a.sent()))
                        return [2 /*return*/];
                    return [4 /*yield*/, doesVideoCommentThreadExist(req.params.threadId, res.locals.video, res)];
                case 2:
                    if (!(_a.sent()))
                        return [2 /*return*/];
                    return [2 /*return*/, next()];
            }
        });
    }); }
];
exports.listVideoThreadCommentsValidator = listVideoThreadCommentsValidator;
var addVideoCommentThreadValidator = [
    express_validator_1.param('videoId').custom(misc_1.isIdOrUUIDValid).not().isEmpty().withMessage('Should have a valid videoId'),
    express_validator_1.body('text').custom(video_comments_1.isValidVideoCommentText).not().isEmpty().withMessage('Should have a valid comment text'),
    function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.debug('Checking addVideoCommentThread parameters.', { parameters: req.params, body: req.body });
                    if (utils_1.areValidationErrors(req, res))
                        return [2 /*return*/];
                    return [4 /*yield*/, middlewares_1.doesVideoExist(req.params.videoId, res)];
                case 1:
                    if (!(_a.sent()))
                        return [2 /*return*/];
                    if (!isVideoCommentsEnabled(res.locals.video, res))
                        return [2 /*return*/];
                    return [4 /*yield*/, isVideoCommentAccepted(req, res, false)];
                case 2:
                    if (!(_a.sent()))
                        return [2 /*return*/];
                    return [2 /*return*/, next()];
            }
        });
    }); }
];
exports.addVideoCommentThreadValidator = addVideoCommentThreadValidator;
var addVideoCommentReplyValidator = [
    express_validator_1.param('videoId').custom(misc_1.isIdOrUUIDValid).not().isEmpty().withMessage('Should have a valid videoId'),
    express_validator_1.param('commentId').custom(misc_1.isIdValid).not().isEmpty().withMessage('Should have a valid commentId'),
    express_validator_1.body('text').custom(video_comments_1.isValidVideoCommentText).not().isEmpty().withMessage('Should have a valid comment text'),
    function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.debug('Checking addVideoCommentReply parameters.', { parameters: req.params, body: req.body });
                    if (utils_1.areValidationErrors(req, res))
                        return [2 /*return*/];
                    return [4 /*yield*/, middlewares_1.doesVideoExist(req.params.videoId, res)];
                case 1:
                    if (!(_a.sent()))
                        return [2 /*return*/];
                    if (!isVideoCommentsEnabled(res.locals.video, res))
                        return [2 /*return*/];
                    return [4 /*yield*/, doesVideoCommentExist(req.params.commentId, res.locals.video, res)];
                case 2:
                    if (!(_a.sent()))
                        return [2 /*return*/];
                    return [4 /*yield*/, isVideoCommentAccepted(req, res, true)];
                case 3:
                    if (!(_a.sent()))
                        return [2 /*return*/];
                    return [2 /*return*/, next()];
            }
        });
    }); }
];
exports.addVideoCommentReplyValidator = addVideoCommentReplyValidator;
var videoCommentGetValidator = [
    express_validator_1.param('videoId').custom(misc_1.isIdOrUUIDValid).not().isEmpty().withMessage('Should have a valid videoId'),
    express_validator_1.param('commentId').custom(misc_1.isIdValid).not().isEmpty().withMessage('Should have a valid commentId'),
    function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.debug('Checking videoCommentGetValidator parameters.', { parameters: req.params });
                    if (utils_1.areValidationErrors(req, res))
                        return [2 /*return*/];
                    return [4 /*yield*/, middlewares_1.doesVideoExist(req.params.videoId, res, 'id')];
                case 1:
                    if (!(_a.sent()))
                        return [2 /*return*/];
                    return [4 /*yield*/, doesVideoCommentExist(req.params.commentId, res.locals.video, res)];
                case 2:
                    if (!(_a.sent()))
                        return [2 /*return*/];
                    return [2 /*return*/, next()];
            }
        });
    }); }
];
exports.videoCommentGetValidator = videoCommentGetValidator;
var removeVideoCommentValidator = [
    express_validator_1.param('videoId').custom(misc_1.isIdOrUUIDValid).not().isEmpty().withMessage('Should have a valid videoId'),
    express_validator_1.param('commentId').custom(misc_1.isIdValid).not().isEmpty().withMessage('Should have a valid commentId'),
    function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.debug('Checking removeVideoCommentValidator parameters.', { parameters: req.params });
                    if (utils_1.areValidationErrors(req, res))
                        return [2 /*return*/];
                    return [4 /*yield*/, middlewares_1.doesVideoExist(req.params.videoId, res)];
                case 1:
                    if (!(_a.sent()))
                        return [2 /*return*/];
                    return [4 /*yield*/, doesVideoCommentExist(req.params.commentId, res.locals.video, res)];
                case 2:
                    if (!(_a.sent()))
                        return [2 /*return*/];
                    // Check if the user who did the request is able to delete the video
                    if (!checkUserCanDeleteVideoComment(res.locals.oauth.token.User, res.locals.videoComment, res))
                        return [2 /*return*/];
                    return [2 /*return*/, next()];
            }
        });
    }); }
];
exports.removeVideoCommentValidator = removeVideoCommentValidator;
// ---------------------------------------------------------------------------
function doesVideoCommentThreadExist(id, video, res) {
    return __awaiter(this, void 0, void 0, function () {
        var videoComment;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, video_comment_1.VideoCommentModel.loadById(id)];
                case 1:
                    videoComment = _a.sent();
                    if (!videoComment) {
                        res.status(404)
                            .json({ error: 'Video comment thread not found' })
                            .end();
                        return [2 /*return*/, false];
                    }
                    if (videoComment.videoId !== video.id) {
                        res.status(400)
                            .json({ error: 'Video comment is associated to this video.' })
                            .end();
                        return [2 /*return*/, false];
                    }
                    if (videoComment.inReplyToCommentId !== null) {
                        res.status(400)
                            .json({ error: 'Video comment is not a thread.' })
                            .end();
                        return [2 /*return*/, false];
                    }
                    res.locals.videoCommentThread = videoComment;
                    return [2 /*return*/, true];
            }
        });
    });
}
function doesVideoCommentExist(id, video, res) {
    return __awaiter(this, void 0, void 0, function () {
        var videoComment;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, video_comment_1.VideoCommentModel.loadByIdAndPopulateVideoAndAccountAndReply(id)];
                case 1:
                    videoComment = _a.sent();
                    if (!videoComment) {
                        res.status(404)
                            .json({ error: 'Video comment thread not found' })
                            .end();
                        return [2 /*return*/, false];
                    }
                    if (videoComment.videoId !== video.id) {
                        res.status(400)
                            .json({ error: 'Video comment is associated to this video.' })
                            .end();
                        return [2 /*return*/, false];
                    }
                    res.locals.videoComment = videoComment;
                    return [2 /*return*/, true];
            }
        });
    });
}
function isVideoCommentsEnabled(video, res) {
    if (video.commentsEnabled !== true) {
        res.status(409)
            .json({ error: 'Video comments are disabled for this video.' })
            .end();
        return false;
    }
    return true;
}
function checkUserCanDeleteVideoComment(user, videoComment, res) {
    var account = videoComment.Account;
    if (user.hasRight(shared_1.UserRight.REMOVE_ANY_VIDEO_COMMENT) === false && account.userId !== user.id) {
        res.status(403)
            .json({ error: 'Cannot remove video comment of another user' })
            .end();
        return false;
    }
    return true;
}
function isVideoCommentAccepted(req, res, isReply) {
    return __awaiter(this, void 0, void 0, function () {
        var acceptParameters, acceptedResult, acceptReplyParameters;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    acceptParameters = {
                        video: res.locals.video,
                        commentBody: req.body,
                        user: res.locals.oauth.token.User
                    };
                    if (!isReply) return [3 /*break*/, 2];
                    acceptReplyParameters = Object.assign(acceptParameters, { parentComment: res.locals.videoComment });
                    return [4 /*yield*/, hooks_1.Hooks.wrapFun(moderation_1.isLocalVideoCommentReplyAccepted, acceptReplyParameters, 'filter:api.video-comment-reply.create.accept.result')];
                case 1:
                    acceptedResult = _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, hooks_1.Hooks.wrapFun(moderation_1.isLocalVideoThreadAccepted, acceptParameters, 'filter:api.video-thread.create.accept.result')];
                case 3:
                    acceptedResult = _a.sent();
                    _a.label = 4;
                case 4:
                    if (!acceptedResult || acceptedResult.accepted !== true) {
                        logger_1.logger.info('Refused local comment.', { acceptedResult: acceptedResult, acceptParameters: acceptParameters });
                        res.status(403)
                            .json({ error: acceptedResult.errorMessage || 'Refused local comment' });
                        return [2 /*return*/, false];
                    }
                    return [2 /*return*/, true];
            }
        });
    });
}
