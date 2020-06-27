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
var video_streaming_playlist_1 = require("./video-streaming-playlist");
var sequelize_1 = require("sequelize");
var constants_1 = require("../../initializers/constants");
var VideoFileModel = /** @class */ (function (_super) {
    __extends(VideoFileModel, _super);
    function VideoFileModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    VideoFileModel_1 = VideoFileModel;
    VideoFileModel.doesInfohashExist = function (infoHash) {
        var query = 'SELECT 1 FROM "videoFile" WHERE "infoHash" = $infoHash LIMIT 1';
        var options = {
            type: sequelize_1.QueryTypes.SELECT,
            bind: { infoHash: infoHash },
            raw: true
        };
        return video_1.VideoModel.sequelize.query(query, options)
            .then(function (results) { return results.length === 1; });
    };
    VideoFileModel.loadWithVideo = function (id) {
        var options = {
            include: [
                {
                    model: video_1.VideoModel.unscoped(),
                    required: true
                }
            ]
        };
        return VideoFileModel_1.findByPk(id, options);
    };
    VideoFileModel.listByStreamingPlaylist = function (streamingPlaylistId, transaction) {
        var query = {
            include: [
                {
                    model: video_1.VideoModel.unscoped(),
                    required: true,
                    include: [
                        {
                            model: video_streaming_playlist_1.VideoStreamingPlaylistModel.unscoped(),
                            required: true,
                            where: {
                                id: streamingPlaylistId
                            }
                        }
                    ]
                }
            ],
            transaction: transaction
        };
        return VideoFileModel_1.findAll(query);
    };
    VideoFileModel.getStats = function () {
        var query = {
            include: [
                {
                    attributes: [],
                    model: video_1.VideoModel.unscoped(),
                    where: {
                        remote: false
                    }
                }
            ]
        };
        return VideoFileModel_1.aggregate('size', 'SUM', query)
            .then(function (result) { return ({
            totalLocalVideoFilesSize: utils_1.parseAggregateResult(result)
        }); });
    };
    VideoFileModel.prototype.isAudio = function () {
        return !!constants_1.MIMETYPES.AUDIO.EXT_MIMETYPE[this.extname];
    };
    VideoFileModel.prototype.hasSameUniqueKeysThan = function (other) {
        return this.fps === other.fps &&
            this.resolution === other.resolution &&
            this.videoId === other.videoId;
    };
    var VideoFileModel_1;
    __decorate([
        sequelize_typescript_1.CreatedAt
    ], VideoFileModel.prototype, "createdAt");
    __decorate([
        sequelize_typescript_1.UpdatedAt
    ], VideoFileModel.prototype, "updatedAt");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Is('VideoFileResolution', function (value) { return utils_1.throwIfNotValid(value, videos_1.isVideoFileResolutionValid, 'resolution'); }),
        sequelize_typescript_1.Column
    ], VideoFileModel.prototype, "resolution");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Is('VideoFileSize', function (value) { return utils_1.throwIfNotValid(value, videos_1.isVideoFileSizeValid, 'size'); }),
        sequelize_typescript_1.Column(sequelize_typescript_1.DataType.BIGINT)
    ], VideoFileModel.prototype, "size");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Is('VideoFileExtname', function (value) { return utils_1.throwIfNotValid(value, videos_1.isVideoFileExtnameValid, 'extname'); }),
        sequelize_typescript_1.Column
    ], VideoFileModel.prototype, "extname");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Is('VideoFileInfohash', function (value) { return utils_1.throwIfNotValid(value, videos_1.isVideoFileInfoHashValid, 'info hash'); }),
        sequelize_typescript_1.Column
    ], VideoFileModel.prototype, "infoHash");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Default(-1),
        sequelize_typescript_1.Is('VideoFileFPS', function (value) { return utils_1.throwIfNotValid(value, videos_1.isVideoFPSResolutionValid, 'fps'); }),
        sequelize_typescript_1.Column
    ], VideoFileModel.prototype, "fps");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return video_1.VideoModel; }),
        sequelize_typescript_1.Column
    ], VideoFileModel.prototype, "videoId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return video_1.VideoModel; }, {
            foreignKey: {
                allowNull: false
            },
            onDelete: 'CASCADE'
        })
    ], VideoFileModel.prototype, "Video");
    __decorate([
        sequelize_typescript_1.HasMany(function () { return video_redundancy_1.VideoRedundancyModel; }, {
            foreignKey: {
                allowNull: true
            },
            onDelete: 'CASCADE',
            hooks: true
        })
    ], VideoFileModel.prototype, "RedundancyVideos");
    VideoFileModel = VideoFileModel_1 = __decorate([
        sequelize_typescript_1.Table({
            tableName: 'videoFile',
            indexes: [
                {
                    fields: ['videoId']
                },
                {
                    fields: ['infoHash']
                },
                {
                    fields: ['videoId', 'resolution', 'fps'],
                    unique: true
                }
            ]
        })
    ], VideoFileModel);
    return VideoFileModel;
}(sequelize_typescript_1.Model));
exports.VideoFileModel = VideoFileModel;
