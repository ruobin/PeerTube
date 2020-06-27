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
var logger_1 = require("../../../helpers/logger");
var utils_1 = require("../utils");
var videos_1 = require("./videos");
var video_imports_1 = require("../../../helpers/custom-validators/video-imports");
var express_utils_1 = require("../../../helpers/express-utils");
var videos_2 = require("../../../helpers/custom-validators/videos");
var config_1 = require("../../../initializers/config");
var constants_1 = require("../../../initializers/constants");
var middlewares_1 = require("../../../helpers/middlewares");
var videoImportAddValidator = videos_1.getCommonVideoEditAttributes().concat([
    express_validator_1.body('channelId')
        .customSanitizer(misc_1.toIntOrNull)
        .custom(misc_1.isIdValid).withMessage('Should have correct video channel id'),
    express_validator_1.body('targetUrl')
        .optional()
        .custom(video_imports_1.isVideoImportTargetUrlValid).withMessage('Should have a valid video import target URL'),
    express_validator_1.body('magnetUri')
        .optional()
        .custom(videos_2.isVideoMagnetUriValid).withMessage('Should have a valid video magnet URI'),
    express_validator_1.body('torrentfile')
        .custom(function (value, _a) {
        var req = _a.req;
        return video_imports_1.isVideoImportTorrentFile(req.files);
    }).withMessage('This torrent file is not supported or too large. Please, make sure it is of the following type: '
        + constants_1.CONSTRAINTS_FIELDS.VIDEO_IMPORTS.TORRENT_FILE.EXTNAME.join(', ')),
    express_validator_1.body('name')
        .optional()
        .custom(videos_2.isVideoNameValid).withMessage('Should have a valid name'),
    function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var user, torrentFile;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.debug('Checking videoImportAddValidator parameters', { parameters: req.body });
                    user = res.locals.oauth.token.User;
                    torrentFile = req.files && req.files['torrentfile'] ? req.files['torrentfile'][0] : undefined;
                    if (utils_1.areValidationErrors(req, res))
                        return [2 /*return*/, express_utils_1.cleanUpReqFiles(req)];
                    if (req.body.targetUrl && config_1.CONFIG.IMPORT.VIDEOS.HTTP.ENABLED !== true) {
                        express_utils_1.cleanUpReqFiles(req);
                        return [2 /*return*/, res.status(409)
                                .json({ error: 'HTTP import is not enabled on this instance.' })
                                .end()];
                    }
                    if (config_1.CONFIG.IMPORT.VIDEOS.TORRENT.ENABLED !== true && (req.body.magnetUri || torrentFile)) {
                        express_utils_1.cleanUpReqFiles(req);
                        return [2 /*return*/, res.status(409)
                                .json({ error: 'Torrent/magnet URI import is not enabled on this instance.' })
                                .end()];
                    }
                    return [4 /*yield*/, middlewares_1.doesVideoChannelOfAccountExist(req.body.channelId, user, res)];
                case 1:
                    if (!(_a.sent()))
                        return [2 /*return*/, express_utils_1.cleanUpReqFiles(req)
                            // Check we have at least 1 required param
                        ];
                    // Check we have at least 1 required param
                    if (!req.body.targetUrl && !req.body.magnetUri && !torrentFile) {
                        express_utils_1.cleanUpReqFiles(req);
                        return [2 /*return*/, res.status(400)
                                .json({ error: 'Should have a magnetUri or a targetUrl or a torrent file.' })
                                .end()];
                    }
                    return [2 /*return*/, next()];
            }
        });
    }); }
]);
exports.videoImportAddValidator = videoImportAddValidator;
// ---------------------------------------------------------------------------
