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
var _a;
var path_1 = require("path");
var sequelize_typescript_1 = require("sequelize-typescript");
var constants_1 = require("../../initializers/constants");
var logger_1 = require("../../helpers/logger");
var fs_extra_1 = require("fs-extra");
var config_1 = require("../../initializers/config");
var video_1 = require("./video");
var video_playlist_1 = require("./video-playlist");
var thumbnail_type_1 = require("../../../shared/models/videos/thumbnail.type");
var ThumbnailModel = /** @class */ (function (_super) {
    __extends(ThumbnailModel, _super);
    function ThumbnailModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ThumbnailModel_1 = ThumbnailModel;
    ThumbnailModel.removeFiles = function (instance) {
        logger_1.logger.info('Removing %s file %s.', ThumbnailModel_1.types[instance.type].label, instance.filename);
        // Don't block the transaction
        instance.removeThumbnail()["catch"](function (err) { return logger_1.logger.error('Cannot remove thumbnail file %s.', instance.filename, err); });
    };
    ThumbnailModel.loadByName = function (filename) {
        var query = {
            where: {
                filename: filename
            }
        };
        return ThumbnailModel_1.findOne(query);
    };
    ThumbnailModel.generateDefaultPreviewName = function (videoUUID) {
        return videoUUID + '.jpg';
    };
    ThumbnailModel.prototype.getFileUrl = function () {
        if (this.fileUrl)
            return this.fileUrl;
        var staticPath = ThumbnailModel_1.types[this.type].staticPath;
        return constants_1.WEBSERVER.URL + staticPath + this.filename;
    };
    ThumbnailModel.prototype.getPath = function () {
        var directory = ThumbnailModel_1.types[this.type].directory;
        return path_1.join(directory, this.filename);
    };
    ThumbnailModel.prototype.removeThumbnail = function () {
        return fs_extra_1.remove(this.getPath());
    };
    var ThumbnailModel_1;
    ThumbnailModel.types = (_a = {},
        _a[thumbnail_type_1.ThumbnailType.MINIATURE] = {
            label: 'miniature',
            directory: config_1.CONFIG.STORAGE.THUMBNAILS_DIR,
            staticPath: constants_1.STATIC_PATHS.THUMBNAILS
        },
        _a[thumbnail_type_1.ThumbnailType.PREVIEW] = {
            label: 'preview',
            directory: config_1.CONFIG.STORAGE.PREVIEWS_DIR,
            staticPath: constants_1.LAZY_STATIC_PATHS.PREVIEWS
        },
        _a);
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Column
    ], ThumbnailModel.prototype, "filename");
    __decorate([
        sequelize_typescript_1.AllowNull(true),
        sequelize_typescript_1.Default(null),
        sequelize_typescript_1.Column
    ], ThumbnailModel.prototype, "height");
    __decorate([
        sequelize_typescript_1.AllowNull(true),
        sequelize_typescript_1.Default(null),
        sequelize_typescript_1.Column
    ], ThumbnailModel.prototype, "width");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Column
    ], ThumbnailModel.prototype, "type");
    __decorate([
        sequelize_typescript_1.AllowNull(true),
        sequelize_typescript_1.Column
    ], ThumbnailModel.prototype, "fileUrl");
    __decorate([
        sequelize_typescript_1.AllowNull(true),
        sequelize_typescript_1.Column
    ], ThumbnailModel.prototype, "automaticallyGenerated");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return video_1.VideoModel; }),
        sequelize_typescript_1.Column
    ], ThumbnailModel.prototype, "videoId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return video_1.VideoModel; }, {
            foreignKey: {
                allowNull: true
            },
            onDelete: 'CASCADE'
        })
    ], ThumbnailModel.prototype, "Video");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return video_playlist_1.VideoPlaylistModel; }),
        sequelize_typescript_1.Column
    ], ThumbnailModel.prototype, "videoPlaylistId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return video_playlist_1.VideoPlaylistModel; }, {
            foreignKey: {
                allowNull: true
            },
            onDelete: 'CASCADE'
        })
    ], ThumbnailModel.prototype, "VideoPlaylist");
    __decorate([
        sequelize_typescript_1.CreatedAt
    ], ThumbnailModel.prototype, "createdAt");
    __decorate([
        sequelize_typescript_1.UpdatedAt
    ], ThumbnailModel.prototype, "updatedAt");
    __decorate([
        sequelize_typescript_1.AfterDestroy
    ], ThumbnailModel, "removeFiles");
    ThumbnailModel = ThumbnailModel_1 = __decorate([
        sequelize_typescript_1.Table({
            tableName: 'thumbnail',
            indexes: [
                {
                    fields: ['videoId']
                },
                {
                    fields: ['videoPlaylistId'],
                    unique: true
                }
            ]
        })
    ], ThumbnailModel);
    return ThumbnailModel;
}(sequelize_typescript_1.Model));
exports.ThumbnailModel = ThumbnailModel;
