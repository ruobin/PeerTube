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
var misc_1 = require("../../helpers/custom-validators/activitypub/misc");
var constants_1 = require("../../initializers/constants");
var account_1 = require("../account/account");
var actor_1 = require("../activitypub/actor");
var utils_1 = require("../utils");
var video_1 = require("./video");
var video_channel_1 = require("./video-channel");
var sequelize_1 = require("sequelize");
var ScopeNames;
(function (ScopeNames) {
    ScopeNames["FULL"] = "FULL";
    ScopeNames["WITH_ACTOR"] = "WITH_ACTOR";
})(ScopeNames || (ScopeNames = {}));
var VideoShareModel = /** @class */ (function (_super) {
    __extends(VideoShareModel, _super);
    function VideoShareModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    VideoShareModel_1 = VideoShareModel;
    VideoShareModel.load = function (actorId, videoId, t) {
        return VideoShareModel_1.scope(ScopeNames.WITH_ACTOR).findOne({
            where: {
                actorId: actorId,
                videoId: videoId
            },
            transaction: t
        });
    };
    VideoShareModel.loadByUrl = function (url, t) {
        return VideoShareModel_1.scope(ScopeNames.FULL).findOne({
            where: {
                url: url
            },
            transaction: t
        });
    };
    VideoShareModel.loadActorsByShare = function (videoId, t) {
        var query = {
            where: {
                videoId: videoId
            },
            include: [
                {
                    model: actor_1.ActorModel,
                    required: true
                }
            ],
            transaction: t
        };
        return VideoShareModel_1.scope(ScopeNames.FULL).findAll(query)
            .then(function (res) { return res.map(function (r) { return r.Actor; }); });
    };
    VideoShareModel.loadActorsWhoSharedVideosOf = function (actorOwnerId, t) {
        var query = {
            attributes: [],
            include: [
                {
                    model: actor_1.ActorModel,
                    required: true
                },
                {
                    attributes: [],
                    model: video_1.VideoModel,
                    required: true,
                    include: [
                        {
                            attributes: [],
                            model: video_channel_1.VideoChannelModel.unscoped(),
                            required: true,
                            include: [
                                {
                                    attributes: [],
                                    model: account_1.AccountModel.unscoped(),
                                    required: true,
                                    where: {
                                        actorId: actorOwnerId
                                    }
                                }
                            ]
                        }
                    ]
                }
            ],
            transaction: t
        };
        return VideoShareModel_1.scope(ScopeNames.FULL).findAll(query)
            .then(function (res) { return res.map(function (r) { return r.Actor; }); });
    };
    VideoShareModel.loadActorsByVideoChannel = function (videoChannelId, t) {
        var query = {
            attributes: [],
            include: [
                {
                    model: actor_1.ActorModel,
                    required: true
                },
                {
                    attributes: [],
                    model: video_1.VideoModel,
                    required: true,
                    where: {
                        channelId: videoChannelId
                    }
                }
            ],
            transaction: t
        };
        return VideoShareModel_1.scope(ScopeNames.FULL)
            .findAll(query)
            .then(function (res) { return res.map(function (r) { return r.Actor; }); });
    };
    VideoShareModel.listAndCountByVideoId = function (videoId, start, count, t) {
        var query = {
            offset: start,
            limit: count,
            where: {
                videoId: videoId
            },
            transaction: t
        };
        return VideoShareModel_1.findAndCountAll(query);
    };
    VideoShareModel.cleanOldSharesOf = function (videoId, beforeUpdatedAt) {
        var _a, _b;
        var query = {
            where: {
                updatedAt: (_a = {},
                    _a[sequelize_1.Op.lt] = beforeUpdatedAt,
                    _a),
                videoId: videoId,
                actorId: (_b = {},
                    _b[sequelize_1.Op.notIn] = utils_1.buildLocalActorIdsIn(),
                    _b)
            }
        };
        return VideoShareModel_1.destroy(query);
    };
    var VideoShareModel_1;
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Is('VideoShareUrl', function (value) { return utils_1.throwIfNotValid(value, misc_1.isActivityPubUrlValid, 'url'); }),
        sequelize_typescript_1.Column(sequelize_typescript_1.DataType.STRING(constants_1.CONSTRAINTS_FIELDS.VIDEO_SHARE.URL.max))
    ], VideoShareModel.prototype, "url");
    __decorate([
        sequelize_typescript_1.CreatedAt
    ], VideoShareModel.prototype, "createdAt");
    __decorate([
        sequelize_typescript_1.UpdatedAt
    ], VideoShareModel.prototype, "updatedAt");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return actor_1.ActorModel; }),
        sequelize_typescript_1.Column
    ], VideoShareModel.prototype, "actorId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return actor_1.ActorModel; }, {
            foreignKey: {
                allowNull: false
            },
            onDelete: 'cascade'
        })
    ], VideoShareModel.prototype, "Actor");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return video_1.VideoModel; }),
        sequelize_typescript_1.Column
    ], VideoShareModel.prototype, "videoId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return video_1.VideoModel; }, {
            foreignKey: {
                allowNull: false
            },
            onDelete: 'cascade'
        })
    ], VideoShareModel.prototype, "Video");
    VideoShareModel = VideoShareModel_1 = __decorate([
        sequelize_typescript_1.Scopes(function () {
            var _a;
            return (_a = {},
                _a[ScopeNames.FULL] = {
                    include: [
                        {
                            model: actor_1.ActorModel,
                            required: true
                        },
                        {
                            model: video_1.VideoModel,
                            required: true
                        }
                    ]
                },
                _a[ScopeNames.WITH_ACTOR] = {
                    include: [
                        {
                            model: actor_1.ActorModel,
                            required: true
                        }
                    ]
                },
                _a);
        }),
        sequelize_typescript_1.Table({
            tableName: 'videoShare',
            indexes: [
                {
                    fields: ['actorId']
                },
                {
                    fields: ['videoId']
                },
                {
                    fields: ['url'],
                    unique: true
                }
            ]
        })
    ], VideoShareModel);
    return VideoShareModel;
}(sequelize_typescript_1.Model));
exports.VideoShareModel = VideoShareModel;
