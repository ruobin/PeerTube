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
var videos_1 = require("../../../helpers/custom-validators/videos");
var ffmpeg_utils_1 = require("../../../helpers/ffmpeg-utils");
var logger_1 = require("../../../helpers/logger");
var constants_1 = require("../../../initializers/constants");
var oauth_1 = require("../../oauth");
var utils_1 = require("../utils");
var express_utils_1 = require("../../../helpers/express-utils");
var video_1 = require("../../../models/video/video");
var video_ownership_1 = require("../../../helpers/custom-validators/video-ownership");
var account_1 = require("../../../models/account/account");
var search_1 = require("../../../helpers/custom-validators/search");
var utils_2 = require("../../../helpers/utils");
var config_1 = require("../../../initializers/config");
var moderation_1 = require("../../../lib/moderation");
var hooks_1 = require("../../../lib/plugins/hooks");
var middlewares_1 = require("../../../helpers/middlewares");
var videosAddValidator = getCommonVideoEditAttributes().concat([
    express_validator_1.body('videofile')
        .custom(function (value, _a) {
        var req = _a.req;
        return videos_1.isVideoFile(req.files);
    }).withMessage('This file is not supported or too large. Please, make sure it is of the following type: '
        + constants_1.CONSTRAINTS_FIELDS.VIDEOS.EXTNAME.join(', ')),
    express_validator_1.body('name').custom(videos_1.isVideoNameValid).withMessage('Should have a valid name'),
    express_validator_1.body('channelId')
        .customSanitizer(misc_1.toIntOrNull)
        .custom(misc_1.isIdValid).withMessage('Should have correct video channel id'),
    function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var videoFile, user, duration, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.debug('Checking videosAdd parameters', { parameters: req.body, files: req.files });
                    if (utils_1.areValidationErrors(req, res))
                        return [2 /*return*/, express_utils_1.cleanUpReqFiles(req)];
                    if (areErrorsInScheduleUpdate(req, res))
                        return [2 /*return*/, express_utils_1.cleanUpReqFiles(req)];
                    videoFile = req.files['videofile'][0];
                    user = res.locals.oauth.token.User;
                    return [4 /*yield*/, middlewares_1.doesVideoChannelOfAccountExist(req.body.channelId, user, res)];
                case 1:
                    if (!(_a.sent()))
                        return [2 /*return*/, express_utils_1.cleanUpReqFiles(req)];
                    return [4 /*yield*/, user.isAbleToUploadVideo(videoFile)];
                case 2:
                    if ((_a.sent()) === false) {
                        res.status(403)
                            .json({ error: 'The user video quota is exceeded with this video.' });
                        return [2 /*return*/, express_utils_1.cleanUpReqFiles(req)];
                    }
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, ffmpeg_utils_1.getDurationFromVideoFile(videoFile.path)];
                case 4:
                    duration = _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _a.sent();
                    logger_1.logger.error('Invalid input file in videosAddValidator.', { err: err_1 });
                    res.status(400)
                        .json({ error: 'Invalid input file.' });
                    return [2 /*return*/, express_utils_1.cleanUpReqFiles(req)];
                case 6:
                    videoFile.duration = duration;
                    return [4 /*yield*/, isVideoAccepted(req, res, videoFile)];
                case 7:
                    if (!(_a.sent()))
                        return [2 /*return*/, express_utils_1.cleanUpReqFiles(req)];
                    return [2 /*return*/, next()];
            }
        });
    }); }
]);
exports.videosAddValidator = videosAddValidator;
var videosUpdateValidator = getCommonVideoEditAttributes().concat([
    express_validator_1.param('id').custom(misc_1.isIdOrUUIDValid).not().isEmpty().withMessage('Should have a valid id'),
    express_validator_1.body('name')
        .optional()
        .custom(videos_1.isVideoNameValid).withMessage('Should have a valid name'),
    express_validator_1.body('channelId')
        .optional()
        .customSanitizer(misc_1.toIntOrNull)
        .custom(misc_1.isIdValid).withMessage('Should have correct video channel id'),
    function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var user, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    logger_1.logger.debug('Checking videosUpdate parameters', { parameters: req.body });
                    if (utils_1.areValidationErrors(req, res))
                        return [2 /*return*/, express_utils_1.cleanUpReqFiles(req)];
                    if (areErrorsInScheduleUpdate(req, res))
                        return [2 /*return*/, express_utils_1.cleanUpReqFiles(req)];
                    return [4 /*yield*/, middlewares_1.doesVideoExist(req.params.id, res)];
                case 1:
                    if (!(_b.sent()))
                        return [2 /*return*/, express_utils_1.cleanUpReqFiles(req)
                            // Check if the user who did the request is able to update the video
                        ];
                    user = res.locals.oauth.token.User;
                    if (!middlewares_1.checkUserCanManageVideo(user, res.locals.video, shared_1.UserRight.UPDATE_ANY_VIDEO, res))
                        return [2 /*return*/, express_utils_1.cleanUpReqFiles(req)];
                    _a = req.body.channelId;
                    if (!_a) return [3 /*break*/, 3];
                    return [4 /*yield*/, middlewares_1.doesVideoChannelOfAccountExist(req.body.channelId, user, res)];
                case 2:
                    _a = !(_b.sent());
                    _b.label = 3;
                case 3:
                    if (_a)
                        return [2 /*return*/, express_utils_1.cleanUpReqFiles(req)];
                    return [2 /*return*/, next()];
            }
        });
    }); }
]);
exports.videosUpdateValidator = videosUpdateValidator;
function checkVideoFollowConstraints(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var video, serverActor;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    video = res.locals.video;
                    // Anybody can watch local videos
                    if (video.isOwned() === true)
                        return [2 /*return*/, next()
                            // Logged user
                        ];
                    // Logged user
                    if (res.locals.oauth) {
                        // Users can search or watch remote videos
                        if (config_1.CONFIG.SEARCH.REMOTE_URI.USERS === true)
                            return [2 /*return*/, next()];
                    }
                    // Anybody can search or watch remote videos
                    if (config_1.CONFIG.SEARCH.REMOTE_URI.ANONYMOUS === true)
                        return [2 /*return*/, next()
                            // Check our instance follows an actor that shared this video
                        ];
                    return [4 /*yield*/, utils_2.getServerActor()];
                case 1:
                    serverActor = _a.sent();
                    return [4 /*yield*/, video_1.VideoModel.checkVideoHasInstanceFollow(video.id, serverActor.id)];
                case 2:
                    if ((_a.sent()) === true)
                        return [2 /*return*/, next()];
                    return [2 /*return*/, res.status(403)
                            .json({
                            error: 'Cannot get this video regarding follow constraints.'
                        })];
            }
        });
    });
}
exports.checkVideoFollowConstraints = checkVideoFollowConstraints;
var videosCustomGetValidator = function (fetchType) {
    return [
        express_validator_1.param('id').custom(misc_1.isIdOrUUIDValid).not().isEmpty().withMessage('Should have a valid id'),
        function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var video, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logger_1.logger.debug('Checking videosGet parameters', { parameters: req.params });
                        if (utils_1.areValidationErrors(req, res))
                            return [2 /*return*/];
                        return [4 /*yield*/, middlewares_1.doesVideoExist(req.params.id, res, fetchType)];
                    case 1:
                        if (!(_a.sent()))
                            return [2 /*return*/];
                        video = res.locals.video;
                        if (!(video.privacy === shared_1.VideoPrivacy.PRIVATE || video.VideoBlacklist)) return [3 /*break*/, 3];
                        return [4 /*yield*/, oauth_1.authenticatePromiseIfNeeded(req, res)];
                    case 2:
                        _a.sent();
                        user = res.locals.oauth ? res.locals.oauth.token.User : null;
                        // Only the owner or a user that have blacklist rights can see the video
                        if (!user ||
                            (video.VideoChannel.Account.userId !== user.id && !user.hasRight(shared_1.UserRight.MANAGE_VIDEO_BLACKLIST))) {
                            return [2 /*return*/, res.status(403)
                                    .json({ error: 'Cannot get this private or blacklisted video.' })];
                        }
                        return [2 /*return*/, next()];
                    case 3:
                        // Video is public, anyone can access it
                        if (video.privacy === shared_1.VideoPrivacy.PUBLIC)
                            return [2 /*return*/, next()
                                // Video is unlisted, check we used the uuid to fetch it
                            ];
                        // Video is unlisted, check we used the uuid to fetch it
                        if (video.privacy === shared_1.VideoPrivacy.UNLISTED) {
                            if (misc_1.isUUIDValid(req.params.id))
                                return [2 /*return*/, next()
                                    // Don't leak this unlisted video
                                ];
                            // Don't leak this unlisted video
                            return [2 /*return*/, res.status(404).end()];
                        }
                        return [2 /*return*/];
                }
            });
        }); }
    ];
};
exports.videosCustomGetValidator = videosCustomGetValidator;
var videosGetValidator = videosCustomGetValidator('all');
exports.videosGetValidator = videosGetValidator;
var videosRemoveValidator = [
    express_validator_1.param('id').custom(misc_1.isIdOrUUIDValid).not().isEmpty().withMessage('Should have a valid id'),
    function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.debug('Checking videosRemove parameters', { parameters: req.params });
                    if (utils_1.areValidationErrors(req, res))
                        return [2 /*return*/];
                    return [4 /*yield*/, middlewares_1.doesVideoExist(req.params.id, res)];
                case 1:
                    if (!(_a.sent()))
                        return [2 /*return*/];
                    // Check if the user who did the request is able to delete the video
                    if (!middlewares_1.checkUserCanManageVideo(res.locals.oauth.token.User, res.locals.video, shared_1.UserRight.REMOVE_ANY_VIDEO, res))
                        return [2 /*return*/];
                    return [2 /*return*/, next()];
            }
        });
    }); }
];
exports.videosRemoveValidator = videosRemoveValidator;
var videosChangeOwnershipValidator = [
    express_validator_1.param('videoId').custom(misc_1.isIdOrUUIDValid).not().isEmpty().withMessage('Should have a valid id'),
    function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var nextOwner;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.debug('Checking changeOwnership parameters', { parameters: req.params });
                    if (utils_1.areValidationErrors(req, res))
                        return [2 /*return*/];
                    return [4 /*yield*/, middlewares_1.doesVideoExist(req.params.videoId, res)];
                case 1:
                    if (!(_a.sent()))
                        return [2 /*return*/];
                    // Check if the user who did the request is able to change the ownership of the video
                    if (!middlewares_1.checkUserCanManageVideo(res.locals.oauth.token.User, res.locals.video, shared_1.UserRight.CHANGE_VIDEO_OWNERSHIP, res))
                        return [2 /*return*/];
                    return [4 /*yield*/, account_1.AccountModel.loadLocalByName(req.body.username)];
                case 2:
                    nextOwner = _a.sent();
                    if (!nextOwner) {
                        res.status(400)
                            .json({ error: 'Changing video ownership to a remote account is not supported yet' });
                        return [2 /*return*/];
                    }
                    res.locals.nextOwner = nextOwner;
                    return [2 /*return*/, next()];
            }
        });
    }); }
];
exports.videosChangeOwnershipValidator = videosChangeOwnershipValidator;
var videosTerminateChangeOwnershipValidator = [
    express_validator_1.param('id').custom(misc_1.isIdOrUUIDValid).not().isEmpty().withMessage('Should have a valid id'),
    function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.debug('Checking changeOwnership parameters', { parameters: req.params });
                    if (utils_1.areValidationErrors(req, res))
                        return [2 /*return*/];
                    return [4 /*yield*/, video_ownership_1.doesChangeVideoOwnershipExist(req.params.id, res)];
                case 1:
                    if (!(_a.sent()))
                        return [2 /*return*/];
                    // Check if the user who did the request is able to change the ownership of the video
                    if (!video_ownership_1.checkUserCanTerminateOwnershipChange(res.locals.oauth.token.User, res.locals.videoChangeOwnership, res))
                        return [2 /*return*/];
                    return [2 /*return*/, next()];
            }
        });
    }); },
    function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var videoChangeOwnership;
        return __generator(this, function (_a) {
            videoChangeOwnership = res.locals.videoChangeOwnership;
            if (videoChangeOwnership.status === shared_1.VideoChangeOwnershipStatus.WAITING) {
                return [2 /*return*/, next()];
            }
            else {
                res.status(403)
                    .json({ error: 'Ownership already accepted or refused' });
                return [2 /*return*/];
            }
            return [2 /*return*/];
        });
    }); }
];
exports.videosTerminateChangeOwnershipValidator = videosTerminateChangeOwnershipValidator;
var videosAcceptChangeOwnershipValidator = [
    function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var body, user, videoChangeOwnership, isAble;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = req.body;
                    return [4 /*yield*/, middlewares_1.doesVideoChannelOfAccountExist(body.channelId, res.locals.oauth.token.User, res)];
                case 1:
                    if (!(_a.sent()))
                        return [2 /*return*/];
                    user = res.locals.oauth.token.User;
                    videoChangeOwnership = res.locals.videoChangeOwnership;
                    return [4 /*yield*/, user.isAbleToUploadVideo(videoChangeOwnership.Video.getOriginalFile())];
                case 2:
                    isAble = _a.sent();
                    if (isAble === false) {
                        res.status(403)
                            .json({ error: 'The user video quota is exceeded with this video.' });
                        return [2 /*return*/];
                    }
                    return [2 /*return*/, next()];
            }
        });
    }); }
];
exports.videosAcceptChangeOwnershipValidator = videosAcceptChangeOwnershipValidator;
function getCommonVideoEditAttributes() {
    return [
        express_validator_1.body('thumbnailfile')
            .custom(function (value, _a) {
            var req = _a.req;
            return videos_1.isVideoImage(req.files, 'thumbnailfile');
        }).withMessage('This thumbnail file is not supported or too large. Please, make sure it is of the following type: '
            + constants_1.CONSTRAINTS_FIELDS.VIDEOS.IMAGE.EXTNAME.join(', ')),
        express_validator_1.body('previewfile')
            .custom(function (value, _a) {
            var req = _a.req;
            return videos_1.isVideoImage(req.files, 'previewfile');
        }).withMessage('This preview file is not supported or too large. Please, make sure it is of the following type: '
            + constants_1.CONSTRAINTS_FIELDS.VIDEOS.IMAGE.EXTNAME.join(', ')),
        express_validator_1.body('category')
            .optional()
            .customSanitizer(misc_1.toIntOrNull)
            .custom(videos_1.isVideoCategoryValid).withMessage('Should have a valid category'),
        express_validator_1.body('licence')
            .optional()
            .customSanitizer(misc_1.toIntOrNull)
            .custom(videos_1.isVideoLicenceValid).withMessage('Should have a valid licence'),
        express_validator_1.body('language')
            .optional()
            .customSanitizer(misc_1.toValueOrNull)
            .custom(videos_1.isVideoLanguageValid).withMessage('Should have a valid language'),
        express_validator_1.body('nsfw')
            .optional()
            .customSanitizer(misc_1.toBooleanOrNull)
            .custom(misc_1.isBooleanValid).withMessage('Should have a valid NSFW attribute'),
        express_validator_1.body('waitTranscoding')
            .optional()
            .customSanitizer(misc_1.toBooleanOrNull)
            .custom(misc_1.isBooleanValid).withMessage('Should have a valid wait transcoding attribute'),
        express_validator_1.body('privacy')
            .optional()
            .customSanitizer(misc_1.toValueOrNull)
            .custom(videos_1.isVideoPrivacyValid).withMessage('Should have correct video privacy'),
        express_validator_1.body('description')
            .optional()
            .customSanitizer(misc_1.toValueOrNull)
            .custom(videos_1.isVideoDescriptionValid).withMessage('Should have a valid description'),
        express_validator_1.body('support')
            .optional()
            .customSanitizer(misc_1.toValueOrNull)
            .custom(videos_1.isVideoSupportValid).withMessage('Should have a valid support text'),
        express_validator_1.body('tags')
            .optional()
            .customSanitizer(misc_1.toValueOrNull)
            .custom(videos_1.isVideoTagsValid).withMessage('Should have correct tags'),
        express_validator_1.body('commentsEnabled')
            .optional()
            .customSanitizer(misc_1.toBooleanOrNull)
            .custom(misc_1.isBooleanValid).withMessage('Should have comments enabled boolean'),
        express_validator_1.body('downloadEnabled')
            .optional()
            .customSanitizer(misc_1.toBooleanOrNull)
            .custom(misc_1.isBooleanValid).withMessage('Should have downloading enabled boolean'),
        express_validator_1.body('originallyPublishedAt')
            .optional()
            .customSanitizer(misc_1.toValueOrNull)
            .custom(videos_1.isVideoOriginallyPublishedAtValid).withMessage('Should have a valid original publication date'),
        express_validator_1.body('scheduleUpdate')
            .optional()
            .customSanitizer(misc_1.toValueOrNull),
        express_validator_1.body('scheduleUpdate.updateAt')
            .optional()
            .custom(misc_1.isDateValid).withMessage('Should have a valid schedule update date'),
        express_validator_1.body('scheduleUpdate.privacy')
            .optional()
            .customSanitizer(misc_1.toIntOrNull)
            .custom(videos_1.isScheduleVideoUpdatePrivacyValid).withMessage('Should have correct schedule update privacy')
    ];
}
exports.getCommonVideoEditAttributes = getCommonVideoEditAttributes;
var commonVideosFiltersValidator = [
    express_validator_1.query('categoryOneOf')
        .optional()
        .customSanitizer(misc_1.toArray)
        .custom(search_1.isNumberArray).withMessage('Should have a valid one of category array'),
    express_validator_1.query('licenceOneOf')
        .optional()
        .customSanitizer(misc_1.toArray)
        .custom(search_1.isNumberArray).withMessage('Should have a valid one of licence array'),
    express_validator_1.query('languageOneOf')
        .optional()
        .customSanitizer(misc_1.toArray)
        .custom(search_1.isStringArray).withMessage('Should have a valid one of language array'),
    express_validator_1.query('tagsOneOf')
        .optional()
        .customSanitizer(misc_1.toArray)
        .custom(search_1.isStringArray).withMessage('Should have a valid one of tags array'),
    express_validator_1.query('tagsAllOf')
        .optional()
        .customSanitizer(misc_1.toArray)
        .custom(search_1.isStringArray).withMessage('Should have a valid all of tags array'),
    express_validator_1.query('nsfw')
        .optional()
        .custom(search_1.isNSFWQueryValid).withMessage('Should have a valid NSFW attribute'),
    express_validator_1.query('filter')
        .optional()
        .custom(videos_1.isVideoFilterValid).withMessage('Should have a valid filter attribute'),
    function (req, res, next) {
        logger_1.logger.debug('Checking commons video filters query', { parameters: req.query });
        if (utils_1.areValidationErrors(req, res))
            return;
        var user = res.locals.oauth ? res.locals.oauth.token.User : undefined;
        if (req.query.filter === 'all-local' && (!user || user.hasRight(shared_1.UserRight.SEE_ALL_VIDEOS) === false)) {
            res.status(401)
                .json({ error: 'You are not allowed to see all local videos.' });
            return;
        }
        return next();
    }
];
exports.commonVideosFiltersValidator = commonVideosFiltersValidator;
// ---------------------------------------------------------------------------
function areErrorsInScheduleUpdate(req, res) {
    if (req.body.scheduleUpdate) {
        if (!req.body.scheduleUpdate.updateAt) {
            logger_1.logger.warn('Invalid parameters: scheduleUpdate.updateAt is mandatory.');
            res.status(400)
                .json({ error: 'Schedule update at is mandatory.' });
            return true;
        }
    }
    return false;
}
function isVideoAccepted(req, res, videoFile) {
    return __awaiter(this, void 0, void 0, function () {
        var acceptParameters, acceptedResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    acceptParameters = {
                        videoBody: req.body,
                        videoFile: videoFile,
                        user: res.locals.oauth.token.User
                    };
                    return [4 /*yield*/, hooks_1.Hooks.wrapFun(moderation_1.isLocalVideoAccepted, acceptParameters, 'filter:api.video.upload.accept.result')];
                case 1:
                    acceptedResult = _a.sent();
                    if (!acceptedResult || acceptedResult.accepted !== true) {
                        logger_1.logger.info('Refused local video.', { acceptedResult: acceptedResult, acceptParameters: acceptParameters });
                        res.status(403)
                            .json({ error: acceptedResult.errorMessage || 'Refused local video' });
                        return [2 /*return*/, false];
                    }
                    return [2 /*return*/, true];
            }
        });
    });
}
