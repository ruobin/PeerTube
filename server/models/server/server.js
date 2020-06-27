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
var servers_1 = require("../../helpers/custom-validators/servers");
var actor_1 = require("../activitypub/actor");
var utils_1 = require("../utils");
var server_blocklist_1 = require("./server-blocklist");
var ServerModel = /** @class */ (function (_super) {
    __extends(ServerModel, _super);
    function ServerModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ServerModel_1 = ServerModel;
    ServerModel.loadByHost = function (host) {
        var query = {
            where: {
                host: host
            }
        };
        return ServerModel_1.findOne(query);
    };
    ServerModel.prototype.isBlocked = function () {
        return this.BlockedByAccounts && this.BlockedByAccounts.length !== 0;
    };
    ServerModel.prototype.toFormattedJSON = function () {
        return {
            host: this.host
        };
    };
    var ServerModel_1;
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Is('Host', function (value) { return utils_1.throwIfNotValid(value, servers_1.isHostValid, 'valid host'); }),
        sequelize_typescript_1.Column
    ], ServerModel.prototype, "host");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Default(false),
        sequelize_typescript_1.Column
    ], ServerModel.prototype, "redundancyAllowed");
    __decorate([
        sequelize_typescript_1.CreatedAt
    ], ServerModel.prototype, "createdAt");
    __decorate([
        sequelize_typescript_1.UpdatedAt
    ], ServerModel.prototype, "updatedAt");
    __decorate([
        sequelize_typescript_1.HasMany(function () { return actor_1.ActorModel; }, {
            foreignKey: {
                name: 'serverId',
                allowNull: true
            },
            onDelete: 'CASCADE',
            hooks: true
        })
    ], ServerModel.prototype, "Actors");
    __decorate([
        sequelize_typescript_1.HasMany(function () { return server_blocklist_1.ServerBlocklistModel; }, {
            foreignKey: {
                allowNull: false
            },
            onDelete: 'CASCADE'
        })
    ], ServerModel.prototype, "BlockedByAccounts");
    ServerModel = ServerModel_1 = __decorate([
        sequelize_typescript_1.Table({
            tableName: 'server',
            indexes: [
                {
                    fields: ['host'],
                    unique: true
                }
            ]
        })
    ], ServerModel);
    return ServerModel;
}(sequelize_typescript_1.Model));
exports.ServerModel = ServerModel;
