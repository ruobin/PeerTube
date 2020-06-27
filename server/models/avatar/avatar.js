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
var path_1 = require("path");
var sequelize_typescript_1 = require("sequelize-typescript");
var constants_1 = require("../../initializers/constants");
var logger_1 = require("../../helpers/logger");
var fs_extra_1 = require("fs-extra");
var config_1 = require("../../initializers/config");
var utils_1 = require("../utils");
var misc_1 = require("../../helpers/custom-validators/activitypub/misc");
var AvatarModel = /** @class */ (function (_super) {
    __extends(AvatarModel, _super);
    function AvatarModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AvatarModel_1 = AvatarModel;
    AvatarModel.removeFilesAndSendDelete = function (instance) {
        logger_1.logger.info('Removing avatar file %s.', instance.filename);
        // Don't block the transaction
        instance.removeAvatar()["catch"](function (err) { return logger_1.logger.error('Cannot remove avatar file %s.', instance.filename, err); });
    };
    AvatarModel.loadByName = function (filename) {
        var query = {
            where: {
                filename: filename
            }
        };
        return AvatarModel_1.findOne(query);
    };
    AvatarModel.prototype.toFormattedJSON = function () {
        return {
            path: this.getStaticPath(),
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    };
    AvatarModel.prototype.getStaticPath = function () {
        return path_1.join(constants_1.LAZY_STATIC_PATHS.AVATARS, this.filename);
    };
    AvatarModel.prototype.getPath = function () {
        return path_1.join(config_1.CONFIG.STORAGE.AVATARS_DIR, this.filename);
    };
    AvatarModel.prototype.removeAvatar = function () {
        var avatarPath = path_1.join(config_1.CONFIG.STORAGE.AVATARS_DIR, this.filename);
        return fs_extra_1.remove(avatarPath);
    };
    var AvatarModel_1;
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Column
    ], AvatarModel.prototype, "filename");
    __decorate([
        sequelize_typescript_1.AllowNull(true),
        sequelize_typescript_1.Is('AvatarFileUrl', function (value) { return utils_1.throwIfNotValid(value, misc_1.isActivityPubUrlValid, 'fileUrl', true); }),
        sequelize_typescript_1.Column
    ], AvatarModel.prototype, "fileUrl");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Column
    ], AvatarModel.prototype, "onDisk");
    __decorate([
        sequelize_typescript_1.CreatedAt
    ], AvatarModel.prototype, "createdAt");
    __decorate([
        sequelize_typescript_1.UpdatedAt
    ], AvatarModel.prototype, "updatedAt");
    __decorate([
        sequelize_typescript_1.AfterDestroy
    ], AvatarModel, "removeFilesAndSendDelete");
    AvatarModel = AvatarModel_1 = __decorate([
        sequelize_typescript_1.Table({
            tableName: 'avatar',
            indexes: [
                {
                    fields: ['filename'],
                    unique: true
                }
            ]
        })
    ], AvatarModel);
    return AvatarModel;
}(sequelize_typescript_1.Model));
exports.AvatarModel = AvatarModel;
