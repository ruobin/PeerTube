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
// FIXME: https://github.com/nodejs/node/pull/16853
require('tls').DEFAULT_ECDH_CURVE = 'auto';
var program = require("commander");
var path_1 = require("path");
var requests_1 = require("../helpers/requests");
var constants_1 = require("../initializers/constants");
var index_1 = require("../../shared/extra-utils/index");
var lodash_1 = require("lodash");
var prompt = require("prompt");
var fs_extra_1 = require("fs-extra");
var core_utils_1 = require("../helpers/core-utils");
var youtube_dl_1 = require("../helpers/youtube-dl");
var cli_1 = require("./cli");
var processOptions = {
    cwd: __dirname,
    maxBuffer: Infinity
};
var command = program
    .name('import-videos');
command = cli_1.buildCommonVideoOptions(command);
command
    .option('-u, --url <url>', 'Server url')
    .option('-U, --username <username>', 'Username')
    .option('-p, --password <token>', 'Password')
    .option('--target-url <targetUrl>', 'Video target URL')
    .option('--since <since>', 'Publication date (inclusive) since which the videos can be imported (YYYY-MM-DD)', parseDate)
    .option('--until <until>', 'Publication date (inclusive) until which the videos can be imported (YYYY-MM-DD)', parseDate)
    .option('-v, --verbose', 'Verbose mode')
    .parse(process.argv);
cli_1.getServerCredentials(command)
    .then(function (_a) {
    var url = _a.url, username = _a.username, password = _a.password;
    if (!program['targetUrl']) {
        console.error('--targetUrl field is required.');
        process.exit(-1);
    }
    removeEndSlashes(url);
    removeEndSlashes(program['targetUrl']);
    var user = { username: username, password: password };
    run(url, user)["catch"](function (err) {
        console.error(err);
        process.exit(-1);
    });
});
function run(url, user) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, youtubeDL, options;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!!user.password) return [3 /*break*/, 2];
                    _a = user;
                    return [4 /*yield*/, promptPassword()];
                case 1:
                    _a.password = _b.sent();
                    _b.label = 2;
                case 2: return [4 /*yield*/, youtube_dl_1.safeGetYoutubeDL()];
                case 3:
                    youtubeDL = _b.sent();
                    options = ['-j', '--flat-playlist', '--playlist-reverse'];
                    youtubeDL.getInfo(program['targetUrl'], options, processOptions, function (err, info) { return __awaiter(_this, void 0, void 0, function () {
                        var infoArray, _i, infoArray_1, info_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (err) {
                                        console.log(err.message);
                                        process.exit(1);
                                    }
                                    // Normalize utf8 fields
                                    if (Array.isArray(info) === true) {
                                        infoArray = info.map(function (i) { return normalizeObject(i); });
                                    }
                                    else {
                                        infoArray = [normalizeObject(info)];
                                    }
                                    console.log('Will download and upload %d videos.\n', infoArray.length);
                                    _i = 0, infoArray_1 = infoArray;
                                    _a.label = 1;
                                case 1:
                                    if (!(_i < infoArray_1.length)) return [3 /*break*/, 4];
                                    info_1 = infoArray_1[_i];
                                    return [4 /*yield*/, processVideo({
                                            cwd: processOptions.cwd,
                                            url: url,
                                            user: user,
                                            youtubeInfo: info_1
                                        })];
                                case 2:
                                    _a.sent();
                                    _a.label = 3;
                                case 3:
                                    _i++;
                                    return [3 /*break*/, 1];
                                case 4:
                                    console.log('Video/s for user %s imported: %s', program['username'], program['targetUrl']);
                                    process.exit(0);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [2 /*return*/];
            }
        });
    });
}
function processVideo(parameters) {
    var _this = this;
    var youtubeInfo = parameters.youtubeInfo, cwd = parameters.cwd, url = parameters.url, user = parameters.user;
    return new Promise(function (res) { return __awaiter(_this, void 0, void 0, function () {
        var videoInfo, result, path, options, youtubeDL, err_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (program['verbose'])
                        console.log('Fetching object.', youtubeInfo);
                    return [4 /*yield*/, fetchObject(youtubeInfo)];
                case 1:
                    videoInfo = _a.sent();
                    if (program['verbose'])
                        console.log('Fetched object.', videoInfo);
                    if (program['since']) {
                        if (youtube_dl_1.buildOriginallyPublishedAt(videoInfo).getTime() < program['since'].getTime()) {
                            console.log('Video "%s" has been published before "%s", don\'t upload it.\n', videoInfo.title, formatDate(program['since']));
                            return [2 /*return*/, res()];
                        }
                    }
                    if (program['until']) {
                        if (youtube_dl_1.buildOriginallyPublishedAt(videoInfo).getTime() > program['until'].getTime()) {
                            console.log('Video "%s" has been published after "%s", don\'t upload it.\n', videoInfo.title, formatDate(program['until']));
                            return [2 /*return*/, res()];
                        }
                    }
                    return [4 /*yield*/, index_1.searchVideoWithSort(url, videoInfo.title, '-match')];
                case 2:
                    result = _a.sent();
                    console.log('############################################################\n');
                    if (result.body.data.find(function (v) { return v.name === videoInfo.title; })) {
                        console.log('Video "%s" already exists, don\'t reupload it.\n', videoInfo.title);
                        return [2 /*return*/, res()];
                    }
                    path = path_1.join(cwd, core_utils_1.sha256(videoInfo.url) + '.mp4');
                    console.log('Downloading video "%s"...', videoInfo.title);
                    options = ['-f', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best', '-o', path];
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, youtube_dl_1.safeGetYoutubeDL()];
                case 4:
                    youtubeDL = _a.sent();
                    youtubeDL.exec(videoInfo.url, options, processOptions, function (err, output) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (err) {
                                        console.error(err);
                                        return [2 /*return*/, res()];
                                    }
                                    console.log(output.join('\n'));
                                    return [4 /*yield*/, uploadVideoOnPeerTube({
                                            cwd: cwd,
                                            url: url,
                                            user: user,
                                            videoInfo: normalizeObject(videoInfo),
                                            videoPath: path
                                        })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/, res()];
                            }
                        });
                    }); });
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _a.sent();
                    console.log(err_1.message);
                    return [2 /*return*/, res()];
                case 6: return [2 /*return*/];
            }
        });
    }); });
}
function uploadVideoOnPeerTube(parameters) {
    return __awaiter(this, void 0, void 0, function () {
        var videoInfo, videoPath, cwd, url, user, category, licence, tags, thumbnailfile, originallyPublishedAt, defaultAttributes, videoAttributes, accessToken, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    videoInfo = parameters.videoInfo, videoPath = parameters.videoPath, cwd = parameters.cwd, url = parameters.url, user = parameters.user;
                    return [4 /*yield*/, getCategory(videoInfo.categories, url)];
                case 1:
                    category = _a.sent();
                    licence = getLicence(videoInfo.license);
                    tags = [];
                    if (Array.isArray(videoInfo.tags)) {
                        tags = videoInfo.tags
                            .filter(function (t) { return t.length < constants_1.CONSTRAINTS_FIELDS.VIDEOS.TAG.max && t.length > constants_1.CONSTRAINTS_FIELDS.VIDEOS.TAG.min; })
                            .map(function (t) { return t.normalize(); })
                            .slice(0, 5);
                    }
                    if (!videoInfo.thumbnail) return [3 /*break*/, 3];
                    thumbnailfile = path_1.join(cwd, core_utils_1.sha256(videoInfo.thumbnail) + '.jpg');
                    return [4 /*yield*/, requests_1.doRequestAndSaveToFile({
                            method: 'GET',
                            uri: videoInfo.thumbnail
                        }, thumbnailfile)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    originallyPublishedAt = youtube_dl_1.buildOriginallyPublishedAt(videoInfo);
                    defaultAttributes = {
                        name: lodash_1.truncate(videoInfo.title, {
                            'length': constants_1.CONSTRAINTS_FIELDS.VIDEOS.NAME.max,
                            'separator': /,? +/,
                            'omission': ' […]'
                        }),
                        category: category,
                        licence: licence,
                        nsfw: isNSFW(videoInfo),
                        description: videoInfo.description,
                        tags: tags
                    };
                    return [4 /*yield*/, cli_1.buildVideoAttributesFromCommander(url, program, defaultAttributes)];
                case 4:
                    videoAttributes = _a.sent();
                    Object.assign(videoAttributes, {
                        originallyPublishedAt: originallyPublishedAt ? originallyPublishedAt.toISOString() : null,
                        thumbnailfile: thumbnailfile,
                        previewfile: thumbnailfile,
                        fixture: videoPath
                    });
                    console.log('\nUploading on PeerTube video "%s".', videoAttributes.name);
                    return [4 /*yield*/, getAccessTokenOrDie(url, user)];
                case 5:
                    accessToken = _a.sent();
                    _a.label = 6;
                case 6:
                    _a.trys.push([6, 8, , 13]);
                    return [4 /*yield*/, index_1.uploadVideo(url, accessToken, videoAttributes)];
                case 7:
                    _a.sent();
                    return [3 /*break*/, 13];
                case 8:
                    err_2 = _a.sent();
                    if (!(err_2.message.indexOf('401') !== -1)) return [3 /*break*/, 11];
                    console.log('Got 401 Unauthorized, token may have expired, renewing token and retry.');
                    return [4 /*yield*/, getAccessTokenOrDie(url, user)];
                case 9:
                    accessToken = _a.sent();
                    return [4 /*yield*/, index_1.uploadVideo(url, accessToken, videoAttributes)];
                case 10:
                    _a.sent();
                    return [3 /*break*/, 12];
                case 11:
                    console.log(err_2.message);
                    process.exit(1);
                    _a.label = 12;
                case 12: return [3 /*break*/, 13];
                case 13: return [4 /*yield*/, fs_extra_1.remove(videoPath)];
                case 14:
                    _a.sent();
                    if (!thumbnailfile) return [3 /*break*/, 16];
                    return [4 /*yield*/, fs_extra_1.remove(thumbnailfile)];
                case 15:
                    _a.sent();
                    _a.label = 16;
                case 16:
                    console.log('Uploaded video "%s"!\n', videoAttributes.name);
                    return [2 /*return*/];
            }
        });
    });
}
/* ---------------------------------------------------------- */
function getCategory(categories, url) {
    return __awaiter(this, void 0, void 0, function () {
        var categoryString, res, categoriesServer, _i, _a, key, categoryServer;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!categories)
                        return [2 /*return*/, undefined];
                    categoryString = categories[0];
                    if (categoryString === 'News & Politics')
                        return [2 /*return*/, 11];
                    return [4 /*yield*/, index_1.getVideoCategories(url)];
                case 1:
                    res = _b.sent();
                    categoriesServer = res.body;
                    for (_i = 0, _a = Object.keys(categoriesServer); _i < _a.length; _i++) {
                        key = _a[_i];
                        categoryServer = categoriesServer[key];
                        if (categoryString.toLowerCase() === categoryServer.toLowerCase())
                            return [2 /*return*/, parseInt(key, 10)];
                    }
                    return [2 /*return*/, undefined];
            }
        });
    });
}
function getLicence(licence) {
    if (!licence)
        return undefined;
    if (licence.indexOf('Creative Commons Attribution licence') !== -1)
        return 1;
    return undefined;
}
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
function fetchObject(info) {
    var _this = this;
    var url = buildUrl(info);
    return new Promise(function (res, rej) { return __awaiter(_this, void 0, void 0, function () {
        var youtubeDL;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, youtube_dl_1.safeGetYoutubeDL()];
                case 1:
                    youtubeDL = _a.sent();
                    youtubeDL.getInfo(url, undefined, processOptions, function (err, videoInfo) { return __awaiter(_this, void 0, void 0, function () {
                        var videoInfoWithUrl;
                        return __generator(this, function (_a) {
                            if (err)
                                return [2 /*return*/, rej(err)];
                            videoInfoWithUrl = Object.assign(videoInfo, { url: url });
                            return [2 /*return*/, res(normalizeObject(videoInfoWithUrl))];
                        });
                    }); });
                    return [2 /*return*/];
            }
        });
    }); });
}
function buildUrl(info) {
    var webpageUrl = info.webpage_url;
    if (webpageUrl && webpageUrl.match(/^https?:\/\//))
        return webpageUrl;
    var url = info.url;
    if (url && url.match(/^https?:\/\//))
        return url;
    // It seems youtube-dl does not return the video url
    return 'https://www.youtube.com/watch?v=' + info.id;
}
function isNSFW(info) {
    return info.age_limit && info.age_limit >= 16;
}
function removeEndSlashes(url) {
    while (url.endsWith('/')) {
        url.slice(0, -1);
    }
}
function promptPassword() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (res, rej) {
                    prompt.start();
                    var schema = {
                        properties: {
                            password: {
                                hidden: true,
                                required: true
                            }
                        }
                    };
                    prompt.get(schema, function (err, result) {
                        if (err) {
                            return rej(err);
                        }
                        return res(result.password);
                    });
                })];
        });
    });
}
function getAccessTokenOrDie(url, user) {
    return __awaiter(this, void 0, void 0, function () {
        var resClient, client, res, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, index_1.getClient(url)];
                case 1:
                    resClient = _a.sent();
                    client = {
                        id: resClient.body.client_id,
                        secret: resClient.body.client_secret
                    };
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, index_1.login(url, client, user)];
                case 3:
                    res = _a.sent();
                    return [2 /*return*/, res.body.access_token];
                case 4:
                    err_3 = _a.sent();
                    console.error('Cannot authenticate. Please check your username/password.');
                    process.exit(-1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function parseDate(dateAsStr) {
    if (!/\d{4}-\d{2}-\d{2}/.test(dateAsStr)) {
        console.error("Invalid date passed: " + dateAsStr + ". Expected format: YYYY-MM-DD. See help for usage.");
        process.exit(-1);
    }
    var date = new Date(dateAsStr);
    if (isNaN(date.getTime())) {
        console.error("Invalid date passed: " + dateAsStr + ". See help for usage.");
        process.exit(-1);
    }
    return date;
}
function formatDate(date) {
    return date.toISOString().split('T')[0];
}
