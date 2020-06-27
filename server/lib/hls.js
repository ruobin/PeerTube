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
var path_1 = require("path");
var constants_1 = require("../initializers/constants");
var fs_extra_1 = require("fs-extra");
var ffmpeg_utils_1 = require("../helpers/ffmpeg-utils");
var core_utils_1 = require("../helpers/core-utils");
var video_streaming_playlist_1 = require("../models/video/video-streaming-playlist");
var logger_1 = require("../helpers/logger");
var requests_1 = require("../helpers/requests");
var utils_1 = require("../helpers/utils");
var lodash_1 = require("lodash");
var video_file_1 = require("../models/video/video-file");
var config_1 = require("../initializers/config");
var database_1 = require("../initializers/database");
function updateStreamingPlaylistsInfohashesIfNeeded() {
    return __awaiter(this, void 0, void 0, function () {
        var playlistsToUpdate, _loop_1, _i, playlistsToUpdate_1, playlist;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, video_streaming_playlist_1.VideoStreamingPlaylistModel.listByIncorrectPeerVersion()
                    // Use separate SQL queries, because we could have many videos to update
                ];
                case 1:
                    playlistsToUpdate = _a.sent();
                    _loop_1 = function (playlist) {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, database_1.sequelizeTypescript.transaction(function (t) { return __awaiter(_this, void 0, void 0, function () {
                                        var videoFiles;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, video_file_1.VideoFileModel.listByStreamingPlaylist(playlist.id, t)];
                                                case 1:
                                                    videoFiles = _a.sent();
                                                    playlist.p2pMediaLoaderInfohashes = video_streaming_playlist_1.VideoStreamingPlaylistModel.buildP2PMediaLoaderInfoHashes(playlist.playlistUrl, videoFiles);
                                                    playlist.p2pMediaLoaderPeerVersion = constants_1.P2P_MEDIA_LOADER_PEER_VERSION;
                                                    return [4 /*yield*/, playlist.save({ transaction: t })];
                                                case 2:
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
                    };
                    _i = 0, playlistsToUpdate_1 = playlistsToUpdate;
                    _a.label = 2;
                case 2:
                    if (!(_i < playlistsToUpdate_1.length)) return [3 /*break*/, 5];
                    playlist = playlistsToUpdate_1[_i];
                    return [5 /*yield**/, _loop_1(playlist)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.updateStreamingPlaylistsInfohashesIfNeeded = updateStreamingPlaylistsInfohashesIfNeeded;
function updateMasterHLSPlaylist(video) {
    return __awaiter(this, void 0, void 0, function () {
        var directory, masterPlaylists, masterPlaylistPath, _i, _a, file, filePlaylistPath, videoFilePath, size, bandwidth, resolution, line;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    directory = path_1.join(constants_1.HLS_STREAMING_PLAYLIST_DIRECTORY, video.uuid);
                    masterPlaylists = ['#EXTM3U', '#EXT-X-VERSION:3'];
                    masterPlaylistPath = path_1.join(directory, video_streaming_playlist_1.VideoStreamingPlaylistModel.getMasterHlsPlaylistFilename());
                    _i = 0, _a = video.VideoFiles;
                    _b.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                    file = _a[_i];
                    filePlaylistPath = path_1.join(directory, video_streaming_playlist_1.VideoStreamingPlaylistModel.getHlsPlaylistFilename(file.resolution));
                    return [4 /*yield*/, fs_extra_1.pathExists(filePlaylistPath)];
                case 2:
                    if ((_b.sent()) === false)
                        return [3 /*break*/, 4];
                    videoFilePath = video.getVideoFilePath(file);
                    return [4 /*yield*/, ffmpeg_utils_1.getVideoFileSize(videoFilePath)];
                case 3:
                    size = _b.sent();
                    bandwidth = 'BANDWIDTH=' + video.getBandwidthBits(file);
                    resolution = "RESOLUTION=" + size.width + "x" + size.height;
                    line = "#EXT-X-STREAM-INF:" + bandwidth + "," + resolution;
                    if (file.fps)
                        line += ',FRAME-RATE=' + file.fps;
                    masterPlaylists.push(line);
                    masterPlaylists.push(video_streaming_playlist_1.VideoStreamingPlaylistModel.getHlsPlaylistFilename(file.resolution));
                    _b.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 1];
                case 5: return [4 /*yield*/, fs_extra_1.writeFile(masterPlaylistPath, masterPlaylists.join('\n') + '\n')];
                case 6:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.updateMasterHLSPlaylist = updateMasterHLSPlaylist;
function updateSha256Segments(video) {
    return __awaiter(this, void 0, void 0, function () {
        var json, playlistDirectory, _i, _a, file, rangeHashes, videoPath, playlistPath, playlistContent, ranges, fd, _b, ranges_1, range, buf, videoFilename, outputPath;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    json = {};
                    playlistDirectory = path_1.join(constants_1.HLS_STREAMING_PLAYLIST_DIRECTORY, video.uuid);
                    _i = 0, _a = video.VideoFiles;
                    _c.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 11];
                    file = _a[_i];
                    rangeHashes = {};
                    videoPath = path_1.join(playlistDirectory, video_streaming_playlist_1.VideoStreamingPlaylistModel.getHlsVideoName(video.uuid, file.resolution));
                    playlistPath = path_1.join(playlistDirectory, video_streaming_playlist_1.VideoStreamingPlaylistModel.getHlsPlaylistFilename(file.resolution));
                    return [4 /*yield*/, fs_extra_1.pathExists(playlistPath)];
                case 2:
                    // Maybe the playlist is not generated for this resolution yet
                    if (!(_c.sent()))
                        return [3 /*break*/, 10];
                    return [4 /*yield*/, fs_extra_1.readFile(playlistPath)];
                case 3:
                    playlistContent = _c.sent();
                    ranges = getRangesFromPlaylist(playlistContent.toString());
                    return [4 /*yield*/, fs_extra_1.open(videoPath, 'r')];
                case 4:
                    fd = _c.sent();
                    _b = 0, ranges_1 = ranges;
                    _c.label = 5;
                case 5:
                    if (!(_b < ranges_1.length)) return [3 /*break*/, 8];
                    range = ranges_1[_b];
                    buf = Buffer.alloc(range.length);
                    return [4 /*yield*/, fs_extra_1.read(fd, buf, 0, range.length, range.offset)];
                case 6:
                    _c.sent();
                    rangeHashes[range.offset + "-" + (range.offset + range.length - 1)] = core_utils_1.sha256(buf);
                    _c.label = 7;
                case 7:
                    _b++;
                    return [3 /*break*/, 5];
                case 8: return [4 /*yield*/, fs_extra_1.close(fd)];
                case 9:
                    _c.sent();
                    videoFilename = video_streaming_playlist_1.VideoStreamingPlaylistModel.getHlsVideoName(video.uuid, file.resolution);
                    json[videoFilename] = rangeHashes;
                    _c.label = 10;
                case 10:
                    _i++;
                    return [3 /*break*/, 1];
                case 11:
                    outputPath = path_1.join(playlistDirectory, video_streaming_playlist_1.VideoStreamingPlaylistModel.getHlsSha256SegmentsFilename());
                    return [4 /*yield*/, fs_extra_1.outputJSON(outputPath, json)];
                case 12:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.updateSha256Segments = updateSha256Segments;
function getRangesFromPlaylist(playlistContent) {
    var ranges = [];
    var lines = playlistContent.split('\n');
    var regex = /^#EXT-X-BYTERANGE:(\d+)@(\d+)$/;
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        var captured = regex.exec(line);
        if (captured) {
            ranges.push({ length: parseInt(captured[1], 10), offset: parseInt(captured[2], 10) });
        }
    }
    return ranges;
}
function downloadPlaylistSegments(playlistUrl, destinationDir, timeout) {
    var _this = this;
    var timer;
    logger_1.logger.info('Importing HLS playlist %s', playlistUrl);
    return new Promise(function (res, rej) { return __awaiter(_this, void 0, void 0, function () {
        var tmpDirectory, _a, _b, subPlaylistUrls, subRequests, fileUrls, _c, _d, _i, fileUrls_1, fileUrl, destPath, bodyKBLimit, err_1;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _a = path_1.join;
                    _b = [config_1.CONFIG.STORAGE.TMP_DIR];
                    return [4 /*yield*/, utils_1.generateRandomString(10)];
                case 1:
                    tmpDirectory = _a.apply(void 0, _b.concat([_e.sent()]));
                    return [4 /*yield*/, fs_extra_1.ensureDir(tmpDirectory)];
                case 2:
                    _e.sent();
                    timer = setTimeout(function () {
                        deleteTmpDirectory(tmpDirectory);
                        return rej(new Error('HLS download timeout.'));
                    }, timeout);
                    _e.label = 3;
                case 3:
                    _e.trys.push([3, 11, , 12]);
                    return [4 /*yield*/, fetchUniqUrls(playlistUrl)];
                case 4:
                    subPlaylistUrls = _e.sent();
                    subRequests = subPlaylistUrls.map(function (u) { return fetchUniqUrls(u); });
                    _c = lodash_1.uniq;
                    _d = lodash_1.flatten;
                    return [4 /*yield*/, Promise.all(subRequests)];
                case 5:
                    fileUrls = _c.apply(void 0, [_d.apply(void 0, [_e.sent()])]);
                    logger_1.logger.debug('Will download %d HLS files.', fileUrls.length, { fileUrls: fileUrls });
                    _i = 0, fileUrls_1 = fileUrls;
                    _e.label = 6;
                case 6:
                    if (!(_i < fileUrls_1.length)) return [3 /*break*/, 9];
                    fileUrl = fileUrls_1[_i];
                    destPath = path_1.join(tmpDirectory, path_1.basename(fileUrl));
                    bodyKBLimit = 10 * 1000 * 1000 // 10GB
                    ;
                    return [4 /*yield*/, requests_1.doRequestAndSaveToFile({ uri: fileUrl }, destPath, bodyKBLimit)];
                case 7:
                    _e.sent();
                    _e.label = 8;
                case 8:
                    _i++;
                    return [3 /*break*/, 6];
                case 9:
                    clearTimeout(timer);
                    return [4 /*yield*/, fs_extra_1.move(tmpDirectory, destinationDir, { overwrite: true })];
                case 10:
                    _e.sent();
                    return [2 /*return*/, res()];
                case 11:
                    err_1 = _e.sent();
                    deleteTmpDirectory(tmpDirectory);
                    return [2 /*return*/, rej(err_1)];
                case 12: return [2 /*return*/];
            }
        });
    }); });
    function deleteTmpDirectory(directory) {
        fs_extra_1.remove(directory)["catch"](function (err) { return logger_1.logger.error('Cannot delete path on HLS download error.', { err: err }); });
    }
    function fetchUniqUrls(playlistUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var body, urls;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, requests_1.doRequest({ uri: playlistUrl })];
                    case 1:
                        body = (_a.sent()).body;
                        if (!body)
                            return [2 /*return*/, []];
                        urls = body.split('\n')
                            .filter(function (line) { return line.endsWith('.m3u8') || line.endsWith('.mp4'); })
                            .map(function (url) {
                            if (url.startsWith('http://') || url.startsWith('https://'))
                                return url;
                            return path_1.dirname(playlistUrl) + "/" + url;
                        });
                        return [2 /*return*/, lodash_1.uniq(urls)];
                }
            });
        });
    }
}
exports.downloadPlaylistSegments = downloadPlaylistSegments;
// ---------------------------------------------------------------------------
