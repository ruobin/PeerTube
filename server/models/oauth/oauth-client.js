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
var oauth_token_1 = require("./oauth-token");
var OAuthClientModel = /** @class */ (function (_super) {
    __extends(OAuthClientModel, _super);
    function OAuthClientModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OAuthClientModel_1 = OAuthClientModel;
    OAuthClientModel.countTotal = function () {
        return OAuthClientModel_1.count();
    };
    OAuthClientModel.loadFirstClient = function () {
        return OAuthClientModel_1.findOne();
    };
    OAuthClientModel.getByIdAndSecret = function (clientId, clientSecret) {
        var query = {
            where: {
                clientId: clientId,
                clientSecret: clientSecret
            }
        };
        return OAuthClientModel_1.findOne(query);
    };
    var OAuthClientModel_1;
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Column
    ], OAuthClientModel.prototype, "clientId");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Column
    ], OAuthClientModel.prototype, "clientSecret");
    __decorate([
        sequelize_typescript_1.Column(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING))
    ], OAuthClientModel.prototype, "grants");
    __decorate([
        sequelize_typescript_1.Column(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING))
    ], OAuthClientModel.prototype, "redirectUris");
    __decorate([
        sequelize_typescript_1.CreatedAt
    ], OAuthClientModel.prototype, "createdAt");
    __decorate([
        sequelize_typescript_1.UpdatedAt
    ], OAuthClientModel.prototype, "updatedAt");
    __decorate([
        sequelize_typescript_1.HasMany(function () { return oauth_token_1.OAuthTokenModel; }, {
            onDelete: 'cascade'
        })
    ], OAuthClientModel.prototype, "OAuthTokens");
    OAuthClientModel = OAuthClientModel_1 = __decorate([
        sequelize_typescript_1.Table({
            tableName: 'oAuthClient',
            indexes: [
                {
                    fields: ['clientId'],
                    unique: true
                },
                {
                    fields: ['clientId', 'clientSecret'],
                    unique: true
                }
            ]
        })
    ], OAuthClientModel);
    return OAuthClientModel;
}(sequelize_typescript_1.Model));
exports.OAuthClientModel = OAuthClientModel;
