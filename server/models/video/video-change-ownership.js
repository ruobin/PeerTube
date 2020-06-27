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
var account_1 = require("../account/account");
var video_1 = require("./video");
var utils_1 = require("../utils");
var ScopeNames;
(function (ScopeNames) {
    ScopeNames["WITH_ACCOUNTS"] = "WITH_ACCOUNTS";
    ScopeNames["WITH_VIDEO"] = "WITH_VIDEO";
})(ScopeNames || (ScopeNames = {}));
var VideoChangeOwnershipModel = /** @class */ (function (_super) {
    __extends(VideoChangeOwnershipModel, _super);
    function VideoChangeOwnershipModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    VideoChangeOwnershipModel_1 = VideoChangeOwnershipModel;
    VideoChangeOwnershipModel.listForApi = function (nextOwnerId, start, count, sort) {
        var query = {
            offset: start,
            limit: count,
            order: utils_1.getSort(sort),
            where: {
                nextOwnerAccountId: nextOwnerId
            }
        };
        return Promise.all([
            VideoChangeOwnershipModel_1.scope(ScopeNames.WITH_ACCOUNTS).count(query),
            VideoChangeOwnershipModel_1.scope([ScopeNames.WITH_ACCOUNTS, ScopeNames.WITH_VIDEO]).findAll(query)
        ]).then(function (_a) {
            var count = _a[0], rows = _a[1];
            return ({ total: count, data: rows });
        });
    };
    VideoChangeOwnershipModel.load = function (id) {
        return VideoChangeOwnershipModel_1.scope([ScopeNames.WITH_ACCOUNTS, ScopeNames.WITH_VIDEO])
            .findByPk(id);
    };
    VideoChangeOwnershipModel.prototype.toFormattedJSON = function () {
        return {
            id: this.id,
            status: this.status,
            initiatorAccount: this.Initiator.toFormattedJSON(),
            nextOwnerAccount: this.NextOwner.toFormattedJSON(),
            video: {
                id: this.Video.id,
                uuid: this.Video.uuid,
                url: this.Video.url,
                name: this.Video.name
            },
            createdAt: this.createdAt
        };
    };
    var VideoChangeOwnershipModel_1;
    __decorate([
        sequelize_typescript_1.CreatedAt
    ], VideoChangeOwnershipModel.prototype, "createdAt");
    __decorate([
        sequelize_typescript_1.UpdatedAt
    ], VideoChangeOwnershipModel.prototype, "updatedAt");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Column
    ], VideoChangeOwnershipModel.prototype, "status");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return account_1.AccountModel; }),
        sequelize_typescript_1.Column
    ], VideoChangeOwnershipModel.prototype, "initiatorAccountId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return account_1.AccountModel; }, {
            foreignKey: {
                name: 'initiatorAccountId',
                allowNull: false
            },
            onDelete: 'cascade'
        })
    ], VideoChangeOwnershipModel.prototype, "Initiator");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return account_1.AccountModel; }),
        sequelize_typescript_1.Column
    ], VideoChangeOwnershipModel.prototype, "nextOwnerAccountId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return account_1.AccountModel; }, {
            foreignKey: {
                name: 'nextOwnerAccountId',
                allowNull: false
            },
            onDelete: 'cascade'
        })
    ], VideoChangeOwnershipModel.prototype, "NextOwner");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return video_1.VideoModel; }),
        sequelize_typescript_1.Column
    ], VideoChangeOwnershipModel.prototype, "videoId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return video_1.VideoModel; }, {
            foreignKey: {
                allowNull: false
            },
            onDelete: 'cascade'
        })
    ], VideoChangeOwnershipModel.prototype, "Video");
    VideoChangeOwnershipModel = VideoChangeOwnershipModel_1 = __decorate([
        sequelize_typescript_1.Table({
            tableName: 'videoChangeOwnership',
            indexes: [
                {
                    fields: ['videoId']
                },
                {
                    fields: ['initiatorAccountId']
                },
                {
                    fields: ['nextOwnerAccountId']
                }
            ]
        }),
        sequelize_typescript_1.Scopes(function () {
            var _a;
            return (_a = {},
                _a[ScopeNames.WITH_ACCOUNTS] = {
                    include: [
                        {
                            model: account_1.AccountModel,
                            as: 'Initiator',
                            required: true
                        },
                        {
                            model: account_1.AccountModel,
                            as: 'NextOwner',
                            required: true
                        }
                    ]
                },
                _a[ScopeNames.WITH_VIDEO] = {
                    include: [
                        {
                            model: video_1.VideoModel.scope([video_1.ScopeNames.WITH_THUMBNAILS, video_1.ScopeNames.WITH_FILES]),
                            required: true
                        }
                    ]
                },
                _a);
        })
    ], VideoChangeOwnershipModel);
    return VideoChangeOwnershipModel;
}(sequelize_typescript_1.Model));
exports.VideoChangeOwnershipModel = VideoChangeOwnershipModel;
