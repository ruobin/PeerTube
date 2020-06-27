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
var lodash_1 = require("lodash");
var path_1 = require("path");
var Sequelize = require("sequelize");
var sequelize_typescript_1 = require("sequelize-typescript");
var activitypub_1 = require("../../helpers/activitypub");
var actor_1 = require("../../helpers/custom-validators/activitypub/actor");
var misc_1 = require("../../helpers/custom-validators/activitypub/misc");
var constants_1 = require("../../initializers/constants");
var account_1 = require("../account/account");
var avatar_1 = require("../avatar/avatar");
var server_1 = require("../server/server");
var utils_1 = require("../utils");
var video_channel_1 = require("../video/video-channel");
var actor_follow_1 = require("./actor-follow");
var video_1 = require("../video/video");
var ScopeNames;
(function (ScopeNames) {
    ScopeNames["FULL"] = "FULL";
})(ScopeNames || (ScopeNames = {}));
exports.unusedActorAttributesForAPI = [
    'publicKey',
    'privateKey',
    'inboxUrl',
    'outboxUrl',
    'sharedInboxUrl',
    'followersUrl',
    'followingUrl',
    'url',
    'createdAt',
    'updatedAt'
];
var ActorModel = /** @class */ (function (_super) {
    __extends(ActorModel, _super);
    function ActorModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ActorModel_1 = ActorModel;
    ActorModel.load = function (id) {
        return ActorModel_1.unscoped().findByPk(id);
    };
    ActorModel.loadAccountActorByVideoId = function (videoId, transaction) {
        var query = {
            include: [
                {
                    attributes: ['id'],
                    model: account_1.AccountModel.unscoped(),
                    required: true,
                    include: [
                        {
                            attributes: ['id'],
                            model: video_channel_1.VideoChannelModel.unscoped(),
                            required: true,
                            include: [
                                {
                                    attributes: ['id'],
                                    model: video_1.VideoModel.unscoped(),
                                    required: true,
                                    where: {
                                        id: videoId
                                    }
                                }
                            ]
                        }
                    ]
                }
            ],
            transaction: transaction
        };
        return ActorModel_1.unscoped().findOne(query);
    };
    ActorModel.isActorUrlExist = function (url) {
        var query = {
            raw: true,
            where: {
                url: url
            }
        };
        return ActorModel_1.unscoped().findOne(query)
            .then(function (a) { return !!a; });
    };
    ActorModel.listByFollowersUrls = function (followersUrls, transaction) {
        var _a;
        var query = {
            where: {
                followersUrl: (_a = {},
                    _a[Sequelize.Op["in"]] = followersUrls,
                    _a)
            },
            transaction: transaction
        };
        return ActorModel_1.scope(ScopeNames.FULL).findAll(query);
    };
    ActorModel.loadLocalByName = function (preferredUsername, transaction) {
        var query = {
            where: {
                preferredUsername: preferredUsername,
                serverId: null
            },
            transaction: transaction
        };
        return ActorModel_1.scope(ScopeNames.FULL).findOne(query);
    };
    ActorModel.loadByNameAndHost = function (preferredUsername, host) {
        var query = {
            where: {
                preferredUsername: preferredUsername
            },
            include: [
                {
                    model: server_1.ServerModel,
                    required: true,
                    where: {
                        host: host
                    }
                }
            ]
        };
        return ActorModel_1.scope(ScopeNames.FULL).findOne(query);
    };
    ActorModel.loadByUrl = function (url, transaction) {
        var query = {
            where: {
                url: url
            },
            transaction: transaction,
            include: [
                {
                    attributes: ['id'],
                    model: account_1.AccountModel.unscoped(),
                    required: false
                },
                {
                    attributes: ['id'],
                    model: video_channel_1.VideoChannelModel.unscoped(),
                    required: false
                }
            ]
        };
        return ActorModel_1.unscoped().findOne(query);
    };
    ActorModel.loadByUrlAndPopulateAccountAndChannel = function (url, transaction) {
        var query = {
            where: {
                url: url
            },
            transaction: transaction
        };
        return ActorModel_1.scope(ScopeNames.FULL).findOne(query);
    };
    ActorModel.incrementFollows = function (id, column, by) {
        return ActorModel_1.increment(column, {
            by: by,
            where: {
                id: id
            }
        });
    };
    ActorModel.prototype.toFormattedJSON = function () {
        var avatar = null;
        if (this.Avatar) {
            avatar = this.Avatar.toFormattedJSON();
        }
        return {
            id: this.id,
            url: this.url,
            name: this.preferredUsername,
            host: this.getHost(),
            hostRedundancyAllowed: this.getRedundancyAllowed(),
            followingCount: this.followingCount,
            followersCount: this.followersCount,
            avatar: avatar,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    };
    ActorModel.prototype.toActivityPubObject = function (name, type) {
        var activityPubType;
        if (type === 'Account') {
            activityPubType = 'Person';
        }
        else if (type === 'Application') {
            activityPubType = 'Application';
        }
        else { // VideoChannel
            activityPubType = 'Group';
        }
        var icon = undefined;
        if (this.avatarId) {
            var extension = path_1.extname(this.Avatar.filename);
            icon = {
                type: 'Image',
                mediaType: extension === '.png' ? 'image/png' : 'image/jpeg',
                url: this.getAvatarUrl()
            };
        }
        var json = {
            type: activityPubType,
            id: this.url,
            following: this.getFollowingUrl(),
            followers: this.getFollowersUrl(),
            playlists: this.getPlaylistsUrl(),
            inbox: this.inboxUrl,
            outbox: this.outboxUrl,
            preferredUsername: this.preferredUsername,
            url: this.url,
            name: name,
            endpoints: {
                sharedInbox: this.sharedInboxUrl
            },
            publicKey: {
                id: this.getPublicKeyUrl(),
                owner: this.url,
                publicKeyPem: this.publicKey
            },
            icon: icon
        };
        return activitypub_1.activityPubContextify(json);
    };
    ActorModel.prototype.getFollowerSharedInboxUrls = function (t) {
        var query = {
            attributes: ['sharedInboxUrl'],
            include: [
                {
                    attribute: [],
                    model: actor_follow_1.ActorFollowModel.unscoped(),
                    required: true,
                    as: 'ActorFollowing',
                    where: {
                        state: 'accepted',
                        targetActorId: this.id
                    }
                }
            ],
            transaction: t
        };
        return ActorModel_1.findAll(query)
            .then(function (accounts) { return accounts.map(function (a) { return a.sharedInboxUrl; }); });
    };
    ActorModel.prototype.getFollowingUrl = function () {
        return this.url + '/following';
    };
    ActorModel.prototype.getFollowersUrl = function () {
        return this.url + '/followers';
    };
    ActorModel.prototype.getPlaylistsUrl = function () {
        return this.url + '/playlists';
    };
    ActorModel.prototype.getPublicKeyUrl = function () {
        return this.url + '#main-key';
    };
    ActorModel.prototype.isOwned = function () {
        return this.serverId === null;
    };
    ActorModel.prototype.getWebfingerUrl = function () {
        return 'acct:' + this.preferredUsername + '@' + this.getHost();
    };
    ActorModel.prototype.getIdentifier = function () {
        return this.Server ? this.preferredUsername + "@" + this.Server.host : this.preferredUsername;
    };
    ActorModel.prototype.getHost = function () {
        return this.Server ? this.Server.host : constants_1.WEBSERVER.HOST;
    };
    ActorModel.prototype.getRedundancyAllowed = function () {
        return this.Server ? this.Server.redundancyAllowed : false;
    };
    ActorModel.prototype.getAvatarUrl = function () {
        if (!this.avatarId)
            return undefined;
        return constants_1.WEBSERVER.URL + this.Avatar.getStaticPath();
    };
    ActorModel.prototype.isOutdated = function () {
        if (this.isOwned())
            return false;
        return utils_1.isOutdated(this, constants_1.ACTIVITY_PUB.ACTOR_REFRESH_INTERVAL);
    };
    var ActorModel_1;
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Column(sequelize_typescript_1.DataType.ENUM.apply(sequelize_typescript_1.DataType, lodash_1.values(constants_1.ACTIVITY_PUB_ACTOR_TYPES)))
    ], ActorModel.prototype, "type");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Is('ActorPreferredUsername', function (value) { return utils_1.throwIfNotValid(value, actor_1.isActorPreferredUsernameValid, 'actor preferred username'); }),
        sequelize_typescript_1.Column
    ], ActorModel.prototype, "preferredUsername");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Is('ActorUrl', function (value) { return utils_1.throwIfNotValid(value, misc_1.isActivityPubUrlValid, 'url'); }),
        sequelize_typescript_1.Column(sequelize_typescript_1.DataType.STRING(constants_1.CONSTRAINTS_FIELDS.ACTORS.URL.max))
    ], ActorModel.prototype, "url");
    __decorate([
        sequelize_typescript_1.AllowNull(true),
        sequelize_typescript_1.Is('ActorPublicKey', function (value) { return utils_1.throwIfNotValid(value, actor_1.isActorPublicKeyValid, 'public key', true); }),
        sequelize_typescript_1.Column(sequelize_typescript_1.DataType.STRING(constants_1.CONSTRAINTS_FIELDS.ACTORS.PUBLIC_KEY.max))
    ], ActorModel.prototype, "publicKey");
    __decorate([
        sequelize_typescript_1.AllowNull(true),
        sequelize_typescript_1.Is('ActorPublicKey', function (value) { return utils_1.throwIfNotValid(value, actor_1.isActorPrivateKeyValid, 'private key', true); }),
        sequelize_typescript_1.Column(sequelize_typescript_1.DataType.STRING(constants_1.CONSTRAINTS_FIELDS.ACTORS.PRIVATE_KEY.max))
    ], ActorModel.prototype, "privateKey");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Is('ActorFollowersCount', function (value) { return utils_1.throwIfNotValid(value, actor_1.isActorFollowersCountValid, 'followers count'); }),
        sequelize_typescript_1.Column
    ], ActorModel.prototype, "followersCount");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Is('ActorFollowersCount', function (value) { return utils_1.throwIfNotValid(value, actor_1.isActorFollowingCountValid, 'following count'); }),
        sequelize_typescript_1.Column
    ], ActorModel.prototype, "followingCount");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Is('ActorInboxUrl', function (value) { return utils_1.throwIfNotValid(value, misc_1.isActivityPubUrlValid, 'inbox url'); }),
        sequelize_typescript_1.Column(sequelize_typescript_1.DataType.STRING(constants_1.CONSTRAINTS_FIELDS.ACTORS.URL.max))
    ], ActorModel.prototype, "inboxUrl");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Is('ActorOutboxUrl', function (value) { return utils_1.throwIfNotValid(value, misc_1.isActivityPubUrlValid, 'outbox url'); }),
        sequelize_typescript_1.Column(sequelize_typescript_1.DataType.STRING(constants_1.CONSTRAINTS_FIELDS.ACTORS.URL.max))
    ], ActorModel.prototype, "outboxUrl");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Is('ActorSharedInboxUrl', function (value) { return utils_1.throwIfNotValid(value, misc_1.isActivityPubUrlValid, 'shared inbox url'); }),
        sequelize_typescript_1.Column(sequelize_typescript_1.DataType.STRING(constants_1.CONSTRAINTS_FIELDS.ACTORS.URL.max))
    ], ActorModel.prototype, "sharedInboxUrl");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Is('ActorFollowersUrl', function (value) { return utils_1.throwIfNotValid(value, misc_1.isActivityPubUrlValid, 'followers url'); }),
        sequelize_typescript_1.Column(sequelize_typescript_1.DataType.STRING(constants_1.CONSTRAINTS_FIELDS.ACTORS.URL.max))
    ], ActorModel.prototype, "followersUrl");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Is('ActorFollowingUrl', function (value) { return utils_1.throwIfNotValid(value, misc_1.isActivityPubUrlValid, 'following url'); }),
        sequelize_typescript_1.Column(sequelize_typescript_1.DataType.STRING(constants_1.CONSTRAINTS_FIELDS.ACTORS.URL.max))
    ], ActorModel.prototype, "followingUrl");
    __decorate([
        sequelize_typescript_1.CreatedAt
    ], ActorModel.prototype, "createdAt");
    __decorate([
        sequelize_typescript_1.UpdatedAt
    ], ActorModel.prototype, "updatedAt");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return avatar_1.AvatarModel; }),
        sequelize_typescript_1.Column
    ], ActorModel.prototype, "avatarId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return avatar_1.AvatarModel; }, {
            foreignKey: {
                allowNull: true
            },
            onDelete: 'set null',
            hooks: true
        })
    ], ActorModel.prototype, "Avatar");
    __decorate([
        sequelize_typescript_1.HasMany(function () { return actor_follow_1.ActorFollowModel; }, {
            foreignKey: {
                name: 'actorId',
                allowNull: false
            },
            as: 'ActorFollowings',
            onDelete: 'cascade'
        })
    ], ActorModel.prototype, "ActorFollowing");
    __decorate([
        sequelize_typescript_1.HasMany(function () { return actor_follow_1.ActorFollowModel; }, {
            foreignKey: {
                name: 'targetActorId',
                allowNull: false
            },
            as: 'ActorFollowers',
            onDelete: 'cascade'
        })
    ], ActorModel.prototype, "ActorFollowers");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return server_1.ServerModel; }),
        sequelize_typescript_1.Column
    ], ActorModel.prototype, "serverId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return server_1.ServerModel; }, {
            foreignKey: {
                allowNull: true
            },
            onDelete: 'cascade'
        })
    ], ActorModel.prototype, "Server");
    __decorate([
        sequelize_typescript_1.HasOne(function () { return account_1.AccountModel; }, {
            foreignKey: {
                allowNull: true
            },
            onDelete: 'cascade',
            hooks: true
        })
    ], ActorModel.prototype, "Account");
    __decorate([
        sequelize_typescript_1.HasOne(function () { return video_channel_1.VideoChannelModel; }, {
            foreignKey: {
                allowNull: true
            },
            onDelete: 'cascade',
            hooks: true
        })
    ], ActorModel.prototype, "VideoChannel");
    ActorModel = ActorModel_1 = __decorate([
        sequelize_typescript_1.DefaultScope(function () { return ({
            include: [
                {
                    model: server_1.ServerModel,
                    required: false
                },
                {
                    model: avatar_1.AvatarModel,
                    required: false
                }
            ]
        }); }),
        sequelize_typescript_1.Scopes(function () {
            var _a;
            return (_a = {},
                _a[ScopeNames.FULL] = {
                    include: [
                        {
                            model: account_1.AccountModel.unscoped(),
                            required: false
                        },
                        {
                            model: video_channel_1.VideoChannelModel.unscoped(),
                            required: false,
                            include: [
                                {
                                    model: account_1.AccountModel,
                                    required: true
                                }
                            ]
                        },
                        {
                            model: server_1.ServerModel,
                            required: false
                        },
                        {
                            model: avatar_1.AvatarModel,
                            required: false
                        }
                    ]
                },
                _a);
        }),
        sequelize_typescript_1.Table({
            tableName: 'actor',
            indexes: [
                {
                    fields: ['url'],
                    unique: true
                },
                {
                    fields: ['preferredUsername', 'serverId'],
                    unique: true
                },
                {
                    fields: ['inboxUrl', 'sharedInboxUrl']
                },
                {
                    fields: ['sharedInboxUrl']
                },
                {
                    fields: ['serverId']
                },
                {
                    fields: ['avatarId']
                },
                {
                    fields: ['followersUrl']
                }
            ]
        })
    ], ActorModel);
    return ActorModel;
}(sequelize_typescript_1.Model));
exports.ActorModel = ActorModel;
