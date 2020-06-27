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
var video_abuses_1 = require("../../helpers/custom-validators/video-abuses");
var account_1 = require("../account/account");
var utils_1 = require("../utils");
var video_1 = require("./video");
var constants_1 = require("../../initializers/constants");
var VideoAbuseModel = /** @class */ (function (_super) {
    __extends(VideoAbuseModel, _super);
    function VideoAbuseModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    VideoAbuseModel_1 = VideoAbuseModel;
    VideoAbuseModel.loadByIdAndVideoId = function (id, videoId) {
        var query = {
            where: {
                id: id,
                videoId: videoId
            }
        };
        return VideoAbuseModel_1.findOne(query);
    };
    VideoAbuseModel.listForApi = function (start, count, sort) {
        var query = {
            offset: start,
            limit: count,
            order: utils_1.getSort(sort),
            include: [
                {
                    model: account_1.AccountModel,
                    required: true
                },
                {
                    model: video_1.VideoModel,
                    required: true
                }
            ]
        };
        return VideoAbuseModel_1.findAndCountAll(query)
            .then(function (_a) {
            var rows = _a.rows, count = _a.count;
            return { total: count, data: rows };
        });
    };
    VideoAbuseModel.prototype.toFormattedJSON = function () {
        return {
            id: this.id,
            reason: this.reason,
            reporterAccount: this.Account.toFormattedJSON(),
            state: {
                id: this.state,
                label: VideoAbuseModel_1.getStateLabel(this.state)
            },
            moderationComment: this.moderationComment,
            video: {
                id: this.Video.id,
                uuid: this.Video.uuid,
                name: this.Video.name
            },
            createdAt: this.createdAt
        };
    };
    VideoAbuseModel.prototype.toActivityPubObject = function () {
        return {
            type: 'Flag',
            content: this.reason,
            object: this.Video.url
        };
    };
    VideoAbuseModel.getStateLabel = function (id) {
        return constants_1.VIDEO_ABUSE_STATES[id] || 'Unknown';
    };
    var VideoAbuseModel_1;
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Default(null),
        sequelize_typescript_1.Is('VideoAbuseReason', function (value) { return utils_1.throwIfNotValid(value, video_abuses_1.isVideoAbuseReasonValid, 'reason'); }),
        sequelize_typescript_1.Column(sequelize_typescript_1.DataType.STRING(constants_1.CONSTRAINTS_FIELDS.VIDEO_ABUSES.REASON.max))
    ], VideoAbuseModel.prototype, "reason");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Default(null),
        sequelize_typescript_1.Is('VideoAbuseState', function (value) { return utils_1.throwIfNotValid(value, video_abuses_1.isVideoAbuseStateValid, 'state'); }),
        sequelize_typescript_1.Column
    ], VideoAbuseModel.prototype, "state");
    __decorate([
        sequelize_typescript_1.AllowNull(true),
        sequelize_typescript_1.Default(null),
        sequelize_typescript_1.Is('VideoAbuseModerationComment', function (value) { return utils_1.throwIfNotValid(value, video_abuses_1.isVideoAbuseModerationCommentValid, 'moderationComment', true); }),
        sequelize_typescript_1.Column(sequelize_typescript_1.DataType.STRING(constants_1.CONSTRAINTS_FIELDS.VIDEO_ABUSES.MODERATION_COMMENT.max))
    ], VideoAbuseModel.prototype, "moderationComment");
    __decorate([
        sequelize_typescript_1.CreatedAt
    ], VideoAbuseModel.prototype, "createdAt");
    __decorate([
        sequelize_typescript_1.UpdatedAt
    ], VideoAbuseModel.prototype, "updatedAt");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return account_1.AccountModel; }),
        sequelize_typescript_1.Column
    ], VideoAbuseModel.prototype, "reporterAccountId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return account_1.AccountModel; }, {
            foreignKey: {
                allowNull: false
            },
            onDelete: 'cascade'
        })
    ], VideoAbuseModel.prototype, "Account");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return video_1.VideoModel; }),
        sequelize_typescript_1.Column
    ], VideoAbuseModel.prototype, "videoId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return video_1.VideoModel; }, {
            foreignKey: {
                allowNull: false
            },
            onDelete: 'cascade'
        })
    ], VideoAbuseModel.prototype, "Video");
    VideoAbuseModel = VideoAbuseModel_1 = __decorate([
        sequelize_typescript_1.Table({
            tableName: 'videoAbuse',
            indexes: [
                {
                    fields: ['videoId']
                },
                {
                    fields: ['reporterAccountId']
                }
            ]
        })
    ], VideoAbuseModel);
    return VideoAbuseModel;
}(sequelize_typescript_1.Model));
exports.VideoAbuseModel = VideoAbuseModel;
