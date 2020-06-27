"use strict";
/* tslint:disable:no-unused-expression */
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
var chai = require("chai");
var path_1 = require("path");
var request = require("supertest");
var fs_extra_1 = require("fs-extra");
var ffmpeg = require("fluent-ffmpeg");
var expect = chai.expect;
var webtorrent;
function immutableAssign(target, source) {
    return Object.assign({}, target, source);
}
exports.immutableAssign = immutableAssign;
// Default interval -> 5 minutes
function dateIsValid(dateString, interval) {
    if (interval === void 0) { interval = 300000; }
    var dateToCheck = new Date(dateString);
    var now = new Date();
    return Math.abs(now.getTime() - dateToCheck.getTime()) <= interval;
}
exports.dateIsValid = dateIsValid;
function wait(milliseconds) {
    return new Promise(function (resolve) { return setTimeout(resolve, milliseconds); });
}
exports.wait = wait;
function webtorrentAdd(torrent, refreshWebTorrent) {
    if (refreshWebTorrent === void 0) { refreshWebTorrent = false; }
    var WebTorrent = require('webtorrent');
    if (!webtorrent)
        webtorrent = new WebTorrent();
    if (refreshWebTorrent === true)
        webtorrent = new WebTorrent();
    return new Promise(function (res) { return webtorrent.add(torrent, res); });
}
exports.webtorrentAdd = webtorrentAdd;
function root() {
    // We are in /miscs
    var root = path_1.join(__dirname, '..', '..', '..');
    if (path_1.basename(root) === 'dist')
        root = path_1.resolve(root, '..');
    return root;
}
exports.root = root;
function buildServerDirectory(internalServerNumber, directory) {
    return path_1.join(root(), 'test' + internalServerNumber, directory);
}
exports.buildServerDirectory = buildServerDirectory;
function testImage(url, imageName, imagePath, extension) {
    if (extension === void 0) { extension = '.jpg'; }
    return __awaiter(this, void 0, void 0, function () {
        var res, body, data, minLength, maxLength;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, request(url)
                        .get(imagePath)
                        .expect(200)];
                case 1:
                    res = _a.sent();
                    body = res.body;
                    return [4 /*yield*/, fs_extra_1.readFile(path_1.join(root(), 'server', 'tests', 'fixtures', imageName + extension))];
                case 2:
                    data = _a.sent();
                    minLength = body.length - ((20 * body.length) / 100);
                    maxLength = body.length + ((20 * body.length) / 100);
                    expect(data.length).to.be.above(minLength);
                    expect(data.length).to.be.below(maxLength);
                    return [2 /*return*/];
            }
        });
    });
}
exports.testImage = testImage;
function buildAbsoluteFixturePath(path, customCIPath) {
    if (customCIPath === void 0) { customCIPath = false; }
    if (path_1.isAbsolute(path)) {
        return path;
    }
    if (customCIPath) {
        if (process.env.GITLAB_CI)
            return path_1.join(root(), 'cached-fixtures', path);
        if (process.env.TRAVIS)
            return path_1.join(process.env.HOME, 'fixtures', path);
    }
    return path_1.join(root(), 'server', 'tests', 'fixtures', path);
}
exports.buildAbsoluteFixturePath = buildAbsoluteFixturePath;
function generateHighBitrateVideo() {
    return __awaiter(this, void 0, void 0, function () {
        var tempFixturePath, exists;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tempFixturePath = buildAbsoluteFixturePath('video_high_bitrate_1080p.mp4', true);
                    return [4 /*yield*/, fs_extra_1.ensureDir(path_1.dirname(tempFixturePath))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, fs_extra_1.pathExists(tempFixturePath)];
                case 2:
                    exists = _a.sent();
                    if (!exists) {
                        // Generate a random, high bitrate video on the fly, so we don't have to include
                        // a large file in the repo. The video needs to have a certain minimum length so
                        // that FFmpeg properly applies bitrate limits.
                        // https://stackoverflow.com/a/15795112
                        return [2 /*return*/, new Promise(function (res, rej) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    ffmpeg()
                                        .outputOptions(['-f rawvideo', '-video_size 1920x1080', '-i /dev/urandom'])
                                        .outputOptions(['-ac 2', '-f s16le', '-i /dev/urandom', '-t 10'])
                                        .outputOptions(['-maxrate 10M', '-bufsize 10M'])
                                        .output(tempFixturePath)
                                        .on('error', rej)
                                        .on('end', function () { return res(tempFixturePath); })
                                        .run();
                                    return [2 /*return*/];
                                });
                            }); })];
                    }
                    return [2 /*return*/, tempFixturePath];
            }
        });
    });
}
exports.generateHighBitrateVideo = generateHighBitrateVideo;
