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
var uuidv4 = require("uuid/v4");
var constants_1 = require("../initializers/constants");
var account_1 = require("../models/account/account");
var activitypub_1 = require("./activitypub");
var video_channel_1 = require("./video-channel");
var actor_1 = require("../models/activitypub/actor");
var user_notification_setting_1 = require("../models/account/user-notification-setting");
var users_1 = require("../../shared/models/users");
var video_playlist_1 = require("./video-playlist");
var database_1 = require("../initializers/database");
var redis_1 = require("./redis");
var emailer_1 = require("./emailer");
function createUserAccountAndChannelAndPlaylist(parameters) {
    return __awaiter(this, void 0, void 0, function () {
        var userToCreate, userDisplayName, channelNames, _a, validateUser, _b, user, account, videoChannel, _c, accountKeys, channelKeys;
        var _this = this;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    userToCreate = parameters.userToCreate, userDisplayName = parameters.userDisplayName, channelNames = parameters.channelNames, _a = parameters.validateUser, validateUser = _a === void 0 ? true : _a;
                    return [4 /*yield*/, database_1.sequelizeTypescript.transaction(function (t) { return __awaiter(_this, void 0, void 0, function () {
                            var userOptions, userCreated, _a, accountCreated, channelAttributes, videoChannel, videoPlaylist;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        userOptions = {
                                            transaction: t,
                                            validate: validateUser
                                        };
                                        return [4 /*yield*/, userToCreate.save(userOptions)];
                                    case 1:
                                        userCreated = _b.sent();
                                        _a = userCreated;
                                        return [4 /*yield*/, createDefaultUserNotificationSettings(userCreated, t)];
                                    case 2:
                                        _a.NotificationSetting = _b.sent();
                                        return [4 /*yield*/, createLocalAccountWithoutKeys({
                                                name: userCreated.username,
                                                displayName: userDisplayName,
                                                userId: userCreated.id,
                                                applicationId: null,
                                                t: t
                                            })];
                                    case 3:
                                        accountCreated = _b.sent();
                                        userCreated.Account = accountCreated;
                                        return [4 /*yield*/, buildChannelAttributes(userCreated, channelNames)];
                                    case 4:
                                        channelAttributes = _b.sent();
                                        return [4 /*yield*/, video_channel_1.createVideoChannel(channelAttributes, accountCreated, t)];
                                    case 5:
                                        videoChannel = _b.sent();
                                        return [4 /*yield*/, video_playlist_1.createWatchLaterPlaylist(accountCreated, t)];
                                    case 6:
                                        videoPlaylist = _b.sent();
                                        return [2 /*return*/, { user: userCreated, account: accountCreated, videoChannel: videoChannel, videoPlaylist: videoPlaylist }];
                                }
                            });
                        }); })];
                case 1:
                    _b = _d.sent(), user = _b.user, account = _b.account, videoChannel = _b.videoChannel;
                    return [4 /*yield*/, Promise.all([
                            activitypub_1.setAsyncActorKeys(account.Actor),
                            activitypub_1.setAsyncActorKeys(videoChannel.Actor)
                        ])];
                case 2:
                    _c = _d.sent(), accountKeys = _c[0], channelKeys = _c[1];
                    account.Actor = accountKeys;
                    videoChannel.Actor = channelKeys;
                    return [2 /*return*/, { user: user, account: account, videoChannel: videoChannel }];
            }
        });
    });
}
exports.createUserAccountAndChannelAndPlaylist = createUserAccountAndChannelAndPlaylist;
function createLocalAccountWithoutKeys(parameters) {
    return __awaiter(this, void 0, void 0, function () {
        var name, displayName, userId, applicationId, t, _a, type, url, actorInstance, actorInstanceCreated, accountInstance, accountInstanceCreated;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    name = parameters.name, displayName = parameters.displayName, userId = parameters.userId, applicationId = parameters.applicationId, t = parameters.t, _a = parameters.type, type = _a === void 0 ? 'Person' : _a;
                    url = activitypub_1.getAccountActivityPubUrl(name);
                    actorInstance = activitypub_1.buildActorInstance(type, url, name);
                    return [4 /*yield*/, actorInstance.save({ transaction: t })];
                case 1:
                    actorInstanceCreated = _b.sent();
                    accountInstance = new account_1.AccountModel({
                        name: displayName || name,
                        userId: userId,
                        applicationId: applicationId,
                        actorId: actorInstanceCreated.id
                    });
                    return [4 /*yield*/, accountInstance.save({ transaction: t })];
                case 2:
                    accountInstanceCreated = _b.sent();
                    accountInstanceCreated.Actor = actorInstanceCreated;
                    return [2 /*return*/, accountInstanceCreated];
            }
        });
    });
}
exports.createLocalAccountWithoutKeys = createLocalAccountWithoutKeys;
function createApplicationActor(applicationId) {
    return __awaiter(this, void 0, void 0, function () {
        var accountCreated, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, createLocalAccountWithoutKeys({
                        name: constants_1.SERVER_ACTOR_NAME,
                        userId: null,
                        applicationId: applicationId,
                        t: undefined,
                        type: 'Application'
                    })];
                case 1:
                    accountCreated = _b.sent();
                    _a = accountCreated;
                    return [4 /*yield*/, activitypub_1.setAsyncActorKeys(accountCreated.Actor)];
                case 2:
                    _a.Actor = _b.sent();
                    return [2 /*return*/, accountCreated];
            }
        });
    });
}
exports.createApplicationActor = createApplicationActor;
function sendVerifyUserEmail(user, isPendingEmail) {
    if (isPendingEmail === void 0) { isPendingEmail = false; }
    return __awaiter(this, void 0, void 0, function () {
        var verificationString, url, email;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, redis_1.Redis.Instance.setVerifyEmailVerificationString(user.id)];
                case 1:
                    verificationString = _a.sent();
                    url = constants_1.WEBSERVER.URL + '/verify-account/email?userId=' + user.id + '&verificationString=' + verificationString;
                    if (isPendingEmail)
                        url += '&isPendingEmail=true';
                    email = isPendingEmail ? user.pendingEmail : user.email;
                    return [4 /*yield*/, emailer_1.Emailer.Instance.addVerifyEmailJob(email, url)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.sendVerifyUserEmail = sendVerifyUserEmail;
// ---------------------------------------------------------------------------
function createDefaultUserNotificationSettings(user, t) {
    var values = {
        userId: user.id,
        newVideoFromSubscription: users_1.UserNotificationSettingValue.WEB,
        newCommentOnMyVideo: users_1.UserNotificationSettingValue.WEB,
        myVideoImportFinished: users_1.UserNotificationSettingValue.WEB,
        myVideoPublished: users_1.UserNotificationSettingValue.WEB,
        videoAbuseAsModerator: users_1.UserNotificationSettingValue.WEB | users_1.UserNotificationSettingValue.EMAIL,
        videoAutoBlacklistAsModerator: users_1.UserNotificationSettingValue.WEB | users_1.UserNotificationSettingValue.EMAIL,
        blacklistOnMyVideo: users_1.UserNotificationSettingValue.WEB | users_1.UserNotificationSettingValue.EMAIL,
        newUserRegistration: users_1.UserNotificationSettingValue.WEB,
        commentMention: users_1.UserNotificationSettingValue.WEB,
        newFollow: users_1.UserNotificationSettingValue.WEB,
        newInstanceFollower: users_1.UserNotificationSettingValue.WEB
    };
    return user_notification_setting_1.UserNotificationSettingModel.create(values, { transaction: t });
}
function buildChannelAttributes(user, channelNames) {
    return __awaiter(this, void 0, void 0, function () {
        var channelName, actor, videoChannelDisplayName;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (channelNames)
                        return [2 /*return*/, channelNames];
                    channelName = user.username + '_channel';
                    return [4 /*yield*/, actor_1.ActorModel.loadLocalByName(channelName)];
                case 1:
                    actor = _a.sent();
                    if (actor)
                        channelName = uuidv4();
                    videoChannelDisplayName = "Main " + user.username + " channel";
                    return [2 /*return*/, {
                            name: channelName,
                            displayName: videoChannelDisplayName
                        }];
            }
        });
    });
}
