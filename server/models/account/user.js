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
var sequelize_1 = require("sequelize");
var sequelize_typescript_1 = require("sequelize-typescript");
var shared_1 = require("../../../shared");
var users_1 = require("../../helpers/custom-validators/users");
var peertube_crypto_1 = require("../../helpers/peertube-crypto");
var oauth_token_1 = require("../oauth/oauth-token");
var utils_1 = require("../utils");
var video_channel_1 = require("../video/video-channel");
var account_1 = require("./account");
var lodash_1 = require("lodash");
var constants_1 = require("../../initializers/constants");
var oauth_model_1 = require("../../lib/oauth-model");
var user_notification_setting_1 = require("./user-notification-setting");
var video_1 = require("../video/video");
var actor_1 = require("../activitypub/actor");
var actor_follow_1 = require("../activitypub/actor-follow");
var video_import_1 = require("../video/video-import");
var user_flag_model_1 = require("../../../shared/models/users/user-flag.model");
var plugins_1 = require("../../helpers/custom-validators/plugins");
var theme_utils_1 = require("../../lib/plugins/theme-utils");
var ScopeNames;
(function (ScopeNames) {
    ScopeNames["WITH_VIDEO_CHANNEL"] = "WITH_VIDEO_CHANNEL";
})(ScopeNames || (ScopeNames = {}));
var UserModel = /** @class */ (function (_super) {
    __extends(UserModel, _super);
    function UserModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UserModel_1 = UserModel;
    UserModel.cryptPasswordIfNeeded = function (instance) {
        if (instance.changed('password')) {
            return peertube_crypto_1.cryptPassword(instance.password)
                .then(function (hash) {
                instance.password = hash;
                return undefined;
            });
        }
    };
    UserModel.removeTokenCache = function (instance) {
        return oauth_model_1.clearCacheByUserId(instance.id);
    };
    UserModel.countTotal = function () {
        return this.count();
    };
    UserModel.listForApi = function (start, count, sort, search) {
        var _a, _b, _c;
        var where = undefined;
        if (search) {
            where = (_a = {},
                _a[sequelize_1.Op.or] = [
                    {
                        email: (_b = {},
                            _b[sequelize_1.Op.iLike] = '%' + search + '%',
                            _b)
                    },
                    {
                        username: (_c = {},
                            _c[sequelize_1.Op.iLike] = '%' + search + '%',
                            _c)
                    }
                ],
                _a);
        }
        var query = {
            attributes: {
                include: [
                    [
                        sequelize_1.literal('(' +
                            'SELECT COALESCE(SUM("size"), 0) ' +
                            'FROM (' +
                            'SELECT MAX("videoFile"."size") AS "size" FROM "videoFile" ' +
                            'INNER JOIN "video" ON "videoFile"."videoId" = "video"."id" ' +
                            'INNER JOIN "videoChannel" ON "videoChannel"."id" = "video"."channelId" ' +
                            'INNER JOIN "account" ON "videoChannel"."accountId" = "account"."id" ' +
                            'WHERE "account"."userId" = "UserModel"."id" GROUP BY "video"."id"' +
                            ') t' +
                            ')'),
                        'videoQuotaUsed'
                    ]
                ]
            },
            offset: start,
            limit: count,
            order: utils_1.getSort(sort),
            where: where
        };
        return UserModel_1.findAndCountAll(query)
            .then(function (_a) {
            var rows = _a.rows, count = _a.count;
            return {
                data: rows,
                total: count
            };
        });
    };
    UserModel.listWithRight = function (right) {
        var _a;
        var roles = Object.keys(shared_1.USER_ROLE_LABELS)
            .map(function (k) { return parseInt(k, 10); })
            .filter(function (role) { return shared_1.hasUserRight(role, right); });
        var query = {
            where: {
                role: (_a = {},
                    _a[sequelize_1.Op["in"]] = roles,
                    _a)
            }
        };
        return UserModel_1.findAll(query);
    };
    UserModel.listUserSubscribersOf = function (actorId) {
        var query = {
            include: [
                {
                    model: user_notification_setting_1.UserNotificationSettingModel.unscoped(),
                    required: true
                },
                {
                    attributes: ['userId'],
                    model: account_1.AccountModel.unscoped(),
                    required: true,
                    include: [
                        {
                            attributes: [],
                            model: actor_1.ActorModel.unscoped(),
                            required: true,
                            where: {
                                serverId: null
                            },
                            include: [
                                {
                                    attributes: [],
                                    as: 'ActorFollowings',
                                    model: actor_follow_1.ActorFollowModel.unscoped(),
                                    required: true,
                                    where: {
                                        targetActorId: actorId
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        };
        return UserModel_1.unscoped().findAll(query);
    };
    UserModel.listByUsernames = function (usernames) {
        var query = {
            where: {
                username: usernames
            }
        };
        return UserModel_1.findAll(query);
    };
    UserModel.loadById = function (id) {
        return UserModel_1.findByPk(id);
    };
    UserModel.loadByUsername = function (username) {
        var _a;
        var query = {
            where: {
                username: (_a = {}, _a[sequelize_1.Op.iLike] = username, _a)
            }
        };
        return UserModel_1.findOne(query);
    };
    UserModel.loadByUsernameAndPopulateChannels = function (username) {
        var _a;
        var query = {
            where: {
                username: (_a = {}, _a[sequelize_1.Op.iLike] = username, _a)
            }
        };
        return UserModel_1.scope(ScopeNames.WITH_VIDEO_CHANNEL).findOne(query);
    };
    UserModel.loadByEmail = function (email) {
        var query = {
            where: {
                email: email
            }
        };
        return UserModel_1.findOne(query);
    };
    UserModel.loadByUsernameOrEmail = function (username, email) {
        var _a, _b;
        if (!email)
            email = username;
        var query = {
            where: (_a = {},
                _a[sequelize_1.Op.or] = [{ username: (_b = {}, _b[sequelize_1.Op.iLike] = username, _b) }, { email: email }],
                _a)
        };
        return UserModel_1.findOne(query);
    };
    UserModel.loadByVideoId = function (videoId) {
        var query = {
            include: [
                {
                    required: true,
                    attributes: ['id'],
                    model: account_1.AccountModel.unscoped(),
                    include: [
                        {
                            required: true,
                            attributes: ['id'],
                            model: video_channel_1.VideoChannelModel.unscoped(),
                            include: [
                                {
                                    required: true,
                                    attributes: ['id'],
                                    model: video_1.VideoModel.unscoped(),
                                    where: {
                                        id: videoId
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        };
        return UserModel_1.findOne(query);
    };
    UserModel.loadByVideoImportId = function (videoImportId) {
        var query = {
            include: [
                {
                    required: true,
                    attributes: ['id'],
                    model: video_import_1.VideoImportModel.unscoped(),
                    where: {
                        id: videoImportId
                    }
                }
            ]
        };
        return UserModel_1.findOne(query);
    };
    UserModel.loadByChannelActorId = function (videoChannelActorId) {
        var query = {
            include: [
                {
                    required: true,
                    attributes: ['id'],
                    model: account_1.AccountModel.unscoped(),
                    include: [
                        {
                            required: true,
                            attributes: ['id'],
                            model: video_channel_1.VideoChannelModel.unscoped(),
                            where: {
                                actorId: videoChannelActorId
                            }
                        }
                    ]
                }
            ]
        };
        return UserModel_1.findOne(query);
    };
    UserModel.loadByAccountActorId = function (accountActorId) {
        var query = {
            include: [
                {
                    required: true,
                    attributes: ['id'],
                    model: account_1.AccountModel.unscoped(),
                    where: {
                        actorId: accountActorId
                    }
                }
            ]
        };
        return UserModel_1.findOne(query);
    };
    UserModel.getOriginalVideoFileTotalFromUser = function (user) {
        // Don't use sequelize because we need to use a sub query
        var query = UserModel_1.generateUserQuotaBaseSQL();
        return UserModel_1.getTotalRawQuery(query, user.id);
    };
    // Returns cumulative size of all video files uploaded in the last 24 hours.
    UserModel.getOriginalVideoFileTotalDailyFromUser = function (user) {
        // Don't use sequelize because we need to use a sub query
        var query = UserModel_1.generateUserQuotaBaseSQL('"video"."createdAt" > now() - interval \'24 hours\'');
        return UserModel_1.getTotalRawQuery(query, user.id);
    };
    UserModel.getStats = function () {
        return __awaiter(this, void 0, void 0, function () {
            var totalUsers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, UserModel_1.count()];
                    case 1:
                        totalUsers = _a.sent();
                        return [2 /*return*/, {
                                totalUsers: totalUsers
                            }];
                }
            });
        });
    };
    UserModel.autoComplete = function (search) {
        var _a;
        var query = {
            where: {
                username: (_a = {},
                    _a[sequelize_1.Op.like] = "%" + search + "%",
                    _a)
            },
            limit: 10
        };
        return UserModel_1.findAll(query)
            .then(function (u) { return u.map(function (u) { return u.username; }); });
    };
    UserModel.prototype.hasRight = function (right) {
        return shared_1.hasUserRight(this.role, right);
    };
    UserModel.prototype.hasAdminFlag = function (flag) {
        return this.adminFlags & flag;
    };
    UserModel.prototype.isPasswordMatch = function (password) {
        return peertube_crypto_1.comparePassword(password, this.password);
    };
    UserModel.prototype.toFormattedJSON = function (parameters) {
        if (parameters === void 0) { parameters = {}; }
        var videoQuotaUsed = this.get('videoQuotaUsed');
        var videoQuotaUsedDaily = this.get('videoQuotaUsedDaily');
        var json = {
            id: this.id,
            username: this.username,
            email: this.email,
            pendingEmail: this.pendingEmail,
            emailVerified: this.emailVerified,
            nsfwPolicy: this.nsfwPolicy,
            webTorrentEnabled: this.webTorrentEnabled,
            videosHistoryEnabled: this.videosHistoryEnabled,
            autoPlayVideo: this.autoPlayVideo,
            videoLanguages: this.videoLanguages,
            role: this.role,
            theme: theme_utils_1.getThemeOrDefault(this.theme, constants_1.DEFAULT_USER_THEME_NAME),
            roleLabel: shared_1.USER_ROLE_LABELS[this.role],
            videoQuota: this.videoQuota,
            videoQuotaDaily: this.videoQuotaDaily,
            createdAt: this.createdAt,
            blocked: this.blocked,
            blockedReason: this.blockedReason,
            account: this.Account.toFormattedJSON(),
            notificationSettings: this.NotificationSetting ? this.NotificationSetting.toFormattedJSON() : undefined,
            videoChannels: [],
            videoQuotaUsed: videoQuotaUsed !== undefined
                ? parseInt(videoQuotaUsed + '', 10)
                : undefined,
            videoQuotaUsedDaily: videoQuotaUsedDaily !== undefined
                ? parseInt(videoQuotaUsedDaily + '', 10)
                : undefined
        };
        if (parameters.withAdminFlags) {
            Object.assign(json, { adminFlags: this.adminFlags });
        }
        if (Array.isArray(this.Account.VideoChannels) === true) {
            json.videoChannels = this.Account.VideoChannels
                .map(function (c) { return c.toFormattedJSON(); })
                .sort(function (v1, v2) {
                if (v1.createdAt < v2.createdAt)
                    return -1;
                if (v1.createdAt === v2.createdAt)
                    return 0;
                return 1;
            });
        }
        return json;
    };
    UserModel.prototype.isAbleToUploadVideo = function (videoFile) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, totalBytes, totalBytesDaily, uploadedTotal, uploadedDaily;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.videoQuota === -1 && this.videoQuotaDaily === -1)
                            return [2 /*return*/, Promise.resolve(true)];
                        return [4 /*yield*/, Promise.all([
                                UserModel_1.getOriginalVideoFileTotalFromUser(this),
                                UserModel_1.getOriginalVideoFileTotalDailyFromUser(this)
                            ])];
                    case 1:
                        _a = _b.sent(), totalBytes = _a[0], totalBytesDaily = _a[1];
                        uploadedTotal = videoFile.size + totalBytes;
                        uploadedDaily = videoFile.size + totalBytesDaily;
                        if (this.videoQuotaDaily === -1)
                            return [2 /*return*/, uploadedTotal < this.videoQuota];
                        if (this.videoQuota === -1)
                            return [2 /*return*/, uploadedDaily < this.videoQuotaDaily];
                        return [2 /*return*/, uploadedTotal < this.videoQuota && uploadedDaily < this.videoQuotaDaily];
                }
            });
        });
    };
    UserModel.generateUserQuotaBaseSQL = function (where) {
        var andWhere = where ? 'AND ' + where : '';
        return 'SELECT SUM("size") AS "total" ' +
            'FROM (' +
            'SELECT MAX("videoFile"."size") AS "size" FROM "videoFile" ' +
            'INNER JOIN "video" ON "videoFile"."videoId" = "video"."id" ' +
            'INNER JOIN "videoChannel" ON "videoChannel"."id" = "video"."channelId" ' +
            'INNER JOIN "account" ON "videoChannel"."accountId" = "account"."id" ' +
            'WHERE "account"."userId" = $userId ' + andWhere +
            'GROUP BY "video"."id"' +
            ') t';
    };
    UserModel.getTotalRawQuery = function (query, userId) {
        var options = {
            bind: { userId: userId },
            type: sequelize_1.QueryTypes.SELECT
        };
        return UserModel_1.sequelize.query(query, options)
            .then(function (_a) {
            var total = _a[0].total;
            if (total === null)
                return 0;
            return parseInt(total, 10);
        });
    };
    var UserModel_1;
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Is('UserPassword', function (value) { return utils_1.throwIfNotValid(value, users_1.isUserPasswordValid, 'user password'); }),
        sequelize_typescript_1.Column
    ], UserModel.prototype, "password");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Is('UserPassword', function (value) { return utils_1.throwIfNotValid(value, users_1.isUserUsernameValid, 'user name'); }),
        sequelize_typescript_1.Column
    ], UserModel.prototype, "username");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.IsEmail,
        sequelize_typescript_1.Column(sequelize_typescript_1.DataType.STRING(400))
    ], UserModel.prototype, "email");
    __decorate([
        sequelize_typescript_1.AllowNull(true),
        sequelize_typescript_1.IsEmail,
        sequelize_typescript_1.Column(sequelize_typescript_1.DataType.STRING(400))
    ], UserModel.prototype, "pendingEmail");
    __decorate([
        sequelize_typescript_1.AllowNull(true),
        sequelize_typescript_1.Default(null),
        sequelize_typescript_1.Is('UserEmailVerified', function (value) { return utils_1.throwIfNotValid(value, users_1.isUserEmailVerifiedValid, 'email verified boolean', true); }),
        sequelize_typescript_1.Column
    ], UserModel.prototype, "emailVerified");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Is('UserNSFWPolicy', function (value) { return utils_1.throwIfNotValid(value, users_1.isUserNSFWPolicyValid, 'NSFW policy'); }),
        sequelize_typescript_1.Column(sequelize_typescript_1.DataType.ENUM.apply(sequelize_typescript_1.DataType, lodash_1.values(constants_1.NSFW_POLICY_TYPES)))
    ], UserModel.prototype, "nsfwPolicy");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Default(true),
        sequelize_typescript_1.Is('UserWebTorrentEnabled', function (value) { return utils_1.throwIfNotValid(value, users_1.isUserWebTorrentEnabledValid, 'WebTorrent enabled'); }),
        sequelize_typescript_1.Column
    ], UserModel.prototype, "webTorrentEnabled");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Default(true),
        sequelize_typescript_1.Is('UserVideosHistoryEnabled', function (value) { return utils_1.throwIfNotValid(value, users_1.isUserVideosHistoryEnabledValid, 'Videos history enabled'); }),
        sequelize_typescript_1.Column
    ], UserModel.prototype, "videosHistoryEnabled");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Default(true),
        sequelize_typescript_1.Is('UserAutoPlayVideo', function (value) { return utils_1.throwIfNotValid(value, users_1.isUserAutoPlayVideoValid, 'auto play video boolean'); }),
        sequelize_typescript_1.Column
    ], UserModel.prototype, "autoPlayVideo");
    __decorate([
        sequelize_typescript_1.AllowNull(true),
        sequelize_typescript_1.Default(null),
        sequelize_typescript_1.Is('UserVideoLanguages', function (value) { return utils_1.throwIfNotValid(value, users_1.isUserVideoLanguages, 'video languages'); }),
        sequelize_typescript_1.Column(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING))
    ], UserModel.prototype, "videoLanguages");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Default(user_flag_model_1.UserAdminFlag.NONE),
        sequelize_typescript_1.Is('UserAdminFlags', function (value) { return utils_1.throwIfNotValid(value, users_1.isUserAdminFlagsValid, 'user admin flags'); }),
        sequelize_typescript_1.Column
    ], UserModel.prototype, "adminFlags");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Default(false),
        sequelize_typescript_1.Is('UserBlocked', function (value) { return utils_1.throwIfNotValid(value, users_1.isUserBlockedValid, 'blocked boolean'); }),
        sequelize_typescript_1.Column
    ], UserModel.prototype, "blocked");
    __decorate([
        sequelize_typescript_1.AllowNull(true),
        sequelize_typescript_1.Default(null),
        sequelize_typescript_1.Is('UserBlockedReason', function (value) { return utils_1.throwIfNotValid(value, users_1.isUserBlockedReasonValid, 'blocked reason', true); }),
        sequelize_typescript_1.Column
    ], UserModel.prototype, "blockedReason");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Is('UserRole', function (value) { return utils_1.throwIfNotValid(value, users_1.isUserRoleValid, 'role'); }),
        sequelize_typescript_1.Column
    ], UserModel.prototype, "role");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Is('UserVideoQuota', function (value) { return utils_1.throwIfNotValid(value, users_1.isUserVideoQuotaValid, 'video quota'); }),
        sequelize_typescript_1.Column(sequelize_typescript_1.DataType.BIGINT)
    ], UserModel.prototype, "videoQuota");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Is('UserVideoQuotaDaily', function (value) { return utils_1.throwIfNotValid(value, users_1.isUserVideoQuotaDailyValid, 'video quota daily'); }),
        sequelize_typescript_1.Column(sequelize_typescript_1.DataType.BIGINT)
    ], UserModel.prototype, "videoQuotaDaily");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Default(constants_1.DEFAULT_THEME_NAME),
        sequelize_typescript_1.Is('UserTheme', function (value) { return utils_1.throwIfNotValid(value, plugins_1.isThemeNameValid, 'theme'); }),
        sequelize_typescript_1.Column
    ], UserModel.prototype, "theme");
    __decorate([
        sequelize_typescript_1.CreatedAt
    ], UserModel.prototype, "createdAt");
    __decorate([
        sequelize_typescript_1.UpdatedAt
    ], UserModel.prototype, "updatedAt");
    __decorate([
        sequelize_typescript_1.HasOne(function () { return account_1.AccountModel; }, {
            foreignKey: 'userId',
            onDelete: 'cascade',
            hooks: true
        })
    ], UserModel.prototype, "Account");
    __decorate([
        sequelize_typescript_1.HasOne(function () { return user_notification_setting_1.UserNotificationSettingModel; }, {
            foreignKey: 'userId',
            onDelete: 'cascade',
            hooks: true
        })
    ], UserModel.prototype, "NotificationSetting");
    __decorate([
        sequelize_typescript_1.HasMany(function () { return video_import_1.VideoImportModel; }, {
            foreignKey: 'userId',
            onDelete: 'cascade'
        })
    ], UserModel.prototype, "VideoImports");
    __decorate([
        sequelize_typescript_1.HasMany(function () { return oauth_token_1.OAuthTokenModel; }, {
            foreignKey: 'userId',
            onDelete: 'cascade'
        })
    ], UserModel.prototype, "OAuthTokens");
    __decorate([
        sequelize_typescript_1.BeforeCreate,
        sequelize_typescript_1.BeforeUpdate
    ], UserModel, "cryptPasswordIfNeeded");
    __decorate([
        sequelize_typescript_1.AfterUpdate,
        sequelize_typescript_1.AfterDestroy
    ], UserModel, "removeTokenCache");
    UserModel = UserModel_1 = __decorate([
        sequelize_typescript_1.DefaultScope(function () { return ({
            include: [
                {
                    model: account_1.AccountModel,
                    required: true
                },
                {
                    model: user_notification_setting_1.UserNotificationSettingModel,
                    required: true
                }
            ]
        }); }),
        sequelize_typescript_1.Scopes(function () {
            var _a;
            return (_a = {},
                _a[ScopeNames.WITH_VIDEO_CHANNEL] = {
                    include: [
                        {
                            model: account_1.AccountModel,
                            required: true,
                            include: [video_channel_1.VideoChannelModel]
                        },
                        {
                            model: user_notification_setting_1.UserNotificationSettingModel,
                            required: true
                        }
                    ]
                },
                _a);
        }),
        sequelize_typescript_1.Table({
            tableName: 'user',
            indexes: [
                {
                    fields: ['username'],
                    unique: true
                },
                {
                    fields: ['email'],
                    unique: true
                }
            ]
        })
    ], UserModel);
    return UserModel;
}(sequelize_typescript_1.Model));
exports.UserModel = UserModel;
