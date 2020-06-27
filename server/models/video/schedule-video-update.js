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
var sequelize_1 = require("sequelize");
var ScheduleVideoUpdateModel = /** @class */ (function (_super) {
    __extends(ScheduleVideoUpdateModel, _super);
    function ScheduleVideoUpdateModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ScheduleVideoUpdateModel_1 = ScheduleVideoUpdateModel;
    ScheduleVideoUpdateModel.areVideosToUpdate = function () {
        var _a;
        var query = {
            logging: false,
            attributes: ['id'],
            where: {
                updateAt: (_a = {},
                    _a[sequelize_1.Op.lte] = new Date(),
                    _a)
            }
        };
        return ScheduleVideoUpdateModel_1.findOne(query)
            .then(function (res) { return !!res; });
    };
    ScheduleVideoUpdateModel.listVideosToUpdate = function (t) {
        var _a;
        var query = {
            where: {
                updateAt: (_a = {},
                    _a[sequelize_1.Op.lte] = new Date(),
                    _a)
            },
            include: [
                {
                    model: video_1.VideoModel.scope([
                        video_1.ScopeNames.WITH_FILES,
                        video_1.ScopeNames.WITH_ACCOUNT_DETAILS,
                        video_1.ScopeNames.WITH_BLACKLISTED,
                        video_1.ScopeNames.WITH_THUMBNAILS
                    ])
                }
            ],
            transaction: t
        };
        return ScheduleVideoUpdateModel_1.findAll(query);
    };
    ScheduleVideoUpdateModel.deleteByVideoId = function (videoId, t) {
        var query = {
            where: {
                videoId: videoId
            },
            transaction: t
        };
        return ScheduleVideoUpdateModel_1.destroy(query);
    };
    ScheduleVideoUpdateModel.prototype.toFormattedJSON = function () {
        return {
            updateAt: this.updateAt,
            privacy: this.privacy || undefined
        };
    };
    var ScheduleVideoUpdateModel_1;
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Default(null),
        sequelize_typescript_1.Column
    ], ScheduleVideoUpdateModel.prototype, "updateAt");
    __decorate([
        sequelize_typescript_1.AllowNull(true),
        sequelize_typescript_1.Default(null),
        sequelize_typescript_1.Column
    ], ScheduleVideoUpdateModel.prototype, "privacy");
    __decorate([
        sequelize_typescript_1.CreatedAt
    ], ScheduleVideoUpdateModel.prototype, "createdAt");
    __decorate([
        sequelize_typescript_1.UpdatedAt
    ], ScheduleVideoUpdateModel.prototype, "updatedAt");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return video_1.VideoModel; }),
        sequelize_typescript_1.Column
    ], ScheduleVideoUpdateModel.prototype, "videoId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return video_1.VideoModel; }, {
            foreignKey: {
                allowNull: false
            },
            onDelete: 'cascade'
        })
    ], ScheduleVideoUpdateModel.prototype, "Video");
    ScheduleVideoUpdateModel = ScheduleVideoUpdateModel_1 = __decorate([
        sequelize_typescript_1.Table({
            tableName: 'scheduleVideoUpdate',
            indexes: [
                {
                    fields: ['videoId'],
                    unique: true
                },
                {
                    fields: ['updateAt']
                }
            ]
        })
    ], ScheduleVideoUpdateModel);
    return ScheduleVideoUpdateModel;
}(sequelize_typescript_1.Model));
exports.ScheduleVideoUpdateModel = ScheduleVideoUpdateModel;
