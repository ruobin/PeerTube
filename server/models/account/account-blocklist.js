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
var account_1 = require("./account");
var utils_1 = require("../utils");
var sequelize_1 = require("sequelize");
var ScopeNames;
(function (ScopeNames) {
    ScopeNames["WITH_ACCOUNTS"] = "WITH_ACCOUNTS";
})(ScopeNames || (ScopeNames = {}));
var AccountBlocklistModel = /** @class */ (function (_super) {
    __extends(AccountBlocklistModel, _super);
    function AccountBlocklistModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AccountBlocklistModel_1 = AccountBlocklistModel;
    AccountBlocklistModel.isAccountMutedBy = function (accountId, targetAccountId) {
        return AccountBlocklistModel_1.isAccountMutedByMulti([accountId], targetAccountId)
            .then(function (result) { return result[accountId]; });
    };
    AccountBlocklistModel.isAccountMutedByMulti = function (accountIds, targetAccountId) {
        var _a;
        var query = {
            attributes: ['accountId', 'id'],
            where: {
                accountId: (_a = {},
                    _a[sequelize_1.Op["in"]] = accountIds // FIXME: sequelize ANY seems broken
                ,
                    _a),
                targetAccountId: targetAccountId
            },
            raw: true
        };
        return AccountBlocklistModel_1.unscoped()
            .findAll(query)
            .then(function (rows) {
            var result = {};
            var _loop_1 = function (accountId) {
                result[accountId] = !!rows.find(function (r) { return r.accountId === accountId; });
            };
            for (var _i = 0, accountIds_1 = accountIds; _i < accountIds_1.length; _i++) {
                var accountId = accountIds_1[_i];
                _loop_1(accountId);
            }
            return result;
        });
    };
    AccountBlocklistModel.loadByAccountAndTarget = function (accountId, targetAccountId) {
        var query = {
            where: {
                accountId: accountId,
                targetAccountId: targetAccountId
            }
        };
        return AccountBlocklistModel_1.findOne(query);
    };
    AccountBlocklistModel.listForApi = function (accountId, start, count, sort) {
        var query = {
            offset: start,
            limit: count,
            order: utils_1.getSort(sort),
            where: {
                accountId: accountId
            }
        };
        return AccountBlocklistModel_1
            .scope([ScopeNames.WITH_ACCOUNTS])
            .findAndCountAll(query)
            .then(function (_a) {
            var rows = _a.rows, count = _a.count;
            return { total: count, data: rows };
        });
    };
    AccountBlocklistModel.prototype.toFormattedJSON = function () {
        return {
            byAccount: this.ByAccount.toFormattedJSON(),
            blockedAccount: this.BlockedAccount.toFormattedJSON(),
            createdAt: this.createdAt
        };
    };
    var AccountBlocklistModel_1;
    __decorate([
        sequelize_typescript_1.CreatedAt
    ], AccountBlocklistModel.prototype, "createdAt");
    __decorate([
        sequelize_typescript_1.UpdatedAt
    ], AccountBlocklistModel.prototype, "updatedAt");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return account_1.AccountModel; }),
        sequelize_typescript_1.Column
    ], AccountBlocklistModel.prototype, "accountId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return account_1.AccountModel; }, {
            foreignKey: {
                name: 'accountId',
                allowNull: false
            },
            as: 'ByAccount',
            onDelete: 'CASCADE'
        })
    ], AccountBlocklistModel.prototype, "ByAccount");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return account_1.AccountModel; }),
        sequelize_typescript_1.Column
    ], AccountBlocklistModel.prototype, "targetAccountId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return account_1.AccountModel; }, {
            foreignKey: {
                name: 'targetAccountId',
                allowNull: false
            },
            as: 'BlockedAccount',
            onDelete: 'CASCADE'
        })
    ], AccountBlocklistModel.prototype, "BlockedAccount");
    AccountBlocklistModel = AccountBlocklistModel_1 = __decorate([
        sequelize_typescript_1.Scopes(function () {
            var _a;
            return (_a = {},
                _a[ScopeNames.WITH_ACCOUNTS] = {
                    include: [
                        {
                            model: account_1.AccountModel,
                            required: true,
                            as: 'ByAccount'
                        },
                        {
                            model: account_1.AccountModel,
                            required: true,
                            as: 'BlockedAccount'
                        }
                    ]
                },
                _a);
        }),
        sequelize_typescript_1.Table({
            tableName: 'accountBlocklist',
            indexes: [
                {
                    fields: ['accountId', 'targetAccountId'],
                    unique: true
                },
                {
                    fields: ['targetAccountId']
                }
            ]
        })
    ], AccountBlocklistModel);
    return AccountBlocklistModel;
}(sequelize_typescript_1.Model));
exports.AccountBlocklistModel = AccountBlocklistModel;
