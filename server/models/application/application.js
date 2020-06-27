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
var ApplicationModel = /** @class */ (function (_super) {
    __extends(ApplicationModel, _super);
    function ApplicationModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ApplicationModel_1 = ApplicationModel;
    ApplicationModel.countTotal = function () {
        return ApplicationModel_1.count();
    };
    ApplicationModel.load = function () {
        return ApplicationModel_1.findOne();
    };
    var ApplicationModel_1;
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Default(0),
        sequelize_typescript_1.IsInt,
        sequelize_typescript_1.Column
    ], ApplicationModel.prototype, "migrationVersion");
    __decorate([
        sequelize_typescript_1.HasOne(function () { return account_1.AccountModel; }, {
            foreignKey: {
                allowNull: true
            },
            onDelete: 'cascade'
        })
    ], ApplicationModel.prototype, "Account");
    ApplicationModel = ApplicationModel_1 = __decorate([
        sequelize_typescript_1.DefaultScope(function () { return ({
            include: [
                {
                    model: account_1.AccountModel,
                    required: true
                }
            ]
        }); }),
        sequelize_typescript_1.Table({
            tableName: 'application',
            timestamps: false
        })
    ], ApplicationModel);
    return ApplicationModel;
}(sequelize_typescript_1.Model));
exports.ApplicationModel = ApplicationModel;
