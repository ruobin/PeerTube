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
var user_1 = require("./user");
var user_notifications_1 = require("../../helpers/custom-validators/user-notifications");
var oauth_model_1 = require("../../lib/oauth-model");
var UserNotificationSettingModel = /** @class */ (function (_super) {
    __extends(UserNotificationSettingModel, _super);
    function UserNotificationSettingModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UserNotificationSettingModel.removeTokenCache = function (instance) {
        return oauth_model_1.clearCacheByUserId(instance.userId);
    };
    UserNotificationSettingModel.prototype.toFormattedJSON = function () {
        return {
            newCommentOnMyVideo: this.newCommentOnMyVideo,
            newVideoFromSubscription: this.newVideoFromSubscription,
            videoAbuseAsModerator: this.videoAbuseAsModerator,
            videoAutoBlacklistAsModerator: this.videoAutoBlacklistAsModerator,
            blacklistOnMyVideo: this.blacklistOnMyVideo,
            myVideoPublished: this.myVideoPublished,
            myVideoImportFinished: this.myVideoImportFinished,
            newUserRegistration: this.newUserRegistration,
            commentMention: this.commentMention,
            newFollow: this.newFollow,
            newInstanceFollower: this.newInstanceFollower
        };
    };
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Default(null),
        sequelize_typescript_1.Is('UserNotificationSettingNewVideoFromSubscription', function (value) { return utils_1.throwIfNotValid(value, user_notifications_1.isUserNotificationSettingValid, 'newVideoFromSubscription'); }),
        sequelize_typescript_1.Column
    ], UserNotificationSettingModel.prototype, "newVideoFromSubscription");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Default(null),
        sequelize_typescript_1.Is('UserNotificationSettingNewCommentOnMyVideo', function (value) { return utils_1.throwIfNotValid(value, user_notifications_1.isUserNotificationSettingValid, 'newCommentOnMyVideo'); }),
        sequelize_typescript_1.Column
    ], UserNotificationSettingModel.prototype, "newCommentOnMyVideo");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Default(null),
        sequelize_typescript_1.Is('UserNotificationSettingVideoAbuseAsModerator', function (value) { return utils_1.throwIfNotValid(value, user_notifications_1.isUserNotificationSettingValid, 'videoAbuseAsModerator'); }),
        sequelize_typescript_1.Column
    ], UserNotificationSettingModel.prototype, "videoAbuseAsModerator");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Default(null),
        sequelize_typescript_1.Is('UserNotificationSettingVideoAutoBlacklistAsModerator', function (value) { return utils_1.throwIfNotValid(value, user_notifications_1.isUserNotificationSettingValid, 'videoAutoBlacklistAsModerator'); }),
        sequelize_typescript_1.Column
    ], UserNotificationSettingModel.prototype, "videoAutoBlacklistAsModerator");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Default(null),
        sequelize_typescript_1.Is('UserNotificationSettingBlacklistOnMyVideo', function (value) { return utils_1.throwIfNotValid(value, user_notifications_1.isUserNotificationSettingValid, 'blacklistOnMyVideo'); }),
        sequelize_typescript_1.Column
    ], UserNotificationSettingModel.prototype, "blacklistOnMyVideo");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Default(null),
        sequelize_typescript_1.Is('UserNotificationSettingMyVideoPublished', function (value) { return utils_1.throwIfNotValid(value, user_notifications_1.isUserNotificationSettingValid, 'myVideoPublished'); }),
        sequelize_typescript_1.Column
    ], UserNotificationSettingModel.prototype, "myVideoPublished");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Default(null),
        sequelize_typescript_1.Is('UserNotificationSettingMyVideoImportFinished', function (value) { return utils_1.throwIfNotValid(value, user_notifications_1.isUserNotificationSettingValid, 'myVideoImportFinished'); }),
        sequelize_typescript_1.Column
    ], UserNotificationSettingModel.prototype, "myVideoImportFinished");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Default(null),
        sequelize_typescript_1.Is('UserNotificationSettingNewUserRegistration', function (value) { return utils_1.throwIfNotValid(value, user_notifications_1.isUserNotificationSettingValid, 'newUserRegistration'); }),
        sequelize_typescript_1.Column
    ], UserNotificationSettingModel.prototype, "newUserRegistration");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Default(null),
        sequelize_typescript_1.Is('UserNotificationSettingNewInstanceFollower', function (value) { return utils_1.throwIfNotValid(value, user_notifications_1.isUserNotificationSettingValid, 'newInstanceFollower'); }),
        sequelize_typescript_1.Column
    ], UserNotificationSettingModel.prototype, "newInstanceFollower");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Default(null),
        sequelize_typescript_1.Is('UserNotificationSettingNewFollow', function (value) { return utils_1.throwIfNotValid(value, user_notifications_1.isUserNotificationSettingValid, 'newFollow'); }),
        sequelize_typescript_1.Column
    ], UserNotificationSettingModel.prototype, "newFollow");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Default(null),
        sequelize_typescript_1.Is('UserNotificationSettingCommentMention', function (value) { return utils_1.throwIfNotValid(value, user_notifications_1.isUserNotificationSettingValid, 'commentMention'); }),
        sequelize_typescript_1.Column
    ], UserNotificationSettingModel.prototype, "commentMention");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return user_1.UserModel; }),
        sequelize_typescript_1.Column
    ], UserNotificationSettingModel.prototype, "userId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return user_1.UserModel; }, {
            foreignKey: {
                allowNull: false
            },
            onDelete: 'cascade'
        })
    ], UserNotificationSettingModel.prototype, "User");
    __decorate([
        sequelize_typescript_1.CreatedAt
    ], UserNotificationSettingModel.prototype, "createdAt");
    __decorate([
        sequelize_typescript_1.UpdatedAt
    ], UserNotificationSettingModel.prototype, "updatedAt");
    __decorate([
        sequelize_typescript_1.AfterUpdate,
        sequelize_typescript_1.AfterDestroy
    ], UserNotificationSettingModel, "removeTokenCache");
    UserNotificationSettingModel = __decorate([
        sequelize_typescript_1.Table({
            tableName: 'userNotificationSetting',
            indexes: [
                {
                    fields: ['userId'],
                    unique: true
                }
            ]
        })
    ], UserNotificationSettingModel);
    return UserNotificationSettingModel;
}(sequelize_typescript_1.Model));
exports.UserNotificationSettingModel = UserNotificationSettingModel;
