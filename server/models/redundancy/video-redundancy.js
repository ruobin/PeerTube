"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var sequelize_typescript_1 = require("sequelize-typescript");
var actor_1 = require("../activitypub/actor");
var utils_1 = require("../utils");
var misc_1 = require("../../helpers/custom-validators/activitypub/misc");
var constants_1 = require("../../initializers/constants");
var video_file_1 = require("../video/video-file");
var utils_2 = require("../../helpers/utils");
var video_1 = require("../video/video");
var logger_1 = require("../../helpers/logger");
var shared_1 = require("../../../shared");
var video_channel_1 = require("../video/video-channel");
var server_1 = require("../server/server");
var lodash_1 = require("lodash");
var core_utils_1 = require("../../helpers/core-utils");
var sequelize_1 = require("sequelize");
var video_streaming_playlist_1 = require("../video/video-streaming-playlist");
var config_1 = require("../../initializers/config");
var ScopeNames;
(function (ScopeNames) {
    ScopeNames["WITH_VIDEO"] = "WITH_VIDEO";
})(ScopeNames = exports.ScopeNames || (exports.ScopeNames = {}));
var VideoRedundancyModel = /** @class */ (function (_super) {
    __extends(VideoRedundancyModel, _super);
    function VideoRedundancyModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    VideoRedundancyModel_1 = VideoRedundancyModel;
    VideoRedundancyModel.removeFile = function (instance) {
        return __awaiter(this, void 0, void 0, function () {
            var videoFile, logIdentifier_1, videoStreamingPlaylist, videoUUID_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!instance.isOwned())
                            return [2 /*return*/];
                        if (!instance.videoFileId) return [3 /*break*/, 2];
                        return [4 /*yield*/, video_file_1.VideoFileModel.loadWithVideo(instance.videoFileId)];
                    case 1:
                        videoFile = _a.sent();
                        logIdentifier_1 = videoFile.Video.uuid + "-" + videoFile.resolution;
                        logger_1.logger.info('Removing duplicated video file %s.', logIdentifier_1);
                        videoFile.Video.removeFile(videoFile, true)["catch"](function (err) { return logger_1.logger.error('Cannot delete %s files.', logIdentifier_1, { err: err }); });
                        _a.label = 2;
                    case 2:
                        if (!instance.videoStreamingPlaylistId) return [3 /*break*/, 4];
                        return [4 /*yield*/, video_streaming_playlist_1.VideoStreamingPlaylistModel.loadWithVideo(instance.videoStreamingPlaylistId)];
                    case 3:
                        videoStreamingPlaylist = _a.sent();
                        videoUUID_1 = videoStreamingPlaylist.Video.uuid;
                        logger_1.logger.info('Removing duplicated video streaming playlist %s.', videoUUID_1);
                        videoStreamingPlaylist.Video.removeStreamingPlaylist(true)["catch"](function (err) { return logger_1.logger.error('Cannot delete video streaming playlist files of %s.', videoUUID_1, { err: err }); });
                        _a.label = 4;
                    case 4: return [2 /*return*/, undefined];
                }
            });
        });
    };
    VideoRedundancyModel.loadLocalByFileId = function (videoFileId) {
        return __awaiter(this, void 0, void 0, function () {
            var actor, query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, utils_2.getServerActor()];
                    case 1:
                        actor = _a.sent();
                        query = {
                            where: {
                                actorId: actor.id,
                                videoFileId: videoFileId
                            }
                        };
                        return [2 /*return*/, VideoRedundancyModel_1.scope(ScopeNames.WITH_VIDEO).findOne(query)];
                }
            });
        });
    };
    VideoRedundancyModel.loadLocalByStreamingPlaylistId = function (videoStreamingPlaylistId) {
        return __awaiter(this, void 0, void 0, function () {
            var actor, query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, utils_2.getServerActor()];
                    case 1:
                        actor = _a.sent();
                        query = {
                            where: {
                                actorId: actor.id,
                                videoStreamingPlaylistId: videoStreamingPlaylistId
                            }
                        };
                        return [2 /*return*/, VideoRedundancyModel_1.scope(ScopeNames.WITH_VIDEO).findOne(query)];
                }
            });
        });
    };
    VideoRedundancyModel.loadByUrl = function (url, transaction) {
        var query = {
            where: {
                url: url
            },
            transaction: transaction
        };
        return VideoRedundancyModel_1.findOne(query);
    };
    VideoRedundancyModel.isLocalByVideoUUIDExists = function (uuid) {
        return __awaiter(this, void 0, void 0, function () {
            var actor, query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, utils_2.getServerActor()];
                    case 1:
                        actor = _a.sent();
                        query = {
                            raw: true,
                            attributes: ['id'],
                            where: {
                                actorId: actor.id
                            },
                            include: [
                                {
                                    attributes: [],
                                    model: video_file_1.VideoFileModel,
                                    required: true,
                                    include: [
                                        {
                                            attributes: [],
                                            model: video_1.VideoModel,
                                            required: true,
                                            where: {
                                                uuid: uuid
                                            }
                                        }
                                    ]
                                }
                            ]
                        };
                        return [2 /*return*/, VideoRedundancyModel_1.findOne(query)
                                .then(function (r) { return !!r; })];
                }
            });
        });
    };
    VideoRedundancyModel.getVideoSample = function (p) {
        return __awaiter(this, void 0, void 0, function () {
            var rows, ids, id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, p];
                    case 1:
                        rows = _a.sent();
                        if (rows.length === 0)
                            return [2 /*return*/, undefined];
                        ids = rows.map(function (r) { return r.id; });
                        id = lodash_1.sample(ids);
                        return [2 /*return*/, video_1.VideoModel.loadWithFiles(id, undefined, !core_utils_1.isTestInstance())];
                }
            });
        });
    };
    VideoRedundancyModel.findMostViewToDuplicate = function (randomizedFactor) {
        return __awaiter(this, void 0, void 0, function () {
            var query, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = {
                            attributes: ['id', 'views'],
                            limit: randomizedFactor,
                            order: utils_1.getVideoSort('-views'),
                            where: {
                                privacy: shared_1.VideoPrivacy.PUBLIC
                            }
                        };
                        return [4 /*yield*/, VideoRedundancyModel_1.buildVideoFileForDuplication()];
                    case 1:
                        query = (_a.include = [
                            _b.sent(),
                            VideoRedundancyModel_1.buildServerRedundancyInclude()
                        ],
                            _a);
                        return [2 /*return*/, VideoRedundancyModel_1.getVideoSample(video_1.VideoModel.unscoped().findAll(query))];
                }
            });
        });
    };
    VideoRedundancyModel.findTrendingToDuplicate = function (randomizedFactor) {
        return __awaiter(this, void 0, void 0, function () {
            var query, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = {
                            attributes: ['id', 'views'],
                            subQuery: false,
                            group: 'VideoModel.id',
                            limit: randomizedFactor,
                            order: utils_1.getVideoSort('-trending'),
                            where: {
                                privacy: shared_1.VideoPrivacy.PUBLIC
                            }
                        };
                        return [4 /*yield*/, VideoRedundancyModel_1.buildVideoFileForDuplication()];
                    case 1:
                        query = (_a.include = [
                            _b.sent(),
                            VideoRedundancyModel_1.buildServerRedundancyInclude(),
                            video_1.VideoModel.buildTrendingQuery(config_1.CONFIG.TRENDING.VIDEOS.INTERVAL_DAYS)
                        ],
                            _a);
                        return [2 /*return*/, VideoRedundancyModel_1.getVideoSample(video_1.VideoModel.unscoped().findAll(query))];
                }
            });
        });
    };
    VideoRedundancyModel.findRecentlyAddedToDuplicate = function (randomizedFactor, minViews) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, query, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = {
                            attributes: ['id', 'publishedAt'],
                            limit: randomizedFactor,
                            order: utils_1.getVideoSort('-publishedAt'),
                            where: {
                                privacy: shared_1.VideoPrivacy.PUBLIC,
                                views: (_a = {},
                                    _a[sequelize_1.Op.gte] = minViews,
                                    _a)
                            }
                        };
                        return [4 /*yield*/, VideoRedundancyModel_1.buildVideoFileForDuplication()];
                    case 1:
                        query = (_b.include = [
                            _c.sent(),
                            VideoRedundancyModel_1.buildServerRedundancyInclude()
                        ],
                            _b);
                        return [2 /*return*/, VideoRedundancyModel_1.getVideoSample(video_1.VideoModel.unscoped().findAll(query))];
                }
            });
        });
    };
    VideoRedundancyModel.loadOldestLocalThatAlreadyExpired = function (strategy, expiresAfterMs) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, expiredDate, actor, query;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        expiredDate = new Date();
                        expiredDate.setMilliseconds(expiredDate.getMilliseconds() - expiresAfterMs);
                        return [4 /*yield*/, utils_2.getServerActor()];
                    case 1:
                        actor = _b.sent();
                        query = {
                            where: {
                                actorId: actor.id,
                                strategy: strategy,
                                createdAt: (_a = {},
                                    _a[sequelize_1.Op.lt] = expiredDate,
                                    _a)
                            }
                        };
                        return [2 /*return*/, VideoRedundancyModel_1.scope([ScopeNames.WITH_VIDEO]).findOne(query)];
                }
            });
        });
    };
    VideoRedundancyModel.getTotalDuplicated = function (strategy) {
        return __awaiter(this, void 0, void 0, function () {
            var actor, redundancyInclude, queryFiles, queryStreamingPlaylists;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, utils_2.getServerActor()];
                    case 1:
                        actor = _a.sent();
                        redundancyInclude = {
                            attributes: [],
                            model: VideoRedundancyModel_1,
                            required: true,
                            where: {
                                actorId: actor.id,
                                strategy: strategy
                            }
                        };
                        queryFiles = {
                            include: [redundancyInclude]
                        };
                        queryStreamingPlaylists = {
                            include: [
                                {
                                    attributes: [],
                                    model: video_1.VideoModel.unscoped(),
                                    required: true,
                                    include: [
                                        {
                                            required: true,
                                            attributes: [],
                                            model: video_streaming_playlist_1.VideoStreamingPlaylistModel.unscoped(),
                                            include: [
                                                redundancyInclude
                                            ]
                                        }
                                    ]
                                }
                            ]
                        };
                        return [2 /*return*/, Promise.all([
                                video_file_1.VideoFileModel.aggregate('size', 'SUM', queryFiles),
                                video_file_1.VideoFileModel.aggregate('size', 'SUM', queryStreamingPlaylists)
                            ]).then(function (_a) {
                                var r1 = _a[0], r2 = _a[1];
                                return utils_1.parseAggregateResult(r1) + utils_1.parseAggregateResult(r2);
                            })];
                }
            });
        });
    };
    VideoRedundancyModel.listLocalExpired = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, actor, query;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, utils_2.getServerActor()];
                    case 1:
                        actor = _b.sent();
                        query = {
                            where: {
                                actorId: actor.id,
                                expiresOn: (_a = {},
                                    _a[sequelize_1.Op.lt] = new Date(),
                                    _a)
                            }
                        };
                        return [2 /*return*/, VideoRedundancyModel_1.scope([ScopeNames.WITH_VIDEO]).findAll(query)];
                }
            });
        });
    };
    VideoRedundancyModel.listRemoteExpired = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, actor, query;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, utils_2.getServerActor()];
                    case 1:
                        actor = _c.sent();
                        query = {
                            where: {
                                actorId: (_a = {},
                                    _a[sequelize_1.Op.ne] = actor.id,
                                    _a),
                                expiresOn: (_b = {},
                                    _b[sequelize_1.Op.lt] = new Date(),
                                    _b)
                            }
                        };
                        return [2 /*return*/, VideoRedundancyModel_1.scope([ScopeNames.WITH_VIDEO]).findAll(query)];
                }
            });
        });
    };
    VideoRedundancyModel.listLocalOfServer = function (serverId) {
        return __awaiter(this, void 0, void 0, function () {
            var actor, buildVideoInclude, query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, utils_2.getServerActor()];
                    case 1:
                        actor = _a.sent();
                        buildVideoInclude = function () { return ({
                            model: video_1.VideoModel,
                            required: true,
                            include: [
                                {
                                    attributes: [],
                                    model: video_channel_1.VideoChannelModel.unscoped(),
                                    required: true,
                                    include: [
                                        {
                                            attributes: [],
                                            model: actor_1.ActorModel.unscoped(),
                                            required: true,
                                            where: {
                                                serverId: serverId
                                            }
                                        }
                                    ]
                                }
                            ]
                        }); };
                        query = {
                            where: {
                                actorId: actor.id
                            },
                            include: [
                                {
                                    model: video_file_1.VideoFileModel,
                                    required: false,
                                    include: [buildVideoInclude()]
                                },
                                {
                                    model: video_streaming_playlist_1.VideoStreamingPlaylistModel,
                                    required: false,
                                    include: [buildVideoInclude()]
                                }
                            ]
                        };
                        return [2 /*return*/, VideoRedundancyModel_1.findAll(query)];
                }
            });
        });
    };
    VideoRedundancyModel.getStats = function (strategy) {
        return __awaiter(this, void 0, void 0, function () {
            var actor, query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, utils_2.getServerActor()];
                    case 1:
                        actor = _a.sent();
                        query = {
                            raw: true,
                            attributes: [
                                [sequelize_1.fn('COALESCE', sequelize_1.fn('SUM', sequelize_1.col('VideoFile.size')), '0'), 'totalUsed'],
                                [sequelize_1.fn('COUNT', sequelize_1.fn('DISTINCT', sequelize_1.col('videoId'))), 'totalVideos'],
                                [sequelize_1.fn('COUNT', sequelize_1.col('videoFileId')), 'totalVideoFiles']
                            ],
                            where: {
                                strategy: strategy,
                                actorId: actor.id
                            },
                            include: [
                                {
                                    attributes: [],
                                    model: video_file_1.VideoFileModel,
                                    required: true
                                }
                            ]
                        };
                        return [2 /*return*/, VideoRedundancyModel_1.findOne(query)
                                .then(function (r) { return ({
                                totalUsed: utils_1.parseAggregateResult(r.totalUsed),
                                totalVideos: r.totalVideos,
                                totalVideoFiles: r.totalVideoFiles
                            }); })];
                }
            });
        });
    };
    VideoRedundancyModel.prototype.getVideo = function () {
        if (this.VideoFile)
            return this.VideoFile.Video;
        return this.VideoStreamingPlaylist.Video;
    };
    VideoRedundancyModel.prototype.isOwned = function () {
        return !!this.strategy;
    };
    VideoRedundancyModel.prototype.toActivityPubObject = function () {
        if (this.VideoStreamingPlaylist) {
            return {
                id: this.url,
                type: 'CacheFile',
                object: this.VideoStreamingPlaylist.Video.url,
                expires: this.expiresOn.toISOString(),
                url: {
                    type: 'Link',
                    mimeType: 'application/x-mpegURL',
                    mediaType: 'application/x-mpegURL',
                    href: this.fileUrl
                }
            };
        }
        return {
            id: this.url,
            type: 'CacheFile',
            object: this.VideoFile.Video.url,
            expires: this.expiresOn.toISOString(),
            url: {
                type: 'Link',
                mimeType: constants_1.MIMETYPES.VIDEO.EXT_MIMETYPE[this.VideoFile.extname],
                mediaType: constants_1.MIMETYPES.VIDEO.EXT_MIMETYPE[this.VideoFile.extname],
                href: this.fileUrl,
                height: this.VideoFile.resolution,
                size: this.VideoFile.size,
                fps: this.VideoFile.fps
            }
        };
    };
    // Don't include video files we already duplicated
    VideoRedundancyModel.buildVideoFileForDuplication = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, actor, notIn;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, utils_2.getServerActor()];
                    case 1:
                        actor = _b.sent();
                        notIn = sequelize_1.literal('(' +
                            ("SELECT \"videoFileId\" FROM \"videoRedundancy\" WHERE \"actorId\" = " + actor.id + " AND \"videoFileId\" IS NOT NULL") +
                            ')');
                        return [2 /*return*/, {
                                attributes: [],
                                model: video_file_1.VideoFileModel.unscoped(),
                                required: true,
                                where: {
                                    id: (_a = {},
                                        _a[sequelize_1.Op.notIn] = notIn,
                                        _a)
                                }
                            }];
                }
            });
        });
    };
    VideoRedundancyModel.buildServerRedundancyInclude = function () {
        return {
            attributes: [],
            model: video_channel_1.VideoChannelModel.unscoped(),
            required: true,
            include: [
                {
                    attributes: [],
                    model: actor_1.ActorModel.unscoped(),
                    required: true,
                    include: [
                        {
                            attributes: [],
                            model: server_1.ServerModel.unscoped(),
                            required: true,
                            where: {
                                redundancyAllowed: true
                            }
                        }
                    ]
                }
            ]
        };
    };
    var VideoRedundancyModel_1;
    __decorate([
        sequelize_typescript_1.CreatedAt
    ], VideoRedundancyModel.prototype, "createdAt");
    __decorate([
        sequelize_typescript_1.UpdatedAt
    ], VideoRedundancyModel.prototype, "updatedAt");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Column
    ], VideoRedundancyModel.prototype, "expiresOn");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Is('VideoRedundancyFileUrl', function (value) { return utils_1.throwIfNotValid(value, misc_1.isUrlValid, 'fileUrl'); }),
        sequelize_typescript_1.Column(sequelize_typescript_1.DataType.STRING(constants_1.CONSTRAINTS_FIELDS.VIDEOS_REDUNDANCY.URL.max))
    ], VideoRedundancyModel.prototype, "fileUrl");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Is('VideoRedundancyUrl', function (value) { return utils_1.throwIfNotValid(value, misc_1.isActivityPubUrlValid, 'url'); }),
        sequelize_typescript_1.Column(sequelize_typescript_1.DataType.STRING(constants_1.CONSTRAINTS_FIELDS.VIDEOS_REDUNDANCY.URL.max))
    ], VideoRedundancyModel.prototype, "url");
    __decorate([
        sequelize_typescript_1.AllowNull(true),
        sequelize_typescript_1.Column
    ], VideoRedundancyModel.prototype, "strategy");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return video_file_1.VideoFileModel; }),
        sequelize_typescript_1.Column
    ], VideoRedundancyModel.prototype, "videoFileId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return video_file_1.VideoFileModel; }, {
            foreignKey: {
                allowNull: true
            },
            onDelete: 'cascade'
        })
    ], VideoRedundancyModel.prototype, "VideoFile");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return video_streaming_playlist_1.VideoStreamingPlaylistModel; }),
        sequelize_typescript_1.Column
    ], VideoRedundancyModel.prototype, "videoStreamingPlaylistId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return video_streaming_playlist_1.VideoStreamingPlaylistModel; }, {
            foreignKey: {
                allowNull: true
            },
            onDelete: 'cascade'
        })
    ], VideoRedundancyModel.prototype, "VideoStreamingPlaylist");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return actor_1.ActorModel; }),
        sequelize_typescript_1.Column
    ], VideoRedundancyModel.prototype, "actorId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return actor_1.ActorModel; }, {
            foreignKey: {
                allowNull: false
            },
            onDelete: 'cascade'
        })
    ], VideoRedundancyModel.prototype, "Actor");
    __decorate([
        sequelize_typescript_1.BeforeDestroy
    ], VideoRedundancyModel, "removeFile");
    VideoRedundancyModel = VideoRedundancyModel_1 = __decorate([
        sequelize_typescript_1.Scopes(function () {
            var _a;
            return (_a = {},
                _a[ScopeNames.WITH_VIDEO] = {
                    include: [
                        {
                            model: video_file_1.VideoFileModel,
                            required: false,
                            include: [
                                {
                                    model: video_1.VideoModel,
                                    required: true
                                }
                            ]
                        },
                        {
                            model: video_streaming_playlist_1.VideoStreamingPlaylistModel,
                            required: false,
                            include: [
                                {
                                    model: video_1.VideoModel,
                                    required: true
                                }
                            ]
                        }
                    ]
                },
                _a);
        }),
        sequelize_typescript_1.Table({
            tableName: 'videoRedundancy',
            indexes: [
                {
                    fields: ['videoFileId']
                },
                {
                    fields: ['actorId']
                },
                {
                    fields: ['url'],
                    unique: true
                }
            ]
        })
    ], VideoRedundancyModel);
    return VideoRedundancyModel;
}(sequelize_typescript_1.Model));
exports.VideoRedundancyModel = VideoRedundancyModel;
