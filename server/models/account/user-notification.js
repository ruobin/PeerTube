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
var _a, _b, _c, _d, _e, _f, _g;
var sequelize_typescript_1 = require("sequelize-typescript");
var utils_1 = require("../utils");
var misc_1 = require("../../helpers/custom-validators/misc");
var user_notifications_1 = require("../../helpers/custom-validators/user-notifications");
var user_1 = require("./user");
var video_1 = require("../video/video");
var video_comment_1 = require("../video/video-comment");
var sequelize_1 = require("sequelize");
var video_channel_1 = require("../video/video-channel");
var account_1 = require("./account");
var video_abuse_1 = require("../video/video-abuse");
var video_blacklist_1 = require("../video/video-blacklist");
var video_import_1 = require("../video/video-import");
var actor_1 = require("../activitypub/actor");
var actor_follow_1 = require("../activitypub/actor-follow");
var avatar_1 = require("../avatar/avatar");
var server_1 = require("../server/server");
var ScopeNames;
(function (ScopeNames) {
    ScopeNames["WITH_ALL"] = "WITH_ALL";
})(ScopeNames || (ScopeNames = {}));
function buildActorWithAvatarInclude() {
    return {
        attributes: ['preferredUsername'],
        model: actor_1.ActorModel.unscoped(),
        required: true,
        include: [
            {
                attributes: ['filename'],
                model: avatar_1.AvatarModel.unscoped(),
                required: false
            },
            {
                attributes: ['host'],
                model: server_1.ServerModel.unscoped(),
                required: false
            }
        ]
    };
}
function buildVideoInclude(required) {
    return {
        attributes: ['id', 'uuid', 'name'],
        model: video_1.VideoModel.unscoped(),
        required: required
    };
}
function buildChannelInclude(required, withActor) {
    if (withActor === void 0) { withActor = false; }
    return {
        required: required,
        attributes: ['id', 'name'],
        model: video_channel_1.VideoChannelModel.unscoped(),
        include: withActor === true ? [buildActorWithAvatarInclude()] : []
    };
}
function buildAccountInclude(required, withActor) {
    if (withActor === void 0) { withActor = false; }
    return {
        required: required,
        attributes: ['id', 'name'],
        model: account_1.AccountModel.unscoped(),
        include: withActor === true ? [buildActorWithAvatarInclude()] : []
    };
}
var UserNotificationModel = /** @class */ (function (_super) {
    __extends(UserNotificationModel, _super);
    function UserNotificationModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UserNotificationModel_1 = UserNotificationModel;
    UserNotificationModel.listForApi = function (userId, start, count, sort, unread) {
        var query = {
            offset: start,
            limit: count,
            order: utils_1.getSort(sort),
            where: {
                userId: userId
            }
        };
        if (unread !== undefined)
            query.where['read'] = !unread;
        return UserNotificationModel_1.scope(ScopeNames.WITH_ALL)
            .findAndCountAll(query)
            .then(function (_a) {
            var rows = _a.rows, count = _a.count;
            return {
                data: rows,
                total: count
            };
        });
    };
    UserNotificationModel.markAsRead = function (userId, notificationIds) {
        var _a;
        var query = {
            where: {
                userId: userId,
                id: (_a = {},
                    _a[sequelize_1.Op["in"]] = notificationIds // FIXME: sequelize ANY seems broken
                ,
                    _a)
            }
        };
        return UserNotificationModel_1.update({ read: true }, query);
    };
    UserNotificationModel.markAllAsRead = function (userId) {
        var query = { where: { userId: userId } };
        return UserNotificationModel_1.update({ read: true }, query);
    };
    UserNotificationModel.prototype.toFormattedJSON = function () {
        var video = this.Video
            ? Object.assign(this.formatVideo(this.Video), { channel: this.formatActor(this.Video.VideoChannel) })
            : undefined;
        var videoImport = this.VideoImport ? {
            id: this.VideoImport.id,
            video: this.VideoImport.Video ? this.formatVideo(this.VideoImport.Video) : undefined,
            torrentName: this.VideoImport.torrentName,
            magnetUri: this.VideoImport.magnetUri,
            targetUrl: this.VideoImport.targetUrl
        } : undefined;
        var comment = this.Comment ? {
            id: this.Comment.id,
            threadId: this.Comment.getThreadId(),
            account: this.formatActor(this.Comment.Account),
            video: this.formatVideo(this.Comment.Video)
        } : undefined;
        var videoAbuse = this.VideoAbuse ? {
            id: this.VideoAbuse.id,
            video: this.formatVideo(this.VideoAbuse.Video)
        } : undefined;
        var videoBlacklist = this.VideoBlacklist ? {
            id: this.VideoBlacklist.id,
            video: this.formatVideo(this.VideoBlacklist.Video)
        } : undefined;
        var account = this.Account ? this.formatActor(this.Account) : undefined;
        var actorFollow = this.ActorFollow ? {
            id: this.ActorFollow.id,
            state: this.ActorFollow.state,
            follower: {
                id: this.ActorFollow.ActorFollower.Account.id,
                displayName: this.ActorFollow.ActorFollower.Account.getDisplayName(),
                name: this.ActorFollow.ActorFollower.preferredUsername,
                avatar: this.ActorFollow.ActorFollower.Avatar ? { path: this.ActorFollow.ActorFollower.Avatar.getStaticPath() } : undefined,
                host: this.ActorFollow.ActorFollower.getHost()
            },
            following: {
                type: this.ActorFollow.ActorFollowing.VideoChannel ? 'channel' : 'account',
                displayName: (this.ActorFollow.ActorFollowing.VideoChannel || this.ActorFollow.ActorFollowing.Account).getDisplayName(),
                name: this.ActorFollow.ActorFollowing.preferredUsername
            }
        } : undefined;
        return {
            id: this.id,
            type: this.type,
            read: this.read,
            video: video,
            videoImport: videoImport,
            comment: comment,
            videoAbuse: videoAbuse,
            videoBlacklist: videoBlacklist,
            account: account,
            actorFollow: actorFollow,
            createdAt: this.createdAt.toISOString(),
            updatedAt: this.updatedAt.toISOString()
        };
    };
    UserNotificationModel.prototype.formatVideo = function (video) {
        return {
            id: video.id,
            uuid: video.uuid,
            name: video.name
        };
    };
    UserNotificationModel.prototype.formatActor = function (accountOrChannel) {
        var avatar = accountOrChannel.Actor.Avatar
            ? { path: accountOrChannel.Actor.Avatar.getStaticPath() }
            : undefined;
        return {
            id: accountOrChannel.id,
            displayName: accountOrChannel.getDisplayName(),
            name: accountOrChannel.Actor.preferredUsername,
            host: accountOrChannel.Actor.getHost(),
            avatar: avatar
        };
    };
    var UserNotificationModel_1;
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Default(null),
        sequelize_typescript_1.Is('UserNotificationType', function (value) { return utils_1.throwIfNotValid(value, user_notifications_1.isUserNotificationTypeValid, 'type'); }),
        sequelize_typescript_1.Column
    ], UserNotificationModel.prototype, "type");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Default(false),
        sequelize_typescript_1.Is('UserNotificationRead', function (value) { return utils_1.throwIfNotValid(value, misc_1.isBooleanValid, 'read'); }),
        sequelize_typescript_1.Column
    ], UserNotificationModel.prototype, "read");
    __decorate([
        sequelize_typescript_1.CreatedAt
    ], UserNotificationModel.prototype, "createdAt");
    __decorate([
        sequelize_typescript_1.UpdatedAt
    ], UserNotificationModel.prototype, "updatedAt");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return user_1.UserModel; }),
        sequelize_typescript_1.Column
    ], UserNotificationModel.prototype, "userId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return user_1.UserModel; }, {
            foreignKey: {
                allowNull: false
            },
            onDelete: 'cascade'
        })
    ], UserNotificationModel.prototype, "User");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return video_1.VideoModel; }),
        sequelize_typescript_1.Column
    ], UserNotificationModel.prototype, "videoId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return video_1.VideoModel; }, {
            foreignKey: {
                allowNull: true
            },
            onDelete: 'cascade'
        })
    ], UserNotificationModel.prototype, "Video");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return video_comment_1.VideoCommentModel; }),
        sequelize_typescript_1.Column
    ], UserNotificationModel.prototype, "commentId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return video_comment_1.VideoCommentModel; }, {
            foreignKey: {
                allowNull: true
            },
            onDelete: 'cascade'
        })
    ], UserNotificationModel.prototype, "Comment");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return video_abuse_1.VideoAbuseModel; }),
        sequelize_typescript_1.Column
    ], UserNotificationModel.prototype, "videoAbuseId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return video_abuse_1.VideoAbuseModel; }, {
            foreignKey: {
                allowNull: true
            },
            onDelete: 'cascade'
        })
    ], UserNotificationModel.prototype, "VideoAbuse");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return video_blacklist_1.VideoBlacklistModel; }),
        sequelize_typescript_1.Column
    ], UserNotificationModel.prototype, "videoBlacklistId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return video_blacklist_1.VideoBlacklistModel; }, {
            foreignKey: {
                allowNull: true
            },
            onDelete: 'cascade'
        })
    ], UserNotificationModel.prototype, "VideoBlacklist");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return video_import_1.VideoImportModel; }),
        sequelize_typescript_1.Column
    ], UserNotificationModel.prototype, "videoImportId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return video_import_1.VideoImportModel; }, {
            foreignKey: {
                allowNull: true
            },
            onDelete: 'cascade'
        })
    ], UserNotificationModel.prototype, "VideoImport");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return account_1.AccountModel; }),
        sequelize_typescript_1.Column
    ], UserNotificationModel.prototype, "accountId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return account_1.AccountModel; }, {
            foreignKey: {
                allowNull: true
            },
            onDelete: 'cascade'
        })
    ], UserNotificationModel.prototype, "Account");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return actor_follow_1.ActorFollowModel; }),
        sequelize_typescript_1.Column
    ], UserNotificationModel.prototype, "actorFollowId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return actor_follow_1.ActorFollowModel; }, {
            foreignKey: {
                allowNull: true
            },
            onDelete: 'cascade'
        })
    ], UserNotificationModel.prototype, "ActorFollow");
    UserNotificationModel = UserNotificationModel_1 = __decorate([
        sequelize_typescript_1.Scopes(function () {
            var _a;
            return (_a = {},
                _a[ScopeNames.WITH_ALL] = {
                    include: [
                        Object.assign(buildVideoInclude(false), {
                            include: [buildChannelInclude(true, true)]
                        }),
                        {
                            attributes: ['id', 'originCommentId'],
                            model: video_comment_1.VideoCommentModel.unscoped(),
                            required: false,
                            include: [
                                buildAccountInclude(true, true),
                                buildVideoInclude(true)
                            ]
                        },
                        {
                            attributes: ['id'],
                            model: video_abuse_1.VideoAbuseModel.unscoped(),
                            required: false,
                            include: [buildVideoInclude(true)]
                        },
                        {
                            attributes: ['id'],
                            model: video_blacklist_1.VideoBlacklistModel.unscoped(),
                            required: false,
                            include: [buildVideoInclude(true)]
                        },
                        {
                            attributes: ['id', 'magnetUri', 'targetUrl', 'torrentName'],
                            model: video_import_1.VideoImportModel.unscoped(),
                            required: false,
                            include: [buildVideoInclude(false)]
                        },
                        {
                            attributes: ['id', 'state'],
                            model: actor_follow_1.ActorFollowModel.unscoped(),
                            required: false,
                            include: [
                                {
                                    attributes: ['preferredUsername'],
                                    model: actor_1.ActorModel.unscoped(),
                                    required: true,
                                    as: 'ActorFollower',
                                    include: [
                                        {
                                            attributes: ['id', 'name'],
                                            model: account_1.AccountModel.unscoped(),
                                            required: true
                                        },
                                        {
                                            attributes: ['filename'],
                                            model: avatar_1.AvatarModel.unscoped(),
                                            required: false
                                        },
                                        {
                                            attributes: ['host'],
                                            model: server_1.ServerModel.unscoped(),
                                            required: false
                                        }
                                    ]
                                },
                                {
                                    attributes: ['preferredUsername'],
                                    model: actor_1.ActorModel.unscoped(),
                                    required: true,
                                    as: 'ActorFollowing',
                                    include: [
                                        buildChannelInclude(false),
                                        buildAccountInclude(false)
                                    ]
                                }
                            ]
                        },
                        buildAccountInclude(false, true)
                    ]
                },
                _a);
        }),
        sequelize_typescript_1.Table({
            tableName: 'userNotification',
            indexes: [
                {
                    fields: ['userId']
                },
                {
                    fields: ['videoId'],
                    where: {
                        videoId: (_a = {},
                            _a[sequelize_1.Op.ne] = null,
                            _a)
                    }
                },
                {
                    fields: ['commentId'],
                    where: {
                        commentId: (_b = {},
                            _b[sequelize_1.Op.ne] = null,
                            _b)
                    }
                },
                {
                    fields: ['videoAbuseId'],
                    where: {
                        videoAbuseId: (_c = {},
                            _c[sequelize_1.Op.ne] = null,
                            _c)
                    }
                },
                {
                    fields: ['videoBlacklistId'],
                    where: {
                        videoBlacklistId: (_d = {},
                            _d[sequelize_1.Op.ne] = null,
                            _d)
                    }
                },
                {
                    fields: ['videoImportId'],
                    where: {
                        videoImportId: (_e = {},
                            _e[sequelize_1.Op.ne] = null,
                            _e)
                    }
                },
                {
                    fields: ['accountId'],
                    where: {
                        accountId: (_f = {},
                            _f[sequelize_1.Op.ne] = null,
                            _f)
                    }
                },
                {
                    fields: ['actorFollowId'],
                    where: {
                        actorFollowId: (_g = {},
                            _g[sequelize_1.Op.ne] = null,
                            _g)
                    }
                }
            ]
        })
    ], UserNotificationModel);
    return UserNotificationModel;
}(sequelize_typescript_1.Model));
exports.UserNotificationModel = UserNotificationModel;
