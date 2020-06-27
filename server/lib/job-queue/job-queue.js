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
var Bull = require("bull");
var logger_1 = require("../../helpers/logger");
var redis_1 = require("../redis");
var constants_1 = require("../../initializers/constants");
var activitypub_http_broadcast_1 = require("./handlers/activitypub-http-broadcast");
var activitypub_http_fetcher_1 = require("./handlers/activitypub-http-fetcher");
var activitypub_http_unicast_1 = require("./handlers/activitypub-http-unicast");
var email_1 = require("./handlers/email");
var video_transcoding_1 = require("./handlers/video-transcoding");
var activitypub_follow_1 = require("./handlers/activitypub-follow");
var video_import_1 = require("./handlers/video-import");
var video_views_1 = require("./handlers/video-views");
var activitypub_refresher_1 = require("./handlers/activitypub-refresher");
var video_file_import_1 = require("./handlers/video-file-import");
var handlers = {
    'activitypub-http-broadcast': activitypub_http_broadcast_1.processActivityPubHttpBroadcast,
    'activitypub-http-unicast': activitypub_http_unicast_1.processActivityPubHttpUnicast,
    'activitypub-http-fetcher': activitypub_http_fetcher_1.processActivityPubHttpFetcher,
    'activitypub-follow': activitypub_follow_1.processActivityPubFollow,
    'video-file-import': video_file_import_1.processVideoFileImport,
    'video-transcoding': video_transcoding_1.processVideoTranscoding,
    'video-file': video_transcoding_1.processVideoTranscoding,
    'email': email_1.processEmail,
    'video-import': video_import_1.processVideoImport,
    'videos-views': video_views_1.processVideosViews,
    'activitypub-refresher': activitypub_refresher_1.refreshAPObject
};
var jobTypes = [
    'activitypub-follow',
    'activitypub-http-broadcast',
    'activitypub-http-fetcher',
    'activitypub-http-unicast',
    'email',
    'video-transcoding',
    'video-file-import',
    'video-import',
    'videos-views',
    'activitypub-refresher'
];
var JobQueue = /** @class */ (function () {
    function JobQueue() {
        this.queues = {};
        this.initialized = false;
    }
    JobQueue.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var queueOptions, _loop_1, this_1, _i, _a, handlerName;
            return __generator(this, function (_b) {
                // Already initialized
                if (this.initialized === true)
                    return [2 /*return*/];
                this.initialized = true;
                this.jobRedisPrefix = 'bull-' + constants_1.WEBSERVER.HOST;
                queueOptions = {
                    prefix: this.jobRedisPrefix,
                    redis: redis_1.Redis.getRedisClientOptions(),
                    settings: {
                        maxStalledCount: 10 // transcoding could be long, so jobs can often be interrupted by restarts
                    }
                };
                _loop_1 = function (handlerName) {
                    var queue = new Bull(handlerName, queueOptions);
                    var handler = handlers[handlerName];
                    queue.process(constants_1.JOB_CONCURRENCY[handlerName], handler)["catch"](function (err) { return logger_1.logger.error('Error in job queue processor %s.', handlerName, { err: err }); });
                    queue.on('failed', function (job, err) {
                        logger_1.logger.error('Cannot execute job %d in queue %s.', job.id, handlerName, { payload: job.data, err: err });
                    });
                    queue.on('error', function (err) {
                        logger_1.logger.error('Error in job queue %s.', handlerName, { err: err });
                    });
                    this_1.queues[handlerName] = queue;
                };
                this_1 = this;
                for (_i = 0, _a = Object.keys(handlers); _i < _a.length; _i++) {
                    handlerName = _a[_i];
                    _loop_1(handlerName);
                }
                this.addRepeatableJobs();
                return [2 /*return*/];
            });
        });
    };
    JobQueue.prototype.terminate = function () {
        for (var _i = 0, _a = Object.keys(this.queues); _i < _a.length; _i++) {
            var queueName = _a[_i];
            var queue = this.queues[queueName];
            queue.close();
        }
    };
    JobQueue.prototype.createJob = function (obj) {
        var queue = this.queues[obj.type];
        if (queue === undefined) {
            logger_1.logger.error('Unknown queue %s: cannot create job.', obj.type);
            throw Error('Unknown queue, cannot create job');
        }
        var jobArgs = {
            backoff: { delay: 60 * 1000, type: 'exponential' },
            attempts: constants_1.JOB_ATTEMPTS[obj.type],
            timeout: constants_1.JOB_TTL[obj.type]
        };
        return queue.add(obj.payload, jobArgs);
    };
    JobQueue.prototype.listForApi = function (state, start, count, asc) {
        return __awaiter(this, void 0, void 0, function () {
            var results, _i, jobTypes_1, jobType, queue, jobs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        results = [];
                        _i = 0, jobTypes_1 = jobTypes;
                        _a.label = 1;
                    case 1:
                        if (!(_i < jobTypes_1.length)) return [3 /*break*/, 4];
                        jobType = jobTypes_1[_i];
                        queue = this.queues[jobType];
                        if (queue === undefined) {
                            logger_1.logger.error('Unknown queue %s to list jobs.', jobType);
                            return [3 /*break*/, 3];
                        }
                        return [4 /*yield*/, queue.getJobs(state, 0, start + count, asc)];
                    case 2:
                        jobs = _a.sent();
                        results = results.concat(jobs);
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        results.sort(function (j1, j2) {
                            if (j1.timestamp < j2.timestamp)
                                return -1;
                            else if (j1.timestamp === j2.timestamp)
                                return 0;
                            return 1;
                        });
                        if (asc === false)
                            results.reverse();
                        return [2 /*return*/, results.slice(start, start + count)];
                }
            });
        });
    };
    JobQueue.prototype.count = function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var total, _i, jobTypes_2, type, queue, counts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        total = 0;
                        _i = 0, jobTypes_2 = jobTypes;
                        _a.label = 1;
                    case 1:
                        if (!(_i < jobTypes_2.length)) return [3 /*break*/, 4];
                        type = jobTypes_2[_i];
                        queue = this.queues[type];
                        if (queue === undefined) {
                            logger_1.logger.error('Unknown queue %s to count jobs.', type);
                            return [3 /*break*/, 3];
                        }
                        return [4 /*yield*/, queue.getJobCounts()];
                    case 2:
                        counts = _a.sent();
                        total += counts[state];
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, total];
                }
            });
        });
    };
    JobQueue.prototype.removeOldJobs = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, key, queue;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _i = 0, _a = Object.keys(this.queues);
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        key = _a[_i];
                        queue = this.queues[key];
                        return [4 /*yield*/, queue.clean(constants_1.JOB_COMPLETED_LIFETIME, 'completed')];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    JobQueue.prototype.addRepeatableJobs = function () {
        this.queues['videos-views'].add({}, {
            repeat: constants_1.REPEAT_JOBS['videos-views']
        });
    };
    Object.defineProperty(JobQueue, "Instance", {
        get: function () {
            return this.instance || (this.instance = new this());
        },
        enumerable: true,
        configurable: true
    });
    return JobQueue;
}());
exports.JobQueue = JobQueue;
