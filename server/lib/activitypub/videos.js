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
var Bluebird = require("bluebird");
var magnetUtil = require("magnet-uri");
var index_1 = require("../../../shared/index");
var videos_1 = require("../../../shared/models/videos");
var videos_2 = require("../../helpers/custom-validators/activitypub/videos");
var videos_3 = require("../../helpers/custom-validators/videos");
var database_utils_1 = require("../../helpers/database-utils");
var logger_1 = require("../../helpers/logger");
var requests_1 = require("../../helpers/requests");
var constants_1 = require("../../initializers/constants");
var tag_1 = require("../../models/video/tag");
var video_1 = require("../../models/video/video");
var video_file_1 = require("../../models/video/video-file");
var actor_1 = require("./actor");
var video_comments_1 = require("./video-comments");
var crawl_1 = require("./crawl");
var send_1 = require("./send");
var misc_1 = require("../../helpers/custom-validators/misc");
var video_caption_1 = require("../../models/video/video-caption");
var job_queue_1 = require("../job-queue");
var video_rates_1 = require("./video-rates");
var share_1 = require("./share");
var account_1 = require("../../models/account/account");
var video_2 = require("../../helpers/video");
var activitypub_1 = require("../../helpers/activitypub");
var notifier_1 = require("../notifier");
var video_streaming_playlist_1 = require("../../models/video/video-streaming-playlist");
var video_streaming_playlist_type_1 = require("../../../shared/models/videos/video-streaming-playlist.type");
var account_video_rate_1 = require("../../models/account/account-video-rate");
var video_share_1 = require("../../models/video/video-share");
var video_comment_1 = require("../../models/video/video-comment");
var database_1 = require("../../initializers/database");
var thumbnail_1 = require("../thumbnail");
var thumbnail_type_1 = require("../../../shared/models/videos/thumbnail.type");
var path_1 = require("path");
var video_blacklist_1 = require("../video-blacklist");
var files_cache_1 = require("../files-cache");
function federateVideoIfNeeded(video, isNewVideo, transaction) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!
                    // Check this is not a blacklisted video, or unfederated blacklisted video
                    ((video.isBlacklisted() === false || (isNewVideo === false && video.VideoBlacklist.unfederated === false)) &&
                        // Check the video is public/unlisted and published
                        video.privacy !== videos_1.VideoPrivacy.PRIVATE && video.state === index_1.VideoState.PUBLISHED)) 
                    // Check this is not a blacklisted video, or unfederated blacklisted video
                    return [3 /*break*/, 7];
                    if (!(misc_1.isArray(video.VideoCaptions) === false)) return [3 /*break*/, 2];
                    _a = video;
                    return [4 /*yield*/, video.$get('VideoCaptions', {
                            attributes: ['language'],
                            transaction: transaction
                        })];
                case 1:
                    _a.VideoCaptions = (_b.sent());
                    _b.label = 2;
                case 2:
                    if (!isNewVideo) return [3 /*break*/, 5];
                    // Now we'll add the video's meta data to our followers
                    return [4 /*yield*/, send_1.sendCreateVideo(video, transaction)];
                case 3:
                    // Now we'll add the video's meta data to our followers
                    _b.sent();
                    return [4 /*yield*/, share_1.shareVideoByServerAndChannel(video, transaction)];
                case 4:
                    _b.sent();
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, send_1.sendUpdateVideo(video, transaction)];
                case 6:
                    _b.sent();
                    _b.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.federateVideoIfNeeded = federateVideoIfNeeded;
function fetchRemoteVideo(videoUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var options, _a, response, body;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    options = {
                        uri: videoUrl,
                        method: 'GET',
                        json: true,
                        activityPub: true
                    };
                    logger_1.logger.info('Fetching remote video %s.', videoUrl);
                    return [4 /*yield*/, requests_1.doRequest(options)];
                case 1:
                    _a = _b.sent(), response = _a.response, body = _a.body;
                    if (videos_2.sanitizeAndCheckVideoTorrentObject(body) === false || activitypub_1.checkUrlsSameHost(body.id, videoUrl) !== true) {
                        logger_1.logger.debug('Remote video JSON is not valid.', { body: body });
                        return [2 /*return*/, { response: response, videoObject: undefined }];
                    }
                    return [2 /*return*/, { response: response, videoObject: body }];
            }
        });
    });
}
exports.fetchRemoteVideo = fetchRemoteVideo;
function fetchRemoteVideoDescription(video) {
    return __awaiter(this, void 0, void 0, function () {
        var host, path, options, body;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    host = video.VideoChannel.Account.Actor.Server.host;
                    path = video.getDescriptionAPIPath();
                    options = {
                        uri: constants_1.REMOTE_SCHEME.HTTP + '://' + host + path,
                        json: true
                    };
                    return [4 /*yield*/, requests_1.doRequest(options)];
                case 1:
                    body = (_a.sent()).body;
                    return [2 /*return*/, body.description ? body.description : ''];
            }
        });
    });
}
exports.fetchRemoteVideoDescription = fetchRemoteVideoDescription;
function fetchRemoteVideoStaticFile(video, path, destPath) {
    var url = buildRemoteBaseUrl(video, path);
    // We need to provide a callback, if no we could have an uncaught exception
    return requests_1.doRequestAndSaveToFile({ uri: url }, destPath);
}
exports.fetchRemoteVideoStaticFile = fetchRemoteVideoStaticFile;
function buildRemoteBaseUrl(video, path) {
    var host = video.VideoChannel.Account.Actor.Server.host;
    return constants_1.REMOTE_SCHEME.HTTP + '://' + host + path;
}
function getOrCreateVideoChannelFromVideoObject(videoObject) {
    var channel = videoObject.attributedTo.find(function (a) { return a.type === 'Group'; });
    if (!channel)
        throw new Error('Cannot find associated video channel to video ' + videoObject.url);
    if (activitypub_1.checkUrlsSameHost(channel.id, videoObject.id) !== true) {
        throw new Error("Video channel url " + channel.id + " does not have the same host than video object id " + videoObject.id);
    }
    return actor_1.getOrCreateActorAndServerAndModel(channel.id, 'all');
}
exports.getOrCreateVideoChannelFromVideoObject = getOrCreateVideoChannelFromVideoObject;
function syncVideoExternalAttributes(video, fetchedVideo, syncParam) {
    return __awaiter(this, void 0, void 0, function () {
        var jobPayloads, handler, cleaner, handler, cleaner, handler, cleaner, handler, cleaner;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.info('Adding likes/dislikes/shares/comments of video %s.', video.uuid);
                    jobPayloads = [];
                    if (!(syncParam.likes === true)) return [3 /*break*/, 2];
                    handler = function (items) { return video_rates_1.createRates(items, video, 'like'); };
                    cleaner = function (crawlStartDate) { return account_video_rate_1.AccountVideoRateModel.cleanOldRatesOf(video.id, 'like', crawlStartDate); };
                    return [4 /*yield*/, crawl_1.crawlCollectionPage(fetchedVideo.likes, handler, cleaner)["catch"](function (err) { return logger_1.logger.error('Cannot add likes of video %s.', video.uuid, { err: err }); })];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    jobPayloads.push({ uri: fetchedVideo.likes, videoId: video.id, type: 'video-likes' });
                    _a.label = 3;
                case 3:
                    if (!(syncParam.dislikes === true)) return [3 /*break*/, 5];
                    handler = function (items) { return video_rates_1.createRates(items, video, 'dislike'); };
                    cleaner = function (crawlStartDate) { return account_video_rate_1.AccountVideoRateModel.cleanOldRatesOf(video.id, 'dislike', crawlStartDate); };
                    return [4 /*yield*/, crawl_1.crawlCollectionPage(fetchedVideo.dislikes, handler, cleaner)["catch"](function (err) { return logger_1.logger.error('Cannot add dislikes of video %s.', video.uuid, { err: err }); })];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    jobPayloads.push({ uri: fetchedVideo.dislikes, videoId: video.id, type: 'video-dislikes' });
                    _a.label = 6;
                case 6:
                    if (!(syncParam.shares === true)) return [3 /*break*/, 8];
                    handler = function (items) { return share_1.addVideoShares(items, video); };
                    cleaner = function (crawlStartDate) { return video_share_1.VideoShareModel.cleanOldSharesOf(video.id, crawlStartDate); };
                    return [4 /*yield*/, crawl_1.crawlCollectionPage(fetchedVideo.shares, handler, cleaner)["catch"](function (err) { return logger_1.logger.error('Cannot add shares of video %s.', video.uuid, { err: err }); })];
                case 7:
                    _a.sent();
                    return [3 /*break*/, 9];
                case 8:
                    jobPayloads.push({ uri: fetchedVideo.shares, videoId: video.id, type: 'video-shares' });
                    _a.label = 9;
                case 9:
                    if (!(syncParam.comments === true)) return [3 /*break*/, 11];
                    handler = function (items) { return video_comments_1.addVideoComments(items); };
                    cleaner = function (crawlStartDate) { return video_comment_1.VideoCommentModel.cleanOldCommentsOf(video.id, crawlStartDate); };
                    return [4 /*yield*/, crawl_1.crawlCollectionPage(fetchedVideo.comments, handler, cleaner)["catch"](function (err) { return logger_1.logger.error('Cannot add comments of video %s.', video.uuid, { err: err }); })];
                case 10:
                    _a.sent();
                    return [3 /*break*/, 12];
                case 11:
                    jobPayloads.push({ uri: fetchedVideo.comments, videoId: video.id, type: 'video-comments' });
                    _a.label = 12;
                case 12: return [4 /*yield*/, Bluebird.map(jobPayloads, function (payload) { return job_queue_1.JobQueue.Instance.createJob({ type: 'activitypub-http-fetcher', payload: payload }); })];
                case 13:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function getOrCreateVideoAndAccountAndChannel(options) {
    return __awaiter(this, void 0, void 0, function () {
        var syncParam, fetchType, allowRefresh, videoUrl, videoFromDatabase, refreshOptions, fetchedVideo, channelActor, _a, autoBlacklisted, videoCreated;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    syncParam = options.syncParam || { likes: true, dislikes: true, shares: true, comments: true, thumbnail: true, refreshVideo: false };
                    fetchType = options.fetchType || 'all';
                    allowRefresh = options.allowRefresh !== false;
                    videoUrl = activitypub_1.getAPId(options.videoObject);
                    return [4 /*yield*/, video_2.fetchVideoByUrl(videoUrl, fetchType)];
                case 1:
                    videoFromDatabase = _b.sent();
                    if (!videoFromDatabase) return [3 /*break*/, 6];
                    if (!(videoFromDatabase.isOutdated() && allowRefresh === true)) return [3 /*break*/, 5];
                    refreshOptions = {
                        video: videoFromDatabase,
                        fetchedType: fetchType,
                        syncParam: syncParam
                    };
                    if (!(syncParam.refreshVideo === true)) return [3 /*break*/, 3];
                    return [4 /*yield*/, refreshVideoIfNeeded(refreshOptions)];
                case 2:
                    videoFromDatabase = _b.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, job_queue_1.JobQueue.Instance.createJob({ type: 'activitypub-refresher', payload: { type: 'video', url: videoFromDatabase.url } })];
                case 4:
                    _b.sent();
                    _b.label = 5;
                case 5: return [2 /*return*/, { video: videoFromDatabase, created: false }];
                case 6: return [4 /*yield*/, fetchRemoteVideo(videoUrl)];
                case 7:
                    fetchedVideo = (_b.sent()).videoObject;
                    if (!fetchedVideo)
                        throw new Error('Cannot fetch remote video with url: ' + videoUrl);
                    return [4 /*yield*/, getOrCreateVideoChannelFromVideoObject(fetchedVideo)];
                case 8:
                    channelActor = _b.sent();
                    return [4 /*yield*/, database_utils_1.retryTransactionWrapper(createVideo, fetchedVideo, channelActor, syncParam.thumbnail)];
                case 9:
                    _a = _b.sent(), autoBlacklisted = _a.autoBlacklisted, videoCreated = _a.videoCreated;
                    return [4 /*yield*/, syncVideoExternalAttributes(videoCreated, fetchedVideo, syncParam)];
                case 10:
                    _b.sent();
                    return [2 /*return*/, { video: videoCreated, created: true, autoBlacklisted: autoBlacklisted }];
            }
        });
    });
}
exports.getOrCreateVideoAndAccountAndChannel = getOrCreateVideoAndAccountAndChannel;
function updateVideoFromAP(options) {
    return __awaiter(this, void 0, void 0, function () {
        var video, videoObject, account, channel, overrideTo, videoFieldsSave, wasPrivateVideo, wasUnlistedVideo, thumbnailModel_1, err_1, err_2;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    video = options.video, videoObject = options.videoObject, account = options.account, channel = options.channel, overrideTo = options.overrideTo;
                    logger_1.logger.debug('Updating remote video "%s".', options.videoObject.uuid);
                    wasPrivateVideo = video.privacy === videos_1.VideoPrivacy.PRIVATE;
                    wasUnlistedVideo = video.privacy === videos_1.VideoPrivacy.UNLISTED;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 8, , 9]);
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, thumbnail_1.createVideoMiniatureFromUrl(videoObject.icon.url, video, thumbnail_type_1.ThumbnailType.MINIATURE)];
                case 3:
                    thumbnailModel_1 = _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _a.sent();
                    logger_1.logger.warn('Cannot generate thumbnail of %s.', videoObject.id, { err: err_1 });
                    return [3 /*break*/, 5];
                case 5: return [4 /*yield*/, database_1.sequelizeTypescript.transaction(function (t) { return __awaiter(_this, void 0, void 0, function () {
                        var sequelizeOptions, videoChannel, to, videoData, previewUrl, previewModel, videoFileAttributes, newVideoFiles_1, destroyTasks, upsertTasks, _a, streamingPlaylistAttributes, newStreamingPlaylists_1, destroyTasks, upsertTasks, _b, tags, tagInstances, videoCaptionsPromises, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    sequelizeOptions = { transaction: t };
                                    videoFieldsSave = video.toJSON();
                                    videoChannel = video.VideoChannel;
                                    if (videoChannel.Account.id !== account.id) {
                                        throw new Error('Account ' + account.Actor.url + ' does not own video channel ' + videoChannel.Actor.url);
                                    }
                                    to = overrideTo ? overrideTo : videoObject.to;
                                    return [4 /*yield*/, videoActivityObjectToDBAttributes(channel, videoObject, to)];
                                case 1:
                                    videoData = _d.sent();
                                    video.name = videoData.name;
                                    video.uuid = videoData.uuid;
                                    video.url = videoData.url;
                                    video.category = videoData.category;
                                    video.licence = videoData.licence;
                                    video.language = videoData.language;
                                    video.description = videoData.description;
                                    video.support = videoData.support;
                                    video.nsfw = videoData.nsfw;
                                    video.commentsEnabled = videoData.commentsEnabled;
                                    video.downloadEnabled = videoData.downloadEnabled;
                                    video.waitTranscoding = videoData.waitTranscoding;
                                    video.state = videoData.state;
                                    video.duration = videoData.duration;
                                    video.createdAt = videoData.createdAt;
                                    video.publishedAt = videoData.publishedAt;
                                    video.originallyPublishedAt = videoData.originallyPublishedAt;
                                    video.privacy = videoData.privacy;
                                    video.channelId = videoData.channelId;
                                    video.views = videoData.views;
                                    return [4 /*yield*/, video.save(sequelizeOptions)];
                                case 2:
                                    _d.sent();
                                    if (!thumbnailModel_1) return [3 /*break*/, 4];
                                    return [4 /*yield*/, video.addAndSaveThumbnail(thumbnailModel_1, t)
                                        // FIXME: use icon URL instead
                                    ];
                                case 3:
                                    _d.sent();
                                    _d.label = 4;
                                case 4:
                                    previewUrl = buildRemoteBaseUrl(video, path_1.join(constants_1.STATIC_PATHS.PREVIEWS, video.getPreview().filename));
                                    previewModel = thumbnail_1.createPlaceholderThumbnail(previewUrl, video, thumbnail_type_1.ThumbnailType.PREVIEW, constants_1.PREVIEWS_SIZE);
                                    return [4 /*yield*/, video.addAndSaveThumbnail(previewModel, t)];
                                case 5:
                                    _d.sent();
                                    videoFileAttributes = videoFileActivityUrlToDBAttributes(video, videoObject);
                                    newVideoFiles_1 = videoFileAttributes.map(function (a) { return new video_file_1.VideoFileModel(a); });
                                    destroyTasks = video.VideoFiles
                                        .filter(function (f) { return !newVideoFiles_1.find(function (newFile) { return newFile.hasSameUniqueKeysThan(f); }); })
                                        .map(function (f) { return f.destroy(sequelizeOptions); });
                                    return [4 /*yield*/, Promise.all(destroyTasks)
                                        // Update or add other one
                                    ];
                                case 6:
                                    _d.sent();
                                    upsertTasks = videoFileAttributes.map(function (a) {
                                        return video_file_1.VideoFileModel.upsert(a, { returning: true, transaction: t })
                                            .then(function (_a) {
                                            var file = _a[0];
                                            return file;
                                        });
                                    });
                                    _a = video;
                                    return [4 /*yield*/, Promise.all(upsertTasks)];
                                case 7:
                                    _a.VideoFiles = _d.sent();
                                    streamingPlaylistAttributes = streamingPlaylistActivityUrlToDBAttributes(video, videoObject, video.VideoFiles);
                                    newStreamingPlaylists_1 = streamingPlaylistAttributes.map(function (a) { return new video_streaming_playlist_1.VideoStreamingPlaylistModel(a); });
                                    destroyTasks = video.VideoStreamingPlaylists
                                        .filter(function (f) { return !newStreamingPlaylists_1.find(function (newPlaylist) { return newPlaylist.hasSameUniqueKeysThan(f); }); })
                                        .map(function (f) { return f.destroy(sequelizeOptions); });
                                    return [4 /*yield*/, Promise.all(destroyTasks)
                                        // Update or add other one
                                    ];
                                case 8:
                                    _d.sent();
                                    upsertTasks = streamingPlaylistAttributes.map(function (a) {
                                        return video_streaming_playlist_1.VideoStreamingPlaylistModel.upsert(a, { returning: true, transaction: t })
                                            .then(function (_a) {
                                            var streamingPlaylist = _a[0];
                                            return streamingPlaylist;
                                        });
                                    });
                                    _b = video;
                                    return [4 /*yield*/, Promise.all(upsertTasks)];
                                case 9:
                                    _b.VideoStreamingPlaylists = _d.sent();
                                    tags = videoObject.tag.map(function (tag) { return tag.name; });
                                    return [4 /*yield*/, tag_1.TagModel.findOrCreateTags(tags, t)];
                                case 10:
                                    tagInstances = _d.sent();
                                    return [4 /*yield*/, video.$set('Tags', tagInstances, sequelizeOptions)];
                                case 11:
                                    _d.sent();
                                    // Update captions
                                    return [4 /*yield*/, video_caption_1.VideoCaptionModel.deleteAllCaptionsOfRemoteVideo(video.id, t)];
                                case 12:
                                    // Update captions
                                    _d.sent();
                                    videoCaptionsPromises = videoObject.subtitleLanguage.map(function (c) {
                                        return video_caption_1.VideoCaptionModel.insertOrReplaceLanguage(video.id, c.identifier, t);
                                    });
                                    _c = video;
                                    return [4 /*yield*/, Promise.all(videoCaptionsPromises)];
                                case 13:
                                    _c.VideoCaptions = _d.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, video_blacklist_1.autoBlacklistVideoIfNeeded({
                            video: video,
                            user: undefined,
                            isRemote: true,
                            isNew: false,
                            transaction: undefined
                        })];
                case 7:
                    _a.sent();
                    if (wasPrivateVideo || wasUnlistedVideo)
                        notifier_1.Notifier.Instance.notifyOnNewVideoIfNeeded(video); // Notify our users?
                    logger_1.logger.info('Remote video with uuid %s updated', videoObject.uuid);
                    return [3 /*break*/, 9];
                case 8:
                    err_2 = _a.sent();
                    if (video !== undefined && videoFieldsSave !== undefined) {
                        database_utils_1.resetSequelizeInstance(video, videoFieldsSave);
                    }
                    // This is just a debug because we will retry the insert
                    logger_1.logger.debug('Cannot update the remote video.', { err: err_2 });
                    throw err_2;
                case 9: return [2 /*return*/];
            }
        });
    });
}
exports.updateVideoFromAP = updateVideoFromAP;
function refreshVideoIfNeeded(options) {
    return __awaiter(this, void 0, void 0, function () {
        var video, _a, _b, response, videoObject, channelActor, account, updateOptions, err_3;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!options.video.isOutdated())
                        return [2 /*return*/, options.video
                            // We need more attributes if the argument video was fetched with not enough joints
                        ];
                    if (!(options.fetchedType === 'all')) return [3 /*break*/, 1];
                    _a = options.video;
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, video_1.VideoModel.loadByUrlAndPopulateAccount(options.video.url)];
                case 2:
                    _a = _c.sent();
                    _c.label = 3;
                case 3:
                    video = _a;
                    _c.label = 4;
                case 4:
                    _c.trys.push([4, 14, , 16]);
                    return [4 /*yield*/, fetchRemoteVideo(video.url)];
                case 5:
                    _b = _c.sent(), response = _b.response, videoObject = _b.videoObject;
                    if (!(response.statusCode === 404)) return [3 /*break*/, 7];
                    logger_1.logger.info('Cannot refresh remote video %s: video does not exist anymore. Deleting it.', video.url);
                    // Video does not exist anymore
                    return [4 /*yield*/, video.destroy()];
                case 6:
                    // Video does not exist anymore
                    _c.sent();
                    return [2 /*return*/, undefined];
                case 7:
                    if (!(videoObject === undefined)) return [3 /*break*/, 9];
                    logger_1.logger.warn('Cannot refresh remote video %s: invalid body.', video.url);
                    return [4 /*yield*/, video.setAsRefreshed()];
                case 8:
                    _c.sent();
                    return [2 /*return*/, video];
                case 9: return [4 /*yield*/, getOrCreateVideoChannelFromVideoObject(videoObject)];
                case 10:
                    channelActor = _c.sent();
                    return [4 /*yield*/, account_1.AccountModel.load(channelActor.VideoChannel.accountId)];
                case 11:
                    account = _c.sent();
                    updateOptions = {
                        video: video,
                        videoObject: videoObject,
                        account: account,
                        channel: channelActor.VideoChannel
                    };
                    return [4 /*yield*/, database_utils_1.retryTransactionWrapper(updateVideoFromAP, updateOptions)];
                case 12:
                    _c.sent();
                    return [4 /*yield*/, syncVideoExternalAttributes(video, videoObject, options.syncParam)];
                case 13:
                    _c.sent();
                    files_cache_1.ActorFollowScoreCache.Instance.addGoodServerId(video.VideoChannel.Actor.serverId);
                    return [2 /*return*/, video];
                case 14:
                    err_3 = _c.sent();
                    logger_1.logger.warn('Cannot refresh video %s.', options.video.url, { err: err_3 });
                    files_cache_1.ActorFollowScoreCache.Instance.addBadServerId(video.VideoChannel.Actor.serverId);
                    // Don't refresh in loop
                    return [4 /*yield*/, video.setAsRefreshed()];
                case 15:
                    // Don't refresh in loop
                    _c.sent();
                    return [2 /*return*/, video];
                case 16: return [2 /*return*/];
            }
        });
    });
}
exports.refreshVideoIfNeeded = refreshVideoIfNeeded;
// ---------------------------------------------------------------------------
function isAPVideoUrlObject(url) {
    var mimeTypes = Object.keys(constants_1.MIMETYPES.VIDEO.MIMETYPE_EXT);
    var urlMediaType = url.mediaType || url.mimeType;
    return mimeTypes.indexOf(urlMediaType) !== -1 && urlMediaType.startsWith('video/');
}
function isAPStreamingPlaylistUrlObject(url) {
    var urlMediaType = url.mediaType || url.mimeType;
    return urlMediaType === 'application/x-mpegURL';
}
function isAPPlaylistSegmentHashesUrlObject(tag) {
    var urlMediaType = tag.mediaType || tag.mimeType;
    return tag.name === 'sha256' && tag.type === 'Link' && urlMediaType === 'application/json';
}
function createVideo(videoObject, channelActor, waitThumbnail) {
    if (waitThumbnail === void 0) { waitThumbnail = false; }
    return __awaiter(this, void 0, void 0, function () {
        var videoData, video, promiseThumbnail, thumbnailModel, _a, autoBlacklisted, videoCreated;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    logger_1.logger.debug('Adding remote video %s.', videoObject.id);
                    return [4 /*yield*/, videoActivityObjectToDBAttributes(channelActor.VideoChannel, videoObject, videoObject.to)];
                case 1:
                    videoData = _b.sent();
                    video = video_1.VideoModel.build(videoData);
                    promiseThumbnail = thumbnail_1.createVideoMiniatureFromUrl(videoObject.icon.url, video, thumbnail_type_1.ThumbnailType.MINIATURE);
                    if (!(waitThumbnail === true)) return [3 /*break*/, 3];
                    return [4 /*yield*/, promiseThumbnail];
                case 2:
                    thumbnailModel = _b.sent();
                    _b.label = 3;
                case 3: return [4 /*yield*/, database_1.sequelizeTypescript.transaction(function (t) { return __awaiter(_this, void 0, void 0, function () {
                        var sequelizeOptions, videoCreated, previewUrl, previewModel, videoFileAttributes, videoFilePromises, videoFiles, videoStreamingPlaylists, playlistPromises, streamingPlaylists, tags, tagInstances, videoCaptionsPromises, captions, autoBlacklisted;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    sequelizeOptions = { transaction: t };
                                    return [4 /*yield*/, video.save(sequelizeOptions)];
                                case 1:
                                    videoCreated = _a.sent();
                                    videoCreated.VideoChannel = channelActor.VideoChannel;
                                    if (!thumbnailModel) return [3 /*break*/, 3];
                                    return [4 /*yield*/, videoCreated.addAndSaveThumbnail(thumbnailModel, t)
                                        // FIXME: use icon URL instead
                                    ];
                                case 2:
                                    _a.sent();
                                    _a.label = 3;
                                case 3:
                                    previewUrl = buildRemoteBaseUrl(videoCreated, path_1.join(constants_1.STATIC_PATHS.PREVIEWS, video.generatePreviewName()));
                                    previewModel = thumbnail_1.createPlaceholderThumbnail(previewUrl, video, thumbnail_type_1.ThumbnailType.PREVIEW, constants_1.PREVIEWS_SIZE);
                                    if (!thumbnailModel) return [3 /*break*/, 5];
                                    return [4 /*yield*/, videoCreated.addAndSaveThumbnail(previewModel, t)
                                        // Process files
                                    ];
                                case 4:
                                    _a.sent();
                                    _a.label = 5;
                                case 5:
                                    videoFileAttributes = videoFileActivityUrlToDBAttributes(videoCreated, videoObject);
                                    if (videoFileAttributes.length === 0) {
                                        throw new Error('Cannot find valid files for video %s ' + videoObject.url);
                                    }
                                    videoFilePromises = videoFileAttributes.map(function (f) { return video_file_1.VideoFileModel.create(f, { transaction: t }); });
                                    return [4 /*yield*/, Promise.all(videoFilePromises)];
                                case 6:
                                    videoFiles = _a.sent();
                                    videoStreamingPlaylists = streamingPlaylistActivityUrlToDBAttributes(videoCreated, videoObject, videoFiles);
                                    playlistPromises = videoStreamingPlaylists.map(function (p) { return video_streaming_playlist_1.VideoStreamingPlaylistModel.create(p, { transaction: t }); });
                                    return [4 /*yield*/, Promise.all(playlistPromises)
                                        // Process tags
                                    ];
                                case 7:
                                    streamingPlaylists = _a.sent();
                                    tags = videoObject.tag
                                        .filter(function (t) { return t.type === 'Hashtag'; })
                                        .map(function (t) { return t.name; });
                                    return [4 /*yield*/, tag_1.TagModel.findOrCreateTags(tags, t)];
                                case 8:
                                    tagInstances = _a.sent();
                                    return [4 /*yield*/, videoCreated.$set('Tags', tagInstances, sequelizeOptions)
                                        // Process captions
                                    ];
                                case 9:
                                    _a.sent();
                                    videoCaptionsPromises = videoObject.subtitleLanguage.map(function (c) {
                                        return video_caption_1.VideoCaptionModel.insertOrReplaceLanguage(videoCreated.id, c.identifier, t);
                                    });
                                    return [4 /*yield*/, Promise.all(videoCaptionsPromises)];
                                case 10:
                                    captions = _a.sent();
                                    video.VideoFiles = videoFiles;
                                    video.VideoStreamingPlaylists = streamingPlaylists;
                                    video.Tags = tagInstances;
                                    video.VideoCaptions = captions;
                                    return [4 /*yield*/, video_blacklist_1.autoBlacklistVideoIfNeeded({
                                            video: video,
                                            user: undefined,
                                            isRemote: true,
                                            isNew: true,
                                            transaction: t
                                        })];
                                case 11:
                                    autoBlacklisted = _a.sent();
                                    logger_1.logger.info('Remote video with uuid %s inserted.', videoObject.uuid);
                                    return [2 /*return*/, { autoBlacklisted: autoBlacklisted, videoCreated: videoCreated }];
                            }
                        });
                    }); })];
                case 4:
                    _a = _b.sent(), autoBlacklisted = _a.autoBlacklisted, videoCreated = _a.videoCreated;
                    if (waitThumbnail === false) {
                        promiseThumbnail.then(function (thumbnailModel) {
                            thumbnailModel = videoCreated.id;
                            return thumbnailModel.save();
                        });
                    }
                    return [2 /*return*/, { autoBlacklisted: autoBlacklisted, videoCreated: videoCreated }];
            }
        });
    });
}
function videoActivityObjectToDBAttributes(videoChannel, videoObject, to) {
    if (to === void 0) { to = []; }
    return __awaiter(this, void 0, void 0, function () {
        var privacy, duration, language, category, licence, description, support;
        return __generator(this, function (_a) {
            privacy = to.indexOf(constants_1.ACTIVITY_PUB.PUBLIC) !== -1 ? videos_1.VideoPrivacy.PUBLIC : videos_1.VideoPrivacy.UNLISTED;
            duration = videoObject.duration.replace(/[^\d]+/, '');
            if (videoObject.language) {
                language = videoObject.language.identifier;
            }
            if (videoObject.category) {
                category = parseInt(videoObject.category.identifier, 10);
            }
            if (videoObject.licence) {
                licence = parseInt(videoObject.licence.identifier, 10);
            }
            description = videoObject.content || null;
            support = videoObject.support || null;
            return [2 /*return*/, {
                    name: videoObject.name,
                    uuid: videoObject.uuid,
                    url: videoObject.id,
                    category: category,
                    licence: licence,
                    language: language,
                    description: description,
                    support: support,
                    nsfw: videoObject.sensitive,
                    commentsEnabled: videoObject.commentsEnabled,
                    downloadEnabled: videoObject.downloadEnabled,
                    waitTranscoding: videoObject.waitTranscoding,
                    state: videoObject.state,
                    channelId: videoChannel.id,
                    duration: parseInt(duration, 10),
                    createdAt: new Date(videoObject.published),
                    publishedAt: new Date(videoObject.published),
                    originallyPublishedAt: videoObject.originallyPublishedAt ? new Date(videoObject.originallyPublishedAt) : null,
                    // FIXME: updatedAt does not seems to be considered by Sequelize
                    updatedAt: new Date(videoObject.updated),
                    views: videoObject.views,
                    likes: 0,
                    dislikes: 0,
                    remote: true,
                    privacy: privacy
                }];
        });
    });
}
function videoFileActivityUrlToDBAttributes(video, videoObject) {
    var fileUrls = videoObject.url.filter(function (u) { return isAPVideoUrlObject(u); });
    if (fileUrls.length === 0) {
        throw new Error('Cannot find video files for ' + video.url);
    }
    var attributes = [];
    var _loop_1 = function (fileUrl) {
        // Fetch associated magnet uri
        var magnet = videoObject.url.find(function (u) {
            var mediaType = u.mediaType || u.mimeType;
            return mediaType === 'application/x-bittorrent;x-scheme-handler/magnet' && u.height === fileUrl.height;
        });
        if (!magnet)
            throw new Error('Cannot find associated magnet uri for file ' + fileUrl.href);
        var parsed = magnetUtil.decode(magnet.href);
        if (!parsed || videos_3.isVideoFileInfoHashValid(parsed.infoHash) === false) {
            throw new Error('Cannot parse magnet URI ' + magnet.href);
        }
        var mediaType = fileUrl.mediaType || fileUrl.mimeType;
        var attribute = {
            extname: constants_1.MIMETYPES.VIDEO.MIMETYPE_EXT[mediaType],
            infoHash: parsed.infoHash,
            resolution: fileUrl.height,
            size: fileUrl.size,
            videoId: video.id,
            fps: fileUrl.fps || -1
        };
        attributes.push(attribute);
    };
    for (var _i = 0, fileUrls_1 = fileUrls; _i < fileUrls_1.length; _i++) {
        var fileUrl = fileUrls_1[_i];
        _loop_1(fileUrl);
    }
    return attributes;
}
function streamingPlaylistActivityUrlToDBAttributes(video, videoObject, videoFiles) {
    var playlistUrls = videoObject.url.filter(function (u) { return isAPStreamingPlaylistUrlObject(u); });
    if (playlistUrls.length === 0)
        return [];
    var attributes = [];
    for (var _i = 0, playlistUrls_1 = playlistUrls; _i < playlistUrls_1.length; _i++) {
        var playlistUrlObject = playlistUrls_1[_i];
        var segmentsSha256UrlObject = playlistUrlObject.tag
            .find(function (t) {
            return isAPPlaylistSegmentHashesUrlObject(t);
        });
        if (!segmentsSha256UrlObject) {
            logger_1.logger.warn('No segment sha256 URL found in AP playlist object.', { playlistUrl: playlistUrlObject });
            continue;
        }
        var attribute = {
            type: video_streaming_playlist_type_1.VideoStreamingPlaylistType.HLS,
            playlistUrl: playlistUrlObject.href,
            segmentsSha256Url: segmentsSha256UrlObject.href,
            p2pMediaLoaderInfohashes: video_streaming_playlist_1.VideoStreamingPlaylistModel.buildP2PMediaLoaderInfoHashes(playlistUrlObject.href, videoFiles),
            p2pMediaLoaderPeerVersion: constants_1.P2P_MEDIA_LOADER_PEER_VERSION,
            videoId: video.id
        };
        attributes.push(attribute);
    }
    return attributes;
}
