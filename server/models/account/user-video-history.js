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
var video_1 = require("../video/video");
var user_1 = require("./user");
var sequelize_1 = require("sequelize");
var UserVideoHistoryModel = /** @class */ (function (_super) {
    __extends(UserVideoHistoryModel, _super);
    function UserVideoHistoryModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UserVideoHistoryModel_1 = UserVideoHistoryModel;
    UserVideoHistoryModel.listForApi = function (user, start, count) {
        return video_1.VideoModel.listForApi({
            start: start,
            count: count,
            sort: '-UserVideoHistories.updatedAt',
            nsfw: null,
            includeLocalVideos: true,
            withFiles: false,
            user: user,
            historyOfUser: user
        });
    };
    UserVideoHistoryModel.removeUserHistoryBefore = function (user, beforeDate, t) {
        var _a;
        var query = {
            where: {
                userId: user.id
            },
            transaction: t
        };
        if (beforeDate) {
            query.where['updatedAt'] = (_a = {},
                _a[sequelize_1.Op.lt] = beforeDate,
                _a);
        }
        return UserVideoHistoryModel_1.destroy(query);
    };
    UserVideoHistoryModel.removeOldHistory = function (beforeDate) {
        var _a;
        var query = {
            where: {
                updatedAt: (_a = {},
                    _a[sequelize_1.Op.lt] = beforeDate,
                    _a)
            }
        };
        return UserVideoHistoryModel_1.destroy(query);
    };
    var UserVideoHistoryModel_1;
    __decorate([
        sequelize_typescript_1.CreatedAt
    ], UserVideoHistoryModel.prototype, "createdAt");
    __decorate([
        sequelize_typescript_1.UpdatedAt
    ], UserVideoHistoryModel.prototype, "updatedAt");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.IsInt,
        sequelize_typescript_1.Column
    ], UserVideoHistoryModel.prototype, "currentTime");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return video_1.VideoModel; }),
        sequelize_typescript_1.Column
    ], UserVideoHistoryModel.prototype, "videoId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return video_1.VideoModel; }, {
            foreignKey: {
                allowNull: false
            },
            onDelete: 'CASCADE'
        })
    ], UserVideoHistoryModel.prototype, "Video");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return user_1.UserModel; }),
        sequelize_typescript_1.Column
    ], UserVideoHistoryModel.prototype, "userId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return user_1.UserModel; }, {
            foreignKey: {
                allowNull: false
            },
            onDelete: 'CASCADE'
        })
    ], UserVideoHistoryModel.prototype, "User");
    UserVideoHistoryModel = UserVideoHistoryModel_1 = __decorate([
        sequelize_typescript_1.Table({
            tableName: 'userVideoHistory',
            indexes: [
                {
                    fields: ['userId', 'videoId'],
                    unique: true
                },
                {
                    fields: ['userId']
                },
                {
                    fields: ['videoId']
                }
            ]
        })
    ], UserVideoHistoryModel);
    return UserVideoHistoryModel;
}(sequelize_typescript_1.Model));
exports.UserVideoHistoryModel = UserVideoHistoryModel;
