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
var misc_1 = require("../../../helpers/custom-validators/misc");
var video_rates_1 = require("../../../helpers/custom-validators/video-rates");
var videos_1 = require("../../../helpers/custom-validators/videos");
var logger_1 = require("../../../helpers/logger");
var utils_1 = require("../utils");
var account_video_rate_1 = require("../../../models/account/account-video-rate");
var accounts_1 = require("../../../helpers/custom-validators/accounts");
var middlewares_1 = require("../../../helpers/middlewares");
var videoUpdateRateValidator = [
    express_validator_1.param('id').custom(misc_1.isIdOrUUIDValid).not().isEmpty().withMessage('Should have a valid id'),
    express_validator_1.body('rating').custom(videos_1.isVideoRatingTypeValid).withMessage('Should have a valid rate type'),
    function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.debug('Checking videoRate parameters', { parameters: req.body });
                    if (utils_1.areValidationErrors(req, res))
                        return [2 /*return*/];
                    return [4 /*yield*/, middlewares_1.doesVideoExist(req.params.id, res)];
                case 1:
                    if (!(_a.sent()))
                        return [2 /*return*/];
                    return [2 /*return*/, next()];
            }
        });
    }); }
];
exports.videoUpdateRateValidator = videoUpdateRateValidator;
var getAccountVideoRateValidator = function (rateType) {
    var _this = this;
    return [
        express_validator_1.param('name').custom(accounts_1.isAccountNameValid).withMessage('Should have a valid account name'),
        express_validator_1.param('videoId').custom(misc_1.isIdOrUUIDValid).not().isEmpty().withMessage('Should have a valid videoId'),
        function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var rate;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logger_1.logger.debug('Checking videoCommentGetValidator parameters.', { parameters: req.params });
                        if (utils_1.areValidationErrors(req, res))
                            return [2 /*return*/];
                        return [4 /*yield*/, account_video_rate_1.AccountVideoRateModel.loadLocalAndPopulateVideo(rateType, req.params.name, req.params.videoId)];
                    case 1:
                        rate = _a.sent();
                        if (!rate) {
                            return [2 /*return*/, res.status(404)
                                    .json({ error: 'Video rate not found' })
                                    .end()];
                        }
                        res.locals.accountVideoRate = rate;
                        return [2 /*return*/, next()];
                }
            });
        }); }
    ];
};
exports.getAccountVideoRateValidator = getAccountVideoRateValidator;
var videoRatingValidator = [
    express_validator_1.query('rating').optional().custom(video_rates_1.isRatingValid).withMessage('Value must be one of "like" or "dislike"'),
    function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            logger_1.logger.debug('Checking rating parameter', { parameters: req.params });
            if (utils_1.areValidationErrors(req, res))
                return [2 /*return*/];
            return [2 /*return*/, next()];
        });
    }); }
];
exports.videoRatingValidator = videoRatingValidator;
