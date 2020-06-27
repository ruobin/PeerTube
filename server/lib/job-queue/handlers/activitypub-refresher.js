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
var video_1 = require("../../../helpers/video");
var activitypub_1 = require("../../activitypub");
var actor_1 = require("../../../models/activitypub/actor");
var video_playlist_1 = require("../../../models/video/video-playlist");
function refreshAPObject(job) {
    return __awaiter(this, void 0, void 0, function () {
        var payload;
        return __generator(this, function (_a) {
            payload = job.data;
            logger_1.logger.info('Processing AP refresher in job %d for %s.', job.id, payload.url);
            if (payload.type === 'video')
                return [2 /*return*/, refreshVideo(payload.url)];
            if (payload.type === 'video-playlist')
                return [2 /*return*/, refreshVideoPlaylist(payload.url)];
            if (payload.type === 'actor')
                return [2 /*return*/, refreshActor(payload.url)];
            return [2 /*return*/];
        });
    });
}
exports.refreshAPObject = refreshAPObject;
// ---------------------------------------------------------------------------
function refreshVideo(videoUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var fetchType, syncParam, videoFromDatabase, refreshOptions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fetchType = 'all';
                    syncParam = { likes: true, dislikes: true, shares: true, comments: true, thumbnail: true };
                    return [4 /*yield*/, video_1.fetchVideoByUrl(videoUrl, fetchType)];
                case 1:
                    videoFromDatabase = _a.sent();
                    if (!videoFromDatabase) return [3 /*break*/, 3];
                    refreshOptions = {
                        video: videoFromDatabase,
                        fetchedType: fetchType,
                        syncParam: syncParam
                    };
                    return [4 /*yield*/, activitypub_1.refreshVideoIfNeeded(refreshOptions)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function refreshActor(actorUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var fetchType, actor;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fetchType = 'all';
                    return [4 /*yield*/, actor_1.ActorModel.loadByUrlAndPopulateAccountAndChannel(actorUrl)];
                case 1:
                    actor = _a.sent();
                    if (!actor) return [3 /*break*/, 3];
                    return [4 /*yield*/, activitypub_1.refreshActorIfNeeded(actor, fetchType)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function refreshVideoPlaylist(playlistUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var playlist;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, video_playlist_1.VideoPlaylistModel.loadByUrlAndPopulateAccount(playlistUrl)];
                case 1:
                    playlist = _a.sent();
                    if (!playlist) return [3 /*break*/, 3];
                    return [4 /*yield*/, activitypub_1.refreshVideoPlaylistIfNeeded(playlist)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
