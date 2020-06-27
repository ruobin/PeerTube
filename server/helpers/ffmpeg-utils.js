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
var ffmpeg = require("fluent-ffmpeg");
var path_1 = require("path");
var videos_1 = require("../../shared/models/videos");
var constants_1 = require("../initializers/constants");
var image_utils_1 = require("./image-utils");
var logger_1 = require("./logger");
var checker_before_init_1 = require("../initializers/checker-before-init");
var fs_extra_1 = require("fs-extra");
var config_1 = require("../initializers/config");
function computeResolutionsToTranscode(videoFileHeight) {
    var resolutionsEnabled = [];
    var configResolutions = config_1.CONFIG.TRANSCODING.RESOLUTIONS;
    // Put in the order we want to proceed jobs
    var resolutions = [
        videos_1.VideoResolution.H_480P,
        videos_1.VideoResolution.H_360P,
        videos_1.VideoResolution.H_720P,
        videos_1.VideoResolution.H_240P,
        videos_1.VideoResolution.H_1080P,
        videos_1.VideoResolution.H_4K
    ];
    for (var _i = 0, resolutions_1 = resolutions; _i < resolutions_1.length; _i++) {
        var resolution = resolutions_1[_i];
        if (configResolutions[resolution + 'p'] === true && videoFileHeight > resolution) {
            resolutionsEnabled.push(resolution);
        }
    }
    return resolutionsEnabled;
}
exports.computeResolutionsToTranscode = computeResolutionsToTranscode;
function getVideoFileSize(path) {
    return __awaiter(this, void 0, void 0, function () {
        var videoStream;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getVideoStreamFromFile(path)];
                case 1:
                    videoStream = _a.sent();
                    return [2 /*return*/, {
                            width: videoStream.width,
                            height: videoStream.height
                        }];
            }
        });
    });
}
exports.getVideoFileSize = getVideoFileSize;
function getVideoFileResolution(path) {
    return __awaiter(this, void 0, void 0, function () {
        var size;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getVideoFileSize(path)];
                case 1:
                    size = _a.sent();
                    return [2 /*return*/, {
                            videoFileResolution: Math.min(size.height, size.width),
                            isPortraitMode: size.height > size.width
                        }];
            }
        });
    });
}
exports.getVideoFileResolution = getVideoFileResolution;
function getVideoFileFPS(path) {
    return __awaiter(this, void 0, void 0, function () {
        var videoStream, _i, _a, key, valuesText, _b, frames_1, seconds, result;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, getVideoStreamFromFile(path)];
                case 1:
                    videoStream = _c.sent();
                    for (_i = 0, _a = ['avg_frame_rate', 'r_frame_rate']; _i < _a.length; _i++) {
                        key = _a[_i];
                        valuesText = videoStream[key];
                        if (!valuesText)
                            continue;
                        _b = valuesText.split('/'), frames_1 = _b[0], seconds = _b[1];
                        if (!frames_1 || !seconds)
                            continue;
                        result = parseInt(frames_1, 10) / parseInt(seconds, 10);
                        if (result > 0)
                            return [2 /*return*/, Math.round(result)];
                    }
                    return [2 /*return*/, 0];
            }
        });
    });
}
exports.getVideoFileFPS = getVideoFileFPS;
function getVideoFileBitrate(path) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (res, rej) {
                    ffmpeg.ffprobe(path, function (err, metadata) {
                        if (err)
                            return rej(err);
                        return res(metadata.format.bit_rate);
                    });
                })];
        });
    });
}
exports.getVideoFileBitrate = getVideoFileBitrate;
function getDurationFromVideoFile(path) {
    return new Promise(function (res, rej) {
        ffmpeg.ffprobe(path, function (err, metadata) {
            if (err)
                return rej(err);
            return res(Math.floor(metadata.format.duration));
        });
    });
}
exports.getDurationFromVideoFile = getDurationFromVideoFile;
function generateImageFromVideoFile(fromPath, folder, imageName, size) {
    return __awaiter(this, void 0, void 0, function () {
        var pendingImageName, options, pendingImagePath, destination, err_1, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    pendingImageName = 'pending-' + imageName;
                    options = {
                        filename: pendingImageName,
                        count: 1,
                        folder: folder
                    };
                    pendingImagePath = path_1.join(folder, pendingImageName);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 9]);
                    return [4 /*yield*/, new Promise(function (res, rej) {
                            ffmpeg(fromPath, { niceness: constants_1.FFMPEG_NICE.THUMBNAIL })
                                .on('error', rej)
                                .on('end', function () { return res(imageName); })
                                .thumbnail(options);
                        })];
                case 2:
                    _a.sent();
                    destination = path_1.join(folder, imageName);
                    return [4 /*yield*/, image_utils_1.processImage(pendingImagePath, destination, size)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 9];
                case 4:
                    err_1 = _a.sent();
                    logger_1.logger.error('Cannot generate image from video %s.', fromPath, { err: err_1 });
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, fs_extra_1.remove(pendingImagePath)];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 8];
                case 7:
                    err_2 = _a.sent();
                    logger_1.logger.debug('Cannot remove pending image path after generation error.', { err: err_2 });
                    return [3 /*break*/, 8];
                case 8: return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
}
exports.generateImageFromVideoFile = generateImageFromVideoFile;
function transcode(options) {
    var _this = this;
    return new Promise(function (res, rej) { return __awaiter(_this, void 0, void 0, function () {
        var command, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 9, , 10]);
                    command = ffmpeg(options.inputPath, { niceness: constants_1.FFMPEG_NICE.TRANSCODING })
                        .output(options.outputPath);
                    if (!(options.type === 'quick-transcode')) return [3 /*break*/, 2];
                    return [4 /*yield*/, buildQuickTranscodeCommand(command)];
                case 1:
                    command = _a.sent();
                    return [3 /*break*/, 8];
                case 2:
                    if (!(options.type === 'hls')) return [3 /*break*/, 4];
                    return [4 /*yield*/, buildHLSCommand(command, options)];
                case 3:
                    command = _a.sent();
                    return [3 /*break*/, 8];
                case 4:
                    if (!(options.type === 'merge-audio')) return [3 /*break*/, 6];
                    return [4 /*yield*/, buildAudioMergeCommand(command, options)];
                case 5:
                    command = _a.sent();
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, buildx264Command(command, options)];
                case 7:
                    command = _a.sent();
                    _a.label = 8;
                case 8:
                    if (config_1.CONFIG.TRANSCODING.THREADS > 0) {
                        // if we don't set any threads ffmpeg will chose automatically
                        command = command.outputOption('-threads ' + config_1.CONFIG.TRANSCODING.THREADS);
                    }
                    command
                        .on('error', function (err, stdout, stderr) {
                        logger_1.logger.error('Error in transcoding job.', { stdout: stdout, stderr: stderr });
                        return rej(err);
                    })
                        .on('end', function () {
                        return fixHLSPlaylistIfNeeded(options)
                            .then(function () { return res(); })["catch"](function (err) { return rej(err); });
                    })
                        .run();
                    return [3 /*break*/, 10];
                case 9:
                    err_3 = _a.sent();
                    return [2 /*return*/, rej(err_3)];
                case 10: return [2 /*return*/];
            }
        });
    }); });
}
exports.transcode = transcode;
function canDoQuickTranscode(path) {
    return __awaiter(this, void 0, void 0, function () {
        var videoStream, parsedAudio, fps, bitRate, resolution, maxAudioBitrate;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getVideoStreamFromFile(path)];
                case 1:
                    videoStream = _a.sent();
                    return [4 /*yield*/, audio.get(path)];
                case 2:
                    parsedAudio = _a.sent();
                    return [4 /*yield*/, getVideoFileFPS(path)];
                case 3:
                    fps = _a.sent();
                    return [4 /*yield*/, getVideoFileBitrate(path)];
                case 4:
                    bitRate = _a.sent();
                    return [4 /*yield*/, getVideoFileResolution(path)
                        // check video params
                    ];
                case 5:
                    resolution = _a.sent();
                    // check video params
                    if (videoStream['codec_name'] !== 'h264')
                        return [2 /*return*/, false];
                    if (fps < constants_1.VIDEO_TRANSCODING_FPS.MIN || fps > constants_1.VIDEO_TRANSCODING_FPS.MAX)
                        return [2 /*return*/, false];
                    if (bitRate > videos_1.getMaxBitrate(resolution.videoFileResolution, fps, constants_1.VIDEO_TRANSCODING_FPS))
                        return [2 /*return*/, false
                            // check audio params (if audio stream exists)
                        ];
                    // check audio params (if audio stream exists)
                    if (parsedAudio.audioStream) {
                        if (parsedAudio.audioStream['codec_name'] !== 'aac')
                            return [2 /*return*/, false];
                        maxAudioBitrate = audio.bitrate['aac'](parsedAudio.audioStream['bit_rate']);
                        if (maxAudioBitrate !== -1 && parsedAudio.audioStream['bit_rate'] > maxAudioBitrate)
                            return [2 /*return*/, false];
                    }
                    return [2 /*return*/, true];
            }
        });
    });
}
exports.canDoQuickTranscode = canDoQuickTranscode;
// ---------------------------------------------------------------------------
function buildx264Command(command, options) {
    return __awaiter(this, void 0, void 0, function () {
        var fps, size;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getVideoFileFPS(options.inputPath)
                    // On small/medium resolutions, limit FPS
                ];
                case 1:
                    fps = _a.sent();
                    // On small/medium resolutions, limit FPS
                    if (options.resolution !== undefined &&
                        options.resolution < constants_1.VIDEO_TRANSCODING_FPS.KEEP_ORIGIN_FPS_RESOLUTION_MIN &&
                        fps > constants_1.VIDEO_TRANSCODING_FPS.AVERAGE) {
                        fps = constants_1.VIDEO_TRANSCODING_FPS.AVERAGE;
                    }
                    return [4 /*yield*/, presetH264(command, options.inputPath, options.resolution, fps)];
                case 2:
                    command = _a.sent();
                    if (options.resolution !== undefined) {
                        size = options.isPortraitMode === true ? options.resolution + "x?" : "?x" + options.resolution;
                        command = command.size(size);
                    }
                    if (fps) {
                        // Hard FPS limits
                        if (fps > constants_1.VIDEO_TRANSCODING_FPS.MAX)
                            fps = constants_1.VIDEO_TRANSCODING_FPS.MAX;
                        else if (fps < constants_1.VIDEO_TRANSCODING_FPS.MIN)
                            fps = constants_1.VIDEO_TRANSCODING_FPS.MIN;
                        command = command.withFPS(fps);
                    }
                    return [2 /*return*/, command];
            }
        });
    });
}
function buildAudioMergeCommand(command, options) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    command = command.loop(undefined);
                    return [4 /*yield*/, presetH264VeryFast(command, options.audioPath, options.resolution)];
                case 1:
                    command = _a.sent();
                    command = command.input(options.audioPath)
                        .videoFilter('scale=trunc(iw/2)*2:trunc(ih/2)*2') // Avoid "height not divisible by 2" error
                        .outputOption('-tune stillimage')
                        .outputOption('-shortest');
                    return [2 /*return*/, command];
            }
        });
    });
}
function buildQuickTranscodeCommand(command) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, presetCopy(command)];
                case 1:
                    command = _a.sent();
                    command = command.outputOption('-map_metadata -1') // strip all metadata
                        .outputOption('-movflags faststart');
                    return [2 /*return*/, command];
            }
        });
    });
}
function buildHLSCommand(command, options) {
    return __awaiter(this, void 0, void 0, function () {
        var videoPath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    videoPath = getHLSVideoPath(options);
                    return [4 /*yield*/, presetCopy(command)];
                case 1:
                    command = _a.sent();
                    command = command.outputOption('-hls_time 4')
                        .outputOption('-hls_list_size 0')
                        .outputOption('-hls_playlist_type vod')
                        .outputOption('-hls_segment_filename ' + videoPath)
                        .outputOption('-hls_segment_type fmp4')
                        .outputOption('-f hls')
                        .outputOption('-hls_flags single_file');
                    return [2 /*return*/, command];
            }
        });
    });
}
function getHLSVideoPath(options) {
    return path_1.dirname(options.outputPath) + "/" + options.hlsPlaylist.videoFilename;
}
function fixHLSPlaylistIfNeeded(options) {
    return __awaiter(this, void 0, void 0, function () {
        var fileContent, videoFileName, videoFilePath, newContent;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (options.type !== 'hls')
                        return [2 /*return*/];
                    return [4 /*yield*/, fs_extra_1.readFile(options.outputPath)];
                case 1:
                    fileContent = _a.sent();
                    videoFileName = options.hlsPlaylist.videoFilename;
                    videoFilePath = getHLSVideoPath(options);
                    newContent = fileContent.toString()
                        .replace("#EXT-X-MAP:URI=\"" + videoFilePath + "\",", "#EXT-X-MAP:URI=\"" + videoFileName + "\",");
                    return [4 /*yield*/, fs_extra_1.writeFile(options.outputPath, newContent)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function getVideoStreamFromFile(path) {
    return new Promise(function (res, rej) {
        ffmpeg.ffprobe(path, function (err, metadata) {
            if (err)
                return rej(err);
            var videoStream = metadata.streams.find(function (s) { return s.codec_type === 'video'; });
            if (!videoStream)
                return rej(new Error('Cannot find video stream of ' + path));
            return res(videoStream);
        });
    });
}
/**
 * A slightly customised version of the 'veryfast' x264 preset
 *
 * The veryfast preset is right in the sweet spot of performance
 * and quality. Superfast and ultrafast will give you better
 * performance, but then quality is noticeably worse.
 */
function presetH264VeryFast(command, input, resolution, fps) {
    return __awaiter(this, void 0, void 0, function () {
        var localCommand;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, presetH264(command, input, resolution, fps)];
                case 1:
                    localCommand = _a.sent();
                    localCommand = localCommand.outputOption('-preset:v veryfast');
                    /*
                    MAIN reference: https://slhck.info/video/2017/03/01/rate-control.html
                    Our target situation is closer to a livestream than a stream,
                    since we want to reduce as much a possible the encoding burden,
                    although not to the point of a livestream where there is a hard
                    constraint on the frames per second to be encoded.
                    */
                    return [2 /*return*/, localCommand];
            }
        });
    });
}
/**
 * A toolbox to play with audio
 */
var audio;
(function (audio) {
    audio.get = function (option) {
        // without position, ffprobe considers the last input only
        // we make it consider the first input only
        // if you pass a file path to pos, then ffprobe acts on that file directly
        return new Promise(function (res, rej) {
            function parseFfprobe(err, data) {
                if (err)
                    return rej(err);
                if ('streams' in data) {
                    var audioStream = data.streams.find(function (stream) { return stream['codec_type'] === 'audio'; });
                    if (audioStream) {
                        return res({
                            absolutePath: data.format.filename,
                            audioStream: audioStream
                        });
                    }
                }
                return res({ absolutePath: data.format.filename });
            }
            return ffmpeg.ffprobe(option, parseFfprobe);
        });
    };
    var bitrate;
    (function (bitrate_1) {
        var baseKbitrate = 384;
        var toBits = function (kbits) { return kbits * 8000; };
        bitrate_1.aac = function (bitrate) {
            switch (true) {
                case bitrate > toBits(baseKbitrate):
                    return baseKbitrate;
                default:
                    return -1; // we interpret it as a signal to copy the audio stream as is
            }
        };
        bitrate_1.mp3 = function (bitrate) {
            /*
            a 192kbit/sec mp3 doesn't hold as much information as a 192kbit/sec aac.
            That's why, when using aac, we can go to lower kbit/sec. The equivalences
            made here are not made to be accurate, especially with good mp3 encoders.
            */
            switch (true) {
                case bitrate <= toBits(192):
                    return 128;
                case bitrate <= toBits(384):
                    return 256;
                default:
                    return baseKbitrate;
            }
        };
    })(bitrate = audio.bitrate || (audio.bitrate = {}));
})(audio || (audio = {}));
exports.audio = audio;
/**
 * Standard profile, with variable bitrate audio and faststart.
 *
 * As for the audio, quality '5' is the highest and ensures 96-112kbps/channel
 * See https://trac.ffmpeg.org/wiki/Encode/AAC#fdk_vbr
 */
function presetH264(command, input, resolution, fps) {
    return __awaiter(this, void 0, void 0, function () {
        var localCommand, parsedAudio, audioCodecName, bitrate, targetBitrate;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    localCommand = command
                        .format('mp4')
                        .videoCodec('libx264')
                        .outputOption('-level 3.1') // 3.1 is the minimal ressource allocation for our highest supported resolution
                        .outputOption('-b_strategy 1') // NOTE: b-strategy 1 - heuristic algorythm, 16 is optimal B-frames for it
                        .outputOption('-bf 16') // NOTE: Why 16: https://github.com/Chocobozzz/PeerTube/pull/774. b-strategy 2 -> B-frames<16
                        .outputOption('-pix_fmt yuv420p') // allows import of source material with incompatible pixel formats (e.g. MJPEG video)
                        .outputOption('-map_metadata -1') // strip all metadata
                        .outputOption('-movflags faststart');
                    return [4 /*yield*/, audio.get(input)];
                case 1:
                    parsedAudio = _a.sent();
                    if (!!parsedAudio.audioStream) return [3 /*break*/, 2];
                    localCommand = localCommand.noAudio();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, checker_before_init_1.checkFFmpegEncoders()];
                case 3:
                    if ((_a.sent()).get('libfdk_aac')) { // we favor VBR, if a good AAC encoder is available
                        localCommand = localCommand
                            .audioCodec('libfdk_aac')
                            .audioQuality(5);
                    }
                    else {
                        // we try to reduce the ceiling bitrate by making rough matches of bitrates
                        // of course this is far from perfect, but it might save some space in the end
                        localCommand = localCommand.audioCodec('aac');
                        audioCodecName = parsedAudio.audioStream['codec_name'];
                        if (audio.bitrate[audioCodecName]) {
                            bitrate = audio.bitrate[audioCodecName](parsedAudio.audioStream['bit_rate']);
                            if (bitrate !== undefined && bitrate !== -1)
                                localCommand = localCommand.audioBitrate(bitrate);
                        }
                    }
                    _a.label = 4;
                case 4:
                    if (fps) {
                        targetBitrate = videos_1.getTargetBitrate(resolution, fps, constants_1.VIDEO_TRANSCODING_FPS);
                        localCommand = localCommand.outputOptions(["-maxrate " + targetBitrate, "-bufsize " + targetBitrate * 2]);
                        // Keyframe interval of 2 seconds for faster seeking and resolution switching.
                        // https://streaminglearningcenter.com/blogs/whats-the-right-keyframe-interval.html
                        // https://superuser.com/a/908325
                        localCommand = localCommand.outputOption("-g " + fps * 2);
                    }
                    return [2 /*return*/, localCommand];
            }
        });
    });
}
function presetCopy(command) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, command
                    .format('mp4')
                    .videoCodec('copy')
                    .audioCodec('copy')];
        });
    });
}
