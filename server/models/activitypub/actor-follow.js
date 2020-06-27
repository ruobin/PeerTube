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
var lodash_1 = require("lodash");
var sequelize_typescript_1 = require("sequelize-typescript");
var logger_1 = require("../../helpers/logger");
var utils_1 = require("../../helpers/utils");
var constants_1 = require("../../initializers/constants");
var server_1 = require("../server/server");
var utils_2 = require("../utils");
var actor_1 = require("./actor");
var video_channel_1 = require("../video/video-channel");
var account_1 = require("../account/account");
var sequelize_1 = require("sequelize");
var ActorFollowModel = /** @class */ (function (_super) {
    __extends(ActorFollowModel, _super);
    function ActorFollowModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ActorFollowModel_1 = ActorFollowModel;
    ActorFollowModel.incrementFollowerAndFollowingCount = function (instance) {
        if (instance.state !== 'accepted')
            return undefined;
        return Promise.all([
            actor_1.ActorModel.incrementFollows(instance.actorId, 'followingCount', 1),
            actor_1.ActorModel.incrementFollows(instance.targetActorId, 'followersCount', 1)
        ]);
    };
    ActorFollowModel.decrementFollowerAndFollowingCount = function (instance) {
        return Promise.all([
            actor_1.ActorModel.incrementFollows(instance.actorId, 'followingCount', -1),
            actor_1.ActorModel.incrementFollows(instance.targetActorId, 'followersCount', -1)
        ]);
    };
    ActorFollowModel.removeFollowsOf = function (actorId, t) {
        var _a;
        var query = {
            where: (_a = {},
                _a[sequelize_1.Op.or] = [
                    {
                        actorId: actorId
                    },
                    {
                        targetActorId: actorId
                    }
                ],
                _a),
            transaction: t
        };
        return ActorFollowModel_1.destroy(query);
    };
    // Remove actor follows with a score of 0 (too many requests where they were unreachable)
    ActorFollowModel.removeBadActorFollows = function () {
        return __awaiter(this, void 0, void 0, function () {
            var actorFollows, actorFollowsRemovePromises, numberOfActorFollowsRemoved;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ActorFollowModel_1.listBadActorFollows()];
                    case 1:
                        actorFollows = _a.sent();
                        actorFollowsRemovePromises = actorFollows.map(function (actorFollow) { return actorFollow.destroy(); });
                        return [4 /*yield*/, Promise.all(actorFollowsRemovePromises)];
                    case 2:
                        _a.sent();
                        numberOfActorFollowsRemoved = actorFollows.length;
                        if (numberOfActorFollowsRemoved)
                            logger_1.logger.info('Removed bad %d actor follows.', numberOfActorFollowsRemoved);
                        return [2 /*return*/];
                }
            });
        });
    };
    ActorFollowModel.loadByActorAndTarget = function (actorId, targetActorId, t) {
        var query = {
            where: {
                actorId: actorId,
                targetActorId: targetActorId
            },
            include: [
                {
                    model: actor_1.ActorModel,
                    required: true,
                    as: 'ActorFollower'
                },
                {
                    model: actor_1.ActorModel,
                    required: true,
                    as: 'ActorFollowing'
                }
            ],
            transaction: t
        };
        return ActorFollowModel_1.findOne(query);
    };
    ActorFollowModel.loadByActorAndTargetNameAndHostForAPI = function (actorId, targetName, targetHost, t) {
        var actorFollowingPartInclude = {
            model: actor_1.ActorModel,
            required: true,
            as: 'ActorFollowing',
            where: {
                preferredUsername: targetName
            },
            include: [
                {
                    model: video_channel_1.VideoChannelModel.unscoped(),
                    required: false
                }
            ]
        };
        if (targetHost === null) {
            actorFollowingPartInclude.where['serverId'] = null;
        }
        else {
            actorFollowingPartInclude.include.push({
                model: server_1.ServerModel,
                required: true,
                where: {
                    host: targetHost
                }
            });
        }
        var query = {
            where: {
                actorId: actorId
            },
            include: [
                actorFollowingPartInclude,
                {
                    model: actor_1.ActorModel,
                    required: true,
                    as: 'ActorFollower'
                }
            ],
            transaction: t
        };
        return ActorFollowModel_1.findOne(query)
            .then(function (result) {
            if (result && result.ActorFollowing.VideoChannel) {
                result.ActorFollowing.VideoChannel.Actor = result.ActorFollowing;
            }
            return result;
        });
    };
    ActorFollowModel.listSubscribedIn = function (actorId, targets) {
        var _a, _b;
        var whereTab = targets
            .map(function (t) {
            var _a, _b;
            if (t.host) {
                return _a = {},
                    _a[sequelize_1.Op.and] = [
                        {
                            '$preferredUsername$': t.name
                        },
                        {
                            '$host$': t.host
                        }
                    ],
                    _a;
            }
            return _b = {},
                _b[sequelize_1.Op.and] = [
                    {
                        '$preferredUsername$': t.name
                    },
                    {
                        '$serverId$': null
                    }
                ],
                _b;
        });
        var query = {
            attributes: [],
            where: (_a = {},
                _a[sequelize_1.Op.and] = [
                    (_b = {},
                        _b[sequelize_1.Op.or] = whereTab,
                        _b),
                    {
                        actorId: actorId
                    }
                ],
                _a),
            include: [
                {
                    attributes: ['preferredUsername'],
                    model: actor_1.ActorModel.unscoped(),
                    required: true,
                    as: 'ActorFollowing',
                    include: [
                        {
                            attributes: ['host'],
                            model: server_1.ServerModel.unscoped(),
                            required: false
                        }
                    ]
                }
            ]
        };
        return ActorFollowModel_1.findAll(query);
    };
    ActorFollowModel.listFollowingForApi = function (id, start, count, sort, search) {
        var _a;
        var query = {
            distinct: true,
            offset: start,
            limit: count,
            order: utils_2.getSort(sort),
            include: [
                {
                    model: actor_1.ActorModel,
                    required: true,
                    as: 'ActorFollower',
                    where: {
                        id: id
                    }
                },
                {
                    model: actor_1.ActorModel,
                    as: 'ActorFollowing',
                    required: true,
                    include: [
                        {
                            model: server_1.ServerModel,
                            required: true,
                            where: search ? {
                                host: (_a = {},
                                    _a[sequelize_1.Op.iLike] = '%' + search + '%',
                                    _a)
                            } : undefined
                        }
                    ]
                }
            ]
        };
        return ActorFollowModel_1.findAndCountAll(query)
            .then(function (_a) {
            var rows = _a.rows, count = _a.count;
            return {
                data: rows,
                total: count
            };
        });
    };
    ActorFollowModel.listFollowersForApi = function (actorId, start, count, sort, search) {
        var _a;
        var query = {
            distinct: true,
            offset: start,
            limit: count,
            order: utils_2.getSort(sort),
            include: [
                {
                    model: actor_1.ActorModel,
                    required: true,
                    as: 'ActorFollower',
                    include: [
                        {
                            model: server_1.ServerModel,
                            required: true,
                            where: search ? {
                                host: (_a = {},
                                    _a[sequelize_1.Op.iLike] = '%' + search + '%',
                                    _a)
                            } : undefined
                        }
                    ]
                },
                {
                    model: actor_1.ActorModel,
                    as: 'ActorFollowing',
                    required: true,
                    where: {
                        id: actorId
                    }
                }
            ]
        };
        return ActorFollowModel_1.findAndCountAll(query)
            .then(function (_a) {
            var rows = _a.rows, count = _a.count;
            return {
                data: rows,
                total: count
            };
        });
    };
    ActorFollowModel.listSubscriptionsForApi = function (actorId, start, count, sort) {
        var query = {
            attributes: [],
            distinct: true,
            offset: start,
            limit: count,
            order: utils_2.getSort(sort),
            where: {
                actorId: actorId
            },
            include: [
                {
                    attributes: ['id'],
                    model: actor_1.ActorModel.unscoped(),
                    as: 'ActorFollowing',
                    required: true,
                    include: [
                        {
                            model: video_channel_1.VideoChannelModel.unscoped(),
                            required: true,
                            include: [
                                {
                                    attributes: {
                                        exclude: actor_1.unusedActorAttributesForAPI
                                    },
                                    model: actor_1.ActorModel,
                                    required: true
                                },
                                {
                                    model: account_1.AccountModel.unscoped(),
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
                        }
                    ]
                }
            ]
        };
        return ActorFollowModel_1.findAndCountAll(query)
            .then(function (_a) {
            var rows = _a.rows, count = _a.count;
            return {
                data: rows.map(function (r) { return r.ActorFollowing.VideoChannel; }),
                total: count
            };
        });
    };
    ActorFollowModel.listAcceptedFollowerUrlsForAP = function (actorIds, t, start, count) {
        return ActorFollowModel_1.createListAcceptedFollowForApiQuery('followers', actorIds, t, start, count);
    };
    ActorFollowModel.listAcceptedFollowerSharedInboxUrls = function (actorIds, t) {
        return ActorFollowModel_1.createListAcceptedFollowForApiQuery('followers', actorIds, t, undefined, undefined, 'sharedInboxUrl', true);
    };
    ActorFollowModel.listAcceptedFollowingUrlsForApi = function (actorIds, t, start, count) {
        return ActorFollowModel_1.createListAcceptedFollowForApiQuery('following', actorIds, t, start, count);
    };
    ActorFollowModel.getStats = function () {
        return __awaiter(this, void 0, void 0, function () {
            var serverActor, totalInstanceFollowing, totalInstanceFollowers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, utils_1.getServerActor()];
                    case 1:
                        serverActor = _a.sent();
                        return [4 /*yield*/, ActorFollowModel_1.count({
                                where: {
                                    actorId: serverActor.id
                                }
                            })];
                    case 2:
                        totalInstanceFollowing = _a.sent();
                        return [4 /*yield*/, ActorFollowModel_1.count({
                                where: {
                                    targetActorId: serverActor.id
                                }
                            })];
                    case 3:
                        totalInstanceFollowers = _a.sent();
                        return [2 /*return*/, {
                                totalInstanceFollowing: totalInstanceFollowing,
                                totalInstanceFollowers: totalInstanceFollowers
                            }];
                }
            });
        });
    };
    ActorFollowModel.updateScore = function (inboxUrl, value, t) {
        var query = "UPDATE \"actorFollow\" SET \"score\" = LEAST(\"score\" + " + value + ", " + constants_1.ACTOR_FOLLOW_SCORE.MAX + ") " +
            'WHERE id IN (' +
            'SELECT "actorFollow"."id" FROM "actorFollow" ' +
            'INNER JOIN "actor" ON "actor"."id" = "actorFollow"."actorId" ' +
            ("WHERE \"actor\".\"inboxUrl\" = '" + inboxUrl + "' OR \"actor\".\"sharedInboxUrl\" = '" + inboxUrl + "'") +
            ')';
        var options = {
            type: sequelize_1.QueryTypes.BULKUPDATE,
            transaction: t
        };
        return ActorFollowModel_1.sequelize.query(query, options);
    };
    ActorFollowModel.updateScoreByFollowingServers = function (serverIds, value, t) {
        return __awaiter(this, void 0, void 0, function () {
            var me, serverIdsString, query, options;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (serverIds.length === 0)
                            return [2 /*return*/];
                        return [4 /*yield*/, utils_1.getServerActor()];
                    case 1:
                        me = _a.sent();
                        serverIdsString = utils_2.createSafeIn(ActorFollowModel_1, serverIds);
                        query = "UPDATE \"actorFollow\" SET \"score\" = LEAST(\"score\" + " + value + ", " + constants_1.ACTOR_FOLLOW_SCORE.MAX + ") " +
                            'WHERE id IN (' +
                            'SELECT "actorFollow"."id" FROM "actorFollow" ' +
                            'INNER JOIN "actor" ON "actor"."id" = "actorFollow"."targetActorId" ' +
                            ("WHERE \"actorFollow\".\"actorId\" = " + me.Account.actorId + " ") + // I'm the follower
                            ("AND \"actor\".\"serverId\" IN (" + serverIdsString + ")") + // Criteria on followings
                            ')';
                        options = {
                            type: sequelize_1.QueryTypes.BULKUPDATE,
                            transaction: t
                        };
                        return [2 /*return*/, ActorFollowModel_1.sequelize.query(query, options)];
                }
            });
        });
    };
    ActorFollowModel.createListAcceptedFollowForApiQuery = function (type, actorIds, t, start, count, columnUrl, distinct) {
        if (columnUrl === void 0) { columnUrl = 'url'; }
        if (distinct === void 0) { distinct = false; }
        return __awaiter(this, void 0, void 0, function () {
            var firstJoin, secondJoin, selections, tasks, _i, selections_1, selection, query, options, _a, followers, dataTotal, urls;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (type === 'followers') {
                            firstJoin = 'targetActorId';
                            secondJoin = 'actorId';
                        }
                        else {
                            firstJoin = 'actorId';
                            secondJoin = 'targetActorId';
                        }
                        selections = [];
                        if (distinct === true)
                            selections.push('DISTINCT("Follows"."' + columnUrl + '") AS "url"');
                        else
                            selections.push('"Follows"."' + columnUrl + '" AS "url"');
                        selections.push('COUNT(*) AS "total"');
                        tasks = [];
                        for (_i = 0, selections_1 = selections; _i < selections_1.length; _i++) {
                            selection = selections_1[_i];
                            query = 'SELECT ' + selection + ' FROM "actor" ' +
                                'INNER JOIN "actorFollow" ON "actorFollow"."' + firstJoin + '" = "actor"."id" ' +
                                'INNER JOIN "actor" AS "Follows" ON "actorFollow"."' + secondJoin + '" = "Follows"."id" ' +
                                'WHERE "actor"."id" = ANY ($actorIds) AND "actorFollow"."state" = \'accepted\' ';
                            if (count !== undefined)
                                query += 'LIMIT ' + count;
                            if (start !== undefined)
                                query += ' OFFSET ' + start;
                            options = {
                                bind: { actorIds: actorIds },
                                type: sequelize_1.QueryTypes.SELECT,
                                transaction: t
                            };
                            tasks.push(ActorFollowModel_1.sequelize.query(query, options));
                        }
                        return [4 /*yield*/, Promise.all(tasks)];
                    case 1:
                        _a = _b.sent(), followers = _a[0], dataTotal = _a[1][0];
                        urls = followers.map(function (f) { return f.url; });
                        return [2 /*return*/, {
                                data: urls,
                                total: dataTotal ? parseInt(dataTotal.total, 10) : 0
                            }];
                }
            });
        });
    };
    ActorFollowModel.listBadActorFollows = function () {
        var _a;
        var query = {
            where: {
                score: (_a = {},
                    _a[sequelize_1.Op.lte] = 0,
                    _a)
            },
            logging: false
        };
        return ActorFollowModel_1.findAll(query);
    };
    ActorFollowModel.prototype.toFormattedJSON = function () {
        var follower = this.ActorFollower.toFormattedJSON();
        var following = this.ActorFollowing.toFormattedJSON();
        return {
            id: this.id,
            follower: follower,
            following: following,
            score: this.score,
            state: this.state,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    };
    var ActorFollowModel_1;
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Column(sequelize_typescript_1.DataType.ENUM.apply(sequelize_typescript_1.DataType, lodash_1.values(constants_1.FOLLOW_STATES)))
    ], ActorFollowModel.prototype, "state");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Default(constants_1.ACTOR_FOLLOW_SCORE.BASE),
        sequelize_typescript_1.IsInt,
        sequelize_typescript_1.Max(constants_1.ACTOR_FOLLOW_SCORE.MAX),
        sequelize_typescript_1.Column
    ], ActorFollowModel.prototype, "score");
    __decorate([
        sequelize_typescript_1.CreatedAt
    ], ActorFollowModel.prototype, "createdAt");
    __decorate([
        sequelize_typescript_1.UpdatedAt
    ], ActorFollowModel.prototype, "updatedAt");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return actor_1.ActorModel; }),
        sequelize_typescript_1.Column
    ], ActorFollowModel.prototype, "actorId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return actor_1.ActorModel; }, {
            foreignKey: {
                name: 'actorId',
                allowNull: false
            },
            as: 'ActorFollower',
            onDelete: 'CASCADE'
        })
    ], ActorFollowModel.prototype, "ActorFollower");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return actor_1.ActorModel; }),
        sequelize_typescript_1.Column
    ], ActorFollowModel.prototype, "targetActorId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return actor_1.ActorModel; }, {
            foreignKey: {
                name: 'targetActorId',
                allowNull: false
            },
            as: 'ActorFollowing',
            onDelete: 'CASCADE'
        })
    ], ActorFollowModel.prototype, "ActorFollowing");
    __decorate([
        sequelize_typescript_1.AfterCreate,
        sequelize_typescript_1.AfterUpdate
    ], ActorFollowModel, "incrementFollowerAndFollowingCount");
    __decorate([
        sequelize_typescript_1.AfterDestroy
    ], ActorFollowModel, "decrementFollowerAndFollowingCount");
    ActorFollowModel = ActorFollowModel_1 = __decorate([
        sequelize_typescript_1.Table({
            tableName: 'actorFollow',
            indexes: [
                {
                    fields: ['actorId']
                },
                {
                    fields: ['targetActorId']
                },
                {
                    fields: ['actorId', 'targetActorId'],
                    unique: true
                },
                {
                    fields: ['score']
                }
            ]
        })
    ], ActorFollowModel);
    return ActorFollowModel;
}(sequelize_typescript_1.Model));
exports.ActorFollowModel = ActorFollowModel;
