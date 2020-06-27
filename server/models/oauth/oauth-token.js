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
var logger_1 = require("../../helpers/logger");
var user_1 = require("../account/user");
var oauth_client_1 = require("./oauth-client");
var account_1 = require("../account/account");
var actor_1 = require("../activitypub/actor");
var oauth_model_1 = require("../../lib/oauth-model");
var ScopeNames;
(function (ScopeNames) {
    ScopeNames["WITH_USER"] = "WITH_USER";
})(ScopeNames || (ScopeNames = {}));
var OAuthTokenModel = /** @class */ (function (_super) {
    __extends(OAuthTokenModel, _super);
    function OAuthTokenModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OAuthTokenModel_1 = OAuthTokenModel;
    OAuthTokenModel.removeTokenCache = function (token) {
        return oauth_model_1.clearCacheByToken(token.accessToken);
    };
    OAuthTokenModel.getByRefreshTokenAndPopulateClient = function (refreshToken) {
        var query = {
            where: {
                refreshToken: refreshToken
            },
            include: [oauth_client_1.OAuthClientModel]
        };
        return OAuthTokenModel_1.findOne(query)
            .then(function (token) {
            if (!token)
                return null;
            return {
                refreshToken: token.refreshToken,
                refreshTokenExpiresAt: token.refreshTokenExpiresAt,
                client: {
                    id: token.oAuthClientId
                },
                user: {
                    id: token.userId
                }
            };
        })["catch"](function (err) {
            logger_1.logger.error('getRefreshToken error.', { err: err });
            throw err;
        });
    };
    OAuthTokenModel.getByTokenAndPopulateUser = function (bearerToken) {
        var query = {
            where: {
                accessToken: bearerToken
            }
        };
        return OAuthTokenModel_1.scope(ScopeNames.WITH_USER)
            .findOne(query)
            .then(function (token) {
            if (token)
                token['user'] = token.User;
            return token;
        });
    };
    OAuthTokenModel.getByRefreshTokenAndPopulateUser = function (refreshToken) {
        var query = {
            where: {
                refreshToken: refreshToken
            }
        };
        return OAuthTokenModel_1.scope(ScopeNames.WITH_USER)
            .findOne(query)
            .then(function (token) {
            if (token) {
                token['user'] = token.User;
                return token;
            }
            else {
                return new OAuthTokenModel_1();
            }
        });
    };
    OAuthTokenModel.deleteUserToken = function (userId, t) {
        var query = {
            where: {
                userId: userId
            },
            transaction: t
        };
        return OAuthTokenModel_1.destroy(query);
    };
    var OAuthTokenModel_1;
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Column
    ], OAuthTokenModel.prototype, "accessToken");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Column
    ], OAuthTokenModel.prototype, "accessTokenExpiresAt");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Column
    ], OAuthTokenModel.prototype, "refreshToken");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Column
    ], OAuthTokenModel.prototype, "refreshTokenExpiresAt");
    __decorate([
        sequelize_typescript_1.CreatedAt
    ], OAuthTokenModel.prototype, "createdAt");
    __decorate([
        sequelize_typescript_1.UpdatedAt
    ], OAuthTokenModel.prototype, "updatedAt");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return user_1.UserModel; }),
        sequelize_typescript_1.Column
    ], OAuthTokenModel.prototype, "userId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return user_1.UserModel; }, {
            foreignKey: {
                allowNull: false
            },
            onDelete: 'cascade'
        })
    ], OAuthTokenModel.prototype, "User");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return oauth_client_1.OAuthClientModel; }),
        sequelize_typescript_1.Column
    ], OAuthTokenModel.prototype, "oAuthClientId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return oauth_client_1.OAuthClientModel; }, {
            foreignKey: {
                allowNull: false
            },
            onDelete: 'cascade'
        })
    ], OAuthTokenModel.prototype, "OAuthClients");
    __decorate([
        sequelize_typescript_1.AfterUpdate,
        sequelize_typescript_1.AfterDestroy
    ], OAuthTokenModel, "removeTokenCache");
    OAuthTokenModel = OAuthTokenModel_1 = __decorate([
        sequelize_typescript_1.Scopes(function () {
            var _a;
            return (_a = {},
                _a[ScopeNames.WITH_USER] = {
                    include: [
                        {
                            model: user_1.UserModel.unscoped(),
                            required: true,
                            include: [
                                {
                                    attributes: ['id'],
                                    model: account_1.AccountModel.unscoped(),
                                    required: true,
                                    include: [
                                        {
                                            attributes: ['id', 'url'],
                                            model: actor_1.ActorModel.unscoped(),
                                            required: true
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
            tableName: 'oAuthToken',
            indexes: [
                {
                    fields: ['refreshToken'],
                    unique: true
                },
                {
                    fields: ['accessToken'],
                    unique: true
                },
                {
                    fields: ['userId']
                },
                {
                    fields: ['oAuthClientId']
                }
            ]
        })
    ], OAuthTokenModel);
    return OAuthTokenModel;
}(sequelize_typescript_1.Model));
exports.OAuthTokenModel = OAuthTokenModel;
