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
var utils_1 = require("../utils");
var misc_1 = require("../../../helpers/custom-validators/misc");
var express_validator_1 = require("express-validator");
var constants_1 = require("../../../initializers/constants");
var shared_1 = require("../../../../shared");
var logger_1 = require("../../../helpers/logger");
var video_captions_1 = require("../../../helpers/custom-validators/video-captions");
var express_utils_1 = require("../../../helpers/express-utils");
var middlewares_1 = require("../../../helpers/middlewares");
var addVideoCaptionValidator = [
    express_validator_1.param('videoId').custom(misc_1.isIdOrUUIDValid).not().isEmpty().withMessage('Should have a valid video id'),
    express_validator_1.param('captionLanguage').custom(video_captions_1.isVideoCaptionLanguageValid).not().isEmpty().withMessage('Should have a valid caption language'),
    express_validator_1.body('captionfile')
        .custom(function (value, _a) {
        var req = _a.req;
        return video_captions_1.isVideoCaptionFile(req.files, 'captionfile');
    }).withMessage('This caption file is not supported or too large. Please, make sure it is of the following type : '
        + constants_1.CONSTRAINTS_FIELDS.VIDEO_CAPTIONS.CAPTION_FILE.EXTNAME.join(', ')),
    function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.debug('Checking addVideoCaption parameters', { parameters: req.body });
                    if (utils_1.areValidationErrors(req, res))
                        return [2 /*return*/, express_utils_1.cleanUpReqFiles(req)];
                    return [4 /*yield*/, middlewares_1.doesVideoExist(req.params.videoId, res)];
                case 1:
                    if (!(_a.sent()))
                        return [2 /*return*/, express_utils_1.cleanUpReqFiles(req)
                            // Check if the user who did the request is able to update the video
                        ];
                    user = res.locals.oauth.token.User;
                    if (!middlewares_1.checkUserCanManageVideo(user, res.locals.video, shared_1.UserRight.UPDATE_ANY_VIDEO, res))
                        return [2 /*return*/, express_utils_1.cleanUpReqFiles(req)];
                    return [2 /*return*/, next()];
            }
        });
    }); }
];
exports.addVideoCaptionValidator = addVideoCaptionValidator;
var deleteVideoCaptionValidator = [
    express_validator_1.param('videoId').custom(misc_1.isIdOrUUIDValid).not().isEmpty().withMessage('Should have a valid video id'),
    express_validator_1.param('captionLanguage').custom(video_captions_1.isVideoCaptionLanguageValid).not().isEmpty().withMessage('Should have a valid caption language'),
    function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.debug('Checking deleteVideoCaption parameters', { parameters: req.params });
                    if (utils_1.areValidationErrors(req, res))
                        return [2 /*return*/];
                    return [4 /*yield*/, middlewares_1.doesVideoExist(req.params.videoId, res)];
                case 1:
                    if (!(_a.sent()))
                        return [2 /*return*/];
                    return [4 /*yield*/, middlewares_1.doesVideoCaptionExist(res.locals.video, req.params.captionLanguage, res)];
                case 2:
                    if (!(_a.sent()))
                        return [2 /*return*/];
                    user = res.locals.oauth.token.User;
                    if (!middlewares_1.checkUserCanManageVideo(user, res.locals.video, shared_1.UserRight.UPDATE_ANY_VIDEO, res))
                        return [2 /*return*/];
                    return [2 /*return*/, next()];
            }
        });
    }); }
];
exports.deleteVideoCaptionValidator = deleteVideoCaptionValidator;
var listVideoCaptionsValidator = [
    express_validator_1.param('videoId').custom(misc_1.isIdOrUUIDValid).not().isEmpty().withMessage('Should have a valid video id'),
    function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.debug('Checking listVideoCaptions parameters', { parameters: req.params });
                    if (utils_1.areValidationErrors(req, res))
                        return [2 /*return*/];
                    return [4 /*yield*/, middlewares_1.doesVideoExist(req.params.videoId, res, 'id')];
                case 1:
                    if (!(_a.sent()))
                        return [2 /*return*/];
                    return [2 /*return*/, next()];
            }
        });
    }); }
];
exports.listVideoCaptionsValidator = listVideoCaptionsValidator;
