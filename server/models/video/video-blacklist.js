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
var utils_1 = require("../utils");
var video_1 = require("./video");
var video_channel_1 = require("./video-channel");
var video_blacklist_1 = require("../../helpers/custom-validators/video-blacklist");
var constants_1 = require("../../initializers/constants");
var thumbnail_1 = require("./thumbnail");
var VideoBlacklistModel = /** @class */ (function (_super) {
    __extends(VideoBlacklistModel, _super);
    function VideoBlacklistModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    VideoBlacklistModel_1 = VideoBlacklistModel;
    VideoBlacklistModel.listForApi = function (start, count, sort, type) {
        function buildBaseQuery() {
            return {
                offset: start,
                limit: count,
                order: utils_1.getBlacklistSort(sort.sortModel, sort.sortValue)
            };
        }
        var countQuery = buildBaseQuery();
        var findQuery = buildBaseQuery();
        findQuery.include = [
            {
                model: video_1.VideoModel,
                required: true,
                include: [
                    {
                        model: video_channel_1.VideoChannelModel.scope({ method: [video_channel_1.ScopeNames.SUMMARY, { withAccount: true }] }),
                        required: true
                    },
                    {
                        model: thumbnail_1.ThumbnailModel,
                        attributes: ['type', 'filename'],
                        required: false
                    }
                ]
            }
        ];
        if (type) {
            countQuery.where = { type: type };
            findQuery.where = { type: type };
        }
        return Promise.all([
            VideoBlacklistModel_1.count(countQuery),
            VideoBlacklistModel_1.findAll(findQuery)
        ]).then(function (_a) {
            var count = _a[0], rows = _a[1];
            return {
                data: rows,
                total: count
            };
        });
    };
    VideoBlacklistModel.loadByVideoId = function (id) {
        var query = {
            where: {
                videoId: id
            }
        };
        return VideoBlacklistModel_1.findOne(query);
    };
    VideoBlacklistModel.prototype.toFormattedJSON = function () {
        return {
            id: this.id,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            reason: this.reason,
            unfederated: this.unfederated,
            type: this.type,
            video: this.Video.toFormattedJSON()
        };
    };
    var VideoBlacklistModel_1;
    __decorate([
        sequelize_typescript_1.AllowNull(true),
        sequelize_typescript_1.Is('VideoBlacklistReason', function (value) { return utils_1.throwIfNotValid(value, video_blacklist_1.isVideoBlacklistReasonValid, 'reason', true); }),
        sequelize_typescript_1.Column(sequelize_typescript_1.DataType.STRING(constants_1.CONSTRAINTS_FIELDS.VIDEO_BLACKLIST.REASON.max))
    ], VideoBlacklistModel.prototype, "reason");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Column
    ], VideoBlacklistModel.prototype, "unfederated");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Default(null),
        sequelize_typescript_1.Is('VideoBlacklistType', function (value) { return utils_1.throwIfNotValid(value, video_blacklist_1.isVideoBlacklistTypeValid, 'type'); }),
        sequelize_typescript_1.Column
    ], VideoBlacklistModel.prototype, "type");
    __decorate([
        sequelize_typescript_1.CreatedAt
    ], VideoBlacklistModel.prototype, "createdAt");
    __decorate([
        sequelize_typescript_1.UpdatedAt
    ], VideoBlacklistModel.prototype, "updatedAt");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return video_1.VideoModel; }),
        sequelize_typescript_1.Column
    ], VideoBlacklistModel.prototype, "videoId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return video_1.VideoModel; }, {
            foreignKey: {
                allowNull: false
            },
            onDelete: 'cascade'
        })
    ], VideoBlacklistModel.prototype, "Video");
    VideoBlacklistModel = VideoBlacklistModel_1 = __decorate([
        sequelize_typescript_1.Table({
            tableName: 'videoBlacklist',
            indexes: [
                {
                    fields: ['videoId'],
                    unique: true
                }
            ]
        })
    ], VideoBlacklistModel);
    return VideoBlacklistModel;
}(sequelize_typescript_1.Model));
exports.VideoBlacklistModel = VideoBlacklistModel;
