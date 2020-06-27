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
var shared_1 = require("../../../../shared");
var logger_1 = require("../../../helpers/logger");
var video_1 = require("../../../models/video/video");
var job_queue_1 = require("../job-queue");
var activitypub_1 = require("../../activitypub");
var database_utils_1 = require("../../../helpers/database-utils");
var initializers_1 = require("../../../initializers");
var ffmpeg_utils_1 = require("../../../helpers/ffmpeg-utils");
var video_transcoding_1 = require("../../video-transcoding");
var notifier_1 = require("../../notifier");
var config_1 = require("../../../initializers/config");
function processVideoTranscoding(job) {
    return __awaiter(this, void 0, void 0, function () {
        var payload, video;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    payload = job.data;
                    logger_1.logger.info('Processing video file in job %d.', job.id);
                    return [4 /*yield*/, video_1.VideoModel.loadAndPopulateAccountAndServerAndTags(payload.videoUUID)
                        // No video, maybe deleted?
                    ];
                case 1:
                    video = _a.sent();
                    // No video, maybe deleted?
                    if (!video) {
                        logger_1.logger.info('Do not process job %d, video does not exist.', job.id);
                        return [2 /*return*/, undefined];
                    }
                    if (!(payload.type === 'hls')) return [3 /*break*/, 4];
                    return [4 /*yield*/, video_transcoding_1.generateHlsPlaylist(video, payload.resolution, payload.isPortraitMode || false)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, database_utils_1.retryTransactionWrapper(onHlsPlaylistGenerationSuccess, video)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 13];
                case 4:
                    if (!(payload.type === 'new-resolution')) return [3 /*break*/, 7];
                    return [4 /*yield*/, video_transcoding_1.transcodeOriginalVideofile(video, payload.resolution, payload.isPortraitMode || false)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, database_utils_1.retryTransactionWrapper(publishNewResolutionIfNeeded, video, payload)];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 13];
                case 7:
                    if (!(payload.type === 'merge-audio')) return [3 /*break*/, 10];
                    return [4 /*yield*/, video_transcoding_1.mergeAudioVideofile(video, payload.resolution)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, database_utils_1.retryTransactionWrapper(publishNewResolutionIfNeeded, video, payload)];
                case 9:
                    _a.sent();
                    return [3 /*break*/, 13];
                case 10: return [4 /*yield*/, video_transcoding_1.optimizeVideofile(video)];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, database_utils_1.retryTransactionWrapper(onVideoFileOptimizerSuccess, video, payload)];
                case 12:
                    _a.sent();
                    _a.label = 13;
                case 13: return [2 /*return*/, video];
            }
        });
    });
}
exports.processVideoTranscoding = processVideoTranscoding;
function onHlsPlaylistGenerationSuccess(video) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (video === undefined)
                        return [2 /*return*/, undefined];
                    return [4 /*yield*/, initializers_1.sequelizeTypescript.transaction(function (t) { return __awaiter(_this, void 0, void 0, function () {
                            var videoDatabase;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, video_1.VideoModel.loadAndPopulateAccountAndServerAndTags(video.uuid, t)
                                        // Video does not exist anymore
                                    ];
                                    case 1:
                                        videoDatabase = _a.sent();
                                        // Video does not exist anymore
                                        if (!videoDatabase)
                                            return [2 /*return*/, undefined
                                                // If the video was not published, we consider it is a new one for other instances
                                            ];
                                        // If the video was not published, we consider it is a new one for other instances
                                        return [4 /*yield*/, activitypub_1.federateVideoIfNeeded(videoDatabase, false, t)];
                                    case 2:
                                        // If the video was not published, we consider it is a new one for other instances
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function publishNewResolutionIfNeeded(video, payload) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, videoDatabase, videoPublished;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, initializers_1.sequelizeTypescript.transaction(function (t) { return __awaiter(_this, void 0, void 0, function () {
                        var videoDatabase, videoPublished;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, video_1.VideoModel.loadAndPopulateAccountAndServerAndTags(video.uuid, t)
                                    // Video does not exist anymore
                                ];
                                case 1:
                                    videoDatabase = _a.sent();
                                    // Video does not exist anymore
                                    if (!videoDatabase)
                                        return [2 /*return*/, undefined];
                                    videoPublished = false;
                                    if (!(videoDatabase.state !== shared_1.VideoState.PUBLISHED)) return [3 /*break*/, 3];
                                    videoPublished = true;
                                    videoDatabase.state = shared_1.VideoState.PUBLISHED;
                                    videoDatabase.publishedAt = new Date();
                                    return [4 /*yield*/, videoDatabase.save({ transaction: t })];
                                case 2:
                                    videoDatabase = _a.sent();
                                    _a.label = 3;
                                case 3: 
                                // If the video was not published, we consider it is a new one for other instances
                                return [4 /*yield*/, activitypub_1.federateVideoIfNeeded(videoDatabase, videoPublished, t)];
                                case 4:
                                    // If the video was not published, we consider it is a new one for other instances
                                    _a.sent();
                                    return [2 /*return*/, { videoDatabase: videoDatabase, videoPublished: videoPublished }];
                            }
                        });
                    }); })];
                case 1:
                    _a = _b.sent(), videoDatabase = _a.videoDatabase, videoPublished = _a.videoPublished;
                    if (videoPublished) {
                        notifier_1.Notifier.Instance.notifyOnNewVideoIfNeeded(videoDatabase);
                        notifier_1.Notifier.Instance.notifyOnVideoPublishedAfterTranscoding(videoDatabase);
                    }
                    return [4 /*yield*/, createHlsJobIfEnabled(payload)];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.publishNewResolutionIfNeeded = publishNewResolutionIfNeeded;
function onVideoFileOptimizerSuccess(videoArg, payload) {
    return __awaiter(this, void 0, void 0, function () {
        var videoFileResolution, _a, videoDatabase, videoPublished, hlsPayload;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (videoArg === undefined)
                        return [2 /*return*/, undefined
                            // Outside the transaction (IO on disk)
                        ];
                    return [4 /*yield*/, videoArg.getOriginalFileResolution()];
                case 1:
                    videoFileResolution = (_b.sent()).videoFileResolution;
                    return [4 /*yield*/, initializers_1.sequelizeTypescript.transaction(function (t) { return __awaiter(_this, void 0, void 0, function () {
                            var videoDatabase, resolutionsEnabled, videoPublished, tasks, _i, resolutionsEnabled_1, resolution, dataInput, p;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, video_1.VideoModel.loadAndPopulateAccountAndServerAndTags(videoArg.uuid, t)
                                        // Video does not exist anymore
                                    ];
                                    case 1:
                                        videoDatabase = _a.sent();
                                        // Video does not exist anymore
                                        if (!videoDatabase)
                                            return [2 /*return*/, undefined
                                                // Create transcoding jobs if there are enabled resolutions
                                            ];
                                        resolutionsEnabled = ffmpeg_utils_1.computeResolutionsToTranscode(videoFileResolution);
                                        logger_1.logger.info('Resolutions computed for video %s and origin file height of %d.', videoDatabase.uuid, videoFileResolution, { resolutions: resolutionsEnabled });
                                        videoPublished = false;
                                        if (!(resolutionsEnabled.length !== 0)) return [3 /*break*/, 3];
                                        tasks = [];
                                        for (_i = 0, resolutionsEnabled_1 = resolutionsEnabled; _i < resolutionsEnabled_1.length; _i++) {
                                            resolution = resolutionsEnabled_1[_i];
                                            dataInput = {
                                                type: 'new-resolution',
                                                videoUUID: videoDatabase.uuid,
                                                resolution: resolution
                                            };
                                            p = job_queue_1.JobQueue.Instance.createJob({ type: 'video-transcoding', payload: dataInput });
                                            tasks.push(p);
                                        }
                                        return [4 /*yield*/, Promise.all(tasks)];
                                    case 2:
                                        _a.sent();
                                        logger_1.logger.info('Transcoding jobs created for uuid %s.', videoDatabase.uuid, { resolutionsEnabled: resolutionsEnabled });
                                        return [3 /*break*/, 5];
                                    case 3:
                                        videoPublished = true;
                                        // No transcoding to do, it's now published
                                        videoDatabase.state = shared_1.VideoState.PUBLISHED;
                                        return [4 /*yield*/, videoDatabase.save({ transaction: t })];
                                    case 4:
                                        videoDatabase = _a.sent();
                                        logger_1.logger.info('No transcoding jobs created for video %s (no resolutions).', videoDatabase.uuid, { privacy: videoDatabase.privacy });
                                        _a.label = 5;
                                    case 5: return [4 /*yield*/, activitypub_1.federateVideoIfNeeded(videoDatabase, payload.isNewVideo, t)];
                                    case 6:
                                        _a.sent();
                                        return [2 /*return*/, { videoDatabase: videoDatabase, videoPublished: videoPublished }];
                                }
                            });
                        }); })];
                case 2:
                    _a = _b.sent(), videoDatabase = _a.videoDatabase, videoPublished = _a.videoPublished;
                    if (payload.isNewVideo)
                        notifier_1.Notifier.Instance.notifyOnNewVideoIfNeeded(videoDatabase);
                    if (videoPublished)
                        notifier_1.Notifier.Instance.notifyOnVideoPublishedAfterTranscoding(videoDatabase);
                    hlsPayload = Object.assign({}, payload, { resolution: videoDatabase.getOriginalFile().resolution });
                    return [4 /*yield*/, createHlsJobIfEnabled(hlsPayload)];
                case 3:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// ---------------------------------------------------------------------------
function createHlsJobIfEnabled(payload) {
    // Generate HLS playlist?
    if (payload && config_1.CONFIG.TRANSCODING.HLS.ENABLED) {
        var hlsTranscodingPayload = {
            type: 'hls',
            videoUUID: payload.videoUUID,
            resolution: payload.resolution,
            isPortraitMode: payload.isPortraitMode
        };
        return job_queue_1.JobQueue.Instance.createJob({ type: 'video-transcoding', payload: hlsTranscodingPayload });
    }
}
