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
var video_playlist_privacy_model_1 = require("../../../shared/models/videos/playlist/video-playlist-privacy.model");
var utils_1 = require("../utils");
var video_playlists_1 = require("../../helpers/custom-validators/video-playlists");
var misc_1 = require("../../helpers/custom-validators/activitypub/misc");
var constants_1 = require("../../initializers/constants");
var account_1 = require("../account/account");
var video_channel_1 = require("./video-channel");
var path_1 = require("path");
var video_playlist_element_1 = require("./video-playlist-element");
var activitypub_1 = require("../../helpers/activitypub");
var video_playlist_type_model_1 = require("../../../shared/models/videos/playlist/video-playlist-type.model");
var thumbnail_1 = require("./thumbnail");
var sequelize_1 = require("sequelize");
var ScopeNames;
(function (ScopeNames) {
    ScopeNames["AVAILABLE_FOR_LIST"] = "AVAILABLE_FOR_LIST";
    ScopeNames["WITH_VIDEOS_LENGTH"] = "WITH_VIDEOS_LENGTH";
    ScopeNames["WITH_ACCOUNT_AND_CHANNEL_SUMMARY"] = "WITH_ACCOUNT_AND_CHANNEL_SUMMARY";
    ScopeNames["WITH_ACCOUNT"] = "WITH_ACCOUNT";
    ScopeNames["WITH_THUMBNAIL"] = "WITH_THUMBNAIL";
    ScopeNames["WITH_ACCOUNT_AND_CHANNEL"] = "WITH_ACCOUNT_AND_CHANNEL";
})(ScopeNames || (ScopeNames = {}));
var VideoPlaylistModel = /** @class */ (function (_super) {
    __extends(VideoPlaylistModel, _super);
    function VideoPlaylistModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    VideoPlaylistModel_1 = VideoPlaylistModel;
    VideoPlaylistModel.listForApi = function (options) {
        var query = {
            offset: options.start,
            limit: options.count,
            order: utils_1.getSort(options.sort)
        };
        var scopes = [
            {
                method: [
                    ScopeNames.AVAILABLE_FOR_LIST,
                    {
                        type: options.type,
                        followerActorId: options.followerActorId,
                        accountId: options.accountId,
                        videoChannelId: options.videoChannelId,
                        privateAndUnlisted: options.privateAndUnlisted
                    }
                ]
            },
            ScopeNames.WITH_VIDEOS_LENGTH,
            ScopeNames.WITH_THUMBNAIL
        ];
        return VideoPlaylistModel_1
            .scope(scopes)
            .findAndCountAll(query)
            .then(function (_a) {
            var rows = _a.rows, count = _a.count;
            return { total: count, data: rows };
        });
    };
    VideoPlaylistModel.listPublicUrlsOfForAP = function (accountId, start, count) {
        var query = {
            attributes: ['url'],
            offset: start,
            limit: count,
            where: {
                ownerAccountId: accountId,
                privacy: video_playlist_privacy_model_1.VideoPlaylistPrivacy.PUBLIC
            }
        };
        return VideoPlaylistModel_1.findAndCountAll(query)
            .then(function (_a) {
            var rows = _a.rows, count = _a.count;
            return { total: count, data: rows.map(function (p) { return p.url; }) };
        });
    };
    VideoPlaylistModel.listPlaylistIdsOf = function (accountId, videoIds) {
        var _a;
        var query = {
            attributes: ['id'],
            where: {
                ownerAccountId: accountId
            },
            include: [
                {
                    attributes: ['id', 'videoId', 'startTimestamp', 'stopTimestamp'],
                    model: video_playlist_element_1.VideoPlaylistElementModel.unscoped(),
                    where: {
                        videoId: (_a = {},
                            _a[sequelize_1.Op["in"]] = videoIds // FIXME: sequelize ANY seems broken
                        ,
                            _a)
                    },
                    required: true
                }
            ]
        };
        return VideoPlaylistModel_1.findAll(query);
    };
    VideoPlaylistModel.doesPlaylistExist = function (url) {
        var query = {
            attributes: [],
            where: {
                url: url
            }
        };
        return VideoPlaylistModel_1
            .findOne(query)
            .then(function (e) { return !!e; });
    };
    VideoPlaylistModel.loadWithAccountAndChannelSummary = function (id, transaction) {
        var where = utils_1.buildWhereIdOrUUID(id);
        var query = {
            where: where,
            transaction: transaction
        };
        return VideoPlaylistModel_1
            .scope([ScopeNames.WITH_ACCOUNT_AND_CHANNEL_SUMMARY, ScopeNames.WITH_VIDEOS_LENGTH, ScopeNames.WITH_THUMBNAIL])
            .findOne(query);
    };
    VideoPlaylistModel.loadWithAccountAndChannel = function (id, transaction) {
        var where = utils_1.buildWhereIdOrUUID(id);
        var query = {
            where: where,
            transaction: transaction
        };
        return VideoPlaylistModel_1
            .scope([ScopeNames.WITH_ACCOUNT_AND_CHANNEL, ScopeNames.WITH_VIDEOS_LENGTH, ScopeNames.WITH_THUMBNAIL])
            .findOne(query);
    };
    VideoPlaylistModel.loadByUrlAndPopulateAccount = function (url) {
        var query = {
            where: {
                url: url
            }
        };
        return VideoPlaylistModel_1.scope([ScopeNames.WITH_ACCOUNT, ScopeNames.WITH_THUMBNAIL]).findOne(query);
    };
    VideoPlaylistModel.getPrivacyLabel = function (privacy) {
        return constants_1.VIDEO_PLAYLIST_PRIVACIES[privacy] || 'Unknown';
    };
    VideoPlaylistModel.getTypeLabel = function (type) {
        return constants_1.VIDEO_PLAYLIST_TYPES[type] || 'Unknown';
    };
    VideoPlaylistModel.resetPlaylistsOfChannel = function (videoChannelId, transaction) {
        var query = {
            where: {
                videoChannelId: videoChannelId
            },
            transaction: transaction
        };
        return VideoPlaylistModel_1.update({ privacy: video_playlist_privacy_model_1.VideoPlaylistPrivacy.PRIVATE, videoChannelId: null }, query);
    };
    VideoPlaylistModel.prototype.setAndSaveThumbnail = function (thumbnail, t) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        thumbnail.videoPlaylistId = this.id;
                        _a = this;
                        return [4 /*yield*/, thumbnail.save({ transaction: t })];
                    case 1:
                        _a.Thumbnail = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    VideoPlaylistModel.prototype.hasThumbnail = function () {
        return !!this.Thumbnail;
    };
    VideoPlaylistModel.prototype.hasGeneratedThumbnail = function () {
        return this.hasThumbnail() && this.Thumbnail.automaticallyGenerated === true;
    };
    VideoPlaylistModel.prototype.generateThumbnailName = function () {
        var extension = '.jpg';
        return 'playlist-' + this.uuid + extension;
    };
    VideoPlaylistModel.prototype.getThumbnailUrl = function () {
        if (!this.hasThumbnail())
            return null;
        return constants_1.WEBSERVER.URL + constants_1.STATIC_PATHS.THUMBNAILS + this.Thumbnail.filename;
    };
    VideoPlaylistModel.prototype.getThumbnailStaticPath = function () {
        if (!this.hasThumbnail())
            return null;
        return path_1.join(constants_1.STATIC_PATHS.THUMBNAILS, this.Thumbnail.filename);
    };
    VideoPlaylistModel.prototype.setAsRefreshed = function () {
        this.changed('updatedAt', true);
        return this.save();
    };
    VideoPlaylistModel.prototype.isOwned = function () {
        return this.OwnerAccount.isOwned();
    };
    VideoPlaylistModel.prototype.isOutdated = function () {
        if (this.isOwned())
            return false;
        return utils_1.isOutdated(this, constants_1.ACTIVITY_PUB.VIDEO_PLAYLIST_REFRESH_INTERVAL);
    };
    VideoPlaylistModel.prototype.toFormattedJSON = function () {
        return {
            id: this.id,
            uuid: this.uuid,
            isLocal: this.isOwned(),
            displayName: this.name,
            description: this.description,
            privacy: {
                id: this.privacy,
                label: VideoPlaylistModel_1.getPrivacyLabel(this.privacy)
            },
            thumbnailPath: this.getThumbnailStaticPath(),
            type: {
                id: this.type,
                label: VideoPlaylistModel_1.getTypeLabel(this.type)
            },
            videosLength: this.get('videosLength'),
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            ownerAccount: this.OwnerAccount.toFormattedSummaryJSON(),
            videoChannel: this.VideoChannel ? this.VideoChannel.toFormattedSummaryJSON() : null
        };
    };
    VideoPlaylistModel.prototype.toActivityPubObject = function (page, t) {
        var _this = this;
        var handler = function (start, count) {
            return video_playlist_element_1.VideoPlaylistElementModel.listUrlsOfForAP(_this.id, start, count, t);
        };
        var icon;
        if (this.hasThumbnail()) {
            icon = {
                type: 'Image',
                url: this.getThumbnailUrl(),
                mediaType: 'image/jpeg',
                width: constants_1.THUMBNAILS_SIZE.width,
                height: constants_1.THUMBNAILS_SIZE.height
            };
        }
        return activitypub_1.activityPubCollectionPagination(this.url, handler, page)
            .then(function (o) {
            return Object.assign(o, {
                type: 'Playlist',
                name: _this.name,
                content: _this.description,
                uuid: _this.uuid,
                published: _this.createdAt.toISOString(),
                updated: _this.updatedAt.toISOString(),
                attributedTo: _this.VideoChannel ? [_this.VideoChannel.Actor.url] : [],
                icon: icon
            });
        });
    };
    var VideoPlaylistModel_1;
    __decorate([
        sequelize_typescript_1.CreatedAt
    ], VideoPlaylistModel.prototype, "createdAt");
    __decorate([
        sequelize_typescript_1.UpdatedAt
    ], VideoPlaylistModel.prototype, "updatedAt");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Is('VideoPlaylistName', function (value) { return utils_1.throwIfNotValid(value, video_playlists_1.isVideoPlaylistNameValid, 'name'); }),
        sequelize_typescript_1.Column
    ], VideoPlaylistModel.prototype, "name");
    __decorate([
        sequelize_typescript_1.AllowNull(true),
        sequelize_typescript_1.Is('VideoPlaylistDescription', function (value) { return utils_1.throwIfNotValid(value, video_playlists_1.isVideoPlaylistDescriptionValid, 'description', true); }),
        sequelize_typescript_1.Column
    ], VideoPlaylistModel.prototype, "description");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Is('VideoPlaylistPrivacy', function (value) { return utils_1.throwIfNotValid(value, video_playlists_1.isVideoPlaylistPrivacyValid, 'privacy'); }),
        sequelize_typescript_1.Column
    ], VideoPlaylistModel.prototype, "privacy");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Is('VideoPlaylistUrl', function (value) { return utils_1.throwIfNotValid(value, misc_1.isActivityPubUrlValid, 'url'); }),
        sequelize_typescript_1.Column(sequelize_typescript_1.DataType.STRING(constants_1.CONSTRAINTS_FIELDS.VIDEO_PLAYLISTS.URL.max))
    ], VideoPlaylistModel.prototype, "url");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Default(sequelize_typescript_1.DataType.UUIDV4),
        sequelize_typescript_1.IsUUID(4),
        sequelize_typescript_1.Column(sequelize_typescript_1.DataType.UUID)
    ], VideoPlaylistModel.prototype, "uuid");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Default(video_playlist_type_model_1.VideoPlaylistType.REGULAR),
        sequelize_typescript_1.Column
    ], VideoPlaylistModel.prototype, "type");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return account_1.AccountModel; }),
        sequelize_typescript_1.Column
    ], VideoPlaylistModel.prototype, "ownerAccountId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return account_1.AccountModel; }, {
            foreignKey: {
                allowNull: false
            },
            onDelete: 'CASCADE'
        })
    ], VideoPlaylistModel.prototype, "OwnerAccount");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return video_channel_1.VideoChannelModel; }),
        sequelize_typescript_1.Column
    ], VideoPlaylistModel.prototype, "videoChannelId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return video_channel_1.VideoChannelModel; }, {
            foreignKey: {
                allowNull: true
            },
            onDelete: 'CASCADE'
        })
    ], VideoPlaylistModel.prototype, "VideoChannel");
    __decorate([
        sequelize_typescript_1.HasMany(function () { return video_playlist_element_1.VideoPlaylistElementModel; }, {
            foreignKey: {
                name: 'videoPlaylistId',
                allowNull: false
            },
            onDelete: 'CASCADE'
        })
    ], VideoPlaylistModel.prototype, "VideoPlaylistElements");
    __decorate([
        sequelize_typescript_1.HasOne(function () { return thumbnail_1.ThumbnailModel; }, {
            foreignKey: {
                name: 'videoPlaylistId',
                allowNull: true
            },
            onDelete: 'CASCADE',
            hooks: true
        })
    ], VideoPlaylistModel.prototype, "Thumbnail");
    VideoPlaylistModel = VideoPlaylistModel_1 = __decorate([
        sequelize_typescript_1.Scopes(function () {
            var _a;
            return (_a = {},
                _a[ScopeNames.WITH_THUMBNAIL] = {
                    include: [
                        {
                            model: thumbnail_1.ThumbnailModel,
                            required: false
                        }
                    ]
                },
                _a[ScopeNames.WITH_VIDEOS_LENGTH] = {
                    attributes: {
                        include: [
                            [
                                sequelize_1.literal('(SELECT COUNT("id") FROM "videoPlaylistElement" WHERE "videoPlaylistId" = "VideoPlaylistModel"."id")'),
                                'videosLength'
                            ]
                        ]
                    }
                },
                _a[ScopeNames.WITH_ACCOUNT] = {
                    include: [
                        {
                            model: account_1.AccountModel,
                            required: true
                        }
                    ]
                },
                _a[ScopeNames.WITH_ACCOUNT_AND_CHANNEL_SUMMARY] = {
                    include: [
                        {
                            model: account_1.AccountModel.scope(account_1.ScopeNames.SUMMARY),
                            required: true
                        },
                        {
                            model: video_channel_1.VideoChannelModel.scope(video_channel_1.ScopeNames.SUMMARY),
                            required: false
                        }
                    ]
                },
                _a[ScopeNames.WITH_ACCOUNT_AND_CHANNEL] = {
                    include: [
                        {
                            model: account_1.AccountModel,
                            required: true
                        },
                        {
                            model: video_channel_1.VideoChannelModel,
                            required: false
                        }
                    ]
                },
                _a[ScopeNames.AVAILABLE_FOR_LIST] = function (options) {
                    var _a, _b, _c;
                    // Only list local playlists OR playlists that are on an instance followed by actorId
                    var inQueryInstanceFollow = utils_1.buildServerIdsFollowedBy(options.followerActorId);
                    var whereActor = (_a = {},
                        _a[sequelize_1.Op.or] = [
                            {
                                serverId: null
                            },
                            {
                                serverId: (_b = {},
                                    _b[sequelize_1.Op["in"]] = sequelize_1.literal(inQueryInstanceFollow),
                                    _b)
                            }
                        ],
                        _a);
                    var whereAnd = [];
                    if (options.privateAndUnlisted !== true) {
                        whereAnd.push({
                            privacy: video_playlist_privacy_model_1.VideoPlaylistPrivacy.PUBLIC
                        });
                    }
                    if (options.accountId) {
                        whereAnd.push({
                            ownerAccountId: options.accountId
                        });
                    }
                    if (options.videoChannelId) {
                        whereAnd.push({
                            videoChannelId: options.videoChannelId
                        });
                    }
                    if (options.type) {
                        whereAnd.push({
                            type: options.type
                        });
                    }
                    var where = (_c = {},
                        _c[sequelize_1.Op.and] = whereAnd,
                        _c);
                    var accountScope = {
                        method: [account_1.ScopeNames.SUMMARY, { whereActor: whereActor }]
                    };
                    return {
                        where: where,
                        include: [
                            {
                                model: account_1.AccountModel.scope(accountScope),
                                required: true
                            },
                            {
                                model: video_channel_1.VideoChannelModel.scope(video_channel_1.ScopeNames.SUMMARY),
                                required: false
                            }
                        ]
                    };
                },
                _a);
        }),
        sequelize_typescript_1.Table({
            tableName: 'videoPlaylist',
            indexes: [
                {
                    fields: ['ownerAccountId']
                },
                {
                    fields: ['videoChannelId']
                },
                {
                    fields: ['url'],
                    unique: true
                }
            ]
        })
    ], VideoPlaylistModel);
    return VideoPlaylistModel;
}(sequelize_typescript_1.Model));
exports.VideoPlaylistModel = VideoPlaylistModel;
