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
var lodash_1 = require("lodash");
var constants_1 = require("../initializers/constants");
var logger_1 = require("./logger");
var utils_1 = require("./utils");
var path_1 = require("path");
var core_utils_1 = require("./core-utils");
var fs_extra_1 = require("fs-extra");
var request = require("request");
var fs_1 = require("fs");
var processOptions = {
    maxBuffer: 1024 * 1024 * 10 // 10MB
};
function getYoutubeDLInfo(url, opts) {
    var _this = this;
    return new Promise(function (res, rej) { return __awaiter(_this, void 0, void 0, function () {
        var args, youtubeDL;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    args = opts || ['-j', '--flat-playlist'];
                    return [4 /*yield*/, safeGetYoutubeDL()];
                case 1:
                    youtubeDL = _a.sent();
                    youtubeDL.getInfo(url, args, processOptions, function (err, info) {
                        if (err)
                            return rej(err);
                        if (info.is_live === true)
                            return rej(new Error('Cannot download a live streaming.'));
                        var obj = buildVideoInfo(normalizeObject(info));
                        if (obj.name && obj.name.length < constants_1.CONSTRAINTS_FIELDS.VIDEOS.NAME.min)
                            obj.name += ' video';
                        return res(obj);
                    });
                    return [2 /*return*/];
            }
        });
    }); });
}
exports.getYoutubeDLInfo = getYoutubeDLInfo;
function downloadYoutubeDLVideo(url, timeout) {
    var _this = this;
    var path = utils_1.generateVideoImportTmpPath(url);
    var timer;
    logger_1.logger.info('Importing youtubeDL video %s', url);
    var options = ['-f', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best', '-o', path];
    if (process.env.FFMPEG_PATH) {
        options.push('--ffmpeg-location');
        options.push(process.env.FFMPEG_PATH);
    }
    return new Promise(function (res, rej) { return __awaiter(_this, void 0, void 0, function () {
        var youtubeDL;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, safeGetYoutubeDL()];
                case 1:
                    youtubeDL = _a.sent();
                    youtubeDL.exec(url, options, processOptions, function (err) {
                        clearTimeout(timer);
                        if (err) {
                            fs_extra_1.remove(path)["catch"](function (err) { return logger_1.logger.error('Cannot delete path on YoutubeDL error.', { err: err }); });
                            return rej(err);
                        }
                        return res(path);
                    });
                    timer = setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, fs_extra_1.remove(path)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/, rej(new Error('YoutubeDL download timeout.'))];
                            }
                        });
                    }); }, timeout);
                    return [2 /*return*/];
            }
        });
    }); });
}
exports.downloadYoutubeDLVideo = downloadYoutubeDLVideo;
// Thanks: https://github.com/przemyslawpluta/node-youtube-dl/blob/master/lib/downloader.js
// We rewrote it to avoid sync calls
function updateYoutubeDLBinary() {
    return __awaiter(this, void 0, void 0, function () {
        var binDirectory, bin, detailsPath, url;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.info('Updating youtubeDL binary.');
                    binDirectory = path_1.join(core_utils_1.root(), 'node_modules', 'youtube-dl', 'bin');
                    bin = path_1.join(binDirectory, 'youtube-dl');
                    detailsPath = path_1.join(binDirectory, 'details');
                    url = 'https://yt-dl.org/downloads/latest/youtube-dl';
                    return [4 /*yield*/, fs_extra_1.ensureDir(binDirectory)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, new Promise(function (res) {
                            request.get(url, { followRedirect: false }, function (err, result) {
                                if (err) {
                                    logger_1.logger.error('Cannot update youtube-dl.', { err: err });
                                    return res();
                                }
                                if (result.statusCode !== 302) {
                                    logger_1.logger.error('youtube-dl update error: did not get redirect for the latest version link. Status %d', result.statusCode);
                                    return res();
                                }
                                var url = result.headers.location;
                                var downloadFile = request.get(url);
                                var newVersion = /yt-dl\.org\/downloads\/(\d{4}\.\d\d\.\d\d(\.\d)?)\/youtube-dl/.exec(url)[1];
                                downloadFile.on('response', function (result) {
                                    if (result.statusCode !== 200) {
                                        logger_1.logger.error('Cannot update youtube-dl: new version response is not 200, it\'s %d.', result.statusCode);
                                        return res();
                                    }
                                    downloadFile.pipe(fs_1.createWriteStream(bin, { mode: 493 }));
                                });
                                downloadFile.on('error', function (err) {
                                    logger_1.logger.error('youtube-dl update error.', { err: err });
                                    return res();
                                });
                                downloadFile.on('end', function () {
                                    var details = JSON.stringify({ version: newVersion, path: bin, exec: 'youtube-dl' });
                                    fs_extra_1.writeFile(detailsPath, details, { encoding: 'utf8' }, function (err) {
                                        if (err) {
                                            logger_1.logger.error('youtube-dl update error: cannot write details.', { err: err });
                                            return res();
                                        }
                                        logger_1.logger.info('youtube-dl updated to version %s.', newVersion);
                                        return res();
                                    });
                                });
                            });
                        })];
            }
        });
    });
}
exports.updateYoutubeDLBinary = updateYoutubeDLBinary;
function safeGetYoutubeDL() {
    return __awaiter(this, void 0, void 0, function () {
        var youtubeDL, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 1, , 3]);
                    youtubeDL = require('youtube-dl');
                    return [3 /*break*/, 3];
                case 1:
                    e_1 = _a.sent();
                    // Download binary
                    return [4 /*yield*/, updateYoutubeDLBinary()];
                case 2:
                    // Download binary
                    _a.sent();
                    youtubeDL = require('youtube-dl');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/, youtubeDL];
            }
        });
    });
}
exports.safeGetYoutubeDL = safeGetYoutubeDL;
function buildOriginallyPublishedAt(obj) {
    var originallyPublishedAt = null;
    var uploadDateMatcher = /^(\d{4})(\d{2})(\d{2})$/.exec(obj.upload_date);
    if (uploadDateMatcher) {
        originallyPublishedAt = new Date();
        originallyPublishedAt.setHours(0, 0, 0, 0);
        var year = parseInt(uploadDateMatcher[1], 10);
        // Month starts from 0
        var month = parseInt(uploadDateMatcher[2], 10) - 1;
        var day = parseInt(uploadDateMatcher[3], 10);
        originallyPublishedAt.setFullYear(year, month, day);
    }
    return originallyPublishedAt;
}
exports.buildOriginallyPublishedAt = buildOriginallyPublishedAt;
// ---------------------------------------------------------------------------
function normalizeObject(obj) {
    var newObj = {};
    for (var _i = 0, _a = Object.keys(obj); _i < _a.length; _i++) {
        var key = _a[_i];
        // Deprecated key
        if (key === 'resolution')
            continue;
        var value = obj[key];
        if (typeof value === 'string') {
            newObj[key] = value.normalize();
        }
        else {
            newObj[key] = value;
        }
    }
    return newObj;
}
function buildVideoInfo(obj) {
    return {
        name: titleTruncation(obj.title),
        description: descriptionTruncation(obj.description),
        category: getCategory(obj.categories),
        licence: getLicence(obj.license),
        nsfw: isNSFW(obj),
        tags: getTags(obj.tags),
        thumbnailUrl: obj.thumbnail || undefined,
        originallyPublishedAt: buildOriginallyPublishedAt(obj)
    };
}
function titleTruncation(title) {
    return lodash_1.truncate(title, {
        'length': constants_1.CONSTRAINTS_FIELDS.VIDEOS.NAME.max,
        'separator': /,? +/,
        'omission': ' […]'
    });
}
function descriptionTruncation(description) {
    if (!description || description.length < constants_1.CONSTRAINTS_FIELDS.VIDEOS.DESCRIPTION.min)
        return undefined;
    return lodash_1.truncate(description, {
        'length': constants_1.CONSTRAINTS_FIELDS.VIDEOS.DESCRIPTION.max,
        'separator': /,? +/,
        'omission': ' […]'
    });
}
function isNSFW(info) {
    return info.age_limit && info.age_limit >= 16;
}
function getTags(tags) {
    if (Array.isArray(tags) === false)
        return [];
    return tags
        .filter(function (t) { return t.length < constants_1.CONSTRAINTS_FIELDS.VIDEOS.TAG.max && t.length > constants_1.CONSTRAINTS_FIELDS.VIDEOS.TAG.min; })
        .map(function (t) { return t.normalize(); })
        .slice(0, 5);
}
function getLicence(licence) {
    if (!licence)
        return undefined;
    if (licence.indexOf('Creative Commons Attribution') !== -1)
        return 1;
    return undefined;
}
function getCategory(categories) {
    if (!categories)
        return undefined;
    var categoryString = categories[0];
    if (!categoryString || typeof categoryString !== 'string')
        return undefined;
    if (categoryString === 'News & Politics')
        return 11;
    for (var _i = 0, _a = Object.keys(constants_1.VIDEO_CATEGORIES); _i < _a.length; _i++) {
        var key = _a[_i];
        var category = constants_1.VIDEO_CATEGORIES[key];
        if (categoryString.toLowerCase() === category.toLowerCase())
            return parseInt(key, 10);
    }
    return undefined;
}
