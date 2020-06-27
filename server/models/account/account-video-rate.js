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
var sequelize_1 = require("sequelize");
var sequelize_typescript_1 = require("sequelize-typescript");
var constants_1 = require("../../initializers/constants");
var video_1 = require("../video/video");
var account_1 = require("./account");
var actor_1 = require("../activitypub/actor");
var utils_1 = require("../utils");
var misc_1 = require("../../helpers/custom-validators/activitypub/misc");
var video_channel_1 = require("../video/video-channel");
/*
  Account rates per video.
*/
var AccountVideoRateModel = /** @class */ (function (_super) {
    __extends(AccountVideoRateModel, _super);
    function AccountVideoRateModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AccountVideoRateModel_1 = AccountVideoRateModel;
    AccountVideoRateModel.load = function (accountId, videoId, transaction) {
        var options = {
            where: {
                accountId: accountId,
                videoId: videoId
            }
        };
        if (transaction)
            options.transaction = transaction;
        return AccountVideoRateModel_1.findOne(options);
    };
    AccountVideoRateModel.loadByAccountAndVideoOrUrl = function (accountId, videoId, url, transaction) {
        var _a;
        var options = {
            where: (_a = {},
                _a[sequelize_1.Op.or] = [
                    {
                        accountId: accountId,
                        videoId: videoId
                    },
                    {
                        url: url
                    }
                ],
                _a)
        };
        if (transaction)
            options.transaction = transaction;
        return AccountVideoRateModel_1.findOne(options);
    };
    AccountVideoRateModel.listByAccountForApi = function (options) {
        var query = {
            offset: options.start,
            limit: options.count,
            order: utils_1.getSort(options.sort),
            where: {
                accountId: options.accountId
            },
            include: [
                {
                    model: video_1.VideoModel,
                    required: true,
                    include: [
                        {
                            model: video_channel_1.VideoChannelModel.scope({ method: [video_channel_1.ScopeNames.SUMMARY, { withAccount: true }] }),
                            required: true
                        }
                    ]
                }
            ]
        };
        if (options.type)
            query.where['type'] = options.type;
        return AccountVideoRateModel_1.findAndCountAll(query);
    };
    AccountVideoRateModel.loadLocalAndPopulateVideo = function (rateType, accountName, videoId, transaction) {
        var options = {
            where: {
                videoId: videoId,
                type: rateType
            },
            include: [
                {
                    model: account_1.AccountModel.unscoped(),
                    required: true,
                    include: [
                        {
                            attributes: ['id', 'url', 'preferredUsername'],
                            model: actor_1.ActorModel.unscoped(),
                            required: true,
                            where: {
                                preferredUsername: accountName
                            }
                        }
                    ]
                },
                {
                    model: video_1.VideoModel.unscoped(),
                    required: true
                }
            ]
        };
        if (transaction)
            options.transaction = transaction;
        return AccountVideoRateModel_1.findOne(options);
    };
    AccountVideoRateModel.loadByUrl = function (url, transaction) {
        var options = {
            where: {
                url: url
            }
        };
        if (transaction)
            options.transaction = transaction;
        return AccountVideoRateModel_1.findOne(options);
    };
    AccountVideoRateModel.listAndCountAccountUrlsByVideoId = function (rateType, videoId, start, count, t) {
        var query = {
            offset: start,
            limit: count,
            where: {
                videoId: videoId,
                type: rateType
            },
            transaction: t,
            include: [
                {
                    attributes: ['actorId'],
                    model: account_1.AccountModel.unscoped(),
                    required: true,
                    include: [
                        {
                            attributes: ['url'],
                            model: actor_1.ActorModel.unscoped(),
                            required: true
                        }
                    ]
                }
            ]
        };
        return AccountVideoRateModel_1.findAndCountAll(query);
    };
    AccountVideoRateModel.cleanOldRatesOf = function (videoId, type, beforeUpdatedAt) {
        var _this = this;
        return AccountVideoRateModel_1.sequelize.transaction(function (t) { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, query, deleted, options;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        query = {
                            where: {
                                updatedAt: (_a = {},
                                    _a[sequelize_1.Op.lt] = beforeUpdatedAt,
                                    _a),
                                videoId: videoId,
                                type: type,
                                accountId: (_b = {},
                                    _b[sequelize_1.Op.notIn] = utils_1.buildLocalAccountIdsIn(),
                                    _b)
                            },
                            transaction: t
                        };
                        return [4 /*yield*/, AccountVideoRateModel_1.destroy(query)];
                    case 1:
                        deleted = _c.sent();
                        options = {
                            transaction: t,
                            where: {
                                id: videoId
                            }
                        };
                        if (!(type === 'like')) return [3 /*break*/, 3];
                        return [4 /*yield*/, video_1.VideoModel.increment({ likes: -deleted }, options)];
                    case 2:
                        _c.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        if (!(type === 'dislike')) return [3 /*break*/, 5];
                        return [4 /*yield*/, video_1.VideoModel.increment({ dislikes: -deleted }, options)];
                    case 4:
                        _c.sent();
                        _c.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        }); });
    };
    AccountVideoRateModel.prototype.toFormattedJSON = function () {
        return {
            video: this.Video.toFormattedJSON(),
            rating: this.type
        };
    };
    var AccountVideoRateModel_1;
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Column(sequelize_typescript_1.DataType.ENUM.apply(sequelize_typescript_1.DataType, lodash_1.values(constants_1.VIDEO_RATE_TYPES)))
    ], AccountVideoRateModel.prototype, "type");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Is('AccountVideoRateUrl', function (value) { return utils_1.throwIfNotValid(value, misc_1.isActivityPubUrlValid, 'url'); }),
        sequelize_typescript_1.Column(sequelize_typescript_1.DataType.STRING(constants_1.CONSTRAINTS_FIELDS.VIDEO_RATES.URL.max))
    ], AccountVideoRateModel.prototype, "url");
    __decorate([
        sequelize_typescript_1.CreatedAt
    ], AccountVideoRateModel.prototype, "createdAt");
    __decorate([
        sequelize_typescript_1.UpdatedAt
    ], AccountVideoRateModel.prototype, "updatedAt");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return video_1.VideoModel; }),
        sequelize_typescript_1.Column
    ], AccountVideoRateModel.prototype, "videoId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return video_1.VideoModel; }, {
            foreignKey: {
                allowNull: false
            },
            onDelete: 'CASCADE'
        })
    ], AccountVideoRateModel.prototype, "Video");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return account_1.AccountModel; }),
        sequelize_typescript_1.Column
    ], AccountVideoRateModel.prototype, "accountId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return account_1.AccountModel; }, {
            foreignKey: {
                allowNull: false
            },
            onDelete: 'CASCADE'
        })
    ], AccountVideoRateModel.prototype, "Account");
    AccountVideoRateModel = AccountVideoRateModel_1 = __decorate([
        sequelize_typescript_1.Table({
            tableName: 'accountVideoRate',
            indexes: [
                {
                    fields: ['videoId', 'accountId'],
                    unique: true
                },
                {
                    fields: ['videoId']
                },
                {
                    fields: ['accountId']
                },
                {
                    fields: ['videoId', 'type']
                },
                {
                    fields: ['url'],
                    unique: true
                }
            ]
        })
    ], AccountVideoRateModel);
    return AccountVideoRateModel;
}(sequelize_typescript_1.Model));
exports.AccountVideoRateModel = AccountVideoRateModel;
