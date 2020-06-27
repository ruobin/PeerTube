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
var misc_1 = require("../../helpers/custom-validators/misc");
var logger_1 = require("../../helpers/logger");
var utils_1 = require("./utils");
var feeds_1 = require("../../helpers/custom-validators/feeds");
var videos_1 = require("../../helpers/middlewares/videos");
var middlewares_1 = require("../../helpers/middlewares");
var videoFeedsValidator = [
    express_validator_1.param('format').optional().custom(feeds_1.isValidRSSFeed).withMessage('Should have a valid format (rss, atom, json)'),
    express_validator_1.query('format').optional().custom(feeds_1.isValidRSSFeed).withMessage('Should have a valid format (rss, atom, json)'),
    express_validator_1.query('accountId').optional().custom(misc_1.isIdValid),
    express_validator_1.query('accountName').optional(),
    express_validator_1.query('videoChannelId').optional().custom(misc_1.isIdValid),
    express_validator_1.query('videoChannelName').optional(),
    function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    logger_1.logger.debug('Checking feeds parameters', { parameters: req.query });
                    if (utils_1.areValidationErrors(req, res))
                        return [2 /*return*/];
                    _a = req.query.accountId;
                    if (!_a) return [3 /*break*/, 2];
                    return [4 /*yield*/, middlewares_1.doesAccountIdExist(req.query.accountId, res)];
                case 1:
                    _a = !(_e.sent());
                    _e.label = 2;
                case 2:
                    if (_a)
                        return [2 /*return*/];
                    _b = req.query.videoChannelId;
                    if (!_b) return [3 /*break*/, 4];
                    return [4 /*yield*/, middlewares_1.doesVideoChannelIdExist(req.query.videoChannelId, res)];
                case 3:
                    _b = !(_e.sent());
                    _e.label = 4;
                case 4:
                    if (_b)
                        return [2 /*return*/];
                    _c = req.query.accountName;
                    if (!_c) return [3 /*break*/, 6];
                    return [4 /*yield*/, middlewares_1.doesAccountNameWithHostExist(req.query.accountName, res)];
                case 5:
                    _c = !(_e.sent());
                    _e.label = 6;
                case 6:
                    if (_c)
                        return [2 /*return*/];
                    _d = req.query.videoChannelName;
                    if (!_d) return [3 /*break*/, 8];
                    return [4 /*yield*/, middlewares_1.doesVideoChannelNameWithHostExist(req.query.videoChannelName, res)];
                case 7:
                    _d = !(_e.sent());
                    _e.label = 8;
                case 8:
                    if (_d)
                        return [2 /*return*/];
                    return [2 /*return*/, next()];
            }
        });
    }); }
];
exports.videoFeedsValidator = videoFeedsValidator;
var videoCommentsFeedsValidator = [
    express_validator_1.param('format').optional().custom(feeds_1.isValidRSSFeed).withMessage('Should have a valid format (rss, atom, json)'),
    express_validator_1.query('format').optional().custom(feeds_1.isValidRSSFeed).withMessage('Should have a valid format (rss, atom, json)'),
    express_validator_1.query('videoId').optional().custom(misc_1.isIdOrUUIDValid),
    function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    logger_1.logger.debug('Checking feeds parameters', { parameters: req.query });
                    if (utils_1.areValidationErrors(req, res))
                        return [2 /*return*/];
                    _a = req.query.videoId;
                    if (!_a) return [3 /*break*/, 2];
                    return [4 /*yield*/, videos_1.doesVideoExist(req.query.videoId, res)];
                case 1:
                    _a = !(_b.sent());
                    _b.label = 2;
                case 2:
                    if (_a)
                        return [2 /*return*/];
                    return [2 /*return*/, next()];
            }
        });
    }); }
];
exports.videoCommentsFeedsValidator = videoCommentsFeedsValidator;
