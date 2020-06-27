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
exports.__esModule = true;
var sequelize_typescript_1 = require("sequelize-typescript");
var video_1 = require("./video");
var video_playlist_1 = require("./video-playlist");
var utils_1 = require("../utils");
var misc_1 = require("../../helpers/custom-validators/activitypub/misc");
var constants_1 = require("../../initializers/constants");
var validator = require("validator");
var sequelize_1 = require("sequelize");
var video_playlist_element_model_1 = require("../../../shared/models/videos/playlist/video-playlist-element.model");
var videos_1 = require("../../../shared/models/videos");
var VideoPlaylistElementModel = /** @class */ (function (_super) {
    __extends(VideoPlaylistElementModel, _super);
    function VideoPlaylistElementModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    VideoPlaylistElementModel_1 = VideoPlaylistElementModel;
    VideoPlaylistElementModel.deleteAllOf = function (videoPlaylistId, transaction) {
        var query = {
            where: {
                videoPlaylistId: videoPlaylistId
            },
            transaction: transaction
        };
        return VideoPlaylistElementModel_1.destroy(query);
    };
    VideoPlaylistElementModel.listForApi = function (options) {
        var accountIds = [options.serverAccount.id];
        var videoScope = [
            video_1.ScopeNames.WITH_BLACKLISTED
        ];
        if (options.user) {
            accountIds.push(options.user.Account.id);
            videoScope.push({ method: [video_1.ScopeNames.WITH_USER_HISTORY, options.user.id] });
        }
        var forApiOptions = { withAccountBlockerIds: accountIds };
        videoScope.push({
            method: [
                video_1.ScopeNames.FOR_API, forApiOptions
            ]
        });
        var findQuery = {
            offset: options.start,
            limit: options.count,
            order: utils_1.getSort('position'),
            where: {
                videoPlaylistId: options.videoPlaylistId
            },
            include: [
                {
                    model: video_1.VideoModel.scope(videoScope),
                    required: false
                }
            ]
        };
        var countQuery = {
            where: {
                videoPlaylistId: options.videoPlaylistId
            }
        };
        return Promise.all([
            VideoPlaylistElementModel_1.count(countQuery),
            VideoPlaylistElementModel_1.findAll(findQuery)
        ]).then(function (_a) {
            var total = _a[0], data = _a[1];
            return ({ total: total, data: data });
        });
    };
    VideoPlaylistElementModel.loadByPlaylistAndVideo = function (videoPlaylistId, videoId) {
        var query = {
            where: {
                videoPlaylistId: videoPlaylistId,
                videoId: videoId
            }
        };
        return VideoPlaylistElementModel_1.findOne(query);
    };
    VideoPlaylistElementModel.loadById = function (playlistElementId) {
        return VideoPlaylistElementModel_1.findByPk(playlistElementId);
    };
    VideoPlaylistElementModel.loadByPlaylistAndVideoForAP = function (playlistId, videoId) {
        var playlistWhere = validator.isUUID('' + playlistId) ? { uuid: playlistId } : { id: playlistId };
        var videoWhere = validator.isUUID('' + videoId) ? { uuid: videoId } : { id: videoId };
        var query = {
            include: [
                {
                    attributes: ['privacy'],
                    model: video_playlist_1.VideoPlaylistModel.unscoped(),
                    where: playlistWhere
                },
                {
                    attributes: ['url'],
                    model: video_1.VideoModel.unscoped(),
                    where: videoWhere
                }
            ]
        };
        return VideoPlaylistElementModel_1.findOne(query);
    };
    VideoPlaylistElementModel.listUrlsOfForAP = function (videoPlaylistId, start, count, t) {
        var query = {
            attributes: ['url'],
            offset: start,
            limit: count,
            order: utils_1.getSort('position'),
            where: {
                videoPlaylistId: videoPlaylistId
            },
            transaction: t
        };
        return VideoPlaylistElementModel_1
            .findAndCountAll(query)
            .then(function (_a) {
            var rows = _a.rows, count = _a.count;
            return { total: count, data: rows.map(function (e) { return e.url; }) };
        });
    };
    VideoPlaylistElementModel.loadFirstElementWithVideoThumbnail = function (videoPlaylistId) {
        var query = {
            order: utils_1.getSort('position'),
            where: {
                videoPlaylistId: videoPlaylistId
            },
            include: [
                {
                    model: video_1.VideoModel.scope(video_1.ScopeNames.WITH_THUMBNAILS),
                    required: true
                }
            ]
        };
        return VideoPlaylistElementModel_1
            .findOne(query);
    };
    VideoPlaylistElementModel.getNextPositionOf = function (videoPlaylistId, transaction) {
        var query = {
            where: {
                videoPlaylistId: videoPlaylistId
            },
            transaction: transaction
        };
        return VideoPlaylistElementModel_1.max('position', query)
            .then(function (position) { return position ? position + 1 : 1; });
    };
    VideoPlaylistElementModel.reassignPositionOf = function (videoPlaylistId, firstPosition, endPosition, newPosition, transaction) {
        var _a;
        var query = {
            where: {
                videoPlaylistId: videoPlaylistId,
                position: (_a = {},
                    _a[sequelize_1.Op.gte] = firstPosition,
                    _a[sequelize_1.Op.lte] = endPosition,
                    _a)
            },
            transaction: transaction,
            validate: false // We use a literal to update the position
        };
        return VideoPlaylistElementModel_1.update({ position: sequelize_1.Sequelize.literal(newPosition + " + \"position\" - " + firstPosition) }, query);
    };
    VideoPlaylistElementModel.increasePositionOf = function (videoPlaylistId, fromPosition, toPosition, by, transaction) {
        if (by === void 0) { by = 1; }
        var _a;
        var query = {
            where: {
                videoPlaylistId: videoPlaylistId,
                position: (_a = {},
                    _a[sequelize_1.Op.gte] = fromPosition,
                    _a)
            },
            transaction: transaction
        };
        return VideoPlaylistElementModel_1.increment({ position: by }, query);
    };
    VideoPlaylistElementModel.prototype.getType = function (displayNSFW, accountId) {
        var video = this.Video;
        if (!video)
            return video_playlist_element_model_1.VideoPlaylistElementType.DELETED;
        // Owned video, don't filter it
        if (accountId && video.VideoChannel.Account.id === accountId)
            return video_playlist_element_model_1.VideoPlaylistElementType.REGULAR;
        if (video.privacy === videos_1.VideoPrivacy.PRIVATE)
            return video_playlist_element_model_1.VideoPlaylistElementType.PRIVATE;
        if (video.isBlacklisted() || video.isBlocked())
            return video_playlist_element_model_1.VideoPlaylistElementType.UNAVAILABLE;
        if (video.nsfw === true && displayNSFW === false)
            return video_playlist_element_model_1.VideoPlaylistElementType.UNAVAILABLE;
        return video_playlist_element_model_1.VideoPlaylistElementType.REGULAR;
    };
    VideoPlaylistElementModel.prototype.getVideoElement = function (displayNSFW, accountId) {
        if (!this.Video)
            return null;
        if (this.getType(displayNSFW, accountId) !== video_playlist_element_model_1.VideoPlaylistElementType.REGULAR)
            return null;
        return this.Video.toFormattedJSON();
    };
    VideoPlaylistElementModel.prototype.toFormattedJSON = function (options) {
        if (options === void 0) { options = {}; }
        return {
            id: this.id,
            position: this.position,
            startTimestamp: this.startTimestamp,
            stopTimestamp: this.stopTimestamp,
            type: this.getType(options.displayNSFW, options.accountId),
            video: this.getVideoElement(options.displayNSFW, options.accountId)
        };
    };
    VideoPlaylistElementModel.prototype.toActivityPubObject = function () {
        var base = {
            id: this.url,
            type: 'PlaylistElement',
            url: this.Video.url,
            position: this.position
        };
        if (this.startTimestamp)
            base.startTimestamp = this.startTimestamp;
        if (this.stopTimestamp)
            base.stopTimestamp = this.stopTimestamp;
        return base;
    };
    var VideoPlaylistElementModel_1;
    __decorate([
        sequelize_typescript_1.CreatedAt
    ], VideoPlaylistElementModel.prototype, "createdAt");
    __decorate([
        sequelize_typescript_1.UpdatedAt
    ], VideoPlaylistElementModel.prototype, "updatedAt");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Is('VideoPlaylistUrl', function (value) { return utils_1.throwIfNotValid(value, misc_1.isActivityPubUrlValid, 'url'); }),
        sequelize_typescript_1.Column(sequelize_typescript_1.DataType.STRING(constants_1.CONSTRAINTS_FIELDS.VIDEO_PLAYLISTS.URL.max))
    ], VideoPlaylistElementModel.prototype, "url");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Default(1),
        sequelize_typescript_1.IsInt,
        sequelize_typescript_1.Min(1),
        sequelize_typescript_1.Column
    ], VideoPlaylistElementModel.prototype, "position");
    __decorate([
        sequelize_typescript_1.AllowNull(true),
        sequelize_typescript_1.IsInt,
        sequelize_typescript_1.Min(0),
        sequelize_typescript_1.Column
    ], VideoPlaylistElementModel.prototype, "startTimestamp");
    __decorate([
        sequelize_typescript_1.AllowNull(true),
        sequelize_typescript_1.IsInt,
        sequelize_typescript_1.Min(0),
        sequelize_typescript_1.Column
    ], VideoPlaylistElementModel.prototype, "stopTimestamp");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return video_playlist_1.VideoPlaylistModel; }),
        sequelize_typescript_1.Column
    ], VideoPlaylistElementModel.prototype, "videoPlaylistId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return video_playlist_1.VideoPlaylistModel; }, {
            foreignKey: {
                allowNull: false
            },
            onDelete: 'CASCADE'
        })
    ], VideoPlaylistElementModel.prototype, "VideoPlaylist");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return video_1.VideoModel; }),
        sequelize_typescript_1.Column
    ], VideoPlaylistElementModel.prototype, "videoId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return video_1.VideoModel; }, {
            foreignKey: {
                allowNull: true
            },
            onDelete: 'set null'
        })
    ], VideoPlaylistElementModel.prototype, "Video");
    VideoPlaylistElementModel = VideoPlaylistElementModel_1 = __decorate([
        sequelize_typescript_1.Table({
            tableName: 'videoPlaylistElement',
            indexes: [
                {
                    fields: ['videoPlaylistId']
                },
                {
                    fields: ['videoId']
                },
                {
                    fields: ['videoPlaylistId', 'videoId'],
                    unique: true
                },
                {
                    fields: ['url'],
                    unique: true
                }
            ]
        })
    ], VideoPlaylistElementModel);
    return VideoPlaylistElementModel;
}(sequelize_typescript_1.Model));
exports.VideoPlaylistElementModel = VideoPlaylistElementModel;
