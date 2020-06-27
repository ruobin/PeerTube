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
var logger_1 = require("../../../helpers/logger");
var process_1 = require("../../activitypub/process");
var video_comments_1 = require("../../activitypub/video-comments");
var crawl_1 = require("../../activitypub/crawl");
var video_1 = require("../../../models/video/video");
var activitypub_1 = require("../../activitypub");
var playlist_1 = require("../../activitypub/playlist");
var account_1 = require("../../../models/account/account");
var account_video_rate_1 = require("../../../models/account/account-video-rate");
var video_share_1 = require("../../../models/video/video-share");
var video_comment_1 = require("../../../models/video/video-comment");
function processActivityPubHttpFetcher(job) {
    return __awaiter(this, void 0, void 0, function () {
        var payload, video, account, fetcherType, cleanerType;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.info('Processing ActivityPub fetcher in job %d.', job.id);
                    payload = job.data;
                    if (!payload.videoId) return [3 /*break*/, 2];
                    return [4 /*yield*/, video_1.VideoModel.loadAndPopulateAccountAndServerAndTags(payload.videoId)];
                case 1:
                    video = _a.sent();
                    _a.label = 2;
                case 2:
                    if (!payload.accountId) return [3 /*break*/, 4];
                    return [4 /*yield*/, account_1.AccountModel.load(payload.accountId)];
                case 3:
                    account = _a.sent();
                    _a.label = 4;
                case 4:
                    fetcherType = {
                        'activity': function (items) { return process_1.processActivities(items, { outboxUrl: payload.uri, fromFetch: true }); },
                        'video-likes': function (items) { return activitypub_1.createRates(items, video, 'like'); },
                        'video-dislikes': function (items) { return activitypub_1.createRates(items, video, 'dislike'); },
                        'video-shares': function (items) { return activitypub_1.addVideoShares(items, video); },
                        'video-comments': function (items) { return video_comments_1.addVideoComments(items); },
                        'account-playlists': function (items) { return playlist_1.createAccountPlaylists(items, account); }
                    };
                    cleanerType = {
                        'video-likes': function (crawlStartDate) { return account_video_rate_1.AccountVideoRateModel.cleanOldRatesOf(video.id, 'like', crawlStartDate); },
                        'video-dislikes': function (crawlStartDate) { return account_video_rate_1.AccountVideoRateModel.cleanOldRatesOf(video.id, 'dislike', crawlStartDate); },
                        'video-shares': function (crawlStartDate) { return video_share_1.VideoShareModel.cleanOldSharesOf(video.id, crawlStartDate); },
                        'video-comments': function (crawlStartDate) { return video_comment_1.VideoCommentModel.cleanOldCommentsOf(video.id, crawlStartDate); }
                    };
                    return [2 /*return*/, crawl_1.crawlCollectionPage(payload.uri, fetcherType[payload.type], cleanerType[payload.type])];
            }
        });
    });
}
exports.processActivityPubHttpFetcher = processActivityPubHttpFetcher;
