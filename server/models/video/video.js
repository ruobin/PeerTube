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
var _a, _b, _c, _d, _e;
var Bluebird = require("bluebird");
var lodash_1 = require("lodash");
var magnetUtil = require("magnet-uri");
var parseTorrent = require("parse-torrent");
var path_1 = require("path");
var sequelize_1 = require("sequelize");
var sequelize_typescript_1 = require("sequelize-typescript");
var shared_1 = require("../../../shared");
var core_utils_1 = require("../../helpers/core-utils");
var misc_1 = require("../../helpers/custom-validators/activitypub/misc");
var misc_2 = require("../../helpers/custom-validators/misc");
var videos_1 = require("../../helpers/custom-validators/videos");
var ffmpeg_utils_1 = require("../../helpers/ffmpeg-utils");
var logger_1 = require("../../helpers/logger");
var utils_1 = require("../../helpers/utils");
var constants_1 = require("../../initializers/constants");
var send_1 = require("../../lib/activitypub/send");
var account_1 = require("../account/account");
var account_video_rate_1 = require("../account/account-video-rate");
var actor_1 = require("../activitypub/actor");
var avatar_1 = require("../avatar/avatar");
var server_1 = require("../server/server");
var utils_2 = require("../utils");
var tag_1 = require("./tag");
var video_abuse_1 = require("./video-abuse");
var video_channel_1 = require("./video-channel");
var video_comment_1 = require("./video-comment");
var video_file_1 = require("./video-file");
var video_share_1 = require("./video-share");
var video_tag_1 = require("./video-tag");
var schedule_video_update_1 = require("./schedule-video-update");
var video_caption_1 = require("./video-caption");
var video_blacklist_1 = require("./video-blacklist");
var fs_extra_1 = require("fs-extra");
var video_views_1 = require("./video-views");
var video_redundancy_1 = require("../redundancy/video-redundancy");
var video_format_utils_1 = require("./video-format-utils");
var user_video_history_1 = require("../account/user-video-history");
var video_import_1 = require("./video-import");
var video_streaming_playlist_1 = require("./video-streaming-playlist");
var video_playlist_element_1 = require("./video-playlist-element");
var config_1 = require("../../initializers/config");
var thumbnail_1 = require("./thumbnail");
var thumbnail_type_1 = require("../../../shared/models/videos/thumbnail.type");
var webtorrent_1 = require("../../helpers/webtorrent");
var video_streaming_playlist_type_1 = require("../../../shared/models/videos/video-streaming-playlist.type");
// FIXME: Define indexes here because there is an issue with TS and Sequelize.literal when called directly in the annotation
var indexes = [
    utils_2.buildTrigramSearchIndex('video_name_trigram', 'name'),
    { fields: ['createdAt'] },
    { fields: ['publishedAt'] },
    { fields: ['duration'] },
    { fields: ['views'] },
    { fields: ['channelId'] },
    {
        fields: ['originallyPublishedAt'],
        where: {
            originallyPublishedAt: (_a = {},
                _a[sequelize_1.Op.ne] = null,
                _a)
        }
    },
    {
        fields: ['category'],
        where: {
            category: (_b = {},
                _b[sequelize_1.Op.ne] = null,
                _b)
        }
    },
    {
        fields: ['licence'],
        where: {
            licence: (_c = {},
                _c[sequelize_1.Op.ne] = null,
                _c)
        }
    },
    {
        fields: ['language'],
        where: {
            language: (_d = {},
                _d[sequelize_1.Op.ne] = null,
                _d)
        }
    },
    {
        fields: ['nsfw'],
        where: {
            nsfw: true
        }
    },
    {
        fields: ['remote'],
        where: {
            remote: false
        }
    },
    {
        fields: ['uuid'],
        unique: true
    },
    {
        fields: ['url'],
        unique: true
    }
];
var ScopeNames;
(function (ScopeNames) {
    ScopeNames["AVAILABLE_FOR_LIST_IDS"] = "AVAILABLE_FOR_LIST_IDS";
    ScopeNames["FOR_API"] = "FOR_API";
    ScopeNames["WITH_ACCOUNT_DETAILS"] = "WITH_ACCOUNT_DETAILS";
    ScopeNames["WITH_TAGS"] = "WITH_TAGS";
    ScopeNames["WITH_FILES"] = "WITH_FILES";
    ScopeNames["WITH_SCHEDULED_UPDATE"] = "WITH_SCHEDULED_UPDATE";
    ScopeNames["WITH_BLACKLISTED"] = "WITH_BLACKLISTED";
    ScopeNames["WITH_BLOCKLIST"] = "WITH_BLOCKLIST";
    ScopeNames["WITH_USER_HISTORY"] = "WITH_USER_HISTORY";
    ScopeNames["WITH_STREAMING_PLAYLISTS"] = "WITH_STREAMING_PLAYLISTS";
    ScopeNames["WITH_USER_ID"] = "WITH_USER_ID";
    ScopeNames["WITH_THUMBNAILS"] = "WITH_THUMBNAILS";
})(ScopeNames = exports.ScopeNames || (exports.ScopeNames = {}));
var VideoModel = /** @class */ (function (_super) {
    __extends(VideoModel, _super);
    function VideoModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    VideoModel_1 = VideoModel;
    VideoModel.sendDelete = function (instance, options) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!instance.isOwned()) return [3 /*break*/, 3];
                        if (!!instance.VideoChannel) return [3 /*break*/, 2];
                        _a = instance;
                        return [4 /*yield*/, instance.$get('VideoChannel', {
                                include: [
                                    {
                                        model: account_1.AccountModel,
                                        include: [actor_1.ActorModel]
                                    }
                                ],
                                transaction: options.transaction
                            })];
                    case 1:
                        _a.VideoChannel = (_b.sent());
                        _b.label = 2;
                    case 2: return [2 /*return*/, send_1.sendDeleteVideo(instance, options.transaction)];
                    case 3: return [2 /*return*/, undefined];
                }
            });
        });
    };
    VideoModel.removeFiles = function (instance) {
        return __awaiter(this, void 0, void 0, function () {
            var tasks, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        tasks = [];
                        logger_1.logger.info('Removing files of video %s.', instance.url);
                        if (!instance.isOwned()) return [3 /*break*/, 3];
                        if (!!Array.isArray(instance.VideoFiles)) return [3 /*break*/, 2];
                        _a = instance;
                        return [4 /*yield*/, instance.$get('VideoFiles')];
                    case 1:
                        _a.VideoFiles = (_b.sent());
                        _b.label = 2;
                    case 2:
                        // Remove physical files and torrents
                        instance.VideoFiles.forEach(function (file) {
                            tasks.push(instance.removeFile(file));
                            tasks.push(instance.removeTorrent(file));
                        });
                        // Remove playlists file
                        tasks.push(instance.removeStreamingPlaylist());
                        _b.label = 3;
                    case 3:
                        // Do not wait video deletion because we could be in a transaction
                        Promise.all(tasks)["catch"](function (err) {
                            logger_1.logger.error('Some errors when removing files of video %s in before destroy hook.', instance.uuid, { err: err });
                        });
                        return [2 /*return*/, undefined];
                }
            });
        });
    };
    VideoModel.listLocal = function () {
        var query = {
            where: {
                remote: false
            }
        };
        return VideoModel_1.scope([
            ScopeNames.WITH_FILES,
            ScopeNames.WITH_STREAMING_PLAYLISTS,
            ScopeNames.WITH_THUMBNAILS
        ]).findAll(query);
    };
    VideoModel.listAllAndSharedByActorForOutbox = function (actorId, start, count) {
        var _a, _b, _c, _d;
        function getRawQuery(select) {
            var queryVideo = 'SELECT ' + select + ' FROM "video" AS "Video" ' +
                'INNER JOIN "videoChannel" AS "VideoChannel" ON "VideoChannel"."id" = "Video"."channelId" ' +
                'INNER JOIN "account" AS "Account" ON "Account"."id" = "VideoChannel"."accountId" ' +
                'WHERE "Account"."actorId" = ' + actorId;
            var queryVideoShare = 'SELECT ' + select + ' FROM "videoShare" AS "VideoShare" ' +
                'INNER JOIN "video" AS "Video" ON "Video"."id" = "VideoShare"."videoId" ' +
                'WHERE "VideoShare"."actorId" = ' + actorId;
            return "(" + queryVideo + ") UNION (" + queryVideoShare + ")";
        }
        var rawQuery = getRawQuery('"Video"."id"');
        var rawCountQuery = getRawQuery('COUNT("Video"."id") as "total"');
        var query = {
            distinct: true,
            offset: start,
            limit: count,
            order: utils_2.getVideoSort('createdAt', ['Tags', 'name', 'ASC']),
            where: (_a = {
                    id: (_b = {},
                        _b[sequelize_1.Op["in"]] = sequelize_1.Sequelize.literal('(' + rawQuery + ')'),
                        _b)
                },
                _a[sequelize_1.Op.or] = [
                    { privacy: shared_1.VideoPrivacy.PUBLIC },
                    { privacy: shared_1.VideoPrivacy.UNLISTED }
                ],
                _a),
            include: [
                {
                    attributes: ['language'],
                    model: video_caption_1.VideoCaptionModel.unscoped(),
                    required: false
                },
                {
                    attributes: ['id', 'url'],
                    model: video_share_1.VideoShareModel.unscoped(),
                    required: false,
                    // We only want videos shared by this actor
                    where: (_c = {},
                        _c[sequelize_1.Op.and] = [
                            {
                                id: (_d = {},
                                    _d[sequelize_1.Op.not] = null,
                                    _d)
                            },
                            {
                                actorId: actorId
                            }
                        ],
                        _c),
                    include: [
                        {
                            attributes: ['id', 'url'],
                            model: actor_1.ActorModel.unscoped()
                        }
                    ]
                },
                {
                    model: video_channel_1.VideoChannelModel.unscoped(),
                    required: true,
                    include: [
                        {
                            attributes: ['name'],
                            model: account_1.AccountModel.unscoped(),
                            required: true,
                            include: [
                                {
                                    attributes: ['id', 'url', 'followersUrl'],
                                    model: actor_1.ActorModel.unscoped(),
                                    required: true
                                }
                            ]
                        },
                        {
                            attributes: ['id', 'url', 'followersUrl'],
                            model: actor_1.ActorModel.unscoped(),
                            required: true
                        }
                    ]
                },
                video_file_1.VideoFileModel,
                tag_1.TagModel
            ]
        };
        return Bluebird.all([
            VideoModel_1.scope(ScopeNames.WITH_THUMBNAILS).findAll(query),
            VideoModel_1.sequelize.query(rawCountQuery, { type: sequelize_1.QueryTypes.SELECT })
        ]).then(function (_a) {
            var rows = _a[0], totals = _a[1];
            // totals: totalVideos + totalVideoShares
            var totalVideos = 0;
            var totalVideoShares = 0;
            if (totals[0])
                totalVideos = parseInt(totals[0].total, 10);
            if (totals[1])
                totalVideoShares = parseInt(totals[1].total, 10);
            var total = totalVideos + totalVideoShares;
            return {
                data: rows,
                total: total
            };
        });
    };
    VideoModel.listUserVideosForApi = function (accountId, start, count, sort, withFiles) {
        if (withFiles === void 0) { withFiles = false; }
        function buildBaseQuery() {
            return {
                offset: start,
                limit: count,
                order: utils_2.getVideoSort(sort),
                include: [
                    {
                        model: video_channel_1.VideoChannelModel,
                        required: true,
                        include: [
                            {
                                model: account_1.AccountModel,
                                where: {
                                    id: accountId
                                },
                                required: true
                            }
                        ]
                    }
                ]
            };
        }
        var countQuery = buildBaseQuery();
        var findQuery = buildBaseQuery();
        var findScopes = [
            ScopeNames.WITH_SCHEDULED_UPDATE,
            ScopeNames.WITH_BLACKLISTED,
            ScopeNames.WITH_THUMBNAILS
        ];
        if (withFiles === true) {
            findQuery.include.push({
                model: video_file_1.VideoFileModel.unscoped(),
                required: true
            });
        }
        return Promise.all([
            VideoModel_1.count(countQuery),
            VideoModel_1.scope(findScopes).findAll(findQuery)
        ]).then(function (_a) {
            var count = _a[0], rows = _a[1];
            return {
                data: rows,
                total: count
            };
        });
    };
    VideoModel.listForApi = function (options, countVideos) {
        if (countVideos === void 0) { countVideos = true; }
        return __awaiter(this, void 0, void 0, function () {
            var query, trendingDays, serverActor, followerActorId, queryOptions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (options.filter && options.filter === 'all-local' && !options.user.hasRight(shared_1.UserRight.SEE_ALL_VIDEOS)) {
                            throw new Error('Try to filter all-local but no user has not the see all videos right');
                        }
                        query = {
                            offset: options.start,
                            limit: options.count,
                            order: utils_2.getVideoSort(options.sort)
                        };
                        if (options.sort.endsWith('trending')) {
                            trendingDays = config_1.CONFIG.TRENDING.VIDEOS.INTERVAL_DAYS;
                            query.group = 'VideoModel.id';
                        }
                        return [4 /*yield*/, utils_1.getServerActor()
                            // followerActorId === null has a meaning, so just check undefined
                        ];
                    case 1:
                        serverActor = _a.sent();
                        followerActorId = options.followerActorId !== undefined ? options.followerActorId : serverActor.id;
                        queryOptions = {
                            followerActorId: followerActorId,
                            serverAccountId: serverActor.Account.id,
                            nsfw: options.nsfw,
                            categoryOneOf: options.categoryOneOf,
                            licenceOneOf: options.licenceOneOf,
                            languageOneOf: options.languageOneOf,
                            tagsOneOf: options.tagsOneOf,
                            tagsAllOf: options.tagsAllOf,
                            filter: options.filter,
                            withFiles: options.withFiles,
                            accountId: options.accountId,
                            videoChannelId: options.videoChannelId,
                            videoPlaylistId: options.videoPlaylistId,
                            includeLocalVideos: options.includeLocalVideos,
                            user: options.user,
                            historyOfUser: options.historyOfUser,
                            trendingDays: trendingDays
                        };
                        return [2 /*return*/, VideoModel_1.getAvailableForApi(query, queryOptions, countVideos)];
                }
            });
        });
    };
    VideoModel.searchAndPopulateAccountAndServer = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, whereAnd, publishedAtRange, originallyPublishedAtRange, durationRange, attributesInclude, escapedSearch, escapedLikeSearch, query, serverActor, queryOptions;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        whereAnd = [];
                        if (options.startDate || options.endDate) {
                            publishedAtRange = {};
                            if (options.startDate)
                                publishedAtRange[sequelize_1.Op.gte] = options.startDate;
                            if (options.endDate)
                                publishedAtRange[sequelize_1.Op.lte] = options.endDate;
                            whereAnd.push({ publishedAt: publishedAtRange });
                        }
                        if (options.originallyPublishedStartDate || options.originallyPublishedEndDate) {
                            originallyPublishedAtRange = {};
                            if (options.originallyPublishedStartDate)
                                originallyPublishedAtRange[sequelize_1.Op.gte] = options.originallyPublishedStartDate;
                            if (options.originallyPublishedEndDate)
                                originallyPublishedAtRange[sequelize_1.Op.lte] = options.originallyPublishedEndDate;
                            whereAnd.push({ originallyPublishedAt: originallyPublishedAtRange });
                        }
                        if (options.durationMin || options.durationMax) {
                            durationRange = {};
                            if (options.durationMin)
                                durationRange[sequelize_1.Op.gte] = options.durationMin;
                            if (options.durationMax)
                                durationRange[sequelize_1.Op.lte] = options.durationMax;
                            whereAnd.push({ duration: durationRange });
                        }
                        attributesInclude = [];
                        escapedSearch = VideoModel_1.sequelize.escape(options.search);
                        escapedLikeSearch = VideoModel_1.sequelize.escape('%' + options.search + '%');
                        if (options.search) {
                            whereAnd.push({
                                id: (_a = {},
                                    _a[sequelize_1.Op["in"]] = sequelize_1.Sequelize.literal('(' +
                                        'SELECT "video"."id" FROM "video" ' +
                                        'WHERE ' +
                                        'lower(immutable_unaccent("video"."name")) % lower(immutable_unaccent(' + escapedSearch + ')) OR ' +
                                        'lower(immutable_unaccent("video"."name")) LIKE lower(immutable_unaccent(' + escapedLikeSearch + '))' +
                                        'UNION ALL ' +
                                        'SELECT "video"."id" FROM "video" LEFT JOIN "videoTag" ON "videoTag"."videoId" = "video"."id" ' +
                                        'INNER JOIN "tag" ON "tag"."id" = "videoTag"."tagId" ' +
                                        'WHERE "tag"."name" = ' + escapedSearch +
                                        ')'),
                                    _a)
                            });
                            attributesInclude.push(utils_2.createSimilarityAttribute('VideoModel.name', options.search));
                        }
                        // Cannot search on similarity if we don't have a search
                        if (!options.search) {
                            attributesInclude.push(sequelize_1.Sequelize.literal('0 as similarity'));
                        }
                        query = {
                            attributes: {
                                include: attributesInclude
                            },
                            offset: options.start,
                            limit: options.count,
                            order: utils_2.getVideoSort(options.sort)
                        };
                        return [4 /*yield*/, utils_1.getServerActor()];
                    case 1:
                        serverActor = _b.sent();
                        queryOptions = {
                            followerActorId: serverActor.id,
                            serverAccountId: serverActor.Account.id,
                            includeLocalVideos: options.includeLocalVideos,
                            nsfw: options.nsfw,
                            categoryOneOf: options.categoryOneOf,
                            licenceOneOf: options.licenceOneOf,
                            languageOneOf: options.languageOneOf,
                            tagsOneOf: options.tagsOneOf,
                            tagsAllOf: options.tagsAllOf,
                            user: options.user,
                            filter: options.filter,
                            baseWhere: whereAnd
                        };
                        return [2 /*return*/, VideoModel_1.getAvailableForApi(query, queryOptions)];
                }
            });
        });
    };
    VideoModel.load = function (id, t) {
        var where = utils_2.buildWhereIdOrUUID(id);
        var options = {
            where: where,
            transaction: t
        };
        return VideoModel_1.scope(ScopeNames.WITH_THUMBNAILS).findOne(options);
    };
    VideoModel.loadWithRights = function (id, t) {
        var where = utils_2.buildWhereIdOrUUID(id);
        var options = {
            where: where,
            transaction: t
        };
        return VideoModel_1.scope([
            ScopeNames.WITH_BLACKLISTED,
            ScopeNames.WITH_USER_ID,
            ScopeNames.WITH_THUMBNAILS
        ]).findOne(options);
    };
    VideoModel.loadOnlyId = function (id, t) {
        var where = utils_2.buildWhereIdOrUUID(id);
        var options = {
            attributes: ['id'],
            where: where,
            transaction: t
        };
        return VideoModel_1.scope(ScopeNames.WITH_THUMBNAILS).findOne(options);
    };
    VideoModel.loadWithFiles = function (id, t, logging) {
        var where = utils_2.buildWhereIdOrUUID(id);
        var query = {
            where: where,
            transaction: t,
            logging: logging
        };
        return VideoModel_1.scope([
            ScopeNames.WITH_FILES,
            ScopeNames.WITH_STREAMING_PLAYLISTS,
            ScopeNames.WITH_THUMBNAILS
        ]).findOne(query);
    };
    VideoModel.loadByUUID = function (uuid) {
        var options = {
            where: {
                uuid: uuid
            }
        };
        return VideoModel_1.scope(ScopeNames.WITH_THUMBNAILS).findOne(options);
    };
    VideoModel.loadByUrl = function (url, transaction) {
        var query = {
            where: {
                url: url
            },
            transaction: transaction
        };
        return VideoModel_1.scope(ScopeNames.WITH_THUMBNAILS).findOne(query);
    };
    VideoModel.loadByUrlAndPopulateAccount = function (url, transaction) {
        var query = {
            where: {
                url: url
            },
            transaction: transaction
        };
        return VideoModel_1.scope([
            ScopeNames.WITH_ACCOUNT_DETAILS,
            ScopeNames.WITH_FILES,
            ScopeNames.WITH_STREAMING_PLAYLISTS,
            ScopeNames.WITH_THUMBNAILS
        ]).findOne(query);
    };
    VideoModel.loadAndPopulateAccountAndServerAndTags = function (id, t, userId) {
        var where = utils_2.buildWhereIdOrUUID(id);
        var options = {
            order: [['Tags', 'name', 'ASC']],
            where: where,
            transaction: t
        };
        var scopes = [
            ScopeNames.WITH_TAGS,
            ScopeNames.WITH_BLACKLISTED,
            ScopeNames.WITH_ACCOUNT_DETAILS,
            ScopeNames.WITH_SCHEDULED_UPDATE,
            ScopeNames.WITH_FILES,
            ScopeNames.WITH_STREAMING_PLAYLISTS,
            ScopeNames.WITH_THUMBNAILS
        ];
        if (userId) {
            scopes.push({ method: [ScopeNames.WITH_USER_HISTORY, userId] });
        }
        return VideoModel_1
            .scope(scopes)
            .findOne(options);
    };
    VideoModel.loadForGetAPI = function (parameters) {
        var id = parameters.id, t = parameters.t, userId = parameters.userId;
        var where = utils_2.buildWhereIdOrUUID(id);
        var options = {
            order: [['Tags', 'name', 'ASC']],
            where: where,
            transaction: t
        };
        var scopes = [
            ScopeNames.WITH_TAGS,
            ScopeNames.WITH_BLACKLISTED,
            ScopeNames.WITH_ACCOUNT_DETAILS,
            ScopeNames.WITH_SCHEDULED_UPDATE,
            ScopeNames.WITH_THUMBNAILS,
            { method: [ScopeNames.WITH_FILES, true] },
            { method: [ScopeNames.WITH_STREAMING_PLAYLISTS, true] }
        ];
        if (userId) {
            scopes.push({ method: [ScopeNames.WITH_USER_HISTORY, userId] });
        }
        return VideoModel_1
            .scope(scopes)
            .findOne(options);
    };
    VideoModel.getStats = function () {
        return __awaiter(this, void 0, void 0, function () {
            var totalLocalVideos, totalVideos, totalLocalVideoViews;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, VideoModel_1.count({
                            where: {
                                remote: false
                            }
                        })];
                    case 1:
                        totalLocalVideos = _a.sent();
                        return [4 /*yield*/, VideoModel_1.count()];
                    case 2:
                        totalVideos = _a.sent();
                        return [4 /*yield*/, VideoModel_1.sum('views', {
                                where: {
                                    remote: false
                                }
                            })
                            // Sequelize could return null...
                        ];
                    case 3:
                        totalLocalVideoViews = _a.sent();
                        // Sequelize could return null...
                        if (!totalLocalVideoViews)
                            totalLocalVideoViews = 0;
                        return [2 /*return*/, {
                                totalLocalVideos: totalLocalVideos,
                                totalLocalVideoViews: totalLocalVideoViews,
                                totalVideos: totalVideos
                            }];
                }
            });
        });
    };
    VideoModel.incrementViews = function (id, views) {
        return VideoModel_1.increment('views', {
            by: views,
            where: {
                id: id
            }
        });
    };
    VideoModel.checkVideoHasInstanceFollow = function (videoId, followerActorId) {
        // Instances only share videos
        var query = 'SELECT 1 FROM "videoShare" ' +
            'INNER JOIN "actorFollow" ON "actorFollow"."targetActorId" = "videoShare"."actorId" ' +
            'WHERE "actorFollow"."actorId" = $followerActorId AND "videoShare"."videoId" = $videoId ' +
            'LIMIT 1';
        var options = {
            type: sequelize_1.QueryTypes.SELECT,
            bind: { followerActorId: followerActorId, videoId: videoId },
            raw: true
        };
        return VideoModel_1.sequelize.query(query, options)
            .then(function (results) { return results.length === 1; });
    };
    VideoModel.bulkUpdateSupportField = function (videoChannel, t) {
        var options = {
            where: {
                channelId: videoChannel.id
            },
            transaction: t
        };
        return VideoModel_1.update({ support: videoChannel.support }, options);
    };
    VideoModel.getAllIdsFromChannel = function (videoChannel) {
        var query = {
            attributes: ['id'],
            where: {
                channelId: videoChannel.id
            }
        };
        return VideoModel_1.findAll(query)
            .then(function (videos) { return videos.map(function (v) { return v.id; }); });
    };
    // threshold corresponds to how many video the field should have to be returned
    VideoModel.getRandomFieldSamples = function (field, threshold, count) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, serverActor, followerActorId, scopeOptions, query;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, utils_1.getServerActor()];
                    case 1:
                        serverActor = _b.sent();
                        followerActorId = serverActor.id;
                        scopeOptions = {
                            serverAccountId: serverActor.Account.id,
                            followerActorId: followerActorId,
                            includeLocalVideos: true,
                            attributesType: 'none' // Don't break aggregation
                        };
                        query = {
                            attributes: [field],
                            limit: count,
                            group: field,
                            having: sequelize_1.Sequelize.where(sequelize_1.Sequelize.fn('COUNT', sequelize_1.Sequelize.col(field)), (_a = {}, _a[sequelize_1.Op.gte] = threshold, _a)),
                            order: [this.sequelize.random()]
                        };
                        return [2 /*return*/, VideoModel_1.scope({ method: [ScopeNames.AVAILABLE_FOR_LIST_IDS, scopeOptions] })
                                .findAll(query)
                                .then(function (rows) { return rows.map(function (r) { return r[field]; }); })];
                }
            });
        });
    };
    VideoModel.buildTrendingQuery = function (trendingDays) {
        var _a;
        return {
            attributes: [],
            subQuery: false,
            model: video_views_1.VideoViewModel,
            required: false,
            where: {
                startDate: (_a = {},
                    _a[sequelize_1.Op.gte] = new Date(new Date().getTime() - (24 * 3600 * 1000) * trendingDays),
                    _a)
            }
        };
    };
    VideoModel.buildActorWhereWithFilter = function (filter) {
        if (filter && (filter === 'local' || filter === 'all-local')) {
            return {
                serverId: null
            };
        }
        return {};
    };
    VideoModel.getAvailableForApi = function (query, // Forbid where field in query
    options, countVideos) {
        if (countVideos === void 0) { countVideos = true; }
        return __awaiter(this, void 0, void 0, function () {
            var idsScope, countOptions, countQuery, countScope, _a, count, ids, secondQuery, apiScope, rows;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        idsScope = {
                            method: [
                                ScopeNames.AVAILABLE_FOR_LIST_IDS, options
                            ]
                        };
                        countOptions = Object.assign({}, options, { trendingDays: undefined });
                        countQuery = Object.assign({}, query, { attributes: undefined, group: undefined });
                        countScope = {
                            method: [
                                ScopeNames.AVAILABLE_FOR_LIST_IDS, countOptions
                            ]
                        };
                        return [4 /*yield*/, Promise.all([
                                countVideos
                                    ? VideoModel_1.scope(countScope).count(countQuery)
                                    : Promise.resolve(undefined),
                                VideoModel_1.scope(idsScope)
                                    .findAll(query)
                                    .then(function (rows) { return rows.map(function (r) { return r.id; }); })
                            ])];
                    case 1:
                        _a = _b.sent(), count = _a[0], ids = _a[1];
                        if (ids.length === 0)
                            return [2 /*return*/, { data: [], total: count }];
                        secondQuery = {
                            offset: 0,
                            limit: query.limit,
                            attributes: query.attributes,
                            order: [
                                sequelize_1.Sequelize.literal(ids.map(function (id) { return "\"VideoModel\".id = " + id + " DESC"; }).join(', '))
                            ]
                        };
                        apiScope = [];
                        if (options.user) {
                            apiScope.push({ method: [ScopeNames.WITH_USER_HISTORY, options.user.id] });
                        }
                        apiScope.push({
                            method: [
                                ScopeNames.FOR_API, {
                                    ids: ids,
                                    withFiles: options.withFiles,
                                    videoPlaylistId: options.videoPlaylistId
                                }
                            ]
                        });
                        return [4 /*yield*/, VideoModel_1.scope(apiScope).findAll(secondQuery)];
                    case 2:
                        rows = _b.sent();
                        return [2 /*return*/, {
                                data: rows,
                                total: count
                            }];
                }
            });
        });
    };
    VideoModel.getCategoryLabel = function (id) {
        return constants_1.VIDEO_CATEGORIES[id] || 'Misc';
    };
    VideoModel.getLicenceLabel = function (id) {
        return constants_1.VIDEO_LICENCES[id] || 'Unknown';
    };
    VideoModel.getLanguageLabel = function (id) {
        return constants_1.VIDEO_LANGUAGES[id] || 'Unknown';
    };
    VideoModel.getPrivacyLabel = function (id) {
        return constants_1.VIDEO_PRIVACIES[id] || 'Unknown';
    };
    VideoModel.getStateLabel = function (id) {
        return constants_1.VIDEO_STATES[id] || 'Unknown';
    };
    VideoModel.prototype.isBlacklisted = function () {
        return !!this.VideoBlacklist;
    };
    VideoModel.prototype.isBlocked = function () {
        return (this.VideoChannel.Account.Actor.Server && this.VideoChannel.Account.Actor.Server.isBlocked()) ||
            this.VideoChannel.Account.isBlocked();
    };
    VideoModel.prototype.getOriginalFile = function () {
        if (Array.isArray(this.VideoFiles) === false)
            return undefined;
        // The original file is the file that have the higher resolution
        return lodash_1.maxBy(this.VideoFiles, function (file) { return file.resolution; });
    };
    VideoModel.prototype.getFile = function (resolution) {
        if (Array.isArray(this.VideoFiles) === false)
            return undefined;
        return this.VideoFiles.find(function (f) { return f.resolution === resolution; });
    };
    VideoModel.prototype.addAndSaveThumbnail = function (thumbnail, transaction) {
        return __awaiter(this, void 0, void 0, function () {
            var savedThumbnail;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        thumbnail.videoId = this.id;
                        return [4 /*yield*/, thumbnail.save({ transaction: transaction })];
                    case 1:
                        savedThumbnail = _a.sent();
                        if (Array.isArray(this.Thumbnails) === false)
                            this.Thumbnails = [];
                        // Already have this thumbnail, skip
                        if (this.Thumbnails.find(function (t) { return t.id === savedThumbnail.id; }))
                            return [2 /*return*/];
                        this.Thumbnails.push(savedThumbnail);
                        return [2 /*return*/];
                }
            });
        });
    };
    VideoModel.prototype.getVideoFilename = function (videoFile) {
        return this.uuid + '-' + videoFile.resolution + videoFile.extname;
    };
    VideoModel.prototype.generateThumbnailName = function () {
        return this.uuid + '.jpg';
    };
    VideoModel.prototype.getMiniature = function () {
        if (Array.isArray(this.Thumbnails) === false)
            return undefined;
        return this.Thumbnails.find(function (t) { return t.type === thumbnail_type_1.ThumbnailType.MINIATURE; });
    };
    VideoModel.prototype.generatePreviewName = function () {
        return this.uuid + '.jpg';
    };
    VideoModel.prototype.getPreview = function () {
        if (Array.isArray(this.Thumbnails) === false)
            return undefined;
        return this.Thumbnails.find(function (t) { return t.type === thumbnail_type_1.ThumbnailType.PREVIEW; });
    };
    VideoModel.prototype.getTorrentFileName = function (videoFile) {
        var extension = '.torrent';
        return this.uuid + '-' + videoFile.resolution + extension;
    };
    VideoModel.prototype.isOwned = function () {
        return this.remote === false;
    };
    VideoModel.prototype.getTorrentFilePath = function (videoFile) {
        return path_1.join(config_1.CONFIG.STORAGE.TORRENTS_DIR, this.getTorrentFileName(videoFile));
    };
    VideoModel.prototype.getVideoFilePath = function (videoFile) {
        return path_1.join(config_1.CONFIG.STORAGE.VIDEOS_DIR, this.getVideoFilename(videoFile));
    };
    VideoModel.prototype.createTorrentAndSetInfoHash = function (videoFile) {
        return __awaiter(this, void 0, void 0, function () {
            var options, torrent, filePath, parsedTorrent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = {
                            // Keep the extname, it's used by the client to stream the file inside a web browser
                            name: this.name + " " + videoFile.resolution + "p" + videoFile.extname,
                            createdBy: 'PeerTube',
                            announceList: [
                                [constants_1.WEBSERVER.WS + '://' + constants_1.WEBSERVER.HOSTNAME + ':' + constants_1.WEBSERVER.PORT + '/tracker/socket'],
                                [constants_1.WEBSERVER.URL + '/tracker/announce']
                            ],
                            urlList: [constants_1.WEBSERVER.URL + constants_1.STATIC_PATHS.WEBSEED + this.getVideoFilename(videoFile)]
                        };
                        return [4 /*yield*/, webtorrent_1.createTorrentPromise(this.getVideoFilePath(videoFile), options)];
                    case 1:
                        torrent = _a.sent();
                        filePath = path_1.join(config_1.CONFIG.STORAGE.TORRENTS_DIR, this.getTorrentFileName(videoFile));
                        logger_1.logger.info('Creating torrent %s.', filePath);
                        return [4 /*yield*/, fs_extra_1.writeFile(filePath, torrent)];
                    case 2:
                        _a.sent();
                        parsedTorrent = parseTorrent(torrent);
                        videoFile.infoHash = parsedTorrent.infoHash;
                        return [2 /*return*/];
                }
            });
        });
    };
    VideoModel.prototype.getWatchStaticPath = function () {
        return '/videos/watch/' + this.uuid;
    };
    VideoModel.prototype.getEmbedStaticPath = function () {
        return '/videos/embed/' + this.uuid;
    };
    VideoModel.prototype.getMiniatureStaticPath = function () {
        var thumbnail = this.getMiniature();
        if (!thumbnail)
            return null;
        return path_1.join(constants_1.STATIC_PATHS.THUMBNAILS, thumbnail.filename);
    };
    VideoModel.prototype.getPreviewStaticPath = function () {
        var preview = this.getPreview();
        if (!preview)
            return null;
        // We use a local cache, so specify our cache endpoint instead of potential remote URL
        return path_1.join(constants_1.LAZY_STATIC_PATHS.PREVIEWS, preview.filename);
    };
    VideoModel.prototype.toFormattedJSON = function (options) {
        return video_format_utils_1.videoModelToFormattedJSON(this, options);
    };
    VideoModel.prototype.toFormattedDetailsJSON = function () {
        return video_format_utils_1.videoModelToFormattedDetailsJSON(this);
    };
    VideoModel.prototype.getFormattedVideoFilesJSON = function () {
        return video_format_utils_1.videoFilesModelToFormattedJSON(this, this.VideoFiles);
    };
    VideoModel.prototype.toActivityPubObject = function () {
        return video_format_utils_1.videoModelToActivityPubObject(this);
    };
    VideoModel.prototype.getTruncatedDescription = function () {
        if (!this.description)
            return null;
        var maxLength = constants_1.CONSTRAINTS_FIELDS.VIDEOS.TRUNCATED_DESCRIPTION.max;
        return core_utils_1.peertubeTruncate(this.description, maxLength);
    };
    VideoModel.prototype.getOriginalFileResolution = function () {
        var originalFilePath = this.getVideoFilePath(this.getOriginalFile());
        return ffmpeg_utils_1.getVideoFileResolution(originalFilePath);
    };
    VideoModel.prototype.getDescriptionAPIPath = function () {
        return "/api/" + constants_1.API_VERSION + "/videos/" + this.uuid + "/description";
    };
    VideoModel.prototype.getHLSPlaylist = function () {
        if (!this.VideoStreamingPlaylists)
            return undefined;
        return this.VideoStreamingPlaylists.find(function (p) { return p.type === video_streaming_playlist_type_1.VideoStreamingPlaylistType.HLS; });
    };
    VideoModel.prototype.removeFile = function (videoFile, isRedundancy) {
        if (isRedundancy === void 0) { isRedundancy = false; }
        var baseDir = isRedundancy ? config_1.CONFIG.STORAGE.REDUNDANCY_DIR : config_1.CONFIG.STORAGE.VIDEOS_DIR;
        var filePath = path_1.join(baseDir, this.getVideoFilename(videoFile));
        return fs_extra_1.remove(filePath)["catch"](function (err) { return logger_1.logger.warn('Cannot delete file %s.', filePath, { err: err }); });
    };
    VideoModel.prototype.removeTorrent = function (videoFile) {
        var torrentPath = path_1.join(config_1.CONFIG.STORAGE.TORRENTS_DIR, this.getTorrentFileName(videoFile));
        return fs_extra_1.remove(torrentPath)["catch"](function (err) { return logger_1.logger.warn('Cannot delete torrent %s.', torrentPath, { err: err }); });
    };
    VideoModel.prototype.removeStreamingPlaylist = function (isRedundancy) {
        if (isRedundancy === void 0) { isRedundancy = false; }
        var baseDir = isRedundancy ? constants_1.HLS_REDUNDANCY_DIRECTORY : constants_1.HLS_STREAMING_PLAYLIST_DIRECTORY;
        var filePath = path_1.join(baseDir, this.uuid);
        return fs_extra_1.remove(filePath)["catch"](function (err) { return logger_1.logger.warn('Cannot delete playlist directory %s.', filePath, { err: err }); });
    };
    VideoModel.prototype.isOutdated = function () {
        if (this.isOwned())
            return false;
        return utils_2.isOutdated(this, constants_1.ACTIVITY_PUB.VIDEO_REFRESH_INTERVAL);
    };
    VideoModel.prototype.setAsRefreshed = function () {
        this.changed('updatedAt', true);
        return this.save();
    };
    VideoModel.prototype.getBaseUrls = function () {
        var baseUrlHttp;
        var baseUrlWs;
        if (this.isOwned()) {
            baseUrlHttp = constants_1.WEBSERVER.URL;
            baseUrlWs = constants_1.WEBSERVER.WS + '://' + constants_1.WEBSERVER.HOSTNAME + ':' + constants_1.WEBSERVER.PORT;
        }
        else {
            baseUrlHttp = constants_1.REMOTE_SCHEME.HTTP + '://' + this.VideoChannel.Account.Actor.Server.host;
            baseUrlWs = constants_1.REMOTE_SCHEME.WS + '://' + this.VideoChannel.Account.Actor.Server.host;
        }
        return { baseUrlHttp: baseUrlHttp, baseUrlWs: baseUrlWs };
    };
    VideoModel.prototype.generateMagnetUri = function (videoFile, baseUrlHttp, baseUrlWs) {
        var xs = this.getTorrentUrl(videoFile, baseUrlHttp);
        var announce = this.getTrackerUrls(baseUrlHttp, baseUrlWs);
        var urlList = [this.getVideoFileUrl(videoFile, baseUrlHttp)];
        var redundancies = videoFile.RedundancyVideos;
        if (misc_2.isArray(redundancies))
            urlList = urlList.concat(redundancies.map(function (r) { return r.fileUrl; }));
        var magnetHash = {
            xs: xs,
            announce: announce,
            urlList: urlList,
            infoHash: videoFile.infoHash,
            name: this.name
        };
        return magnetUtil.encode(magnetHash);
    };
    VideoModel.prototype.getTrackerUrls = function (baseUrlHttp, baseUrlWs) {
        return [baseUrlWs + '/tracker/socket', baseUrlHttp + '/tracker/announce'];
    };
    VideoModel.prototype.getTorrentUrl = function (videoFile, baseUrlHttp) {
        return baseUrlHttp + constants_1.STATIC_PATHS.TORRENTS + this.getTorrentFileName(videoFile);
    };
    VideoModel.prototype.getTorrentDownloadUrl = function (videoFile, baseUrlHttp) {
        return baseUrlHttp + constants_1.STATIC_DOWNLOAD_PATHS.TORRENTS + this.getTorrentFileName(videoFile);
    };
    VideoModel.prototype.getVideoFileUrl = function (videoFile, baseUrlHttp) {
        return baseUrlHttp + constants_1.STATIC_PATHS.WEBSEED + this.getVideoFilename(videoFile);
    };
    VideoModel.prototype.getVideoRedundancyUrl = function (videoFile, baseUrlHttp) {
        return baseUrlHttp + constants_1.STATIC_PATHS.REDUNDANCY + this.getVideoFilename(videoFile);
    };
    VideoModel.prototype.getVideoFileDownloadUrl = function (videoFile, baseUrlHttp) {
        return baseUrlHttp + constants_1.STATIC_DOWNLOAD_PATHS.VIDEOS + this.getVideoFilename(videoFile);
    };
    VideoModel.prototype.getBandwidthBits = function (videoFile) {
        return Math.ceil((videoFile.size * 8) / this.duration);
    };
    var VideoModel_1;
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Default(sequelize_typescript_1.DataType.UUIDV4),
        sequelize_typescript_1.IsUUID(4),
        sequelize_typescript_1.Column(sequelize_typescript_1.DataType.UUID)
    ], VideoModel.prototype, "uuid");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Is('VideoName', function (value) { return utils_2.throwIfNotValid(value, videos_1.isVideoNameValid, 'name'); }),
        sequelize_typescript_1.Column
    ], VideoModel.prototype, "name");
    __decorate([
        sequelize_typescript_1.AllowNull(true),
        sequelize_typescript_1.Default(null),
        sequelize_typescript_1.Is('VideoCategory', function (value) { return utils_2.throwIfNotValid(value, videos_1.isVideoCategoryValid, 'category', true); }),
        sequelize_typescript_1.Column
    ], VideoModel.prototype, "category");
    __decorate([
        sequelize_typescript_1.AllowNull(true),
        sequelize_typescript_1.Default(null),
        sequelize_typescript_1.Is('VideoLicence', function (value) { return utils_2.throwIfNotValid(value, videos_1.isVideoLicenceValid, 'licence', true); }),
        sequelize_typescript_1.Column
    ], VideoModel.prototype, "licence");
    __decorate([
        sequelize_typescript_1.AllowNull(true),
        sequelize_typescript_1.Default(null),
        sequelize_typescript_1.Is('VideoLanguage', function (value) { return utils_2.throwIfNotValid(value, videos_1.isVideoLanguageValid, 'language', true); }),
        sequelize_typescript_1.Column(sequelize_typescript_1.DataType.STRING(constants_1.CONSTRAINTS_FIELDS.VIDEOS.LANGUAGE.max))
    ], VideoModel.prototype, "language");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Is('VideoPrivacy', function (value) { return utils_2.throwIfNotValid(value, videos_1.isVideoPrivacyValid, 'privacy'); }),
        sequelize_typescript_1.Column
    ], VideoModel.prototype, "privacy");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Is('VideoNSFW', function (value) { return utils_2.throwIfNotValid(value, misc_2.isBooleanValid, 'NSFW boolean'); }),
        sequelize_typescript_1.Column
    ], VideoModel.prototype, "nsfw");
    __decorate([
        sequelize_typescript_1.AllowNull(true),
        sequelize_typescript_1.Default(null),
        sequelize_typescript_1.Is('VideoDescription', function (value) { return utils_2.throwIfNotValid(value, videos_1.isVideoDescriptionValid, 'description', true); }),
        sequelize_typescript_1.Column(sequelize_typescript_1.DataType.STRING(constants_1.CONSTRAINTS_FIELDS.VIDEOS.DESCRIPTION.max))
    ], VideoModel.prototype, "description");
    __decorate([
        sequelize_typescript_1.AllowNull(true),
        sequelize_typescript_1.Default(null),
        sequelize_typescript_1.Is('VideoSupport', function (value) { return utils_2.throwIfNotValid(value, videos_1.isVideoSupportValid, 'support', true); }),
        sequelize_typescript_1.Column(sequelize_typescript_1.DataType.STRING(constants_1.CONSTRAINTS_FIELDS.VIDEOS.SUPPORT.max))
    ], VideoModel.prototype, "support");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Is('VideoDuration', function (value) { return utils_2.throwIfNotValid(value, videos_1.isVideoDurationValid, 'duration'); }),
        sequelize_typescript_1.Column
    ], VideoModel.prototype, "duration");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Default(0),
        sequelize_typescript_1.IsInt,
        sequelize_typescript_1.Min(0),
        sequelize_typescript_1.Column
    ], VideoModel.prototype, "views");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Default(0),
        sequelize_typescript_1.IsInt,
        sequelize_typescript_1.Min(0),
        sequelize_typescript_1.Column
    ], VideoModel.prototype, "likes");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Default(0),
        sequelize_typescript_1.IsInt,
        sequelize_typescript_1.Min(0),
        sequelize_typescript_1.Column
    ], VideoModel.prototype, "dislikes");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Column
    ], VideoModel.prototype, "remote");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Is('VideoUrl', function (value) { return utils_2.throwIfNotValid(value, misc_1.isActivityPubUrlValid, 'url'); }),
        sequelize_typescript_1.Column(sequelize_typescript_1.DataType.STRING(constants_1.CONSTRAINTS_FIELDS.VIDEOS.URL.max))
    ], VideoModel.prototype, "url");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Column
    ], VideoModel.prototype, "commentsEnabled");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Column
    ], VideoModel.prototype, "downloadEnabled");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Column
    ], VideoModel.prototype, "waitTranscoding");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Default(null),
        sequelize_typescript_1.Is('VideoState', function (value) { return utils_2.throwIfNotValid(value, videos_1.isVideoStateValid, 'state'); }),
        sequelize_typescript_1.Column
    ], VideoModel.prototype, "state");
    __decorate([
        sequelize_typescript_1.CreatedAt
    ], VideoModel.prototype, "createdAt");
    __decorate([
        sequelize_typescript_1.UpdatedAt
    ], VideoModel.prototype, "updatedAt");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Default(sequelize_typescript_1.DataType.NOW),
        sequelize_typescript_1.Column
    ], VideoModel.prototype, "publishedAt");
    __decorate([
        sequelize_typescript_1.AllowNull(true),
        sequelize_typescript_1.Default(null),
        sequelize_typescript_1.Column
    ], VideoModel.prototype, "originallyPublishedAt");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return video_channel_1.VideoChannelModel; }),
        sequelize_typescript_1.Column
    ], VideoModel.prototype, "channelId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return video_channel_1.VideoChannelModel; }, {
            foreignKey: {
                allowNull: true
            },
            hooks: true
        })
    ], VideoModel.prototype, "VideoChannel");
    __decorate([
        sequelize_typescript_1.BelongsToMany(function () { return tag_1.TagModel; }, {
            foreignKey: 'videoId',
            through: function () { return video_tag_1.VideoTagModel; },
            onDelete: 'CASCADE'
        })
    ], VideoModel.prototype, "Tags");
    __decorate([
        sequelize_typescript_1.HasMany(function () { return thumbnail_1.ThumbnailModel; }, {
            foreignKey: {
                name: 'videoId',
                allowNull: true
            },
            hooks: true,
            onDelete: 'cascade'
        })
    ], VideoModel.prototype, "Thumbnails");
    __decorate([
        sequelize_typescript_1.HasMany(function () { return video_playlist_element_1.VideoPlaylistElementModel; }, {
            foreignKey: {
                name: 'videoId',
                allowNull: true
            },
            onDelete: 'set null'
        })
    ], VideoModel.prototype, "VideoPlaylistElements");
    __decorate([
        sequelize_typescript_1.HasMany(function () { return video_abuse_1.VideoAbuseModel; }, {
            foreignKey: {
                name: 'videoId',
                allowNull: false
            },
            onDelete: 'cascade'
        })
    ], VideoModel.prototype, "VideoAbuses");
    __decorate([
        sequelize_typescript_1.HasMany(function () { return video_file_1.VideoFileModel; }, {
            foreignKey: {
                name: 'videoId',
                allowNull: false
            },
            hooks: true,
            onDelete: 'cascade'
        })
    ], VideoModel.prototype, "VideoFiles");
    __decorate([
        sequelize_typescript_1.HasMany(function () { return video_streaming_playlist_1.VideoStreamingPlaylistModel; }, {
            foreignKey: {
                name: 'videoId',
                allowNull: false
            },
            hooks: true,
            onDelete: 'cascade'
        })
    ], VideoModel.prototype, "VideoStreamingPlaylists");
    __decorate([
        sequelize_typescript_1.HasMany(function () { return video_share_1.VideoShareModel; }, {
            foreignKey: {
                name: 'videoId',
                allowNull: false
            },
            onDelete: 'cascade'
        })
    ], VideoModel.prototype, "VideoShares");
    __decorate([
        sequelize_typescript_1.HasMany(function () { return account_video_rate_1.AccountVideoRateModel; }, {
            foreignKey: {
                name: 'videoId',
                allowNull: false
            },
            onDelete: 'cascade'
        })
    ], VideoModel.prototype, "AccountVideoRates");
    __decorate([
        sequelize_typescript_1.HasMany(function () { return video_comment_1.VideoCommentModel; }, {
            foreignKey: {
                name: 'videoId',
                allowNull: false
            },
            onDelete: 'cascade',
            hooks: true
        })
    ], VideoModel.prototype, "VideoComments");
    __decorate([
        sequelize_typescript_1.HasMany(function () { return video_views_1.VideoViewModel; }, {
            foreignKey: {
                name: 'videoId',
                allowNull: false
            },
            onDelete: 'cascade'
        })
    ], VideoModel.prototype, "VideoViews");
    __decorate([
        sequelize_typescript_1.HasMany(function () { return user_video_history_1.UserVideoHistoryModel; }, {
            foreignKey: {
                name: 'videoId',
                allowNull: false
            },
            onDelete: 'cascade'
        })
    ], VideoModel.prototype, "UserVideoHistories");
    __decorate([
        sequelize_typescript_1.HasOne(function () { return schedule_video_update_1.ScheduleVideoUpdateModel; }, {
            foreignKey: {
                name: 'videoId',
                allowNull: false
            },
            onDelete: 'cascade'
        })
    ], VideoModel.prototype, "ScheduleVideoUpdate");
    __decorate([
        sequelize_typescript_1.HasOne(function () { return video_blacklist_1.VideoBlacklistModel; }, {
            foreignKey: {
                name: 'videoId',
                allowNull: false
            },
            onDelete: 'cascade'
        })
    ], VideoModel.prototype, "VideoBlacklist");
    __decorate([
        sequelize_typescript_1.HasOne(function () { return video_import_1.VideoImportModel; }, {
            foreignKey: {
                name: 'videoId',
                allowNull: true
            },
            onDelete: 'set null'
        })
    ], VideoModel.prototype, "VideoImport");
    __decorate([
        sequelize_typescript_1.HasMany(function () { return video_caption_1.VideoCaptionModel; }, (_e = {
                foreignKey: {
                    name: 'videoId',
                    allowNull: false
                },
                onDelete: 'cascade',
                hooks: true
            },
            _e['separate'] = true,
            _e))
    ], VideoModel.prototype, "VideoCaptions");
    __decorate([
        sequelize_typescript_1.BeforeDestroy
    ], VideoModel, "sendDelete");
    __decorate([
        sequelize_typescript_1.BeforeDestroy
    ], VideoModel, "removeFiles");
    VideoModel = VideoModel_1 = __decorate([
        sequelize_typescript_1.Scopes(function () {
            var _a;
            return (_a = {},
                _a[ScopeNames.FOR_API] = function (options) {
                    var _a;
                    var query = {
                        include: [
                            {
                                model: video_channel_1.VideoChannelModel.scope({
                                    method: [
                                        video_channel_1.ScopeNames.SUMMARY, {
                                            withAccount: true,
                                            withAccountBlockerIds: options.withAccountBlockerIds
                                        }
                                    ]
                                }),
                                required: true
                            },
                            {
                                attributes: ['type', 'filename'],
                                model: thumbnail_1.ThumbnailModel,
                                required: false
                            }
                        ]
                    };
                    if (options.ids) {
                        query.where = {
                            id: (_a = {},
                                _a[sequelize_1.Op["in"]] = options.ids // FIXME: sequelize ANY seems broken
                            ,
                                _a)
                        };
                    }
                    if (options.withFiles === true) {
                        query.include.push({
                            model: video_file_1.VideoFileModel.unscoped(),
                            required: true
                        });
                    }
                    if (options.videoPlaylistId) {
                        query.include.push({
                            model: video_playlist_element_1.VideoPlaylistElementModel.unscoped(),
                            required: true,
                            where: {
                                videoPlaylistId: options.videoPlaylistId
                            }
                        });
                    }
                    return query;
                },
                _a[ScopeNames.AVAILABLE_FOR_LIST_IDS] = function (options) {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
                    var whereAnd = options.baseWhere ? options.baseWhere : [];
                    var query = {
                        raw: true,
                        include: []
                    };
                    var attributesType = options.attributesType || 'id';
                    if (attributesType === 'id')
                        query.attributes = ['id'];
                    else if (attributesType === 'none')
                        query.attributes = [];
                    whereAnd.push({
                        id: (_a = {},
                            _a[sequelize_1.Op.notIn] = sequelize_1.Sequelize.literal('(SELECT "videoBlacklist"."videoId" FROM "videoBlacklist")'),
                            _a)
                    });
                    if (options.serverAccountId) {
                        whereAnd.push({
                            channelId: (_b = {},
                                _b[sequelize_1.Op.notIn] = sequelize_1.Sequelize.literal('(' +
                                    'SELECT id FROM "videoChannel" WHERE "accountId" IN (' +
                                    utils_2.buildBlockedAccountSQL(options.serverAccountId, options.user ? options.user.Account.id : undefined) +
                                    ')' +
                                    ')'),
                                _b)
                        });
                    }
                    // Only list public/published videos
                    if (!options.filter || options.filter !== 'all-local') {
                        var privacyWhere = (_c = {
                                // Always list public videos
                                privacy: shared_1.VideoPrivacy.PUBLIC
                            },
                            // Always list published videos, or videos that are being transcoded but on which we don't want to wait for transcoding
                            _c[sequelize_1.Op.or] = [
                                {
                                    state: shared_1.VideoState.PUBLISHED
                                },
                                (_d = {},
                                    _d[sequelize_1.Op.and] = {
                                        state: shared_1.VideoState.TO_TRANSCODE,
                                        waitTranscoding: false
                                    },
                                    _d)
                            ],
                            _c);
                        whereAnd.push(privacyWhere);
                    }
                    if (options.videoPlaylistId) {
                        query.include.push({
                            attributes: [],
                            model: video_playlist_element_1.VideoPlaylistElementModel.unscoped(),
                            required: true,
                            where: {
                                videoPlaylistId: options.videoPlaylistId
                            }
                        });
                        query.subQuery = false;
                    }
                    if (options.filter || options.accountId || options.videoChannelId) {
                        var videoChannelInclude = {
                            attributes: [],
                            model: video_channel_1.VideoChannelModel.unscoped(),
                            required: true
                        };
                        if (options.videoChannelId) {
                            videoChannelInclude.where = {
                                id: options.videoChannelId
                            };
                        }
                        if (options.filter || options.accountId) {
                            var accountInclude = {
                                attributes: [],
                                model: account_1.AccountModel.unscoped(),
                                required: true
                            };
                            if (options.filter) {
                                accountInclude.include = [
                                    {
                                        attributes: [],
                                        model: actor_1.ActorModel.unscoped(),
                                        required: true,
                                        where: VideoModel_1.buildActorWhereWithFilter(options.filter)
                                    }
                                ];
                            }
                            if (options.accountId) {
                                accountInclude.where = { id: options.accountId };
                            }
                            videoChannelInclude.include = [accountInclude];
                        }
                        query.include.push(videoChannelInclude);
                    }
                    if (options.followerActorId) {
                        var localVideosReq = '';
                        if (options.includeLocalVideos === true) {
                            localVideosReq = ' UNION ALL ' +
                                'SELECT "video"."id" AS "id" FROM "video" ' +
                                'INNER JOIN "videoChannel" ON "videoChannel"."id" = "video"."channelId" ' +
                                'INNER JOIN "account" ON "account"."id" = "videoChannel"."accountId" ' +
                                'INNER JOIN "actor" ON "account"."actorId" = "actor"."id" ' +
                                'WHERE "actor"."serverId" IS NULL';
                        }
                        // Force actorId to be a number to avoid SQL injections
                        var actorIdNumber = parseInt(options.followerActorId.toString(), 10);
                        whereAnd.push({
                            id: (_e = {},
                                _e[sequelize_1.Op["in"]] = sequelize_1.Sequelize.literal('(' +
                                    'SELECT "videoShare"."videoId" AS "id" FROM "videoShare" ' +
                                    'INNER JOIN "actorFollow" ON "actorFollow"."targetActorId" = "videoShare"."actorId" ' +
                                    'WHERE "actorFollow"."actorId" = ' + actorIdNumber +
                                    ' UNION ALL ' +
                                    'SELECT "video"."id" AS "id" FROM "video" ' +
                                    'INNER JOIN "videoChannel" ON "videoChannel"."id" = "video"."channelId" ' +
                                    'INNER JOIN "account" ON "account"."id" = "videoChannel"."accountId" ' +
                                    'INNER JOIN "actor" ON "account"."actorId" = "actor"."id" ' +
                                    'INNER JOIN "actorFollow" ON "actorFollow"."targetActorId" = "actor"."id" ' +
                                    'WHERE "actorFollow"."actorId" = ' + actorIdNumber +
                                    localVideosReq +
                                    ')'),
                                _e)
                        });
                    }
                    if (options.withFiles === true) {
                        whereAnd.push({
                            id: (_f = {},
                                _f[sequelize_1.Op["in"]] = sequelize_1.Sequelize.literal('(SELECT "videoId" FROM "videoFile")'),
                                _f)
                        });
                    }
                    // FIXME: issues with sequelize count when making a join on n:m relation, so we just make a IN()
                    if (options.tagsAllOf || options.tagsOneOf) {
                        if (options.tagsOneOf) {
                            whereAnd.push({
                                id: (_g = {},
                                    _g[sequelize_1.Op["in"]] = sequelize_1.Sequelize.literal('(' +
                                        'SELECT "videoId" FROM "videoTag" ' +
                                        'INNER JOIN "tag" ON "tag"."id" = "videoTag"."tagId" ' +
                                        'WHERE "tag"."name" IN (' + utils_2.createSafeIn(VideoModel_1, options.tagsOneOf) + ')' +
                                        ')'),
                                    _g)
                            });
                        }
                        if (options.tagsAllOf) {
                            whereAnd.push({
                                id: (_h = {},
                                    _h[sequelize_1.Op["in"]] = sequelize_1.Sequelize.literal('(' +
                                        'SELECT "videoId" FROM "videoTag" ' +
                                        'INNER JOIN "tag" ON "tag"."id" = "videoTag"."tagId" ' +
                                        'WHERE "tag"."name" IN (' + utils_2.createSafeIn(VideoModel_1, options.tagsAllOf) + ')' +
                                        'GROUP BY "videoTag"."videoId" HAVING COUNT(*) = ' + options.tagsAllOf.length +
                                        ')'),
                                    _h)
                            });
                        }
                    }
                    if (options.nsfw === true || options.nsfw === false) {
                        whereAnd.push({ nsfw: options.nsfw });
                    }
                    if (options.categoryOneOf) {
                        whereAnd.push({
                            category: (_j = {},
                                _j[sequelize_1.Op.or] = options.categoryOneOf,
                                _j)
                        });
                    }
                    if (options.licenceOneOf) {
                        whereAnd.push({
                            licence: (_k = {},
                                _k[sequelize_1.Op.or] = options.licenceOneOf,
                                _k)
                        });
                    }
                    if (options.languageOneOf) {
                        var videoLanguages = options.languageOneOf;
                        if (options.languageOneOf.find(function (l) { return l === '_unknown'; })) {
                            videoLanguages = videoLanguages.concat([null]);
                        }
                        whereAnd.push((_l = {},
                            _l[sequelize_1.Op.or] = [
                                {
                                    language: (_m = {},
                                        _m[sequelize_1.Op.or] = videoLanguages,
                                        _m)
                                },
                                {
                                    id: (_o = {},
                                        _o[sequelize_1.Op["in"]] = sequelize_1.Sequelize.literal('(' +
                                            'SELECT "videoId" FROM "videoCaption" ' +
                                            'WHERE "language" IN (' + utils_2.createSafeIn(VideoModel_1, options.languageOneOf) + ') ' +
                                            ')'),
                                        _o)
                                }
                            ],
                            _l));
                    }
                    if (options.trendingDays) {
                        query.include.push(VideoModel_1.buildTrendingQuery(options.trendingDays));
                        query.subQuery = false;
                    }
                    if (options.historyOfUser) {
                        query.include.push({
                            model: user_video_history_1.UserVideoHistoryModel,
                            required: true,
                            where: {
                                userId: options.historyOfUser.id
                            }
                        });
                        // Even if the relation is n:m, we know that a user only have 0..1 video history
                        // So we won't have multiple rows for the same video
                        // Without this, we would not be able to sort on "updatedAt" column of UserVideoHistoryModel
                        query.subQuery = false;
                    }
                    query.where = (_p = {},
                        _p[sequelize_1.Op.and] = whereAnd,
                        _p);
                    return query;
                },
                _a[ScopeNames.WITH_BLOCKLIST] = {},
                _a[ScopeNames.WITH_THUMBNAILS] = {
                    include: [
                        {
                            model: thumbnail_1.ThumbnailModel,
                            required: false
                        }
                    ]
                },
                _a[ScopeNames.WITH_USER_ID] = {
                    include: [
                        {
                            attributes: ['accountId'],
                            model: video_channel_1.VideoChannelModel.unscoped(),
                            required: true,
                            include: [
                                {
                                    attributes: ['userId'],
                                    model: account_1.AccountModel.unscoped(),
                                    required: true
                                }
                            ]
                        }
                    ]
                },
                _a[ScopeNames.WITH_ACCOUNT_DETAILS] = {
                    include: [
                        {
                            model: video_channel_1.VideoChannelModel.unscoped(),
                            required: true,
                            include: [
                                {
                                    attributes: {
                                        exclude: ['privateKey', 'publicKey']
                                    },
                                    model: actor_1.ActorModel.unscoped(),
                                    required: true,
                                    include: [
                                        {
                                            attributes: ['host'],
                                            model: server_1.ServerModel.unscoped(),
                                            required: false
                                        },
                                        {
                                            model: avatar_1.AvatarModel.unscoped(),
                                            required: false
                                        }
                                    ]
                                },
                                {
                                    model: account_1.AccountModel.unscoped(),
                                    required: true,
                                    include: [
                                        {
                                            model: actor_1.ActorModel.unscoped(),
                                            attributes: {
                                                exclude: ['privateKey', 'publicKey']
                                            },
                                            required: true,
                                            include: [
                                                {
                                                    attributes: ['host'],
                                                    model: server_1.ServerModel.unscoped(),
                                                    required: false
                                                },
                                                {
                                                    model: avatar_1.AvatarModel.unscoped(),
                                                    required: false
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                _a[ScopeNames.WITH_TAGS] = {
                    include: [tag_1.TagModel]
                },
                _a[ScopeNames.WITH_BLACKLISTED] = {
                    include: [
                        {
                            attributes: ['id', 'reason'],
                            model: video_blacklist_1.VideoBlacklistModel,
                            required: false
                        }
                    ]
                },
                _a[ScopeNames.WITH_FILES] = function (withRedundancies) {
                    if (withRedundancies === void 0) { withRedundancies = false; }
                    var subInclude = [];
                    if (withRedundancies === true) {
                        subInclude = [
                            {
                                attributes: ['fileUrl'],
                                model: video_redundancy_1.VideoRedundancyModel.unscoped(),
                                required: false
                            }
                        ];
                    }
                    return {
                        include: [
                            {
                                model: video_file_1.VideoFileModel.unscoped(),
                                separate: true,
                                required: false,
                                include: subInclude
                            }
                        ]
                    };
                },
                _a[ScopeNames.WITH_STREAMING_PLAYLISTS] = function (withRedundancies) {
                    if (withRedundancies === void 0) { withRedundancies = false; }
                    var subInclude = [];
                    if (withRedundancies === true) {
                        subInclude = [
                            {
                                attributes: ['fileUrl'],
                                model: video_redundancy_1.VideoRedundancyModel.unscoped(),
                                required: false
                            }
                        ];
                    }
                    return {
                        include: [
                            {
                                model: video_streaming_playlist_1.VideoStreamingPlaylistModel.unscoped(),
                                separate: true,
                                required: false,
                                include: subInclude
                            }
                        ]
                    };
                },
                _a[ScopeNames.WITH_SCHEDULED_UPDATE] = {
                    include: [
                        {
                            model: schedule_video_update_1.ScheduleVideoUpdateModel.unscoped(),
                            required: false
                        }
                    ]
                },
                _a[ScopeNames.WITH_USER_HISTORY] = function (userId) {
                    return {
                        include: [
                            {
                                attributes: ['currentTime'],
                                model: user_video_history_1.UserVideoHistoryModel.unscoped(),
                                required: false,
                                where: {
                                    userId: userId
                                }
                            }
                        ]
                    };
                },
                _a);
        }),
        sequelize_typescript_1.Table({
            tableName: 'video',
            indexes: indexes
        })
    ], VideoModel);
    return VideoModel;
}(sequelize_typescript_1.Model));
exports.VideoModel = VideoModel;
