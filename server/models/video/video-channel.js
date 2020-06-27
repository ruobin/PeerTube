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
var sequelize_typescript_1 = require("sequelize-typescript");
var video_channels_1 = require("../../helpers/custom-validators/video-channels");
var send_1 = require("../../lib/activitypub/send");
var account_1 = require("../account/account");
var actor_1 = require("../activitypub/actor");
var utils_1 = require("../utils");
var video_1 = require("./video");
var constants_1 = require("../../initializers/constants");
var server_1 = require("../server/server");
var sequelize_1 = require("sequelize");
var avatar_1 = require("../avatar/avatar");
var video_playlist_1 = require("./video-playlist");
// FIXME: Define indexes here because there is an issue with TS and Sequelize.literal when called directly in the annotation
var indexes = [
    utils_1.buildTrigramSearchIndex('video_channel_name_trigram', 'name'),
    {
        fields: ['accountId']
    },
    {
        fields: ['actorId']
    }
];
var ScopeNames;
(function (ScopeNames) {
    ScopeNames["AVAILABLE_FOR_LIST"] = "AVAILABLE_FOR_LIST";
    ScopeNames["WITH_ACCOUNT"] = "WITH_ACCOUNT";
    ScopeNames["WITH_ACTOR"] = "WITH_ACTOR";
    ScopeNames["WITH_VIDEOS"] = "WITH_VIDEOS";
    ScopeNames["SUMMARY"] = "SUMMARY";
})(ScopeNames = exports.ScopeNames || (exports.ScopeNames = {}));
var VideoChannelModel = /** @class */ (function (_super) {
    __extends(VideoChannelModel, _super);
    function VideoChannelModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    VideoChannelModel_1 = VideoChannelModel;
    VideoChannelModel.sendDeleteIfOwned = function (instance, options) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!instance.Actor) return [3 /*break*/, 2];
                        _a = instance;
                        return [4 /*yield*/, instance.$get('Actor', { transaction: options.transaction })];
                    case 1:
                        _a.Actor = (_b.sent());
                        _b.label = 2;
                    case 2:
                        if (instance.Actor.isOwned()) {
                            return [2 /*return*/, send_1.sendDeleteActor(instance.Actor, options.transaction)];
                        }
                        return [2 /*return*/, undefined];
                }
            });
        });
    };
    VideoChannelModel.countByAccount = function (accountId) {
        var query = {
            where: {
                accountId: accountId
            }
        };
        return VideoChannelModel_1.count(query);
    };
    VideoChannelModel.listForApi = function (actorId, start, count, sort) {
        var query = {
            offset: start,
            limit: count,
            order: utils_1.getSort(sort)
        };
        var scopes = {
            method: [ScopeNames.AVAILABLE_FOR_LIST, { actorId: actorId }]
        };
        return VideoChannelModel_1
            .scope(scopes)
            .findAndCountAll(query)
            .then(function (_a) {
            var rows = _a.rows, count = _a.count;
            return { total: count, data: rows };
        });
    };
    VideoChannelModel.listLocalsForSitemap = function (sort) {
        var query = {
            attributes: [],
            offset: 0,
            order: utils_1.getSort(sort),
            include: [
                {
                    attributes: ['preferredUsername', 'serverId'],
                    model: actor_1.ActorModel.unscoped(),
                    where: {
                        serverId: null
                    }
                }
            ]
        };
        return VideoChannelModel_1
            .unscoped()
            .findAll(query);
    };
    VideoChannelModel.searchForApi = function (options) {
        var _a;
        var attributesInclude = [];
        var escapedSearch = video_1.VideoModel.sequelize.escape(options.search);
        var escapedLikeSearch = video_1.VideoModel.sequelize.escape('%' + options.search + '%');
        attributesInclude.push(utils_1.createSimilarityAttribute('VideoChannelModel.name', options.search));
        var query = {
            attributes: {
                include: attributesInclude
            },
            offset: options.start,
            limit: options.count,
            order: utils_1.getSort(options.sort),
            where: (_a = {},
                _a[sequelize_1.Op.or] = [
                    sequelize_typescript_1.Sequelize.literal('lower(immutable_unaccent("VideoChannelModel"."name")) % lower(immutable_unaccent(' + escapedSearch + '))'),
                    sequelize_typescript_1.Sequelize.literal('lower(immutable_unaccent("VideoChannelModel"."name")) LIKE lower(immutable_unaccent(' + escapedLikeSearch + '))')
                ],
                _a)
        };
        var scopes = {
            method: [ScopeNames.AVAILABLE_FOR_LIST, { actorId: options.actorId }]
        };
        return VideoChannelModel_1
            .scope(scopes)
            .findAndCountAll(query)
            .then(function (_a) {
            var rows = _a.rows, count = _a.count;
            return { total: count, data: rows };
        });
    };
    VideoChannelModel.listByAccount = function (options) {
        var query = {
            offset: options.start,
            limit: options.count,
            order: utils_1.getSort(options.sort),
            include: [
                {
                    model: account_1.AccountModel,
                    where: {
                        id: options.accountId
                    },
                    required: true
                }
            ]
        };
        return VideoChannelModel_1
            .findAndCountAll(query)
            .then(function (_a) {
            var rows = _a.rows, count = _a.count;
            return { total: count, data: rows };
        });
    };
    VideoChannelModel.loadByIdAndPopulateAccount = function (id) {
        return VideoChannelModel_1.unscoped()
            .scope([ScopeNames.WITH_ACTOR, ScopeNames.WITH_ACCOUNT])
            .findByPk(id);
    };
    VideoChannelModel.loadByIdAndAccount = function (id, accountId) {
        var query = {
            where: {
                id: id,
                accountId: accountId
            }
        };
        return VideoChannelModel_1.unscoped()
            .scope([ScopeNames.WITH_ACTOR, ScopeNames.WITH_ACCOUNT])
            .findOne(query);
    };
    VideoChannelModel.loadAndPopulateAccount = function (id) {
        return VideoChannelModel_1.unscoped()
            .scope([ScopeNames.WITH_ACTOR, ScopeNames.WITH_ACCOUNT])
            .findByPk(id);
    };
    VideoChannelModel.loadByUrlAndPopulateAccount = function (url) {
        var query = {
            include: [
                {
                    model: actor_1.ActorModel,
                    required: true,
                    where: {
                        url: url
                    }
                }
            ]
        };
        return VideoChannelModel_1
            .scope([ScopeNames.WITH_ACCOUNT])
            .findOne(query);
    };
    VideoChannelModel.loadByNameWithHostAndPopulateAccount = function (nameWithHost) {
        var _a = nameWithHost.split('@'), name = _a[0], host = _a[1];
        if (!host || host === constants_1.WEBSERVER.HOST)
            return VideoChannelModel_1.loadLocalByNameAndPopulateAccount(name);
        return VideoChannelModel_1.loadByNameAndHostAndPopulateAccount(name, host);
    };
    VideoChannelModel.loadLocalByNameAndPopulateAccount = function (name) {
        var query = {
            include: [
                {
                    model: actor_1.ActorModel,
                    required: true,
                    where: {
                        preferredUsername: name,
                        serverId: null
                    }
                }
            ]
        };
        return VideoChannelModel_1.unscoped()
            .scope([ScopeNames.WITH_ACTOR, ScopeNames.WITH_ACCOUNT])
            .findOne(query);
    };
    VideoChannelModel.loadByNameAndHostAndPopulateAccount = function (name, host) {
        var query = {
            include: [
                {
                    model: actor_1.ActorModel,
                    required: true,
                    where: {
                        preferredUsername: name
                    },
                    include: [
                        {
                            model: server_1.ServerModel,
                            required: true,
                            where: { host: host }
                        }
                    ]
                }
            ]
        };
        return VideoChannelModel_1.unscoped()
            .scope([ScopeNames.WITH_ACTOR, ScopeNames.WITH_ACCOUNT])
            .findOne(query);
    };
    VideoChannelModel.loadAndPopulateAccountAndVideos = function (id) {
        var options = {
            include: [
                video_1.VideoModel
            ]
        };
        return VideoChannelModel_1.unscoped()
            .scope([ScopeNames.WITH_ACTOR, ScopeNames.WITH_ACCOUNT, ScopeNames.WITH_VIDEOS])
            .findByPk(id, options);
    };
    VideoChannelModel.prototype.toFormattedJSON = function () {
        var actor = this.Actor.toFormattedJSON();
        var videoChannel = {
            id: this.id,
            displayName: this.getDisplayName(),
            description: this.description,
            support: this.support,
            isLocal: this.Actor.isOwned(),
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            ownerAccount: undefined
        };
        if (this.Account)
            videoChannel.ownerAccount = this.Account.toFormattedJSON();
        return Object.assign(actor, videoChannel);
    };
    VideoChannelModel.prototype.toFormattedSummaryJSON = function () {
        var actor = this.Actor.toFormattedJSON();
        return {
            id: this.id,
            name: actor.name,
            displayName: this.getDisplayName(),
            url: actor.url,
            host: actor.host,
            avatar: actor.avatar
        };
    };
    VideoChannelModel.prototype.toActivityPubObject = function () {
        var obj = this.Actor.toActivityPubObject(this.name, 'VideoChannel');
        return Object.assign(obj, {
            summary: this.description,
            support: this.support,
            attributedTo: [
                {
                    type: 'Person',
                    id: this.Account.Actor.url
                }
            ]
        });
    };
    VideoChannelModel.prototype.getDisplayName = function () {
        return this.name;
    };
    VideoChannelModel.prototype.isOutdated = function () {
        return this.Actor.isOutdated();
    };
    var VideoChannelModel_1;
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Is('VideoChannelName', function (value) { return utils_1.throwIfNotValid(value, video_channels_1.isVideoChannelNameValid, 'name'); }),
        sequelize_typescript_1.Column
    ], VideoChannelModel.prototype, "name");
    __decorate([
        sequelize_typescript_1.AllowNull(true),
        sequelize_typescript_1.Default(null),
        sequelize_typescript_1.Is('VideoChannelDescription', function (value) { return utils_1.throwIfNotValid(value, video_channels_1.isVideoChannelDescriptionValid, 'description', true); }),
        sequelize_typescript_1.Column(sequelize_typescript_1.DataType.STRING(constants_1.CONSTRAINTS_FIELDS.VIDEO_CHANNELS.DESCRIPTION.max))
    ], VideoChannelModel.prototype, "description");
    __decorate([
        sequelize_typescript_1.AllowNull(true),
        sequelize_typescript_1.Default(null),
        sequelize_typescript_1.Is('VideoChannelSupport', function (value) { return utils_1.throwIfNotValid(value, video_channels_1.isVideoChannelSupportValid, 'support', true); }),
        sequelize_typescript_1.Column(sequelize_typescript_1.DataType.STRING(constants_1.CONSTRAINTS_FIELDS.VIDEO_CHANNELS.SUPPORT.max))
    ], VideoChannelModel.prototype, "support");
    __decorate([
        sequelize_typescript_1.CreatedAt
    ], VideoChannelModel.prototype, "createdAt");
    __decorate([
        sequelize_typescript_1.UpdatedAt
    ], VideoChannelModel.prototype, "updatedAt");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return actor_1.ActorModel; }),
        sequelize_typescript_1.Column
    ], VideoChannelModel.prototype, "actorId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return actor_1.ActorModel; }, {
            foreignKey: {
                allowNull: false
            },
            onDelete: 'cascade'
        })
    ], VideoChannelModel.prototype, "Actor");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return account_1.AccountModel; }),
        sequelize_typescript_1.Column
    ], VideoChannelModel.prototype, "accountId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return account_1.AccountModel; }, {
            foreignKey: {
                allowNull: false
            },
            hooks: true
        })
    ], VideoChannelModel.prototype, "Account");
    __decorate([
        sequelize_typescript_1.HasMany(function () { return video_1.VideoModel; }, {
            foreignKey: {
                name: 'channelId',
                allowNull: false
            },
            onDelete: 'CASCADE',
            hooks: true
        })
    ], VideoChannelModel.prototype, "Videos");
    __decorate([
        sequelize_typescript_1.HasMany(function () { return video_playlist_1.VideoPlaylistModel; }, {
            foreignKey: {
                allowNull: true
            },
            onDelete: 'CASCADE',
            hooks: true
        })
    ], VideoChannelModel.prototype, "VideoPlaylists");
    __decorate([
        sequelize_typescript_1.BeforeDestroy
    ], VideoChannelModel, "sendDeleteIfOwned");
    VideoChannelModel = VideoChannelModel_1 = __decorate([
        sequelize_typescript_1.DefaultScope(function () { return ({
            include: [
                {
                    model: actor_1.ActorModel,
                    required: true
                }
            ]
        }); }),
        sequelize_typescript_1.Scopes(function () {
            var _a;
            return (_a = {},
                _a[ScopeNames.SUMMARY] = function (options) {
                    if (options === void 0) { options = {}; }
                    var base = {
                        attributes: ['name', 'description', 'id', 'actorId'],
                        include: [
                            {
                                attributes: ['preferredUsername', 'url', 'serverId', 'avatarId'],
                                model: actor_1.ActorModel.unscoped(),
                                required: true,
                                include: [
                                    {
                                        attributes: ['host'],
                                        model: server_1.ServerModel.unscoped(),
                                        required: false
                                    },
                                    {
                                        model: avatar_1.AvatarModel.unscoped(),
                                        required: false
                                    }
                                ]
                            }
                        ]
                    };
                    if (options.withAccount === true) {
                        base.include.push({
                            model: account_1.AccountModel.scope({
                                method: [account_1.ScopeNames.SUMMARY, { withAccountBlockerIds: options.withAccountBlockerIds }]
                            }),
                            required: true
                        });
                    }
                    return base;
                },
                _a[ScopeNames.AVAILABLE_FOR_LIST] = function (options) {
                    var _a, _b;
                    // Only list local channels OR channels that are on an instance followed by actorId
                    var inQueryInstanceFollow = utils_1.buildServerIdsFollowedBy(options.actorId);
                    return {
                        include: [
                            {
                                attributes: {
                                    exclude: actor_1.unusedActorAttributesForAPI
                                },
                                model: actor_1.ActorModel,
                                where: (_a = {},
                                    _a[sequelize_1.Op.or] = [
                                        {
                                            serverId: null
                                        },
                                        {
                                            serverId: (_b = {},
                                                _b[sequelize_1.Op["in"]] = sequelize_typescript_1.Sequelize.literal(inQueryInstanceFollow),
                                                _b)
                                        }
                                    ],
                                    _a)
                            },
                            {
                                model: account_1.AccountModel,
                                required: true,
                                include: [
                                    {
                                        attributes: {
                                            exclude: actor_1.unusedActorAttributesForAPI
                                        },
                                        model: actor_1.ActorModel,
                                        required: true
                                    }
                                ]
                            }
                        ]
                    };
                },
                _a[ScopeNames.WITH_ACCOUNT] = {
                    include: [
                        {
                            model: account_1.AccountModel,
                            required: true
                        }
                    ]
                },
                _a[ScopeNames.WITH_VIDEOS] = {
                    include: [
                        video_1.VideoModel
                    ]
                },
                _a[ScopeNames.WITH_ACTOR] = {
                    include: [
                        actor_1.ActorModel
                    ]
                },
                _a);
        }),
        sequelize_typescript_1.Table({
            tableName: 'videoChannel',
            indexes: indexes
        })
    ], VideoChannelModel);
    return VideoChannelModel;
}(sequelize_typescript_1.Model));
exports.VideoChannelModel = VideoChannelModel;
