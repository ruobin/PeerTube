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
var misc_1 = require("../../helpers/custom-validators/activitypub/misc");
var constants_1 = require("../../initializers/constants");
var account_1 = require("../account/account");
var actor_1 = require("../activitypub/actor");
var avatar_1 = require("../avatar/avatar");
var server_1 = require("../server/server");
var utils_1 = require("../utils");
var video_1 = require("./video");
var video_channel_1 = require("./video-channel");
var utils_2 = require("../../helpers/utils");
var actor_2 = require("../../helpers/custom-validators/activitypub/actor");
var regexp_1 = require("../../helpers/regexp");
var lodash_1 = require("lodash");
var sequelize_1 = require("sequelize");
var ScopeNames;
(function (ScopeNames) {
    ScopeNames["WITH_ACCOUNT"] = "WITH_ACCOUNT";
    ScopeNames["WITH_IN_REPLY_TO"] = "WITH_IN_REPLY_TO";
    ScopeNames["WITH_VIDEO"] = "WITH_VIDEO";
    ScopeNames["ATTRIBUTES_FOR_API"] = "ATTRIBUTES_FOR_API";
})(ScopeNames || (ScopeNames = {}));
var VideoCommentModel = /** @class */ (function (_super) {
    __extends(VideoCommentModel, _super);
    function VideoCommentModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    VideoCommentModel_1 = VideoCommentModel;
    VideoCommentModel.loadById = function (id, t) {
        var query = {
            where: {
                id: id
            }
        };
        if (t !== undefined)
            query.transaction = t;
        return VideoCommentModel_1.findOne(query);
    };
    VideoCommentModel.loadByIdAndPopulateVideoAndAccountAndReply = function (id, t) {
        var query = {
            where: {
                id: id
            }
        };
        if (t !== undefined)
            query.transaction = t;
        return VideoCommentModel_1
            .scope([ScopeNames.WITH_VIDEO, ScopeNames.WITH_ACCOUNT, ScopeNames.WITH_IN_REPLY_TO])
            .findOne(query);
    };
    VideoCommentModel.loadByUrlAndPopulateAccountAndVideo = function (url, t) {
        var query = {
            where: {
                url: url
            }
        };
        if (t !== undefined)
            query.transaction = t;
        return VideoCommentModel_1.scope([ScopeNames.WITH_ACCOUNT, ScopeNames.WITH_VIDEO]).findOne(query);
    };
    VideoCommentModel.loadByUrlAndPopulateReplyAndVideoUrlAndAccount = function (url, t) {
        var query = {
            where: {
                url: url
            },
            include: [
                {
                    attributes: ['id', 'url'],
                    model: video_1.VideoModel.unscoped()
                }
            ]
        };
        if (t !== undefined)
            query.transaction = t;
        return VideoCommentModel_1.scope([ScopeNames.WITH_IN_REPLY_TO, ScopeNames.WITH_ACCOUNT]).findOne(query);
    };
    VideoCommentModel.listThreadsForApi = function (parameters) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, videoId, start, count, sort, user, serverActor, serverAccountId, userAccountId, query, scopes;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        videoId = parameters.videoId, start = parameters.start, count = parameters.count, sort = parameters.sort, user = parameters.user;
                        return [4 /*yield*/, utils_2.getServerActor()];
                    case 1:
                        serverActor = _b.sent();
                        serverAccountId = serverActor.Account.id;
                        userAccountId = user ? user.Account.id : undefined;
                        query = {
                            offset: start,
                            limit: count,
                            order: utils_1.getSort(sort),
                            where: {
                                videoId: videoId,
                                inReplyToCommentId: null,
                                accountId: (_a = {},
                                    _a[sequelize_1.Op.notIn] = sequelize_1.Sequelize.literal('(' + utils_1.buildBlockedAccountSQL(serverAccountId, userAccountId) + ')'),
                                    _a)
                            }
                        };
                        scopes = [
                            ScopeNames.WITH_ACCOUNT,
                            {
                                method: [ScopeNames.ATTRIBUTES_FOR_API, serverAccountId, userAccountId]
                            }
                        ];
                        return [2 /*return*/, VideoCommentModel_1
                                .scope(scopes)
                                .findAndCountAll(query)
                                .then(function (_a) {
                                var rows = _a.rows, count = _a.count;
                                return { total: count, data: rows };
                            })];
                }
            });
        });
    };
    VideoCommentModel.listThreadCommentsForApi = function (parameters) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, videoId, threadId, user, serverActor, serverAccountId, userAccountId, query, scopes;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        videoId = parameters.videoId, threadId = parameters.threadId, user = parameters.user;
                        return [4 /*yield*/, utils_2.getServerActor()];
                    case 1:
                        serverActor = _c.sent();
                        serverAccountId = serverActor.Account.id;
                        userAccountId = user ? user.Account.id : undefined;
                        query = {
                            order: [['createdAt', 'ASC'], ['updatedAt', 'ASC']],
                            where: (_a = {
                                    videoId: videoId
                                },
                                _a[sequelize_1.Op.or] = [
                                    { id: threadId },
                                    { originCommentId: threadId }
                                ],
                                _a.accountId = (_b = {},
                                    _b[sequelize_1.Op.notIn] = sequelize_1.Sequelize.literal('(' + utils_1.buildBlockedAccountSQL(serverAccountId, userAccountId) + ')'),
                                    _b),
                                _a)
                        };
                        scopes = [
                            ScopeNames.WITH_ACCOUNT,
                            {
                                method: [ScopeNames.ATTRIBUTES_FOR_API, serverAccountId, userAccountId]
                            }
                        ];
                        return [2 /*return*/, VideoCommentModel_1
                                .scope(scopes)
                                .findAndCountAll(query)
                                .then(function (_a) {
                                var rows = _a.rows, count = _a.count;
                                return { total: count, data: rows };
                            })];
                }
            });
        });
    };
    VideoCommentModel.listThreadParentComments = function (comment, t, order) {
        if (order === void 0) { order = 'ASC'; }
        var _a;
        var query = {
            order: [['createdAt', order]],
            where: {
                id: (_a = {},
                    _a[sequelize_1.Op["in"]] = sequelize_1.Sequelize.literal('(' +
                        'WITH RECURSIVE children (id, "inReplyToCommentId") AS ( ' +
                        ("SELECT id, \"inReplyToCommentId\" FROM \"videoComment\" WHERE id = " + comment.id + " ") +
                        'UNION ' +
                        'SELECT "parent"."id", "parent"."inReplyToCommentId" FROM "videoComment" "parent" ' +
                        'INNER JOIN "children" ON "children"."inReplyToCommentId" = "parent"."id"' +
                        ') ' +
                        'SELECT id FROM children' +
                        ')'),
                    _a[sequelize_1.Op.ne] = comment.id,
                    _a)
            },
            transaction: t
        };
        return VideoCommentModel_1
            .scope([ScopeNames.WITH_ACCOUNT])
            .findAll(query);
    };
    VideoCommentModel.listAndCountByVideoId = function (videoId, start, count, t, order) {
        if (order === void 0) { order = 'ASC'; }
        var query = {
            order: [['createdAt', order]],
            offset: start,
            limit: count,
            where: {
                videoId: videoId
            },
            transaction: t
        };
        return VideoCommentModel_1.findAndCountAll(query);
    };
    VideoCommentModel.listForFeed = function (start, count, videoId) {
        var query = {
            order: [['createdAt', 'DESC']],
            offset: start,
            limit: count,
            where: {},
            include: [
                {
                    attributes: ['name', 'uuid'],
                    model: video_1.VideoModel.unscoped(),
                    required: true
                }
            ]
        };
        if (videoId)
            query.where['videoId'] = videoId;
        return VideoCommentModel_1
            .scope([ScopeNames.WITH_ACCOUNT])
            .findAll(query);
    };
    VideoCommentModel.getStats = function () {
        return __awaiter(this, void 0, void 0, function () {
            var totalLocalVideoComments, totalVideoComments;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, VideoCommentModel_1.count({
                            include: [
                                {
                                    model: account_1.AccountModel,
                                    required: true,
                                    include: [
                                        {
                                            model: actor_1.ActorModel,
                                            required: true,
                                            where: {
                                                serverId: null
                                            }
                                        }
                                    ]
                                }
                            ]
                        })];
                    case 1:
                        totalLocalVideoComments = _a.sent();
                        return [4 /*yield*/, VideoCommentModel_1.count()];
                    case 2:
                        totalVideoComments = _a.sent();
                        return [2 /*return*/, {
                                totalLocalVideoComments: totalLocalVideoComments,
                                totalVideoComments: totalVideoComments
                            }];
                }
            });
        });
    };
    VideoCommentModel.cleanOldCommentsOf = function (videoId, beforeUpdatedAt) {
        var _a, _b;
        var query = {
            where: {
                updatedAt: (_a = {},
                    _a[sequelize_1.Op.lt] = beforeUpdatedAt,
                    _a),
                videoId: videoId,
                accountId: (_b = {},
                    _b[sequelize_1.Op.notIn] = utils_1.buildLocalAccountIdsIn(),
                    _b)
            }
        };
        return VideoCommentModel_1.destroy(query);
    };
    VideoCommentModel.prototype.getCommentStaticPath = function () {
        return this.Video.getWatchStaticPath() + ';threadId=' + this.getThreadId();
    };
    VideoCommentModel.prototype.getThreadId = function () {
        return this.originCommentId || this.id;
    };
    VideoCommentModel.prototype.isOwned = function () {
        return this.Account.isOwned();
    };
    VideoCommentModel.prototype.extractMentions = function () {
        var result = [];
        var localMention = "@(" + actor_2.actorNameAlphabet + "+)";
        var remoteMention = localMention + "@" + constants_1.WEBSERVER.HOST;
        var mentionRegex = this.isOwned()
            ? '(?:(?:' + remoteMention + ')|(?:' + localMention + '))' // Include local mentions?
            : '(?:' + remoteMention + ')';
        var firstMentionRegex = new RegExp("^" + mentionRegex + " ", 'g');
        var endMentionRegex = new RegExp(" " + mentionRegex + "$", 'g');
        var remoteMentionsRegex = new RegExp(' ' + remoteMention + ' ', 'g');
        result = result.concat(regexp_1.regexpCapture(this.text, firstMentionRegex)
            .map(function (_a) {
            var username1 = _a[1], username2 = _a[2];
            return username1 || username2;
        }), regexp_1.regexpCapture(this.text, endMentionRegex)
            .map(function (_a) {
            var username1 = _a[1], username2 = _a[2];
            return username1 || username2;
        }), regexp_1.regexpCapture(this.text, remoteMentionsRegex)
            .map(function (_a) {
            var username = _a[1];
            return username;
        }));
        // Include local mentions
        if (this.isOwned()) {
            var localMentionsRegex = new RegExp(' ' + localMention + ' ', 'g');
            result = result.concat(regexp_1.regexpCapture(this.text, localMentionsRegex)
                .map(function (_a) {
                var username = _a[1];
                return username;
            }));
        }
        return lodash_1.uniq(result);
    };
    VideoCommentModel.prototype.toFormattedJSON = function () {
        return {
            id: this.id,
            url: this.url,
            text: this.text,
            threadId: this.originCommentId || this.id,
            inReplyToCommentId: this.inReplyToCommentId || null,
            videoId: this.videoId,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            totalReplies: this.get('totalReplies') || 0,
            account: this.Account.toFormattedJSON()
        };
    };
    VideoCommentModel.prototype.toActivityPubObject = function (threadParentComments) {
        var inReplyTo;
        // New thread, so in AS we reply to the video
        if (this.inReplyToCommentId === null) {
            inReplyTo = this.Video.url;
        }
        else {
            inReplyTo = this.InReplyToVideoComment.url;
        }
        var tag = [];
        for (var _i = 0, threadParentComments_1 = threadParentComments; _i < threadParentComments_1.length; _i++) {
            var parentComment = threadParentComments_1[_i];
            var actor = parentComment.Account.Actor;
            tag.push({
                type: 'Mention',
                href: actor.url,
                name: "@" + actor.preferredUsername + "@" + actor.getHost()
            });
        }
        return {
            type: 'Note',
            id: this.url,
            content: this.text,
            inReplyTo: inReplyTo,
            updated: this.updatedAt.toISOString(),
            published: this.createdAt.toISOString(),
            url: this.url,
            attributedTo: this.Account.Actor.url,
            tag: tag
        };
    };
    var VideoCommentModel_1;
    __decorate([
        sequelize_typescript_1.CreatedAt
    ], VideoCommentModel.prototype, "createdAt");
    __decorate([
        sequelize_typescript_1.UpdatedAt
    ], VideoCommentModel.prototype, "updatedAt");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Is('VideoCommentUrl', function (value) { return utils_1.throwIfNotValid(value, misc_1.isActivityPubUrlValid, 'url'); }),
        sequelize_typescript_1.Column(sequelize_typescript_1.DataType.STRING(constants_1.CONSTRAINTS_FIELDS.VIDEOS.URL.max))
    ], VideoCommentModel.prototype, "url");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Column(sequelize_typescript_1.DataType.TEXT)
    ], VideoCommentModel.prototype, "text");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return VideoCommentModel_1; }),
        sequelize_typescript_1.Column
    ], VideoCommentModel.prototype, "originCommentId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return VideoCommentModel_1; }, {
            foreignKey: {
                name: 'originCommentId',
                allowNull: true
            },
            as: 'OriginVideoComment',
            onDelete: 'CASCADE'
        })
    ], VideoCommentModel.prototype, "OriginVideoComment");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return VideoCommentModel_1; }),
        sequelize_typescript_1.Column
    ], VideoCommentModel.prototype, "inReplyToCommentId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return VideoCommentModel_1; }, {
            foreignKey: {
                name: 'inReplyToCommentId',
                allowNull: true
            },
            as: 'InReplyToVideoComment',
            onDelete: 'CASCADE'
        })
    ], VideoCommentModel.prototype, "InReplyToVideoComment");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return video_1.VideoModel; }),
        sequelize_typescript_1.Column
    ], VideoCommentModel.prototype, "videoId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return video_1.VideoModel; }, {
            foreignKey: {
                allowNull: false
            },
            onDelete: 'CASCADE'
        })
    ], VideoCommentModel.prototype, "Video");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return account_1.AccountModel; }),
        sequelize_typescript_1.Column
    ], VideoCommentModel.prototype, "accountId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return account_1.AccountModel; }, {
            foreignKey: {
                allowNull: false
            },
            onDelete: 'CASCADE'
        })
    ], VideoCommentModel.prototype, "Account");
    VideoCommentModel = VideoCommentModel_1 = __decorate([
        sequelize_typescript_1.Scopes(function () {
            var _a;
            return (_a = {},
                _a[ScopeNames.ATTRIBUTES_FOR_API] = function (serverAccountId, userAccountId) {
                    return {
                        attributes: {
                            include: [
                                [
                                    sequelize_1.Sequelize.literal('(' +
                                        'WITH "blocklist" AS (' + utils_1.buildBlockedAccountSQL(serverAccountId, userAccountId) + ')' +
                                        'SELECT COUNT("replies"."id") - (' +
                                        'SELECT COUNT("replies"."id") ' +
                                        'FROM "videoComment" AS "replies" ' +
                                        'WHERE "replies"."originCommentId" = "VideoCommentModel"."id" ' +
                                        'AND "accountId" IN (SELECT "id" FROM "blocklist")' +
                                        ')' +
                                        'FROM "videoComment" AS "replies" ' +
                                        'WHERE "replies"."originCommentId" = "VideoCommentModel"."id" ' +
                                        'AND "accountId" NOT IN (SELECT "id" FROM "blocklist")' +
                                        ')'),
                                    'totalReplies'
                                ]
                            ]
                        }
                    };
                },
                _a[ScopeNames.WITH_ACCOUNT] = {
                    include: [
                        {
                            model: account_1.AccountModel,
                            include: [
                                {
                                    model: actor_1.ActorModel,
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
                                }
                            ]
                        }
                    ]
                },
                _a[ScopeNames.WITH_IN_REPLY_TO] = {
                    include: [
                        {
                            model: VideoCommentModel_1,
                            as: 'InReplyToVideoComment'
                        }
                    ]
                },
                _a[ScopeNames.WITH_VIDEO] = {
                    include: [
                        {
                            model: video_1.VideoModel,
                            required: true,
                            include: [
                                {
                                    model: video_channel_1.VideoChannelModel.unscoped(),
                                    required: true,
                                    include: [
                                        {
                                            model: actor_1.ActorModel,
                                            required: true
                                        },
                                        {
                                            model: account_1.AccountModel,
                                            required: true,
                                            include: [
                                                {
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
                },
                _a);
        }),
        sequelize_typescript_1.Table({
            tableName: 'videoComment',
            indexes: [
                {
                    fields: ['videoId']
                },
                {
                    fields: ['videoId', 'originCommentId']
                },
                {
                    fields: ['url'],
                    unique: true
                },
                {
                    fields: ['accountId']
                }
            ]
        })
    ], VideoCommentModel);
    return VideoCommentModel;
}(sequelize_typescript_1.Model));
exports.VideoCommentModel = VideoCommentModel;
