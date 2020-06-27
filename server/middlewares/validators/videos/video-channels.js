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
var video_channels_1 = require("../../../helpers/custom-validators/video-channels");
var logger_1 = require("../../../helpers/logger");
var video_channel_1 = require("../../../models/video/video-channel");
var utils_1 = require("../utils");
var actor_1 = require("../../../helpers/custom-validators/activitypub/actor");
var actor_2 = require("../../../models/activitypub/actor");
var misc_1 = require("../../../helpers/custom-validators/misc");
var middlewares_1 = require("../../../helpers/middlewares");
var videoChannelsAddValidator = [
    express_validator_1.body('name').custom(actor_1.isActorPreferredUsernameValid).withMessage('Should have a valid channel name'),
    express_validator_1.body('displayName').custom(video_channels_1.isVideoChannelNameValid).withMessage('Should have a valid display name'),
    express_validator_1.body('description').optional().custom(video_channels_1.isVideoChannelDescriptionValid).withMessage('Should have a valid description'),
    express_validator_1.body('support').optional().custom(video_channels_1.isVideoChannelSupportValid).withMessage('Should have a valid support text'),
    function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var actor;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.debug('Checking videoChannelsAdd parameters', { parameters: req.body });
                    if (utils_1.areValidationErrors(req, res))
                        return [2 /*return*/];
                    return [4 /*yield*/, actor_2.ActorModel.loadLocalByName(req.body.name)];
                case 1:
                    actor = _a.sent();
                    if (actor) {
                        res.status(409)
                            .send({ error: 'Another actor (account/channel) with this name on this instance already exists or has already existed.' })
                            .end();
                        return [2 /*return*/, false];
                    }
                    return [2 /*return*/, next()];
            }
        });
    }); }
];
exports.videoChannelsAddValidator = videoChannelsAddValidator;
var videoChannelsUpdateValidator = [
    express_validator_1.param('nameWithHost').exists().withMessage('Should have an video channel name with host'),
    express_validator_1.body('displayName')
        .optional()
        .custom(video_channels_1.isVideoChannelNameValid).withMessage('Should have a valid display name'),
    express_validator_1.body('description')
        .optional()
        .custom(video_channels_1.isVideoChannelDescriptionValid).withMessage('Should have a valid description'),
    express_validator_1.body('support')
        .optional()
        .custom(video_channels_1.isVideoChannelSupportValid).withMessage('Should have a valid support text'),
    express_validator_1.body('bulkVideosSupportUpdate')
        .optional()
        .custom(misc_1.isBooleanValid).withMessage('Should have a valid bulkVideosSupportUpdate boolean field'),
    function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.debug('Checking videoChannelsUpdate parameters', { parameters: req.body });
                    if (utils_1.areValidationErrors(req, res))
                        return [2 /*return*/];
                    return [4 /*yield*/, middlewares_1.doesVideoChannelNameWithHostExist(req.params.nameWithHost, res)];
                case 1:
                    if (!(_a.sent()))
                        return [2 /*return*/];
                    // We need to make additional checks
                    if (res.locals.videoChannel.Actor.isOwned() === false) {
                        return [2 /*return*/, res.status(403)
                                .json({ error: 'Cannot update video channel of another server' })
                                .end()];
                    }
                    if (res.locals.videoChannel.Account.userId !== res.locals.oauth.token.User.id) {
                        return [2 /*return*/, res.status(403)
                                .json({ error: 'Cannot update video channel of another user' })
                                .end()];
                    }
                    return [2 /*return*/, next()];
            }
        });
    }); }
];
exports.videoChannelsUpdateValidator = videoChannelsUpdateValidator;
var videoChannelsRemoveValidator = [
    express_validator_1.param('nameWithHost').exists().withMessage('Should have an video channel name with host'),
    function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.debug('Checking videoChannelsRemove parameters', { parameters: req.params });
                    if (utils_1.areValidationErrors(req, res))
                        return [2 /*return*/];
                    return [4 /*yield*/, middlewares_1.doesVideoChannelNameWithHostExist(req.params.nameWithHost, res)];
                case 1:
                    if (!(_a.sent()))
                        return [2 /*return*/];
                    if (!checkUserCanDeleteVideoChannel(res.locals.oauth.token.User, res.locals.videoChannel, res))
                        return [2 /*return*/];
                    return [4 /*yield*/, checkVideoChannelIsNotTheLastOne(res)];
                case 2:
                    if (!(_a.sent()))
                        return [2 /*return*/];
                    return [2 /*return*/, next()];
            }
        });
    }); }
];
exports.videoChannelsRemoveValidator = videoChannelsRemoveValidator;
var videoChannelsNameWithHostValidator = [
    express_validator_1.param('nameWithHost').exists().withMessage('Should have an video channel name with host'),
    function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.debug('Checking videoChannelsNameWithHostValidator parameters', { parameters: req.params });
                    if (utils_1.areValidationErrors(req, res))
                        return [2 /*return*/];
                    return [4 /*yield*/, middlewares_1.doesVideoChannelNameWithHostExist(req.params.nameWithHost, res)];
                case 1:
                    if (!(_a.sent()))
                        return [2 /*return*/];
                    return [2 /*return*/, next()];
            }
        });
    }); }
];
exports.videoChannelsNameWithHostValidator = videoChannelsNameWithHostValidator;
var localVideoChannelValidator = [
    express_validator_1.param('name').custom(video_channels_1.isVideoChannelNameValid).withMessage('Should have a valid video channel name'),
    function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.debug('Checking localVideoChannelValidator parameters', { parameters: req.params });
                    if (utils_1.areValidationErrors(req, res))
                        return [2 /*return*/];
                    return [4 /*yield*/, middlewares_1.doesLocalVideoChannelNameExist(req.params.name, res)];
                case 1:
                    if (!(_a.sent()))
                        return [2 /*return*/];
                    return [2 /*return*/, next()];
            }
        });
    }); }
];
exports.localVideoChannelValidator = localVideoChannelValidator;
// ---------------------------------------------------------------------------
function checkUserCanDeleteVideoChannel(user, videoChannel, res) {
    if (videoChannel.Actor.isOwned() === false) {
        res.status(403)
            .json({ error: 'Cannot remove video channel of another server.' })
            .end();
        return false;
    }
    // Check if the user can delete the video channel
    // The user can delete it if s/he is an admin
    // Or if s/he is the video channel's account
    if (user.hasRight(shared_1.UserRight.REMOVE_ANY_VIDEO_CHANNEL) === false && videoChannel.Account.userId !== user.id) {
        res.status(403)
            .json({ error: 'Cannot remove video channel of another user' })
            .end();
        return false;
    }
    return true;
}
function checkVideoChannelIsNotTheLastOne(res) {
    return __awaiter(this, void 0, void 0, function () {
        var count;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, video_channel_1.VideoChannelModel.countByAccount(res.locals.oauth.token.User.Account.id)];
                case 1:
                    count = _a.sent();
                    if (count <= 1) {
                        res.status(409)
                            .json({ error: 'Cannot remove the last channel of this user' })
                            .end();
                        return [2 /*return*/, false];
                    }
                    return [2 /*return*/, true];
            }
        });
    });
}
