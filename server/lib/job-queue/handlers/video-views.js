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
var redis_1 = require("../../redis");
var logger_1 = require("../../../helpers/logger");
var video_1 = require("../../../models/video/video");
var video_views_1 = require("../../../models/video/video-views");
var core_utils_1 = require("../../../helpers/core-utils");
var activitypub_1 = require("../../activitypub");
function processVideosViews() {
    return __awaiter(this, void 0, void 0, function () {
        var lastHour, hour, startDate, endDate, videoIds, _i, videoIds_1, videoId, views, video, err_1, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    lastHour = new Date();
                    // In test mode, we run this function multiple times per hour, so we don't want the values of the previous hour
                    if (!core_utils_1.isTestInstance())
                        lastHour.setHours(lastHour.getHours() - 1);
                    hour = lastHour.getHours();
                    startDate = lastHour.setMinutes(0, 0, 0);
                    endDate = lastHour.setMinutes(59, 59, 999);
                    return [4 /*yield*/, redis_1.Redis.Instance.getVideosIdViewed(hour)];
                case 1:
                    videoIds = _a.sent();
                    if (videoIds.length === 0)
                        return [2 /*return*/];
                    logger_1.logger.info('Processing videos views in job for hour %d.', hour);
                    _i = 0, videoIds_1 = videoIds;
                    _a.label = 2;
                case 2:
                    if (!(_i < videoIds_1.length)) return [3 /*break*/, 16];
                    videoId = videoIds_1[_i];
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 14, , 15]);
                    return [4 /*yield*/, redis_1.Redis.Instance.getVideoViews(videoId, hour)];
                case 4:
                    views = _a.sent();
                    if (!views) return [3 /*break*/, 12];
                    logger_1.logger.debug('Adding %d views to video %d in hour %d.', views, videoId, hour);
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 11, , 12]);
                    return [4 /*yield*/, video_1.VideoModel.loadAndPopulateAccountAndServerAndTags(videoId)];
                case 6:
                    video = _a.sent();
                    if (!video) {
                        logger_1.logger.debug('Video %d does not exist anymore, skipping videos view addition.', videoId);
                        return [3 /*break*/, 15];
                    }
                    return [4 /*yield*/, video_views_1.VideoViewModel.create({
                            startDate: startDate,
                            endDate: endDate,
                            views: views,
                            videoId: videoId
                        })];
                case 7:
                    _a.sent();
                    if (!video.isOwned()) return [3 /*break*/, 10];
                    // If this is a remote video, the origin instance will send us an update
                    return [4 /*yield*/, video_1.VideoModel.incrementViews(videoId, views)
                        // Send video update
                    ];
                case 8:
                    // If this is a remote video, the origin instance will send us an update
                    _a.sent();
                    // Send video update
                    video.views += views;
                    return [4 /*yield*/, activitypub_1.federateVideoIfNeeded(video, false)];
                case 9:
                    _a.sent();
                    _a.label = 10;
                case 10: return [3 /*break*/, 12];
                case 11:
                    err_1 = _a.sent();
                    logger_1.logger.error('Cannot create video views for video %d in hour %d.', videoId, hour, { err: err_1 });
                    return [3 /*break*/, 12];
                case 12: return [4 /*yield*/, redis_1.Redis.Instance.deleteVideoViews(videoId, hour)];
                case 13:
                    _a.sent();
                    return [3 /*break*/, 15];
                case 14:
                    err_2 = _a.sent();
                    logger_1.logger.error('Cannot update video views of video %d in hour %d.', videoId, hour, { err: err_2 });
                    return [3 /*break*/, 15];
                case 15:
                    _i++;
                    return [3 /*break*/, 2];
                case 16: return [2 /*return*/];
            }
        });
    });
}
exports.processVideosViews = processVideosViews;
