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
var constants_1 = require("../initializers/constants");
var path_1 = require("path");
var ffmpeg_utils_1 = require("../helpers/ffmpeg-utils");
var fs_extra_1 = require("fs-extra");
var logger_1 = require("../helpers/logger");
var video_file_1 = require("../models/video/video-file");
var hls_1 = require("./hls");
var video_streaming_playlist_1 = require("../models/video/video-streaming-playlist");
var video_streaming_playlist_type_1 = require("../../shared/models/videos/video-streaming-playlist.type");
var config_1 = require("../initializers/config");
/**
 * Optimize the original video file and replace it. The resolution is not changed.
 */
function optimizeVideofile(video, inputVideoFileArg) {
    return __awaiter(this, void 0, void 0, function () {
        var videosDirectory, transcodeDirectory, newExtname, inputVideoFile, videoInputPath, videoTranscodedPath, transcodeType, transcodeOptions, videoOutputPath, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    videosDirectory = config_1.CONFIG.STORAGE.VIDEOS_DIR;
                    transcodeDirectory = config_1.CONFIG.STORAGE.TMP_DIR;
                    newExtname = '.mp4';
                    inputVideoFile = inputVideoFileArg ? inputVideoFileArg : video.getOriginalFile();
                    videoInputPath = path_1.join(videosDirectory, video.getVideoFilename(inputVideoFile));
                    videoTranscodedPath = path_1.join(transcodeDirectory, video.id + '-transcoded' + newExtname);
                    return [4 /*yield*/, ffmpeg_utils_1.canDoQuickTranscode(videoInputPath)];
                case 1:
                    transcodeType = (_a.sent())
                        ? 'quick-transcode'
                        : 'video';
                    transcodeOptions = {
                        type: transcodeType,
                        inputPath: videoInputPath,
                        outputPath: videoTranscodedPath,
                        resolution: inputVideoFile.resolution
                    };
                    // Could be very long!
                    return [4 /*yield*/, ffmpeg_utils_1.transcode(transcodeOptions)];
                case 2:
                    // Could be very long!
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 6, , 7]);
                    return [4 /*yield*/, fs_extra_1.remove(videoInputPath)
                        // Important to do this before getVideoFilename() to take in account the new file extension
                    ];
                case 4:
                    _a.sent();
                    // Important to do this before getVideoFilename() to take in account the new file extension
                    inputVideoFile.extname = newExtname;
                    videoOutputPath = video.getVideoFilePath(inputVideoFile);
                    return [4 /*yield*/, onVideoFileTranscoding(video, inputVideoFile, videoTranscodedPath, videoOutputPath)];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    err_1 = _a.sent();
                    // Auto destruction...
                    video.destroy()["catch"](function (err) { return logger_1.logger.error('Cannot destruct video after transcoding failure.', { err: err }); });
                    throw err_1;
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.optimizeVideofile = optimizeVideofile;
/**
 * Transcode the original video file to a lower resolution.
 */
function transcodeOriginalVideofile(video, resolution, isPortrait) {
    return __awaiter(this, void 0, void 0, function () {
        var videosDirectory, transcodeDirectory, extname, videoInputPath, newVideoFile, videoOutputPath, videoTranscodedPath, transcodeOptions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    videosDirectory = config_1.CONFIG.STORAGE.VIDEOS_DIR;
                    transcodeDirectory = config_1.CONFIG.STORAGE.TMP_DIR;
                    extname = '.mp4';
                    videoInputPath = path_1.join(videosDirectory, video.getVideoFilename(video.getOriginalFile()));
                    newVideoFile = new video_file_1.VideoFileModel({
                        resolution: resolution,
                        extname: extname,
                        size: 0,
                        videoId: video.id
                    });
                    videoOutputPath = path_1.join(config_1.CONFIG.STORAGE.VIDEOS_DIR, video.getVideoFilename(newVideoFile));
                    videoTranscodedPath = path_1.join(transcodeDirectory, video.getVideoFilename(newVideoFile));
                    transcodeOptions = {
                        type: 'video',
                        inputPath: videoInputPath,
                        outputPath: videoTranscodedPath,
                        resolution: resolution,
                        isPortraitMode: isPortrait
                    };
                    return [4 /*yield*/, ffmpeg_utils_1.transcode(transcodeOptions)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, onVideoFileTranscoding(video, newVideoFile, videoTranscodedPath, videoOutputPath)];
            }
        });
    });
}
exports.transcodeOriginalVideofile = transcodeOriginalVideofile;
function mergeAudioVideofile(video, resolution) {
    return __awaiter(this, void 0, void 0, function () {
        var videosDirectory, transcodeDirectory, newExtname, inputVideoFile, audioInputPath, videoTranscodedPath, transcodeOptions, videoOutputPath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    videosDirectory = config_1.CONFIG.STORAGE.VIDEOS_DIR;
                    transcodeDirectory = config_1.CONFIG.STORAGE.TMP_DIR;
                    newExtname = '.mp4';
                    inputVideoFile = video.getOriginalFile();
                    audioInputPath = path_1.join(videosDirectory, video.getVideoFilename(video.getOriginalFile()));
                    videoTranscodedPath = path_1.join(transcodeDirectory, video.id + '-transcoded' + newExtname);
                    transcodeOptions = {
                        type: 'merge-audio',
                        inputPath: video.getPreview().getPath(),
                        outputPath: videoTranscodedPath,
                        audioPath: audioInputPath,
                        resolution: resolution
                    };
                    return [4 /*yield*/, ffmpeg_utils_1.transcode(transcodeOptions)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, fs_extra_1.remove(audioInputPath)
                        // Important to do this before getVideoFilename() to take in account the new file extension
                    ];
                case 2:
                    _a.sent();
                    // Important to do this before getVideoFilename() to take in account the new file extension
                    inputVideoFile.extname = newExtname;
                    videoOutputPath = video.getVideoFilePath(inputVideoFile);
                    return [2 /*return*/, onVideoFileTranscoding(video, inputVideoFile, videoTranscodedPath, videoOutputPath)];
            }
        });
    });
}
exports.mergeAudioVideofile = mergeAudioVideofile;
function generateHlsPlaylist(video, resolution, isPortraitMode) {
    return __awaiter(this, void 0, void 0, function () {
        var baseHlsDirectory, videoInputPath, outputPath, transcodeOptions, playlistUrl;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    baseHlsDirectory = path_1.join(constants_1.HLS_STREAMING_PLAYLIST_DIRECTORY, video.uuid);
                    return [4 /*yield*/, fs_extra_1.ensureDir(path_1.join(constants_1.HLS_STREAMING_PLAYLIST_DIRECTORY, video.uuid))];
                case 1:
                    _a.sent();
                    videoInputPath = path_1.join(config_1.CONFIG.STORAGE.VIDEOS_DIR, video.getVideoFilename(video.getFile(resolution)));
                    outputPath = path_1.join(baseHlsDirectory, video_streaming_playlist_1.VideoStreamingPlaylistModel.getHlsPlaylistFilename(resolution));
                    transcodeOptions = {
                        type: 'hls',
                        inputPath: videoInputPath,
                        outputPath: outputPath,
                        resolution: resolution,
                        isPortraitMode: isPortraitMode,
                        hlsPlaylist: {
                            videoFilename: video_streaming_playlist_1.VideoStreamingPlaylistModel.getHlsVideoName(video.uuid, resolution)
                        }
                    };
                    return [4 /*yield*/, ffmpeg_utils_1.transcode(transcodeOptions)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, hls_1.updateMasterHLSPlaylist(video)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, hls_1.updateSha256Segments(video)];
                case 4:
                    _a.sent();
                    playlistUrl = constants_1.WEBSERVER.URL + video_streaming_playlist_1.VideoStreamingPlaylistModel.getHlsMasterPlaylistStaticPath(video.uuid);
                    return [4 /*yield*/, video_streaming_playlist_1.VideoStreamingPlaylistModel.upsert({
                            videoId: video.id,
                            playlistUrl: playlistUrl,
                            segmentsSha256Url: constants_1.WEBSERVER.URL + video_streaming_playlist_1.VideoStreamingPlaylistModel.getHlsSha256SegmentsStaticPath(video.uuid),
                            p2pMediaLoaderInfohashes: video_streaming_playlist_1.VideoStreamingPlaylistModel.buildP2PMediaLoaderInfoHashes(playlistUrl, video.VideoFiles),
                            p2pMediaLoaderPeerVersion: constants_1.P2P_MEDIA_LOADER_PEER_VERSION,
                            type: video_streaming_playlist_type_1.VideoStreamingPlaylistType.HLS
                        })];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.generateHlsPlaylist = generateHlsPlaylist;
// ---------------------------------------------------------------------------
function onVideoFileTranscoding(video, videoFile, transcodingPath, outputPath) {
    return __awaiter(this, void 0, void 0, function () {
        var stats, fps, updatedVideoFile;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs_extra_1.stat(transcodingPath)];
                case 1:
                    stats = _a.sent();
                    return [4 /*yield*/, ffmpeg_utils_1.getVideoFileFPS(transcodingPath)];
                case 2:
                    fps = _a.sent();
                    return [4 /*yield*/, fs_extra_1.move(transcodingPath, outputPath)];
                case 3:
                    _a.sent();
                    videoFile.set('size', stats.size);
                    videoFile.set('fps', fps);
                    return [4 /*yield*/, video.createTorrentAndSetInfoHash(videoFile)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, videoFile.save()
                        // Add it if this is a new created file
                    ];
                case 5:
                    updatedVideoFile = _a.sent();
                    // Add it if this is a new created file
                    if (video.VideoFiles.some(function (f) { return f.id === videoFile.id; }) === false) {
                        video.VideoFiles.push(updatedVideoFile);
                    }
                    return [2 /*return*/, video];
            }
        });
    });
}
