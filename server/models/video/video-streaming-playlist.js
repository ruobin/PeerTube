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
var videos_1 = require("../../helpers/custom-validators/videos");
var utils_1 = require("../utils");
var video_1 = require("./video");
var video_redundancy_1 = require("../redundancy/video-redundancy");
var video_streaming_playlist_type_1 = require("../../../shared/models/videos/video-streaming-playlist.type");
var misc_1 = require("../../helpers/custom-validators/activitypub/misc");
var constants_1 = require("../../initializers/constants");
var path_1 = require("path");
var core_utils_1 = require("../../helpers/core-utils");
var misc_2 = require("../../helpers/custom-validators/misc");
var sequelize_1 = require("sequelize");
var VideoStreamingPlaylistModel = /** @class */ (function (_super) {
    __extends(VideoStreamingPlaylistModel, _super);
    function VideoStreamingPlaylistModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    VideoStreamingPlaylistModel_1 = VideoStreamingPlaylistModel;
    VideoStreamingPlaylistModel.doesInfohashExist = function (infoHash) {
        var query = 'SELECT 1 FROM "videoStreamingPlaylist" WHERE $infoHash = ANY("p2pMediaLoaderInfohashes") LIMIT 1';
        var options = {
            type: sequelize_1.QueryTypes.SELECT,
            bind: { infoHash: infoHash },
            raw: true
        };
        return video_1.VideoModel.sequelize.query(query, options)
            .then(function (results) { return results.length === 1; });
    };
    VideoStreamingPlaylistModel.buildP2PMediaLoaderInfoHashes = function (playlistUrl, videoFiles) {
        var hashes = [];
        // https://github.com/Novage/p2p-media-loader/blob/master/p2p-media-loader-core/lib/p2p-media-manager.ts#L115
        for (var i = 0; i < videoFiles.length; i++) {
            hashes.push(core_utils_1.sha1("" + constants_1.P2P_MEDIA_LOADER_PEER_VERSION + playlistUrl + "+V" + i));
        }
        return hashes;
    };
    VideoStreamingPlaylistModel.listByIncorrectPeerVersion = function () {
        var _a;
        var query = {
            where: {
                p2pMediaLoaderPeerVersion: (_a = {},
                    _a[sequelize_1.Op.ne] = constants_1.P2P_MEDIA_LOADER_PEER_VERSION,
                    _a)
            }
        };
        return VideoStreamingPlaylistModel_1.findAll(query);
    };
    VideoStreamingPlaylistModel.loadWithVideo = function (id) {
        var options = {
            include: [
                {
                    model: video_1.VideoModel.unscoped(),
                    required: true
                }
            ]
        };
        return VideoStreamingPlaylistModel_1.findByPk(id, options);
    };
    VideoStreamingPlaylistModel.getHlsPlaylistFilename = function (resolution) {
        return resolution + '.m3u8';
    };
    VideoStreamingPlaylistModel.getMasterHlsPlaylistFilename = function () {
        return 'master.m3u8';
    };
    VideoStreamingPlaylistModel.getHlsSha256SegmentsFilename = function () {
        return 'segments-sha256.json';
    };
    VideoStreamingPlaylistModel.getHlsVideoName = function (uuid, resolution) {
        return uuid + "-" + resolution + "-fragmented.mp4";
    };
    VideoStreamingPlaylistModel.getHlsMasterPlaylistStaticPath = function (videoUUID) {
        return path_1.join(constants_1.STATIC_PATHS.STREAMING_PLAYLISTS.HLS, videoUUID, VideoStreamingPlaylistModel_1.getMasterHlsPlaylistFilename());
    };
    VideoStreamingPlaylistModel.getHlsPlaylistStaticPath = function (videoUUID, resolution) {
        return path_1.join(constants_1.STATIC_PATHS.STREAMING_PLAYLISTS.HLS, videoUUID, VideoStreamingPlaylistModel_1.getHlsPlaylistFilename(resolution));
    };
    VideoStreamingPlaylistModel.getHlsSha256SegmentsStaticPath = function (videoUUID) {
        return path_1.join(constants_1.STATIC_PATHS.STREAMING_PLAYLISTS.HLS, videoUUID, VideoStreamingPlaylistModel_1.getHlsSha256SegmentsFilename());
    };
    VideoStreamingPlaylistModel.prototype.getStringType = function () {
        if (this.type === video_streaming_playlist_type_1.VideoStreamingPlaylistType.HLS)
            return 'hls';
        return 'unknown';
    };
    VideoStreamingPlaylistModel.prototype.getVideoRedundancyUrl = function (baseUrlHttp) {
        return baseUrlHttp + constants_1.STATIC_PATHS.REDUNDANCY + this.getStringType() + '/' + this.Video.uuid;
    };
    VideoStreamingPlaylistModel.prototype.hasSameUniqueKeysThan = function (other) {
        return this.type === other.type &&
            this.videoId === other.videoId;
    };
    var VideoStreamingPlaylistModel_1;
    __decorate([
        sequelize_typescript_1.CreatedAt
    ], VideoStreamingPlaylistModel.prototype, "createdAt");
    __decorate([
        sequelize_typescript_1.UpdatedAt
    ], VideoStreamingPlaylistModel.prototype, "updatedAt");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Column
    ], VideoStreamingPlaylistModel.prototype, "type");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Is('PlaylistUrl', function (value) { return utils_1.throwIfNotValid(value, misc_1.isActivityPubUrlValid, 'playlist url'); }),
        sequelize_typescript_1.Column(sequelize_typescript_1.DataType.STRING(constants_1.CONSTRAINTS_FIELDS.VIDEOS.URL.max))
    ], VideoStreamingPlaylistModel.prototype, "playlistUrl");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Is('VideoStreamingPlaylistInfoHashes', function (value) { return utils_1.throwIfNotValid(value, function (v) { return misc_2.isArrayOf(v, videos_1.isVideoFileInfoHashValid); }, 'info hashes'); }),
        sequelize_typescript_1.Column(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING))
    ], VideoStreamingPlaylistModel.prototype, "p2pMediaLoaderInfohashes");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Column
    ], VideoStreamingPlaylistModel.prototype, "p2pMediaLoaderPeerVersion");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Is('VideoStreamingSegmentsSha256Url', function (value) { return utils_1.throwIfNotValid(value, misc_1.isActivityPubUrlValid, 'segments sha256 url'); }),
        sequelize_typescript_1.Column
    ], VideoStreamingPlaylistModel.prototype, "segmentsSha256Url");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return video_1.VideoModel; }),
        sequelize_typescript_1.Column
    ], VideoStreamingPlaylistModel.prototype, "videoId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return video_1.VideoModel; }, {
            foreignKey: {
                allowNull: false
            },
            onDelete: 'CASCADE'
        })
    ], VideoStreamingPlaylistModel.prototype, "Video");
    __decorate([
        sequelize_typescript_1.HasMany(function () { return video_redundancy_1.VideoRedundancyModel; }, {
            foreignKey: {
                allowNull: false
            },
            onDelete: 'CASCADE',
            hooks: true
        })
    ], VideoStreamingPlaylistModel.prototype, "RedundancyVideos");
    VideoStreamingPlaylistModel = VideoStreamingPlaylistModel_1 = __decorate([
        sequelize_typescript_1.Table({
            tableName: 'videoStreamingPlaylist',
            indexes: [
                {
                    fields: ['videoId']
                },
                {
                    fields: ['videoId', 'type'],
                    unique: true
                },
                {
                    fields: ['p2pMediaLoaderInfohashes'],
                    using: 'gin'
                }
            ]
        })
    ], VideoStreamingPlaylistModel);
    return VideoStreamingPlaylistModel;
}(sequelize_typescript_1.Model));
exports.VideoStreamingPlaylistModel = VideoStreamingPlaylistModel;
