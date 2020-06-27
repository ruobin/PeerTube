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
var server_1 = require("./server");
var utils_1 = require("../utils");
var ScopeNames;
(function (ScopeNames) {
    ScopeNames["WITH_ACCOUNT"] = "WITH_ACCOUNT";
    ScopeNames["WITH_SERVER"] = "WITH_SERVER";
})(ScopeNames || (ScopeNames = {}));
var ServerBlocklistModel = /** @class */ (function (_super) {
    __extends(ServerBlocklistModel, _super);
    function ServerBlocklistModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ServerBlocklistModel_1 = ServerBlocklistModel;
    ServerBlocklistModel.loadByAccountAndHost = function (accountId, host) {
        var query = {
            where: {
                accountId: accountId
            },
            include: [
                {
                    model: server_1.ServerModel,
                    where: {
                        host: host
                    },
                    required: true
                }
            ]
        };
        return ServerBlocklistModel_1.findOne(query);
    };
    ServerBlocklistModel.listForApi = function (accountId, start, count, sort) {
        var query = {
            offset: start,
            limit: count,
            order: utils_1.getSort(sort),
            where: {
                accountId: accountId
            }
        };
        return ServerBlocklistModel_1
            .scope([ScopeNames.WITH_ACCOUNT, ScopeNames.WITH_SERVER])
            .findAndCountAll(query)
            .then(function (_a) {
            var rows = _a.rows, count = _a.count;
            return { total: count, data: rows };
        });
    };
    ServerBlocklistModel.prototype.toFormattedJSON = function () {
        return {
            byAccount: this.ByAccount.toFormattedJSON(),
            blockedServer: this.BlockedServer.toFormattedJSON(),
            createdAt: this.createdAt
        };
    };
    var ServerBlocklistModel_1;
    __decorate([
        sequelize_typescript_1.CreatedAt
    ], ServerBlocklistModel.prototype, "createdAt");
    __decorate([
        sequelize_typescript_1.UpdatedAt
    ], ServerBlocklistModel.prototype, "updatedAt");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return account_1.AccountModel; }),
        sequelize_typescript_1.Column
    ], ServerBlocklistModel.prototype, "accountId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return account_1.AccountModel; }, {
            foreignKey: {
                name: 'accountId',
                allowNull: false
            },
            onDelete: 'CASCADE'
        })
    ], ServerBlocklistModel.prototype, "ByAccount");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return server_1.ServerModel; }),
        sequelize_typescript_1.Column
    ], ServerBlocklistModel.prototype, "targetServerId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return server_1.ServerModel; }, {
            foreignKey: {
                allowNull: false
            },
            onDelete: 'CASCADE'
        })
    ], ServerBlocklistModel.prototype, "BlockedServer");
    ServerBlocklistModel = ServerBlocklistModel_1 = __decorate([
        sequelize_typescript_1.Scopes(function () {
            var _a;
            return (_a = {},
                _a[ScopeNames.WITH_ACCOUNT] = {
                    include: [
                        {
                            model: account_1.AccountModel,
                            required: true
                        }
                    ]
                },
                _a[ScopeNames.WITH_SERVER] = {
                    include: [
                        {
                            model: server_1.ServerModel,
                            required: true
                        }
                    ]
                },
                _a);
        }),
        sequelize_typescript_1.Table({
            tableName: 'serverBlocklist',
            indexes: [
                {
                    fields: ['accountId', 'targetServerId'],
                    unique: true
                },
                {
                    fields: ['targetServerId']
                }
            ]
        })
    ], ServerBlocklistModel);
    return ServerBlocklistModel;
}(sequelize_typescript_1.Model));
exports.ServerBlocklistModel = ServerBlocklistModel;
