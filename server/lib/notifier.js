"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var users_1 = require("../../shared/models/users");
var logger_1 = require("../helpers/logger");
var emailer_1 = require("./emailer");
var user_notification_1 = require("../models/account/user-notification");
var user_1 = require("../models/account/user");
var peertube_socket_1 = require("./peertube-socket");
var config_1 = require("../initializers/config");
var videos_1 = require("../../shared/models/videos");
var account_blocklist_1 = require("../models/account/account-blocklist");
var Notifier = /** @class */ (function () {
    function Notifier() {
    }
    Notifier.prototype.notifyOnNewVideoIfNeeded = function (video) {
        // Only notify on public and published videos which are not blacklisted
        if (video.privacy !== videos_1.VideoPrivacy.PUBLIC || video.state !== videos_1.VideoState.PUBLISHED || video.isBlacklisted())
            return;
        this.notifySubscribersOfNewVideo(video)["catch"](function (err) { return logger_1.logger.error('Cannot notify subscribers of new video %s.', video.url, { err: err }); });
    };
    Notifier.prototype.notifyOnVideoPublishedAfterTranscoding = function (video) {
        // don't notify if didn't wait for transcoding or video is still blacklisted/waiting for scheduled update
        if (!video.waitTranscoding || video.VideoBlacklist || video.ScheduleVideoUpdate)
            return;
        this.notifyOwnedVideoHasBeenPublished(video)["catch"](function (err) { return logger_1.logger.error('Cannot notify owner that its video %s has been published after transcoding.', video.url, { err: err }); });
    };
    Notifier.prototype.notifyOnVideoPublishedAfterScheduledUpdate = function (video) {
        // don't notify if video is still blacklisted or waiting for transcoding
        if (video.VideoBlacklist || (video.waitTranscoding && video.state !== videos_1.VideoState.PUBLISHED))
            return;
        this.notifyOwnedVideoHasBeenPublished(video)["catch"](function (err) { return logger_1.logger.error('Cannot notify owner that its video %s has been published after scheduled update.', video.url, { err: err }); });
    };
    Notifier.prototype.notifyOnVideoPublishedAfterRemovedFromAutoBlacklist = function (video) {
        // don't notify if video is still waiting for transcoding or scheduled update
        if (video.ScheduleVideoUpdate || (video.waitTranscoding && video.state !== videos_1.VideoState.PUBLISHED))
            return;
        this.notifyOwnedVideoHasBeenPublished(video)["catch"](function (err) { return logger_1.logger.error('Cannot notify owner that its video %s has been published after removed from auto-blacklist.', video.url, { err: err }); }); // tslint:disable-line:max-line-length
    };
    Notifier.prototype.notifyOnNewComment = function (comment) {
        this.notifyVideoOwnerOfNewComment(comment)["catch"](function (err) { return logger_1.logger.error('Cannot notify video owner of new comment %s.', comment.url, { err: err }); });
        this.notifyOfCommentMention(comment)["catch"](function (err) { return logger_1.logger.error('Cannot notify mentions of comment %s.', comment.url, { err: err }); });
    };
    Notifier.prototype.notifyOnNewVideoAbuse = function (videoAbuse) {
        this.notifyModeratorsOfNewVideoAbuse(videoAbuse)["catch"](function (err) { return logger_1.logger.error('Cannot notify of new video abuse of video %s.', videoAbuse.Video.url, { err: err }); });
    };
    Notifier.prototype.notifyOnVideoAutoBlacklist = function (video) {
        this.notifyModeratorsOfVideoAutoBlacklist(video)["catch"](function (err) { return logger_1.logger.error('Cannot notify of auto-blacklist of video %s.', video.url, { err: err }); });
    };
    Notifier.prototype.notifyOnVideoBlacklist = function (videoBlacklist) {
        this.notifyVideoOwnerOfBlacklist(videoBlacklist)["catch"](function (err) { return logger_1.logger.error('Cannot notify video owner of new video blacklist of %s.', videoBlacklist.Video.url, { err: err }); });
    };
    Notifier.prototype.notifyOnVideoUnblacklist = function (video) {
        this.notifyVideoOwnerOfUnblacklist(video)["catch"](function (err) { return logger_1.logger.error('Cannot notify video owner of unblacklist of %s.', video.url, { err: err }); });
    };
    Notifier.prototype.notifyOnFinishedVideoImport = function (videoImport, success) {
        this.notifyOwnerVideoImportIsFinished(videoImport, success)["catch"](function (err) { return logger_1.logger.error('Cannot notify owner that its video import %s is finished.', videoImport.getTargetIdentifier(), { err: err }); });
    };
    Notifier.prototype.notifyOnNewUserRegistration = function (user) {
        this.notifyModeratorsOfNewUserRegistration(user)["catch"](function (err) { return logger_1.logger.error('Cannot notify moderators of new user registration (%s).', user.username, { err: err }); });
    };
    Notifier.prototype.notifyOfNewUserFollow = function (actorFollow) {
        this.notifyUserOfNewActorFollow(actorFollow)["catch"](function (err) {
            logger_1.logger.error('Cannot notify owner of channel %s of a new follow by %s.', actorFollow.ActorFollowing.VideoChannel.getDisplayName(), actorFollow.ActorFollower.Account.getDisplayName(), { err: err });
        });
    };
    Notifier.prototype.notifyOfNewInstanceFollow = function (actorFollow) {
        this.notifyAdminsOfNewInstanceFollow(actorFollow)["catch"](function (err) {
            logger_1.logger.error('Cannot notify administrators of new follower %s.', actorFollow.ActorFollower.url, { err: err });
        });
    };
    Notifier.prototype.notifySubscribersOfNewVideo = function (video) {
        return __awaiter(this, void 0, void 0, function () {
            function settingGetter(user) {
                return user.NotificationSetting.newVideoFromSubscription;
            }
            function notificationCreator(user) {
                return __awaiter(this, void 0, void 0, function () {
                    var notification;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, user_notification_1.UserNotificationModel.create({
                                    type: users_1.UserNotificationType.NEW_VIDEO_FROM_SUBSCRIPTION,
                                    userId: user.id,
                                    videoId: video.id
                                })];
                            case 1:
                                notification = _a.sent();
                                notification.Video = video;
                                return [2 /*return*/, notification];
                        }
                    });
                });
            }
            function emailSender(emails) {
                return emailer_1.Emailer.Instance.addNewVideoFromSubscriberNotification(emails, video);
            }
            var users;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, user_1.UserModel.listUserSubscribersOf(video.VideoChannel.actorId)];
                    case 1:
                        users = _a.sent();
                        logger_1.logger.info('Notifying %d users of new video %s.', users.length, video.url);
                        return [2 /*return*/, this.notify({ users: users, settingGetter: settingGetter, notificationCreator: notificationCreator, emailSender: emailSender })];
                }
            });
        });
    };
    Notifier.prototype.notifyVideoOwnerOfNewComment = function (comment) {
        return __awaiter(this, void 0, void 0, function () {
            function settingGetter(user) {
                return user.NotificationSetting.newCommentOnMyVideo;
            }
            function notificationCreator(user) {
                return __awaiter(this, void 0, void 0, function () {
                    var notification;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, user_notification_1.UserNotificationModel.create({
                                    type: users_1.UserNotificationType.NEW_COMMENT_ON_MY_VIDEO,
                                    userId: user.id,
                                    commentId: comment.id
                                })];
                            case 1:
                                notification = _a.sent();
                                notification.Comment = comment;
                                return [2 /*return*/, notification];
                        }
                    });
                });
            }
            function emailSender(emails) {
                return emailer_1.Emailer.Instance.addNewCommentOnMyVideoNotification(emails, comment);
            }
            var user, accountMuted;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (comment.Video.isOwned() === false)
                            return [2 /*return*/];
                        return [4 /*yield*/, user_1.UserModel.loadByVideoId(comment.videoId)
                            // Not our user or user comments its own video
                        ];
                    case 1:
                        user = _a.sent();
                        // Not our user or user comments its own video
                        if (!user || comment.Account.userId === user.id)
                            return [2 /*return*/];
                        return [4 /*yield*/, account_blocklist_1.AccountBlocklistModel.isAccountMutedBy(user.Account.id, comment.accountId)];
                    case 2:
                        accountMuted = _a.sent();
                        if (accountMuted)
                            return [2 /*return*/];
                        logger_1.logger.info('Notifying user %s of new comment %s.', user.username, comment.url);
                        return [2 /*return*/, this.notify({ users: [user], settingGetter: settingGetter, notificationCreator: notificationCreator, emailSender: emailSender })];
                }
            });
        });
    };
    Notifier.prototype.notifyOfCommentMention = function (comment) {
        return __awaiter(this, void 0, void 0, function () {
            function settingGetter(user) {
                if (accountMutedHash[user.Account.id] === true)
                    return users_1.UserNotificationSettingValue.NONE;
                return user.NotificationSetting.commentMention;
            }
            function notificationCreator(user) {
                return __awaiter(this, void 0, void 0, function () {
                    var notification;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, user_notification_1.UserNotificationModel.create({
                                    type: users_1.UserNotificationType.COMMENT_MENTION,
                                    userId: user.id,
                                    commentId: comment.id
                                })];
                            case 1:
                                notification = _a.sent();
                                notification.Comment = comment;
                                return [2 /*return*/, notification];
                        }
                    });
                });
            }
            function emailSender(emails) {
                return emailer_1.Emailer.Instance.addNewCommentMentionNotification(emails, comment);
            }
            var extractedUsernames, users, userException_1, accountMutedHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        extractedUsernames = comment.extractMentions();
                        logger_1.logger.debug('Extracted %d username from comment %s.', extractedUsernames.length, comment.url, { usernames: extractedUsernames, text: comment.text });
                        return [4 /*yield*/, user_1.UserModel.listByUsernames(extractedUsernames)];
                    case 1:
                        users = _a.sent();
                        if (!comment.Video.isOwned()) return [3 /*break*/, 3];
                        return [4 /*yield*/, user_1.UserModel.loadByVideoId(comment.videoId)];
                    case 2:
                        userException_1 = _a.sent();
                        users = users.filter(function (u) { return u.id !== userException_1.id; });
                        _a.label = 3;
                    case 3:
                        // Don't notify if I mentioned myself
                        users = users.filter(function (u) { return u.Account.id !== comment.accountId; });
                        if (users.length === 0)
                            return [2 /*return*/];
                        return [4 /*yield*/, account_blocklist_1.AccountBlocklistModel.isAccountMutedByMulti(users.map(function (u) { return u.Account.id; }), comment.accountId)];
                    case 4:
                        accountMutedHash = _a.sent();
                        logger_1.logger.info('Notifying %d users of new comment %s.', users.length, comment.url);
                        return [2 /*return*/, this.notify({ users: users, settingGetter: settingGetter, notificationCreator: notificationCreator, emailSender: emailSender })];
                }
            });
        });
    };
    Notifier.prototype.notifyUserOfNewActorFollow = function (actorFollow) {
        return __awaiter(this, void 0, void 0, function () {
            function settingGetter(user) {
                return user.NotificationSetting.newFollow;
            }
            function notificationCreator(user) {
                return __awaiter(this, void 0, void 0, function () {
                    var notification;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, user_notification_1.UserNotificationModel.create({
                                    type: users_1.UserNotificationType.NEW_FOLLOW,
                                    userId: user.id,
                                    actorFollowId: actorFollow.id
                                })];
                            case 1:
                                notification = _a.sent();
                                notification.ActorFollow = actorFollow;
                                return [2 /*return*/, notification];
                        }
                    });
                });
            }
            function emailSender(emails) {
                return emailer_1.Emailer.Instance.addNewFollowNotification(emails, actorFollow, followType);
            }
            var followType, user, _a, followerAccount, accountMuted;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (actorFollow.ActorFollowing.isOwned() === false)
                            return [2 /*return*/];
                        followType = 'channel';
                        return [4 /*yield*/, user_1.UserModel.loadByChannelActorId(actorFollow.ActorFollowing.id)
                            // Account follows one of our channel?
                        ];
                    case 1:
                        user = _b.sent();
                        if (!!user) return [3 /*break*/, 3];
                        return [4 /*yield*/, user_1.UserModel.loadByAccountActorId(actorFollow.ActorFollowing.id)];
                    case 2:
                        user = _b.sent();
                        followType = 'account';
                        _b.label = 3;
                    case 3:
                        if (!user)
                            return [2 /*return*/];
                        if (!(!actorFollow.ActorFollower.Account || !actorFollow.ActorFollower.Account.name)) return [3 /*break*/, 5];
                        _a = actorFollow.ActorFollower;
                        return [4 /*yield*/, actorFollow.ActorFollower.$get('Account')];
                    case 4:
                        _a.Account = (_b.sent());
                        _b.label = 5;
                    case 5:
                        followerAccount = actorFollow.ActorFollower.Account;
                        return [4 /*yield*/, account_blocklist_1.AccountBlocklistModel.isAccountMutedBy(user.Account.id, followerAccount.id)];
                    case 6:
                        accountMuted = _b.sent();
                        if (accountMuted)
                            return [2 /*return*/];
                        logger_1.logger.info('Notifying user %s of new follower: %s.', user.username, followerAccount.getDisplayName());
                        return [2 /*return*/, this.notify({ users: [user], settingGetter: settingGetter, notificationCreator: notificationCreator, emailSender: emailSender })];
                }
            });
        });
    };
    Notifier.prototype.notifyAdminsOfNewInstanceFollow = function (actorFollow) {
        return __awaiter(this, void 0, void 0, function () {
            function settingGetter(user) {
                return user.NotificationSetting.newInstanceFollower;
            }
            function notificationCreator(user) {
                return __awaiter(this, void 0, void 0, function () {
                    var notification;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, user_notification_1.UserNotificationModel.create({
                                    type: users_1.UserNotificationType.NEW_INSTANCE_FOLLOWER,
                                    userId: user.id,
                                    actorFollowId: actorFollow.id
                                })];
                            case 1:
                                notification = _a.sent();
                                notification.ActorFollow = actorFollow;
                                return [2 /*return*/, notification];
                        }
                    });
                });
            }
            function emailSender(emails) {
                return emailer_1.Emailer.Instance.addNewInstanceFollowerNotification(emails, actorFollow);
            }
            var admins;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, user_1.UserModel.listWithRight(users_1.UserRight.MANAGE_SERVER_FOLLOW)];
                    case 1:
                        admins = _a.sent();
                        logger_1.logger.info('Notifying %d administrators of new instance follower: %s.', admins.length, actorFollow.ActorFollower.url);
                        return [2 /*return*/, this.notify({ users: admins, settingGetter: settingGetter, notificationCreator: notificationCreator, emailSender: emailSender })];
                }
            });
        });
    };
    Notifier.prototype.notifyModeratorsOfNewVideoAbuse = function (videoAbuse) {
        return __awaiter(this, void 0, void 0, function () {
            function settingGetter(user) {
                return user.NotificationSetting.videoAbuseAsModerator;
            }
            function notificationCreator(user) {
                return __awaiter(this, void 0, void 0, function () {
                    var notification;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, user_notification_1.UserNotificationModel.create({
                                    type: users_1.UserNotificationType.NEW_VIDEO_ABUSE_FOR_MODERATORS,
                                    userId: user.id,
                                    videoAbuseId: videoAbuse.id
                                })];
                            case 1:
                                notification = _a.sent();
                                notification.VideoAbuse = videoAbuse;
                                return [2 /*return*/, notification];
                        }
                    });
                });
            }
            function emailSender(emails) {
                return emailer_1.Emailer.Instance.addVideoAbuseModeratorsNotification(emails, videoAbuse);
            }
            var moderators;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, user_1.UserModel.listWithRight(users_1.UserRight.MANAGE_VIDEO_ABUSES)];
                    case 1:
                        moderators = _a.sent();
                        if (moderators.length === 0)
                            return [2 /*return*/];
                        logger_1.logger.info('Notifying %s user/moderators of new video abuse %s.', moderators.length, videoAbuse.Video.url);
                        return [2 /*return*/, this.notify({ users: moderators, settingGetter: settingGetter, notificationCreator: notificationCreator, emailSender: emailSender })];
                }
            });
        });
    };
    Notifier.prototype.notifyModeratorsOfVideoAutoBlacklist = function (video) {
        return __awaiter(this, void 0, void 0, function () {
            function settingGetter(user) {
                return user.NotificationSetting.videoAutoBlacklistAsModerator;
            }
            function notificationCreator(user) {
                return __awaiter(this, void 0, void 0, function () {
                    var notification;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, user_notification_1.UserNotificationModel.create({
                                    type: users_1.UserNotificationType.VIDEO_AUTO_BLACKLIST_FOR_MODERATORS,
                                    userId: user.id,
                                    videoId: video.id
                                })];
                            case 1:
                                notification = _a.sent();
                                notification.Video = video;
                                return [2 /*return*/, notification];
                        }
                    });
                });
            }
            function emailSender(emails) {
                return emailer_1.Emailer.Instance.addVideoAutoBlacklistModeratorsNotification(emails, video);
            }
            var moderators;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, user_1.UserModel.listWithRight(users_1.UserRight.MANAGE_VIDEO_BLACKLIST)];
                    case 1:
                        moderators = _a.sent();
                        if (moderators.length === 0)
                            return [2 /*return*/];
                        logger_1.logger.info('Notifying %s moderators of video auto-blacklist %s.', moderators.length, video.url);
                        return [2 /*return*/, this.notify({ users: moderators, settingGetter: settingGetter, notificationCreator: notificationCreator, emailSender: emailSender })];
                }
            });
        });
    };
    Notifier.prototype.notifyVideoOwnerOfBlacklist = function (videoBlacklist) {
        return __awaiter(this, void 0, void 0, function () {
            function settingGetter(user) {
                return user.NotificationSetting.blacklistOnMyVideo;
            }
            function notificationCreator(user) {
                return __awaiter(this, void 0, void 0, function () {
                    var notification;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, user_notification_1.UserNotificationModel.create({
                                    type: users_1.UserNotificationType.BLACKLIST_ON_MY_VIDEO,
                                    userId: user.id,
                                    videoBlacklistId: videoBlacklist.id
                                })];
                            case 1:
                                notification = _a.sent();
                                notification.VideoBlacklist = videoBlacklist;
                                return [2 /*return*/, notification];
                        }
                    });
                });
            }
            function emailSender(emails) {
                return emailer_1.Emailer.Instance.addVideoBlacklistNotification(emails, videoBlacklist);
            }
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, user_1.UserModel.loadByVideoId(videoBlacklist.videoId)];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            return [2 /*return*/];
                        logger_1.logger.info('Notifying user %s that its video %s has been blacklisted.', user.username, videoBlacklist.Video.url);
                        return [2 /*return*/, this.notify({ users: [user], settingGetter: settingGetter, notificationCreator: notificationCreator, emailSender: emailSender })];
                }
            });
        });
    };
    Notifier.prototype.notifyVideoOwnerOfUnblacklist = function (video) {
        return __awaiter(this, void 0, void 0, function () {
            function settingGetter(user) {
                return user.NotificationSetting.blacklistOnMyVideo;
            }
            function notificationCreator(user) {
                return __awaiter(this, void 0, void 0, function () {
                    var notification;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, user_notification_1.UserNotificationModel.create({
                                    type: users_1.UserNotificationType.UNBLACKLIST_ON_MY_VIDEO,
                                    userId: user.id,
                                    videoId: video.id
                                })];
                            case 1:
                                notification = _a.sent();
                                notification.Video = video;
                                return [2 /*return*/, notification];
                        }
                    });
                });
            }
            function emailSender(emails) {
                return emailer_1.Emailer.Instance.addVideoUnblacklistNotification(emails, video);
            }
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, user_1.UserModel.loadByVideoId(video.id)];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            return [2 /*return*/];
                        logger_1.logger.info('Notifying user %s that its video %s has been unblacklisted.', user.username, video.url);
                        return [2 /*return*/, this.notify({ users: [user], settingGetter: settingGetter, notificationCreator: notificationCreator, emailSender: emailSender })];
                }
            });
        });
    };
    Notifier.prototype.notifyOwnedVideoHasBeenPublished = function (video) {
        return __awaiter(this, void 0, void 0, function () {
            function settingGetter(user) {
                return user.NotificationSetting.myVideoPublished;
            }
            function notificationCreator(user) {
                return __awaiter(this, void 0, void 0, function () {
                    var notification;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, user_notification_1.UserNotificationModel.create({
                                    type: users_1.UserNotificationType.MY_VIDEO_PUBLISHED,
                                    userId: user.id,
                                    videoId: video.id
                                })];
                            case 1:
                                notification = _a.sent();
                                notification.Video = video;
                                return [2 /*return*/, notification];
                        }
                    });
                });
            }
            function emailSender(emails) {
                return emailer_1.Emailer.Instance.myVideoPublishedNotification(emails, video);
            }
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, user_1.UserModel.loadByVideoId(video.id)];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            return [2 /*return*/];
                        logger_1.logger.info('Notifying user %s of the publication of its video %s.', user.username, video.url);
                        return [2 /*return*/, this.notify({ users: [user], settingGetter: settingGetter, notificationCreator: notificationCreator, emailSender: emailSender })];
                }
            });
        });
    };
    Notifier.prototype.notifyOwnerVideoImportIsFinished = function (videoImport, success) {
        return __awaiter(this, void 0, void 0, function () {
            function settingGetter(user) {
                return user.NotificationSetting.myVideoImportFinished;
            }
            function notificationCreator(user) {
                return __awaiter(this, void 0, void 0, function () {
                    var notification;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, user_notification_1.UserNotificationModel.create({
                                    type: success ? users_1.UserNotificationType.MY_VIDEO_IMPORT_SUCCESS : users_1.UserNotificationType.MY_VIDEO_IMPORT_ERROR,
                                    userId: user.id,
                                    videoImportId: videoImport.id
                                })];
                            case 1:
                                notification = _a.sent();
                                notification.VideoImport = videoImport;
                                return [2 /*return*/, notification];
                        }
                    });
                });
            }
            function emailSender(emails) {
                return success
                    ? emailer_1.Emailer.Instance.myVideoImportSuccessNotification(emails, videoImport)
                    : emailer_1.Emailer.Instance.myVideoImportErrorNotification(emails, videoImport);
            }
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, user_1.UserModel.loadByVideoImportId(videoImport.id)];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            return [2 /*return*/];
                        logger_1.logger.info('Notifying user %s its video import %s is finished.', user.username, videoImport.getTargetIdentifier());
                        return [2 /*return*/, this.notify({ users: [user], settingGetter: settingGetter, notificationCreator: notificationCreator, emailSender: emailSender })];
                }
            });
        });
    };
    Notifier.prototype.notifyModeratorsOfNewUserRegistration = function (registeredUser) {
        return __awaiter(this, void 0, void 0, function () {
            function settingGetter(user) {
                return user.NotificationSetting.newUserRegistration;
            }
            function notificationCreator(user) {
                return __awaiter(this, void 0, void 0, function () {
                    var notification;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, user_notification_1.UserNotificationModel.create({
                                    type: users_1.UserNotificationType.NEW_USER_REGISTRATION,
                                    userId: user.id,
                                    accountId: registeredUser.Account.id
                                })];
                            case 1:
                                notification = _a.sent();
                                notification.Account = registeredUser.Account;
                                return [2 /*return*/, notification];
                        }
                    });
                });
            }
            function emailSender(emails) {
                return emailer_1.Emailer.Instance.addNewUserRegistrationNotification(emails, registeredUser);
            }
            var moderators;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, user_1.UserModel.listWithRight(users_1.UserRight.MANAGE_USERS)];
                    case 1:
                        moderators = _a.sent();
                        if (moderators.length === 0)
                            return [2 /*return*/];
                        logger_1.logger.info('Notifying %s moderators of new user registration of %s.', moderators.length, registeredUser.Account.Actor.preferredUsername);
                        return [2 /*return*/, this.notify({ users: moderators, settingGetter: settingGetter, notificationCreator: notificationCreator, emailSender: emailSender })];
                }
            });
        });
    };
    Notifier.prototype.notify = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var emails, _i, _a, user, notification;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        emails = [];
                        _i = 0, _a = options.users;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        user = _a[_i];
                        if (!this.isWebNotificationEnabled(options.settingGetter(user))) return [3 /*break*/, 3];
                        return [4 /*yield*/, options.notificationCreator(user)];
                    case 2:
                        notification = _b.sent();
                        peertube_socket_1.PeerTubeSocket.Instance.sendNotification(user.id, notification);
                        _b.label = 3;
                    case 3:
                        if (this.isEmailEnabled(user, options.settingGetter(user))) {
                            emails.push(user.email);
                        }
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 1];
                    case 5:
                        if (!(emails.length !== 0)) return [3 /*break*/, 7];
                        return [4 /*yield*/, options.emailSender(emails)];
                    case 6:
                        _b.sent();
                        _b.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    Notifier.prototype.isEmailEnabled = function (user, value) {
        if (config_1.CONFIG.SIGNUP.REQUIRES_EMAIL_VERIFICATION === true && user.emailVerified === false)
            return false;
        return value & users_1.UserNotificationSettingValue.EMAIL;
    };
    Notifier.prototype.isWebNotificationEnabled = function (value) {
        return value & users_1.UserNotificationSettingValue.WEB;
    };
    Object.defineProperty(Notifier, "Instance", {
        get: function () {
            return this.instance || (this.instance = new this());
        },
        enumerable: true,
        configurable: true
    });
    return Notifier;
}());
exports.Notifier = Notifier;
