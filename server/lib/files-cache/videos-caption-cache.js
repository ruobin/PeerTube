"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var path_1 = require("path");
var constants_1 = require("../../initializers/constants");
var video_1 = require("../../models/video/video");
var video_caption_1 = require("../../models/video/video-caption");
var abstract_video_static_file_cache_1 = require("./abstract-video-static-file-cache");
var config_1 = require("../../initializers/config");
var logger_1 = require("../../helpers/logger");
var activitypub_1 = require("../activitypub");
var VideosCaptionCache = /** @class */ (function (_super) {
    __extends(VideosCaptionCache, _super);
    function VideosCaptionCache() {
        return _super.call(this) || this;
    }
    Object.defineProperty(VideosCaptionCache, "Instance", {
        get: function () {
            return this.instance || (this.instance = new this());
        },
        enumerable: true,
        configurable: true
    });
    VideosCaptionCache.prototype.getFilePathImpl = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var videoCaption, key;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, video_caption_1.VideoCaptionModel.loadByVideoIdAndLanguage(params.videoId, params.language)];
                    case 1:
                        videoCaption = _a.sent();
                        if (!videoCaption)
                            return [2 /*return*/, undefined];
                        if (videoCaption.isOwned())
                            return [2 /*return*/, { isOwned: true, path: path_1.join(config_1.CONFIG.STORAGE.CAPTIONS_DIR, videoCaption.getCaptionName()) }];
                        key = params.videoId + VideosCaptionCache.KEY_DELIMITER + params.language;
                        return [2 /*return*/, this.loadRemoteFile(key)];
                }
            });
        });
    };
    VideosCaptionCache.prototype.loadRemoteFile = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, videoId, language, videoCaption, video, remoteStaticPath, destPath;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        logger_1.logger.debug('Loading remote caption file %s.', key);
                        _a = key.split(VideosCaptionCache.KEY_DELIMITER), videoId = _a[0], language = _a[1];
                        return [4 /*yield*/, video_caption_1.VideoCaptionModel.loadByVideoIdAndLanguage(videoId, language)];
                    case 1:
                        videoCaption = _b.sent();
                        if (!videoCaption)
                            return [2 /*return*/, undefined];
                        if (videoCaption.isOwned())
                            throw new Error('Cannot load remote caption of owned video.');
                        return [4 /*yield*/, video_1.VideoModel.loadAndPopulateAccountAndServerAndTags(videoId)];
                    case 2:
                        video = _b.sent();
                        if (!video)
                            return [2 /*return*/, undefined
                                // FIXME: use URL
                            ];
                        remoteStaticPath = videoCaption.getCaptionStaticPath();
                        destPath = path_1.join(constants_1.FILES_CACHE.VIDEO_CAPTIONS.DIRECTORY, videoCaption.getCaptionName());
                        return [4 /*yield*/, activitypub_1.fetchRemoteVideoStaticFile(video, remoteStaticPath, destPath)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, { isOwned: false, path: destPath }];
                }
            });
        });
    };
    VideosCaptionCache.KEY_DELIMITER = '%';
    return VideosCaptionCache;
}(abstract_video_static_file_cache_1.AbstractVideoStaticFileCache));
exports.VideosCaptionCache = VideosCaptionCache;
