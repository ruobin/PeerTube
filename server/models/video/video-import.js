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
var constants_1 = require("../../initializers/constants");
var utils_1 = require("../utils");
var video_1 = require("./video");
var video_imports_1 = require("../../helpers/custom-validators/video-imports");
var shared_1 = require("../../../shared");
var videos_1 = require("../../helpers/custom-validators/videos");
var user_1 = require("../account/user");
var VideoImportModel = /** @class */ (function (_super) {
    __extends(VideoImportModel, _super);
    function VideoImportModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    VideoImportModel_1 = VideoImportModel;
    VideoImportModel.deleteVideoIfFailed = function (instance, options) {
        if (instance.state === shared_1.VideoImportState.FAILED) {
            return instance.Video.destroy({ transaction: options.transaction });
        }
        return undefined;
    };
    VideoImportModel.loadAndPopulateVideo = function (id) {
        return VideoImportModel_1.findByPk(id);
    };
    VideoImportModel.listUserVideoImportsForApi = function (userId, start, count, sort) {
        var query = {
            distinct: true,
            include: [
                {
                    model: user_1.UserModel.unscoped(),
                    required: true
                }
            ],
            offset: start,
            limit: count,
            order: utils_1.getSort(sort),
            where: {
                userId: userId
            }
        };
        return VideoImportModel_1.findAndCountAll(query)
            .then(function (_a) {
            var rows = _a.rows, count = _a.count;
            return {
                data: rows,
                total: count
            };
        });
    };
    VideoImportModel.prototype.getTargetIdentifier = function () {
        return this.targetUrl || this.magnetUri || this.torrentName;
    };
    VideoImportModel.prototype.toFormattedJSON = function () {
        var videoFormatOptions = {
            completeDescription: true,
            additionalAttributes: { state: true, waitTranscoding: true, scheduledUpdate: true }
        };
        var video = this.Video
            ? Object.assign(this.Video.toFormattedJSON(videoFormatOptions), { tags: this.Video.Tags.map(function (t) { return t.name; }) })
            : undefined;
        return {
            id: this.id,
            targetUrl: this.targetUrl,
            magnetUri: this.magnetUri,
            torrentName: this.torrentName,
            state: {
                id: this.state,
                label: VideoImportModel_1.getStateLabel(this.state)
            },
            error: this.error,
            updatedAt: this.updatedAt.toISOString(),
            createdAt: this.createdAt.toISOString(),
            video: video
        };
    };
    VideoImportModel.getStateLabel = function (id) {
        return constants_1.VIDEO_IMPORT_STATES[id] || 'Unknown';
    };
    var VideoImportModel_1;
    __decorate([
        sequelize_typescript_1.CreatedAt
    ], VideoImportModel.prototype, "createdAt");
    __decorate([
        sequelize_typescript_1.UpdatedAt
    ], VideoImportModel.prototype, "updatedAt");
    __decorate([
        sequelize_typescript_1.AllowNull(true),
        sequelize_typescript_1.Default(null),
        sequelize_typescript_1.Is('VideoImportTargetUrl', function (value) { return utils_1.throwIfNotValid(value, video_imports_1.isVideoImportTargetUrlValid, 'targetUrl', true); }),
        sequelize_typescript_1.Column(sequelize_typescript_1.DataType.STRING(constants_1.CONSTRAINTS_FIELDS.VIDEO_IMPORTS.URL.max))
    ], VideoImportModel.prototype, "targetUrl");
    __decorate([
        sequelize_typescript_1.AllowNull(true),
        sequelize_typescript_1.Default(null),
        sequelize_typescript_1.Is('VideoImportMagnetUri', function (value) { return utils_1.throwIfNotValid(value, videos_1.isVideoMagnetUriValid, 'magnetUri', true); }),
        sequelize_typescript_1.Column(sequelize_typescript_1.DataType.STRING(constants_1.CONSTRAINTS_FIELDS.VIDEO_IMPORTS.URL.max)) // Use the same constraints than URLs
    ], VideoImportModel.prototype, "magnetUri");
    __decorate([
        sequelize_typescript_1.AllowNull(true),
        sequelize_typescript_1.Default(null),
        sequelize_typescript_1.Column(sequelize_typescript_1.DataType.STRING(constants_1.CONSTRAINTS_FIELDS.VIDEO_IMPORTS.TORRENT_NAME.max))
    ], VideoImportModel.prototype, "torrentName");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Default(null),
        sequelize_typescript_1.Is('VideoImportState', function (value) { return utils_1.throwIfNotValid(value, video_imports_1.isVideoImportStateValid, 'state'); }),
        sequelize_typescript_1.Column
    ], VideoImportModel.prototype, "state");
    __decorate([
        sequelize_typescript_1.AllowNull(true),
        sequelize_typescript_1.Default(null),
        sequelize_typescript_1.Column(sequelize_typescript_1.DataType.TEXT)
    ], VideoImportModel.prototype, "error");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return user_1.UserModel; }),
        sequelize_typescript_1.Column
    ], VideoImportModel.prototype, "userId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return user_1.UserModel; }, {
            foreignKey: {
                allowNull: false
            },
            onDelete: 'cascade'
        })
    ], VideoImportModel.prototype, "User");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return video_1.VideoModel; }),
        sequelize_typescript_1.Column
    ], VideoImportModel.prototype, "videoId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return video_1.VideoModel; }, {
            foreignKey: {
                allowNull: true
            },
            onDelete: 'set null'
        })
    ], VideoImportModel.prototype, "Video");
    __decorate([
        sequelize_typescript_1.AfterUpdate
    ], VideoImportModel, "deleteVideoIfFailed");
    VideoImportModel = VideoImportModel_1 = __decorate([
        sequelize_typescript_1.DefaultScope(function () { return ({
            include: [
                {
                    model: user_1.UserModel.unscoped(),
                    required: true
                },
                {
                    model: video_1.VideoModel.scope([video_1.ScopeNames.WITH_ACCOUNT_DETAILS, video_1.ScopeNames.WITH_TAGS]),
                    required: false
                }
            ]
        }); }),
        sequelize_typescript_1.Table({
            tableName: 'videoImport',
            indexes: [
                {
                    fields: ['videoId'],
                    unique: true
                },
                {
                    fields: ['userId']
                }
            ]
        })
    ], VideoImportModel);
    return VideoImportModel;
}(sequelize_typescript_1.Model));
exports.VideoImportModel = VideoImportModel;
