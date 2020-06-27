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
var video_1 = require("../../../models/video/video");
var video_transcoding_1 = require("./video-transcoding");
var ffmpeg_utils_1 = require("../../../helpers/ffmpeg-utils");
var fs_extra_1 = require("fs-extra");
var video_file_1 = require("../../../models/video/video-file");
var path_1 = require("path");
function processVideoFileImport(job) {
    return __awaiter(this, void 0, void 0, function () {
        var payload, video;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    payload = job.data;
                    logger_1.logger.info('Processing video file import in job %d.', job.id);
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
                    return [4 /*yield*/, updateVideoFile(video, payload.filePath)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, video_transcoding_1.publishNewResolutionIfNeeded(video)];
                case 3:
                    _a.sent();
                    return [2 /*return*/, video];
            }
        });
    });
}
exports.processVideoFileImport = processVideoFileImport;
// ---------------------------------------------------------------------------
function updateVideoFile(video, inputFilePath) {
    return __awaiter(this, void 0, void 0, function () {
        var videoFileResolution, size, fps, updatedVideoFile, currentVideoFile, outputPath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ffmpeg_utils_1.getVideoFileResolution(inputFilePath)];
                case 1:
                    videoFileResolution = (_a.sent()).videoFileResolution;
                    return [4 /*yield*/, fs_extra_1.stat(inputFilePath)];
                case 2:
                    size = (_a.sent()).size;
                    return [4 /*yield*/, ffmpeg_utils_1.getVideoFileFPS(inputFilePath)];
                case 3:
                    fps = _a.sent();
                    updatedVideoFile = new video_file_1.VideoFileModel({
                        resolution: videoFileResolution,
                        extname: path_1.extname(inputFilePath),
                        size: size,
                        fps: fps,
                        videoId: video.id
                    });
                    currentVideoFile = video.VideoFiles.find(function (videoFile) { return videoFile.resolution === updatedVideoFile.resolution; });
                    if (!currentVideoFile) return [3 /*break*/, 6];
                    // Remove old file and old torrent
                    return [4 /*yield*/, video.removeFile(currentVideoFile)];
                case 4:
                    // Remove old file and old torrent
                    _a.sent();
                    return [4 /*yield*/, video.removeTorrent(currentVideoFile)
                        // Remove the old video file from the array
                    ];
                case 5:
                    _a.sent();
                    // Remove the old video file from the array
                    video.VideoFiles = video.VideoFiles.filter(function (f) { return f !== currentVideoFile; });
                    // Update the database
                    currentVideoFile.set('extname', updatedVideoFile.extname);
                    currentVideoFile.set('size', updatedVideoFile.size);
                    currentVideoFile.set('fps', updatedVideoFile.fps);
                    updatedVideoFile = currentVideoFile;
                    _a.label = 6;
                case 6:
                    outputPath = video.getVideoFilePath(updatedVideoFile);
                    return [4 /*yield*/, fs_extra_1.copy(inputFilePath, outputPath)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, video.createTorrentAndSetInfoHash(updatedVideoFile)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, updatedVideoFile.save()];
                case 9:
                    _a.sent();
                    video.VideoFiles.push(updatedVideoFile);
                    return [2 /*return*/];
            }
        });
    });
}
