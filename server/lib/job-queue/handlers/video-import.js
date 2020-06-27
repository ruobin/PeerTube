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
var logger_1 = require("../../../helpers/logger");
var youtube_dl_1 = require("../../../helpers/youtube-dl");
var video_import_1 = require("../../../models/video/video-import");
var videos_1 = require("../../../../shared/models/videos");
var ffmpeg_utils_1 = require("../../../helpers/ffmpeg-utils");
var path_1 = require("path");
var video_file_1 = require("../../../models/video/video-file");
var constants_1 = require("../../../initializers/constants");
var shared_1 = require("../../../../shared");
var index_1 = require("../index");
var activitypub_1 = require("../../activitypub");
var video_1 = require("../../../models/video/video");
var webtorrent_1 = require("../../../helpers/webtorrent");
var utils_1 = require("../../../helpers/utils");
var fs_extra_1 = require("fs-extra");
var notifier_1 = require("../../notifier");
var config_1 = require("../../../initializers/config");
var database_1 = require("../../../initializers/database");
var thumbnail_1 = require("../../thumbnail");
var thumbnail_type_1 = require("../../../../shared/models/videos/thumbnail.type");
function processVideoImport(job) {
    return __awaiter(this, void 0, void 0, function () {
        var payload;
        return __generator(this, function (_a) {
            payload = job.data;
            if (payload.type === 'youtube-dl')
                return [2 /*return*/, processYoutubeDLImport(job, payload)];
            if (payload.type === 'magnet-uri' || payload.type === 'torrent-file')
                return [2 /*return*/, processTorrentImport(job, payload)];
            return [2 /*return*/];
        });
    });
}
exports.processVideoImport = processVideoImport;
// ---------------------------------------------------------------------------
function processTorrentImport(job, payload) {
    return __awaiter(this, void 0, void 0, function () {
        var videoImport, options, target;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.info('Processing torrent video import in job %d.', job.id);
                    return [4 /*yield*/, getVideoImportOrDie(payload.videoImportId)];
                case 1:
                    videoImport = _a.sent();
                    options = {
                        videoImportId: payload.videoImportId,
                        downloadThumbnail: false,
                        downloadPreview: false,
                        generateThumbnail: true,
                        generatePreview: true
                    };
                    target = {
                        torrentName: videoImport.torrentName ? utils_1.getSecureTorrentName(videoImport.torrentName) : undefined,
                        magnetUri: videoImport.magnetUri
                    };
                    return [2 /*return*/, processFile(function () { return webtorrent_1.downloadWebTorrentVideo(target, constants_1.VIDEO_IMPORT_TIMEOUT); }, videoImport, options)];
            }
        });
    });
}
function processYoutubeDLImport(job, payload) {
    return __awaiter(this, void 0, void 0, function () {
        var videoImport, options;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.info('Processing youtubeDL video import in job %d.', job.id);
                    return [4 /*yield*/, getVideoImportOrDie(payload.videoImportId)];
                case 1:
                    videoImport = _a.sent();
                    options = {
                        videoImportId: videoImport.id,
                        downloadThumbnail: payload.downloadThumbnail,
                        downloadPreview: payload.downloadPreview,
                        thumbnailUrl: payload.thumbnailUrl,
                        generateThumbnail: false,
                        generatePreview: false
                    };
                    return [2 /*return*/, processFile(function () { return youtube_dl_1.downloadYoutubeDLVideo(videoImport.targetUrl, constants_1.VIDEO_IMPORT_TIMEOUT); }, videoImport, options)];
            }
        });
    });
}
function getVideoImportOrDie(videoImportId) {
    return __awaiter(this, void 0, void 0, function () {
        var videoImport;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, video_import_1.VideoImportModel.loadAndPopulateVideo(videoImportId)];
                case 1:
                    videoImport = _a.sent();
                    if (!videoImport || !videoImport.Video) {
                        throw new Error('Cannot import video %s: the video import or video linked to this import does not exist anymore.');
                    }
                    return [2 /*return*/, videoImport];
            }
        });
    });
}
function processFile(downloader, videoImport, options) {
    return __awaiter(this, void 0, void 0, function () {
        var tempVideoPath, videoDestFile, videoFile, stats, isAble, videoFileResolution, fps, duration_1, videoFileData, thumbnailModel_1, previewModel_1, videoImportUpdated, dataInput, err_1, errUnlink_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 20, , 27]);
                    return [4 /*yield*/, downloader()
                        // Get information about this video
                    ];
                case 1:
                    // Download video from youtubeDL
                    tempVideoPath = _a.sent();
                    return [4 /*yield*/, fs_extra_1.stat(tempVideoPath)];
                case 2:
                    stats = _a.sent();
                    return [4 /*yield*/, videoImport.User.isAbleToUploadVideo({ size: stats.size })];
                case 3:
                    isAble = _a.sent();
                    if (isAble === false) {
                        throw new Error('The user video quota is exceeded with this video to import.');
                    }
                    return [4 /*yield*/, ffmpeg_utils_1.getVideoFileResolution(tempVideoPath)];
                case 4:
                    videoFileResolution = (_a.sent()).videoFileResolution;
                    return [4 /*yield*/, ffmpeg_utils_1.getVideoFileFPS(tempVideoPath)];
                case 5:
                    fps = _a.sent();
                    return [4 /*yield*/, ffmpeg_utils_1.getDurationFromVideoFile(tempVideoPath)
                        // Create video file object in database
                    ];
                case 6:
                    duration_1 = _a.sent();
                    videoFileData = {
                        extname: path_1.extname(tempVideoPath),
                        resolution: videoFileResolution,
                        size: stats.size,
                        fps: fps,
                        videoId: videoImport.videoId
                    };
                    videoFile = new video_file_1.VideoFileModel(videoFileData);
                    // To clean files if the import fails
                    videoImport.Video.VideoFiles = [videoFile];
                    // Move file
                    videoDestFile = path_1.join(config_1.CONFIG.STORAGE.VIDEOS_DIR, videoImport.Video.getVideoFilename(videoFile));
                    return [4 /*yield*/, fs_extra_1.move(tempVideoPath, videoDestFile)];
                case 7:
                    _a.sent();
                    tempVideoPath = null; // This path is not used anymore
                    if (!(options.downloadThumbnail && options.thumbnailUrl)) return [3 /*break*/, 9];
                    return [4 /*yield*/, thumbnail_1.createVideoMiniatureFromUrl(options.thumbnailUrl, videoImport.Video, thumbnail_type_1.ThumbnailType.MINIATURE)];
                case 8:
                    thumbnailModel_1 = _a.sent();
                    return [3 /*break*/, 11];
                case 9:
                    if (!(options.generateThumbnail || options.downloadThumbnail)) return [3 /*break*/, 11];
                    return [4 /*yield*/, thumbnail_1.generateVideoMiniature(videoImport.Video, videoFile, thumbnail_type_1.ThumbnailType.MINIATURE)];
                case 10:
                    thumbnailModel_1 = _a.sent();
                    _a.label = 11;
                case 11:
                    if (!(options.downloadPreview && options.thumbnailUrl)) return [3 /*break*/, 13];
                    return [4 /*yield*/, thumbnail_1.createVideoMiniatureFromUrl(options.thumbnailUrl, videoImport.Video, thumbnail_type_1.ThumbnailType.PREVIEW)];
                case 12:
                    previewModel_1 = _a.sent();
                    return [3 /*break*/, 15];
                case 13:
                    if (!(options.generatePreview || options.downloadPreview)) return [3 /*break*/, 15];
                    return [4 /*yield*/, thumbnail_1.generateVideoMiniature(videoImport.Video, videoFile, thumbnail_type_1.ThumbnailType.PREVIEW)];
                case 14:
                    previewModel_1 = _a.sent();
                    _a.label = 15;
                case 15: 
                // Create torrent
                return [4 /*yield*/, videoImport.Video.createTorrentAndSetInfoHash(videoFile)];
                case 16:
                    // Create torrent
                    _a.sent();
                    return [4 /*yield*/, database_1.sequelizeTypescript.transaction(function (t) { return __awaiter(_this, void 0, void 0, function () {
                            var video, videoFileCreated, videoForFederation, videoImportUpdated;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, video_1.VideoModel.load(videoImport.videoId, t)];
                                    case 1:
                                        video = _a.sent();
                                        if (!video)
                                            throw new Error('Video linked to import ' + videoImport.videoId + ' does not exist anymore.');
                                        videoImport.Video = video;
                                        return [4 /*yield*/, videoFile.save({ transaction: t })];
                                    case 2:
                                        videoFileCreated = _a.sent();
                                        video.VideoFiles = [videoFileCreated];
                                        // Update video DB object
                                        video.duration = duration_1;
                                        video.state = config_1.CONFIG.TRANSCODING.ENABLED ? shared_1.VideoState.TO_TRANSCODE : shared_1.VideoState.PUBLISHED;
                                        return [4 /*yield*/, video.save({ transaction: t })];
                                    case 3:
                                        _a.sent();
                                        if (!thumbnailModel_1) return [3 /*break*/, 5];
                                        return [4 /*yield*/, video.addAndSaveThumbnail(thumbnailModel_1, t)];
                                    case 4:
                                        _a.sent();
                                        _a.label = 5;
                                    case 5:
                                        if (!previewModel_1) return [3 /*break*/, 7];
                                        return [4 /*yield*/, video.addAndSaveThumbnail(previewModel_1, t)
                                            // Now we can federate the video (reload from database, we need more attributes)
                                        ];
                                    case 6:
                                        _a.sent();
                                        _a.label = 7;
                                    case 7: return [4 /*yield*/, video_1.VideoModel.loadAndPopulateAccountAndServerAndTags(video.uuid, t)];
                                    case 8:
                                        videoForFederation = _a.sent();
                                        return [4 /*yield*/, activitypub_1.federateVideoIfNeeded(videoForFederation, true, t)
                                            // Update video import object
                                        ];
                                    case 9:
                                        _a.sent();
                                        // Update video import object
                                        videoImport.state = videos_1.VideoImportState.SUCCESS;
                                        return [4 /*yield*/, videoImport.save({ transaction: t })];
                                    case 10:
                                        videoImportUpdated = _a.sent();
                                        logger_1.logger.info('Video %s imported.', video.uuid);
                                        videoImportUpdated.Video = videoForFederation;
                                        return [2 /*return*/, videoImportUpdated];
                                }
                            });
                        }); })];
                case 17:
                    videoImportUpdated = _a.sent();
                    notifier_1.Notifier.Instance.notifyOnFinishedVideoImport(videoImportUpdated, true);
                    if (videoImportUpdated.Video.isBlacklisted()) {
                        notifier_1.Notifier.Instance.notifyOnVideoAutoBlacklist(videoImportUpdated.Video);
                    }
                    else {
                        notifier_1.Notifier.Instance.notifyOnNewVideoIfNeeded(videoImportUpdated.Video);
                    }
                    if (!(videoImportUpdated.Video.state === shared_1.VideoState.TO_TRANSCODE)) return [3 /*break*/, 19];
                    dataInput = {
                        type: 'optimize',
                        videoUUID: videoImportUpdated.Video.uuid,
                        isNewVideo: true
                    };
                    return [4 /*yield*/, index_1.JobQueue.Instance.createJob({ type: 'video-transcoding', payload: dataInput })];
                case 18:
                    _a.sent();
                    _a.label = 19;
                case 19: return [3 /*break*/, 27];
                case 20:
                    err_1 = _a.sent();
                    _a.label = 21;
                case 21:
                    _a.trys.push([21, 24, , 25]);
                    if (!tempVideoPath) return [3 /*break*/, 23];
                    return [4 /*yield*/, fs_extra_1.remove(tempVideoPath)];
                case 22:
                    _a.sent();
                    _a.label = 23;
                case 23: return [3 /*break*/, 25];
                case 24:
                    errUnlink_1 = _a.sent();
                    logger_1.logger.warn('Cannot cleanup files after a video import error.', { err: errUnlink_1 });
                    return [3 /*break*/, 25];
                case 25:
                    videoImport.error = err_1.message;
                    videoImport.state = videos_1.VideoImportState.FAILED;
                    return [4 /*yield*/, videoImport.save()];
                case 26:
                    _a.sent();
                    notifier_1.Notifier.Instance.notifyOnFinishedVideoImport(videoImport, false);
                    throw err_1;
                case 27: return [2 /*return*/];
            }
        });
    });
}
