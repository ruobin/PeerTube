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
var core_utils_1 = require("../helpers/core-utils");
var path_1 = require("path");
var miscs_1 = require("../../shared/extra-utils/miscs/miscs");
var video_channels_1 = require("../../shared/extra-utils/videos/video-channels");
var videos_1 = require("../../shared/models/videos");
var configName = 'PeerTube/CLI';
if (core_utils_1.isTestInstance())
    configName += "-" + core_utils_1.getAppNumber();
var config = require('application-config')(configName);
exports.config = config;
var version = require('../../../package.json').version;
exports.version = version;
function getSettings() {
    return new Promise(function (res, rej) {
        var defaultSettings = {
            remotes: [],
            "default": -1
        };
        config.read(function (err, data) {
            if (err)
                return rej(err);
            return res(Object.keys(data).length === 0 ? defaultSettings : data);
        });
    });
}
exports.getSettings = getSettings;
function getNetrc() {
    return __awaiter(this, void 0, void 0, function () {
        var Netrc, netrc;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    Netrc = require('netrc-parser').Netrc;
                    netrc = core_utils_1.isTestInstance()
                        ? new Netrc(path_1.join(miscs_1.root(), 'test' + core_utils_1.getAppNumber(), 'netrc'))
                        : new Netrc();
                    return [4 /*yield*/, netrc.load()];
                case 1:
                    _a.sent();
                    return [2 /*return*/, netrc];
            }
        });
    });
}
exports.getNetrc = getNetrc;
function writeSettings(settings) {
    return new Promise(function (res, rej) {
        config.write(settings, function (err) {
            if (err)
                return rej(err);
            return res();
        });
    });
}
exports.writeSettings = writeSettings;
function deleteSettings() {
    return new Promise(function (res, rej) {
        config.trash(function (err) {
            if (err)
                return rej(err);
            return res();
        });
    });
}
exports.deleteSettings = deleteSettings;
function getRemoteObjectOrDie(program, settings, netrc) {
    if (!program['url'] || !program['username'] || !program['password']) {
        // No remote and we don't have program parameters: quit
        if (settings.remotes.length === 0 || Object.keys(netrc.machines).length === 0) {
            if (!program['url'])
                console.error('--url field is required.');
            if (!program['username'])
                console.error('--username field is required.');
            if (!program['password'])
                console.error('--password field is required.');
            return process.exit(-1);
        }
        var url = program['url'];
        var username = program['username'];
        var password = program['password'];
        if (!url && settings["default"] !== -1)
            url = settings.remotes[settings["default"]];
        var machine = netrc.machines[url];
        if (!username && machine)
            username = machine.login;
        if (!password && machine)
            password = machine.password;
        return { url: url, username: username, password: password };
    }
    return {
        url: program['url'],
        username: program['username'],
        password: program['password']
    };
}
exports.getRemoteObjectOrDie = getRemoteObjectOrDie;
function buildCommonVideoOptions(command) {
    function list(val) {
        return val.split(',');
    }
    return command
        .option('-n, --video-name <name>', 'Video name')
        .option('-c, --category <category_number>', 'Category number')
        .option('-l, --licence <licence_number>', 'Licence number')
        .option('-L, --language <language_code>', 'Language ISO 639 code (fr or en...)')
        .option('-t, --tags <tags>', 'Video tags', list)
        .option('-N, --nsfw', 'Video is Not Safe For Work')
        .option('-d, --video-description <description>', 'Video description')
        .option('-P, --privacy <privacy_number>', 'Privacy')
        .option('-C, --channel-name <channel_name>', 'Channel name')
        .option('-m, --comments-enabled', 'Enable comments')
        .option('-s, --support <support>', 'Video support text')
        .option('-w, --wait-transcoding', 'Wait transcoding before publishing the video');
}
exports.buildCommonVideoOptions = buildCommonVideoOptions;
function buildVideoAttributesFromCommander(url, command, defaultAttributes) {
    if (defaultAttributes === void 0) { defaultAttributes = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var defaultBooleanAttributes, booleanAttributes, _i, _a, key, videoAttributes, res, videoChannel;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    defaultBooleanAttributes = {
                        nsfw: false,
                        commentsEnabled: true,
                        downloadEnabled: true,
                        waitTranscoding: true
                    };
                    booleanAttributes = {};
                    for (_i = 0, _a = Object.keys(defaultBooleanAttributes); _i < _a.length; _i++) {
                        key = _a[_i];
                        if (command[key] !== undefined) {
                            booleanAttributes[key] = command[key];
                        }
                        else if (defaultAttributes[key] !== undefined) {
                            booleanAttributes[key] = defaultAttributes[key];
                        }
                        else {
                            booleanAttributes[key] = defaultBooleanAttributes[key];
                        }
                    }
                    videoAttributes = {
                        name: command['videoName'] || defaultAttributes.name,
                        category: command['category'] || defaultAttributes.category || undefined,
                        licence: command['licence'] || defaultAttributes.licence || undefined,
                        language: command['language'] || defaultAttributes.language || undefined,
                        privacy: command['privacy'] || defaultAttributes.privacy || videos_1.VideoPrivacy.PUBLIC,
                        support: command['support'] || defaultAttributes.support || undefined,
                        description: command['videoDescription'] || defaultAttributes.description || undefined,
                        tags: command['tags'] || defaultAttributes.tags || undefined
                    };
                    Object.assign(videoAttributes, booleanAttributes);
                    if (!command['channelName']) return [3 /*break*/, 2];
                    return [4 /*yield*/, video_channels_1.getVideoChannel(url, command['channelName'])];
                case 1:
                    res = _b.sent();
                    videoChannel = res.body;
                    Object.assign(videoAttributes, { channelId: videoChannel.id });
                    if (!videoAttributes.support && videoChannel.support) {
                        Object.assign(videoAttributes, { support: videoChannel.support });
                    }
                    _b.label = 2;
                case 2: return [2 /*return*/, videoAttributes];
            }
        });
    });
}
exports.buildVideoAttributesFromCommander = buildVideoAttributesFromCommander;
function getServerCredentials(program) {
    return Promise.all([getSettings(), getNetrc()])
        .then(function (_a) {
        var settings = _a[0], netrc = _a[1];
        return getRemoteObjectOrDie(program, settings, netrc);
    });
}
exports.getServerCredentials = getServerCredentials;
