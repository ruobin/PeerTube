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
var redis_1 = require("redis");
var logger_1 = require("../helpers/logger");
var utils_1 = require("../helpers/utils");
var constants_1 = require("../initializers/constants");
var config_1 = require("../initializers/config");
var Redis = /** @class */ (function () {
    function Redis() {
        this.initialized = false;
    }
    Redis.prototype.init = function () {
        // Already initialized
        if (this.initialized === true)
            return;
        this.initialized = true;
        this.client = redis_1.createClient(Redis.getRedisClientOptions());
        this.client.on('error', function (err) {
            logger_1.logger.error('Error in Redis client.', { err: err });
            process.exit(-1);
        });
        if (config_1.CONFIG.REDIS.AUTH) {
            this.client.auth(config_1.CONFIG.REDIS.AUTH);
        }
        this.prefix = 'redis-' + constants_1.WEBSERVER.HOST + '-';
    };
    Redis.getRedisClientOptions = function () {
        return Object.assign({}, (config_1.CONFIG.REDIS.AUTH && config_1.CONFIG.REDIS.AUTH != null) ? { password: config_1.CONFIG.REDIS.AUTH } : {}, (config_1.CONFIG.REDIS.DB) ? { db: config_1.CONFIG.REDIS.DB } : {}, (config_1.CONFIG.REDIS.HOSTNAME && config_1.CONFIG.REDIS.PORT) ?
            { host: config_1.CONFIG.REDIS.HOSTNAME, port: config_1.CONFIG.REDIS.PORT } :
            { path: config_1.CONFIG.REDIS.SOCKET });
    };
    Redis.prototype.getClient = function () {
        return this.client;
    };
    Redis.prototype.getPrefix = function () {
        return this.prefix;
    };
    /************* Forgot password *************/
    Redis.prototype.setResetPasswordVerificationString = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var generatedString;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, utils_1.generateRandomString(32)];
                    case 1:
                        generatedString = _a.sent();
                        return [4 /*yield*/, this.setValue(this.generateResetPasswordKey(userId), generatedString, constants_1.USER_PASSWORD_RESET_LIFETIME)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, generatedString];
                }
            });
        });
    };
    Redis.prototype.getResetPasswordLink = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.getValue(this.generateResetPasswordKey(userId))];
            });
        });
    };
    /************* Email verification *************/
    Redis.prototype.setVerifyEmailVerificationString = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var generatedString;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, utils_1.generateRandomString(32)];
                    case 1:
                        generatedString = _a.sent();
                        return [4 /*yield*/, this.setValue(this.generateVerifyEmailKey(userId), generatedString, constants_1.USER_EMAIL_VERIFY_LIFETIME)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, generatedString];
                }
            });
        });
    };
    Redis.prototype.getVerifyEmailLink = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.getValue(this.generateVerifyEmailKey(userId))];
            });
        });
    };
    /************* Contact form per IP *************/
    Redis.prototype.setContactFormIp = function (ip) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.setValue(this.generateContactFormKey(ip), '1', constants_1.CONTACT_FORM_LIFETIME)];
            });
        });
    };
    Redis.prototype.doesContactFormIpExist = function (ip) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.exists(this.generateContactFormKey(ip))];
            });
        });
    };
    /************* Views per IP *************/
    Redis.prototype.setIPVideoView = function (ip, videoUUID) {
        return this.setValue(this.generateViewKey(ip, videoUUID), '1', constants_1.VIDEO_VIEW_LIFETIME);
    };
    Redis.prototype.doesVideoIPViewExist = function (ip, videoUUID) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.exists(this.generateViewKey(ip, videoUUID))];
            });
        });
    };
    /************* API cache *************/
    Redis.prototype.getCachedRoute = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var cached;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getObject(this.generateCachedRouteKey(req))];
                    case 1:
                        cached = _a.sent();
                        return [2 /*return*/, cached];
                }
            });
        });
    };
    Redis.prototype.setCachedRoute = function (req, body, lifetime, contentType, statusCode) {
        var cached = Object.assign({}, {
            body: body.toString()
        }, (contentType) ? { contentType: contentType } : null, (statusCode) ? { statusCode: statusCode.toString() } : null);
        return this.setObject(this.generateCachedRouteKey(req), cached, lifetime);
    };
    /************* Video views *************/
    Redis.prototype.addVideoView = function (videoId) {
        var keyIncr = this.generateVideoViewKey(videoId);
        var keySet = this.generateVideosViewKey();
        return Promise.all([
            this.addToSet(keySet, videoId.toString()),
            this.increment(keyIncr)
        ]);
    };
    Redis.prototype.getVideoViews = function (videoId, hour) {
        return __awaiter(this, void 0, void 0, function () {
            var key, valueString, valueInt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        key = this.generateVideoViewKey(videoId, hour);
                        return [4 /*yield*/, this.getValue(key)];
                    case 1:
                        valueString = _a.sent();
                        valueInt = parseInt(valueString, 10);
                        if (isNaN(valueInt)) {
                            logger_1.logger.error('Cannot get videos views of video %d in hour %d: views number is NaN (%s).', videoId, hour, valueString);
                            return [2 /*return*/, undefined];
                        }
                        return [2 /*return*/, valueInt];
                }
            });
        });
    };
    Redis.prototype.getVideosIdViewed = function (hour) {
        return __awaiter(this, void 0, void 0, function () {
            var key, stringIds;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        key = this.generateVideosViewKey(hour);
                        return [4 /*yield*/, this.getSet(key)];
                    case 1:
                        stringIds = _a.sent();
                        return [2 /*return*/, stringIds.map(function (s) { return parseInt(s, 10); })];
                }
            });
        });
    };
    Redis.prototype.deleteVideoViews = function (videoId, hour) {
        var keySet = this.generateVideosViewKey(hour);
        var keyIncr = this.generateVideoViewKey(videoId, hour);
        return Promise.all([
            this.deleteFromSet(keySet, videoId.toString()),
            this.deleteKey(keyIncr)
        ]);
    };
    /************* Keys generation *************/
    Redis.prototype.generateCachedRouteKey = function (req) {
        return req.method + '-' + req.originalUrl;
    };
    Redis.prototype.generateVideosViewKey = function (hour) {
        if (!hour)
            hour = new Date().getHours();
        return "videos-view-h" + hour;
    };
    Redis.prototype.generateVideoViewKey = function (videoId, hour) {
        if (!hour)
            hour = new Date().getHours();
        return "video-view-" + videoId + "-h" + hour;
    };
    Redis.prototype.generateResetPasswordKey = function (userId) {
        return 'reset-password-' + userId;
    };
    Redis.prototype.generateVerifyEmailKey = function (userId) {
        return 'verify-email-' + userId;
    };
    Redis.prototype.generateViewKey = function (ip, videoUUID) {
        return "views-" + videoUUID + "-" + ip;
    };
    Redis.prototype.generateContactFormKey = function (ip) {
        return 'contact-form-' + ip;
    };
    /************* Redis helpers *************/
    Redis.prototype.getValue = function (key) {
        var _this = this;
        return new Promise(function (res, rej) {
            _this.client.get(_this.prefix + key, function (err, value) {
                if (err)
                    return rej(err);
                return res(value);
            });
        });
    };
    Redis.prototype.getSet = function (key) {
        var _this = this;
        return new Promise(function (res, rej) {
            _this.client.smembers(_this.prefix + key, function (err, value) {
                if (err)
                    return rej(err);
                return res(value);
            });
        });
    };
    Redis.prototype.addToSet = function (key, value) {
        var _this = this;
        return new Promise(function (res, rej) {
            _this.client.sadd(_this.prefix + key, value, function (err) { return err ? rej(err) : res(); });
        });
    };
    Redis.prototype.deleteFromSet = function (key, value) {
        var _this = this;
        return new Promise(function (res, rej) {
            _this.client.srem(_this.prefix + key, value, function (err) { return err ? rej(err) : res(); });
        });
    };
    Redis.prototype.deleteKey = function (key) {
        var _this = this;
        return new Promise(function (res, rej) {
            _this.client.del(_this.prefix + key, function (err) { return err ? rej(err) : res(); });
        });
    };
    Redis.prototype.deleteFieldInHash = function (key, field) {
        var _this = this;
        return new Promise(function (res, rej) {
            _this.client.hdel(_this.prefix + key, field, function (err) { return err ? rej(err) : res(); });
        });
    };
    Redis.prototype.setValue = function (key, value, expirationMilliseconds) {
        var _this = this;
        return new Promise(function (res, rej) {
            _this.client.set(_this.prefix + key, value, 'PX', expirationMilliseconds, function (err, ok) {
                if (err)
                    return rej(err);
                if (ok !== 'OK')
                    return rej(new Error('Redis set result is not OK.'));
                return res();
            });
        });
    };
    Redis.prototype.setObject = function (key, obj, expirationMilliseconds) {
        var _this = this;
        return new Promise(function (res, rej) {
            _this.client.hmset(_this.prefix + key, obj, function (err, ok) {
                if (err)
                    return rej(err);
                if (!ok)
                    return rej(new Error('Redis mset result is not OK.'));
                _this.client.pexpire(_this.prefix + key, expirationMilliseconds, function (err, ok) {
                    if (err)
                        return rej(err);
                    if (!ok)
                        return rej(new Error('Redis expiration result is not OK.'));
                    return res();
                });
            });
        });
    };
    Redis.prototype.getObject = function (key) {
        var _this = this;
        return new Promise(function (res, rej) {
            _this.client.hgetall(_this.prefix + key, function (err, value) {
                if (err)
                    return rej(err);
                return res(value);
            });
        });
    };
    Redis.prototype.setValueInHash = function (key, field, value) {
        var _this = this;
        return new Promise(function (res, rej) {
            _this.client.hset(_this.prefix + key, field, value, function (err) {
                if (err)
                    return rej(err);
                return res();
            });
        });
    };
    Redis.prototype.increment = function (key) {
        var _this = this;
        return new Promise(function (res, rej) {
            _this.client.incr(_this.prefix + key, function (err, value) {
                if (err)
                    return rej(err);
                return res(value);
            });
        });
    };
    Redis.prototype.exists = function (key) {
        var _this = this;
        return new Promise(function (res, rej) {
            _this.client.exists(_this.prefix + key, function (err, existsNumber) {
                if (err)
                    return rej(err);
                return res(existsNumber === 1);
            });
        });
    };
    Object.defineProperty(Redis, "Instance", {
        get: function () {
            return this.instance || (this.instance = new this());
        },
        enumerable: true,
        configurable: true
    });
    return Redis;
}());
exports.Redis = Redis;
