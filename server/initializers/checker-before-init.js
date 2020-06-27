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
var config = require("config");
var core_utils_1 = require("../helpers/core-utils");
var logger_1 = require("../helpers/logger");
// ONLY USE CORE MODULES IN THIS FILE!
// Check the config files
function checkMissedConfig() {
    var required = ['listen.port', 'listen.hostname',
        'webserver.https', 'webserver.hostname', 'webserver.port',
        'trust_proxy',
        'database.hostname', 'database.port', 'database.suffix', 'database.username', 'database.password', 'database.pool.max',
        'smtp.hostname', 'smtp.port', 'smtp.username', 'smtp.password', 'smtp.tls', 'smtp.from_address',
        'email.body.signature', 'email.subject.prefix',
        'storage.avatars', 'storage.videos', 'storage.logs', 'storage.previews', 'storage.thumbnails', 'storage.torrents', 'storage.cache',
        'storage.redundancy', 'storage.tmp', 'storage.streaming_playlists', 'storage.plugins',
        'log.level',
        'user.video_quota', 'user.video_quota_daily',
        'csp.enabled', 'csp.report_only', 'csp.report_uri',
        'cache.previews.size', 'admin.email', 'contact_form.enabled',
        'signup.enabled', 'signup.limit', 'signup.requires_email_verification',
        'signup.filters.cidr.whitelist', 'signup.filters.cidr.blacklist',
        'redundancy.videos.strategies', 'redundancy.videos.check_interval',
        'transcoding.enabled', 'transcoding.threads', 'transcoding.allow_additional_extensions',
        'import.videos.http.enabled', 'import.videos.torrent.enabled', 'auto_blacklist.videos.of_users.enabled',
        'trending.videos.interval_days',
        'instance.name', 'instance.short_description', 'instance.description', 'instance.terms', 'instance.default_client_route',
        'instance.is_nsfw', 'instance.default_nsfw_policy', 'instance.robots', 'instance.securitytxt',
        'services.twitter.username', 'services.twitter.whitelisted',
        'followers.instance.enabled', 'followers.instance.manual_approval',
        'tracker.enabled', 'tracker.private', 'tracker.reject_too_many_announces',
        'history.videos.max_age', 'views.videos.remote.max_age',
        'rates_limit.login.window', 'rates_limit.login.max', 'rates_limit.ask_send_email.window', 'rates_limit.ask_send_email.max',
        'theme.default'
    ];
    var requiredAlternatives = [
        [
            ['redis.hostname', 'redis.port'],
            ['redis.socket']
        ]
    ];
    var miss = [];
    for (var _i = 0, required_1 = required; _i < required_1.length; _i++) {
        var key = required_1[_i];
        if (!config.has(key)) {
            miss.push(key);
        }
    }
    var redundancyVideos = config.get('redundancy.videos.strategies');
    if (Array.isArray(redundancyVideos)) {
        for (var _a = 0, redundancyVideos_1 = redundancyVideos; _a < redundancyVideos_1.length; _a++) {
            var r = redundancyVideos_1[_a];
            if (!r.size)
                miss.push('redundancy.videos.strategies.size');
            if (!r.min_lifetime)
                miss.push('redundancy.videos.strategies.min_lifetime');
        }
    }
    var missingAlternatives = requiredAlternatives.filter(function (set) { return !set.find(function (alternative) { return !alternative.find(function (key) { return !config.has(key); }); }); });
    missingAlternatives
        .forEach(function (set) { return set[0].forEach(function (key) { return miss.push(key); }); });
    return miss;
}
exports.checkMissedConfig = checkMissedConfig;
// Check the available codecs
// We get CONFIG by param to not import it in this file (import orders)
function checkFFmpeg(CONFIG) {
    return __awaiter(this, void 0, void 0, function () {
        var Ffmpeg, getAvailableCodecsPromise, codecs, canEncode, _i, canEncode_1, codec;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    Ffmpeg = require('fluent-ffmpeg');
                    getAvailableCodecsPromise = core_utils_1.promisify0(Ffmpeg.getAvailableCodecs);
                    return [4 /*yield*/, getAvailableCodecsPromise()];
                case 1:
                    codecs = _a.sent();
                    canEncode = ['libx264'];
                    if (CONFIG.TRANSCODING.ENABLED === false)
                        return [2 /*return*/, undefined];
                    for (_i = 0, canEncode_1 = canEncode; _i < canEncode_1.length; _i++) {
                        codec = canEncode_1[_i];
                        if (codecs[codec] === undefined) {
                            throw new Error('Unknown codec ' + codec + ' in FFmpeg.');
                        }
                        if (codecs[codec].canEncode !== true) {
                            throw new Error('Unavailable encode codec ' + codec + ' in FFmpeg');
                        }
                    }
                    return [2 /*return*/, checkFFmpegEncoders()];
            }
        });
    });
}
exports.checkFFmpeg = checkFFmpeg;
// Optional encoders, if present, can be used to improve transcoding
// Here we ask ffmpeg if it detects their presence on the system, so that we can later use them
var supportedOptionalEncoders;
function checkFFmpegEncoders() {
    return __awaiter(this, void 0, void 0, function () {
        var Ffmpeg, getAvailableEncodersPromise, encoders, optionalEncoders, _i, optionalEncoders_1, encoder;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (supportedOptionalEncoders !== undefined) {
                        return [2 /*return*/, supportedOptionalEncoders];
                    }
                    Ffmpeg = require('fluent-ffmpeg');
                    getAvailableEncodersPromise = core_utils_1.promisify0(Ffmpeg.getAvailableEncoders);
                    return [4 /*yield*/, getAvailableEncodersPromise()];
                case 1:
                    encoders = _a.sent();
                    optionalEncoders = ['libfdk_aac'];
                    supportedOptionalEncoders = new Map();
                    for (_i = 0, optionalEncoders_1 = optionalEncoders; _i < optionalEncoders_1.length; _i++) {
                        encoder = optionalEncoders_1[_i];
                        supportedOptionalEncoders.set(encoder, encoders[encoder] !== undefined);
                    }
                    return [2 /*return*/, supportedOptionalEncoders];
            }
        });
    });
}
exports.checkFFmpegEncoders = checkFFmpegEncoders;
function checkNodeVersion() {
    var v = process.version;
    var majorString = v.split('.')[0].replace('v', '');
    var major = parseInt(majorString, 10);
    logger_1.logger.debug('Checking NodeJS version %s.', v);
    if (major < 10) {
        logger_1.logger.warn('Your NodeJS version %s is deprecated. Please use Node 10.', v);
    }
}
exports.checkNodeVersion = checkNodeVersion;
