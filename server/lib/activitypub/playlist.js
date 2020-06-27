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
var crawl_1 = require("./crawl");
var constants_1 = require("../../initializers/constants");
var misc_1 = require("../../helpers/custom-validators/misc");
var actor_1 = require("./actor");
var logger_1 = require("../../helpers/logger");
var video_playlist_1 = require("../../models/video/video-playlist");
var requests_1 = require("../../helpers/requests");
var activitypub_1 = require("../../helpers/activitypub");
var Bluebird = require("bluebird");
var videos_1 = require("./videos");
var playlist_1 = require("../../helpers/custom-validators/activitypub/playlist");
var video_playlist_element_1 = require("../../models/video/video-playlist-element");
var video_playlist_privacy_model_1 = require("../../../shared/models/videos/playlist/video-playlist-privacy.model");
var database_1 = require("../../initializers/database");
var thumbnail_1 = require("../thumbnail");
function playlistObjectToDBAttributes(playlistObject, byAccount, to) {
    var privacy = to.indexOf(constants_1.ACTIVITY_PUB.PUBLIC) !== -1 ? video_playlist_privacy_model_1.VideoPlaylistPrivacy.PUBLIC : video_playlist_privacy_model_1.VideoPlaylistPrivacy.UNLISTED;
    return {
        name: playlistObject.name,
        description: playlistObject.content,
        privacy: privacy,
        url: playlistObject.id,
        uuid: playlistObject.uuid,
        ownerAccountId: byAccount.id,
        videoChannelId: null,
        createdAt: new Date(playlistObject.published),
        updatedAt: new Date(playlistObject.updated)
    };
}
exports.playlistObjectToDBAttributes = playlistObjectToDBAttributes;
function playlistElementObjectToDBAttributes(elementObject, videoPlaylist, video) {
    return {
        position: elementObject.position,
        url: elementObject.id,
        startTimestamp: elementObject.startTimestamp || null,
        stopTimestamp: elementObject.stopTimestamp || null,
        videoPlaylistId: videoPlaylist.id,
        videoId: video.id
    };
}
exports.playlistElementObjectToDBAttributes = playlistElementObjectToDBAttributes;
function createAccountPlaylists(playlistUrls, account) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Bluebird.map(playlistUrls, function (playlistUrl) { return __awaiter(_this, void 0, void 0, function () {
                        var exists, body, err_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, , 4]);
                                    return [4 /*yield*/, video_playlist_1.VideoPlaylistModel.doesPlaylistExist(playlistUrl)];
                                case 1:
                                    exists = _a.sent();
                                    if (exists === true)
                                        return [2 /*return*/];
                                    return [4 /*yield*/, requests_1.doRequest({
                                            uri: playlistUrl,
                                            json: true,
                                            activityPub: true
                                        })];
                                case 2:
                                    body = (_a.sent()).body;
                                    if (!playlist_1.isPlaylistObjectValid(body)) {
                                        throw new Error("Invalid playlist object when fetch account playlists: " + JSON.stringify(body));
                                    }
                                    if (!misc_1.isArray(body.to)) {
                                        throw new Error('Playlist does not have an audience.');
                                    }
                                    return [2 /*return*/, createOrUpdateVideoPlaylist(body, account, body.to)];
                                case 3:
                                    err_1 = _a.sent();
                                    logger_1.logger.warn('Cannot add playlist element %s.', playlistUrl, { err: err_1 });
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); }, { concurrency: constants_1.CRAWL_REQUEST_CONCURRENCY })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.createAccountPlaylists = createAccountPlaylists;
function createOrUpdateVideoPlaylist(playlistObject, byAccount, to) {
    return __awaiter(this, void 0, void 0, function () {
        var playlistAttributes, actor, playlist, accItems, refreshedPlaylist, thumbnailModel, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    playlistAttributes = playlistObjectToDBAttributes(playlistObject, byAccount, to);
                    if (!(misc_1.isArray(playlistObject.attributedTo) && playlistObject.attributedTo.length === 1)) return [3 /*break*/, 2];
                    return [4 /*yield*/, actor_1.getOrCreateActorAndServerAndModel(playlistObject.attributedTo[0])];
                case 1:
                    actor = _a.sent();
                    if (actor.VideoChannel) {
                        playlistAttributes.videoChannelId = actor.VideoChannel.id;
                    }
                    else {
                        logger_1.logger.warn('Attributed to of video playlist %s is not a video channel.', playlistObject.id, { playlistObject: playlistObject });
                    }
                    _a.label = 2;
                case 2: return [4 /*yield*/, video_playlist_1.VideoPlaylistModel.upsert(playlistAttributes, { returning: true })];
                case 3:
                    playlist = (_a.sent())[0];
                    accItems = [];
                    return [4 /*yield*/, crawl_1.crawlCollectionPage(playlistObject.id, function (items) {
                            accItems = accItems.concat(items);
                            return Promise.resolve();
                        })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, video_playlist_1.VideoPlaylistModel.loadWithAccountAndChannel(playlist.id, null)];
                case 5:
                    refreshedPlaylist = _a.sent();
                    if (!playlistObject.icon) return [3 /*break*/, 11];
                    _a.label = 6;
                case 6:
                    _a.trys.push([6, 9, , 10]);
                    return [4 /*yield*/, thumbnail_1.createPlaylistMiniatureFromUrl(playlistObject.icon.url, refreshedPlaylist)];
                case 7:
                    thumbnailModel = _a.sent();
                    return [4 /*yield*/, refreshedPlaylist.setAndSaveThumbnail(thumbnailModel, undefined)];
                case 8:
                    _a.sent();
                    return [3 /*break*/, 10];
                case 9:
                    err_2 = _a.sent();
                    logger_1.logger.warn('Cannot generate thumbnail of %s.', playlistObject.id, { err: err_2 });
                    return [3 /*break*/, 10];
                case 10: return [3 /*break*/, 13];
                case 11:
                    if (!refreshedPlaylist.hasThumbnail()) return [3 /*break*/, 13];
                    return [4 /*yield*/, refreshedPlaylist.Thumbnail.destroy()];
                case 12:
                    _a.sent();
                    refreshedPlaylist.Thumbnail = null;
                    _a.label = 13;
                case 13: return [2 /*return*/, resetVideoPlaylistElements(accItems, refreshedPlaylist)];
            }
        });
    });
}
exports.createOrUpdateVideoPlaylist = createOrUpdateVideoPlaylist;
function refreshVideoPlaylistIfNeeded(videoPlaylist) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, statusCode, playlistObject, byAccount, err_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!videoPlaylist.isOutdated())
                        return [2 /*return*/, videoPlaylist];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 8, , 10]);
                    return [4 /*yield*/, fetchRemoteVideoPlaylist(videoPlaylist.url)];
                case 2:
                    _a = _b.sent(), statusCode = _a.statusCode, playlistObject = _a.playlistObject;
                    if (!(statusCode === 404)) return [3 /*break*/, 4];
                    logger_1.logger.info('Cannot refresh remote video playlist %s: it does not exist anymore. Deleting it.', videoPlaylist.url);
                    return [4 /*yield*/, videoPlaylist.destroy()];
                case 3:
                    _b.sent();
                    return [2 /*return*/, undefined];
                case 4:
                    if (!(playlistObject === undefined)) return [3 /*break*/, 6];
                    logger_1.logger.warn('Cannot refresh remote playlist %s: invalid body.', videoPlaylist.url);
                    return [4 /*yield*/, videoPlaylist.setAsRefreshed()];
                case 5:
                    _b.sent();
                    return [2 /*return*/, videoPlaylist];
                case 6:
                    byAccount = videoPlaylist.OwnerAccount;
                    return [4 /*yield*/, createOrUpdateVideoPlaylist(playlistObject, byAccount, playlistObject.to)];
                case 7:
                    _b.sent();
                    return [2 /*return*/, videoPlaylist];
                case 8:
                    err_3 = _b.sent();
                    logger_1.logger.warn('Cannot refresh video playlist %s.', videoPlaylist.url, { err: err_3 });
                    return [4 /*yield*/, videoPlaylist.setAsRefreshed()];
                case 9:
                    _b.sent();
                    return [2 /*return*/, videoPlaylist];
                case 10: return [2 /*return*/];
            }
        });
    });
}
exports.refreshVideoPlaylistIfNeeded = refreshVideoPlaylistIfNeeded;
// ---------------------------------------------------------------------------
function resetVideoPlaylistElements(elementUrls, playlist) {
    return __awaiter(this, void 0, void 0, function () {
        var elementsToCreate;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    elementsToCreate = [];
                    return [4 /*yield*/, Bluebird.map(elementUrls, function (elementUrl) { return __awaiter(_this, void 0, void 0, function () {
                            var body, video, err_4;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 3, , 4]);
                                        return [4 /*yield*/, requests_1.doRequest({
                                                uri: elementUrl,
                                                json: true,
                                                activityPub: true
                                            })];
                                    case 1:
                                        body = (_a.sent()).body;
                                        if (!playlist_1.isPlaylistElementObjectValid(body))
                                            throw new Error("Invalid body in video get playlist element " + elementUrl);
                                        if (activitypub_1.checkUrlsSameHost(body.id, elementUrl) !== true) {
                                            throw new Error("Playlist element url " + elementUrl + " host is different from the AP object id " + body.id);
                                        }
                                        return [4 /*yield*/, videos_1.getOrCreateVideoAndAccountAndChannel({ videoObject: { id: body.url }, fetchType: 'only-video' })];
                                    case 2:
                                        video = (_a.sent()).video;
                                        elementsToCreate.push(playlistElementObjectToDBAttributes(body, playlist, video));
                                        return [3 /*break*/, 4];
                                    case 3:
                                        err_4 = _a.sent();
                                        logger_1.logger.warn('Cannot add playlist element %s.', elementUrl, { err: err_4 });
                                        return [3 /*break*/, 4];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); }, { concurrency: constants_1.CRAWL_REQUEST_CONCURRENCY })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, database_1.sequelizeTypescript.transaction(function (t) { return __awaiter(_this, void 0, void 0, function () {
                            var _i, elementsToCreate_1, element;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, video_playlist_element_1.VideoPlaylistElementModel.deleteAllOf(playlist.id, t)];
                                    case 1:
                                        _a.sent();
                                        _i = 0, elementsToCreate_1 = elementsToCreate;
                                        _a.label = 2;
                                    case 2:
                                        if (!(_i < elementsToCreate_1.length)) return [3 /*break*/, 5];
                                        element = elementsToCreate_1[_i];
                                        return [4 /*yield*/, video_playlist_element_1.VideoPlaylistElementModel.create(element, { transaction: t })];
                                    case 3:
                                        _a.sent();
                                        _a.label = 4;
                                    case 4:
                                        _i++;
                                        return [3 /*break*/, 2];
                                    case 5: return [2 /*return*/];
                                }
                            });
                        }); })];
                case 2:
                    _a.sent();
                    logger_1.logger.info('Reset playlist %s with %s elements.', playlist.url, elementsToCreate.length);
                    return [2 /*return*/, undefined];
            }
        });
    });
}
function fetchRemoteVideoPlaylist(playlistUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var options, _a, response, body;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    options = {
                        uri: playlistUrl,
                        method: 'GET',
                        json: true,
                        activityPub: true
                    };
                    logger_1.logger.info('Fetching remote playlist %s.', playlistUrl);
                    return [4 /*yield*/, requests_1.doRequest(options)];
                case 1:
                    _a = _b.sent(), response = _a.response, body = _a.body;
                    if (playlist_1.isPlaylistObjectValid(body) === false || activitypub_1.checkUrlsSameHost(body.id, playlistUrl) !== true) {
                        logger_1.logger.debug('Remote video playlist JSON is not valid.', { body: body });
                        return [2 /*return*/, { statusCode: response.statusCode, playlistObject: undefined }];
                    }
                    return [2 /*return*/, { statusCode: response.statusCode, playlistObject: body }];
            }
        });
    });
}
