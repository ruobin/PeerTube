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
var accounts_1 = require("../../helpers/custom-validators/accounts");
var send_1 = require("../../lib/activitypub/send");
var actor_1 = require("../activitypub/actor");
var application_1 = require("../application/application");
var server_1 = require("../server/server");
var utils_1 = require("../utils");
var video_channel_1 = require("../video/video-channel");
var video_comment_1 = require("../video/video-comment");
var user_1 = require("./user");
var avatar_1 = require("../avatar/avatar");
var video_playlist_1 = require("../video/video-playlist");
var constants_1 = require("../../initializers/constants");
var sequelize_1 = require("sequelize");
var account_blocklist_1 = require("./account-blocklist");
var server_blocklist_1 = require("../server/server-blocklist");
var actor_follow_1 = require("../activitypub/actor-follow");
var ScopeNames;
(function (ScopeNames) {
    ScopeNames["SUMMARY"] = "SUMMARY";
})(ScopeNames = exports.ScopeNames || (exports.ScopeNames = {}));
var AccountModel = /** @class */ (function (_super) {
    __extends(AccountModel, _super);
    function AccountModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AccountModel_1 = AccountModel;
    AccountModel.sendDeleteIfOwned = function (instance, options) {
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
                    case 2: return [4 /*yield*/, actor_follow_1.ActorFollowModel.removeFollowsOf(instance.Actor.id, options.transaction)];
                    case 3:
                        _b.sent();
                        if (instance.isOwned()) {
                            return [2 /*return*/, send_1.sendDeleteActor(instance.Actor, options.transaction)];
                        }
                        return [2 /*return*/, undefined];
                }
            });
        });
    };
    AccountModel.load = function (id, transaction) {
        return AccountModel_1.findByPk(id, { transaction: transaction });
    };
    AccountModel.loadByNameWithHost = function (nameWithHost) {
        var _a = nameWithHost.split('@'), accountName = _a[0], host = _a[1];
        if (!host || host === constants_1.WEBSERVER.HOST)
            return AccountModel_1.loadLocalByName(accountName);
        return AccountModel_1.loadByNameAndHost(accountName, host);
    };
    AccountModel.loadLocalByName = function (name) {
        var _a, _b, _c;
        var query = {
            where: (_a = {},
                _a[sequelize_1.Op.or] = [
                    {
                        userId: (_b = {},
                            _b[sequelize_1.Op.ne] = null,
                            _b)
                    },
                    {
                        applicationId: (_c = {},
                            _c[sequelize_1.Op.ne] = null,
                            _c)
                    }
                ],
                _a),
            include: [
                {
                    model: actor_1.ActorModel,
                    required: true,
                    where: {
                        preferredUsername: name
                    }
                }
            ]
        };
        return AccountModel_1.findOne(query);
    };
    AccountModel.loadByNameAndHost = function (name, host) {
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
                            where: {
                                host: host
                            }
                        }
                    ]
                }
            ]
        };
        return AccountModel_1.findOne(query);
    };
    AccountModel.loadByUrl = function (url, transaction) {
        var query = {
            include: [
                {
                    model: actor_1.ActorModel,
                    required: true,
                    where: {
                        url: url
                    }
                }
            ],
            transaction: transaction
        };
        return AccountModel_1.findOne(query);
    };
    AccountModel.listForApi = function (start, count, sort) {
        var query = {
            offset: start,
            limit: count,
            order: utils_1.getSort(sort)
        };
        return AccountModel_1.findAndCountAll(query)
            .then(function (_a) {
            var rows = _a.rows, count = _a.count;
            return {
                data: rows,
                total: count
            };
        });
    };
    AccountModel.listLocalsForSitemap = function (sort) {
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
        return AccountModel_1
            .unscoped()
            .findAll(query);
    };
    AccountModel.prototype.toFormattedJSON = function () {
        var actor = this.Actor.toFormattedJSON();
        var account = {
            id: this.id,
            displayName: this.getDisplayName(),
            description: this.description,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            userId: this.userId ? this.userId : undefined
        };
        return Object.assign(actor, account);
    };
    AccountModel.prototype.toFormattedSummaryJSON = function () {
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
    AccountModel.prototype.toActivityPubObject = function () {
        var obj = this.Actor.toActivityPubObject(this.name, 'Account');
        return Object.assign(obj, {
            summary: this.description
        });
    };
    AccountModel.prototype.isOwned = function () {
        return this.Actor.isOwned();
    };
    AccountModel.prototype.isOutdated = function () {
        return this.Actor.isOutdated();
    };
    AccountModel.prototype.getDisplayName = function () {
        return this.name;
    };
    AccountModel.prototype.isBlocked = function () {
        return this.BlockedAccounts && this.BlockedAccounts.length !== 0;
    };
    var AccountModel_1;
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Column
    ], AccountModel.prototype, "name");
    __decorate([
        sequelize_typescript_1.AllowNull(true),
        sequelize_typescript_1.Default(null),
        sequelize_typescript_1.Is('AccountDescription', function (value) { return utils_1.throwIfNotValid(value, accounts_1.isAccountDescriptionValid, 'description', true); }),
        sequelize_typescript_1.Column(sequelize_typescript_1.DataType.STRING(constants_1.CONSTRAINTS_FIELDS.USERS.DESCRIPTION.max))
    ], AccountModel.prototype, "description");
    __decorate([
        sequelize_typescript_1.CreatedAt
    ], AccountModel.prototype, "createdAt");
    __decorate([
        sequelize_typescript_1.UpdatedAt
    ], AccountModel.prototype, "updatedAt");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return actor_1.ActorModel; }),
        sequelize_typescript_1.Column
    ], AccountModel.prototype, "actorId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return actor_1.ActorModel; }, {
            foreignKey: {
                allowNull: false
            },
            onDelete: 'cascade'
        })
    ], AccountModel.prototype, "Actor");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return user_1.UserModel; }),
        sequelize_typescript_1.Column
    ], AccountModel.prototype, "userId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return user_1.UserModel; }, {
            foreignKey: {
                allowNull: true
            },
            onDelete: 'cascade'
        })
    ], AccountModel.prototype, "User");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return application_1.ApplicationModel; }),
        sequelize_typescript_1.Column
    ], AccountModel.prototype, "applicationId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return application_1.ApplicationModel; }, {
            foreignKey: {
                allowNull: true
            },
            onDelete: 'cascade'
        })
    ], AccountModel.prototype, "Application");
    __decorate([
        sequelize_typescript_1.HasMany(function () { return video_channel_1.VideoChannelModel; }, {
            foreignKey: {
                allowNull: false
            },
            onDelete: 'cascade',
            hooks: true
        })
    ], AccountModel.prototype, "VideoChannels");
    __decorate([
        sequelize_typescript_1.HasMany(function () { return video_playlist_1.VideoPlaylistModel; }, {
            foreignKey: {
                allowNull: false
            },
            onDelete: 'cascade',
            hooks: true
        })
    ], AccountModel.prototype, "VideoPlaylists");
    __decorate([
        sequelize_typescript_1.HasMany(function () { return video_comment_1.VideoCommentModel; }, {
            foreignKey: {
                allowNull: false
            },
            onDelete: 'cascade',
            hooks: true
        })
    ], AccountModel.prototype, "VideoComments");
    __decorate([
        sequelize_typescript_1.HasMany(function () { return account_blocklist_1.AccountBlocklistModel; }, {
            foreignKey: {
                name: 'targetAccountId',
                allowNull: false
            },
            as: 'BlockedAccounts',
            onDelete: 'CASCADE'
        })
    ], AccountModel.prototype, "BlockedAccounts");
    __decorate([
        sequelize_typescript_1.BeforeDestroy
    ], AccountModel, "sendDeleteIfOwned");
    AccountModel = AccountModel_1 = __decorate([
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
                    var _a, _b;
                    var whereActor = options.whereActor || undefined;
                    var serverInclude = {
                        attributes: ['host'],
                        model: server_1.ServerModel.unscoped(),
                        required: false
                    };
                    var query = {
                        attributes: ['id', 'name'],
                        include: [
                            {
                                attributes: ['id', 'preferredUsername', 'url', 'serverId', 'avatarId'],
                                model: actor_1.ActorModel.unscoped(),
                                required: true,
                                where: whereActor,
                                include: [
                                    serverInclude,
                                    {
                                        model: avatar_1.AvatarModel.unscoped(),
                                        required: false
                                    }
                                ]
                            }
                        ]
                    };
                    if (options.withAccountBlockerIds) {
                        query.include.push({
                            attributes: ['id'],
                            model: account_blocklist_1.AccountBlocklistModel.unscoped(),
                            as: 'BlockedAccounts',
                            required: false,
                            where: {
                                accountId: (_a = {},
                                    _a[sequelize_1.Op["in"]] = options.withAccountBlockerIds,
                                    _a)
                            }
                        });
                        serverInclude.include = [
                            {
                                attributes: ['id'],
                                model: server_blocklist_1.ServerBlocklistModel.unscoped(),
                                required: false,
                                where: {
                                    accountId: (_b = {},
                                        _b[sequelize_1.Op["in"]] = options.withAccountBlockerIds,
                                        _b)
                                }
                            }
                        ];
                    }
                    return query;
                },
                _a);
        }),
        sequelize_typescript_1.Table({
            tableName: 'account',
            indexes: [
                {
                    fields: ['actorId'],
                    unique: true
                },
                {
                    fields: ['applicationId']
                },
                {
                    fields: ['userId']
                }
            ]
        })
    ], AccountModel);
    return AccountModel;
}(sequelize_typescript_1.Model));
exports.AccountModel = AccountModel;
