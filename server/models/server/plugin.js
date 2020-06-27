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
var utils_1 = require("../utils");
var plugins_1 = require("../../helpers/custom-validators/plugins");
var plugin_type_1 = require("../../../shared/models/plugins/plugin.type");
var sequelize_1 = require("sequelize");
var PluginModel = /** @class */ (function (_super) {
    __extends(PluginModel, _super);
    function PluginModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PluginModel_1 = PluginModel;
    PluginModel.listEnabledPluginsAndThemes = function () {
        var query = {
            where: {
                enabled: true,
                uninstalled: false
            }
        };
        return PluginModel_1.findAll(query);
    };
    PluginModel.loadByNpmName = function (npmName) {
        var name = this.normalizePluginName(npmName);
        var type = this.getTypeFromNpmName(npmName);
        var query = {
            where: {
                name: name,
                type: type
            }
        };
        return PluginModel_1.findOne(query);
    };
    PluginModel.getSetting = function (pluginName, pluginType, settingName) {
        var query = {
            attributes: ['settings'],
            where: {
                name: pluginName,
                type: pluginType
            }
        };
        return PluginModel_1.findOne(query)
            .then(function (p) {
            if (!p || !p.settings)
                return undefined;
            return p.settings[settingName];
        });
    };
    PluginModel.setSetting = function (pluginName, pluginType, settingName, settingValue) {
        var _a;
        var query = {
            where: {
                name: pluginName,
                type: pluginType
            }
        };
        var toSave = (_a = {},
            _a["settings." + settingName] = settingValue,
            _a);
        return PluginModel_1.update(toSave, query)
            .then(function () { return undefined; });
    };
    PluginModel.getData = function (pluginName, pluginType, key) {
        var query = {
            raw: true,
            attributes: [[sequelize_1.json('storage.' + key), 'value']],
            where: {
                name: pluginName,
                type: pluginType
            }
        };
        return PluginModel_1.findOne(query)
            .then(function (c) {
            if (!c)
                return undefined;
            var value = c.value;
            if (typeof value === 'string' && value.startsWith('{')) {
                try {
                    return JSON.parse(value);
                }
                catch (_a) {
                    return value;
                }
            }
            return c.value;
        });
    };
    PluginModel.storeData = function (pluginName, pluginType, key, data) {
        var _a;
        var query = {
            where: {
                name: pluginName,
                type: pluginType
            }
        };
        var toSave = (_a = {},
            _a["storage." + key] = data,
            _a);
        return PluginModel_1.update(toSave, query)
            .then(function () { return undefined; });
    };
    PluginModel.listForApi = function (options) {
        var _a = options.uninstalled, uninstalled = _a === void 0 ? false : _a;
        var query = {
            offset: options.start,
            limit: options.count,
            order: utils_1.getSort(options.sort),
            where: {
                uninstalled: uninstalled
            }
        };
        if (options.pluginType)
            query.where['type'] = options.pluginType;
        return PluginModel_1
            .findAndCountAll(query)
            .then(function (_a) {
            var rows = _a.rows, count = _a.count;
            return { total: count, data: rows };
        });
    };
    PluginModel.listInstalled = function () {
        var query = {
            where: {
                uninstalled: false
            }
        };
        return PluginModel_1.findAll(query);
    };
    PluginModel.normalizePluginName = function (npmName) {
        return npmName.replace(/^peertube-((theme)|(plugin))-/, '');
    };
    PluginModel.getTypeFromNpmName = function (npmName) {
        return npmName.startsWith('peertube-plugin-')
            ? plugin_type_1.PluginType.PLUGIN
            : plugin_type_1.PluginType.THEME;
    };
    PluginModel.buildNpmName = function (name, type) {
        if (type === plugin_type_1.PluginType.THEME)
            return 'peertube-theme-' + name;
        return 'peertube-plugin-' + name;
    };
    PluginModel.prototype.getPublicSettings = function (registeredSettings) {
        var result = {};
        var settings = this.settings || {};
        for (var _i = 0, registeredSettings_1 = registeredSettings; _i < registeredSettings_1.length; _i++) {
            var r = registeredSettings_1[_i];
            if (r.private !== false)
                continue;
            result[r.name] = settings[r.name] || r["default"] || null;
        }
        return result;
    };
    PluginModel.prototype.toFormattedJSON = function () {
        return {
            name: this.name,
            type: this.type,
            version: this.version,
            latestVersion: this.latestVersion,
            enabled: this.enabled,
            uninstalled: this.uninstalled,
            peertubeEngine: this.peertubeEngine,
            description: this.description,
            homepage: this.homepage,
            settings: this.settings,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    };
    var PluginModel_1;
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Is('PluginName', function (value) { return utils_1.throwIfNotValid(value, plugins_1.isPluginNameValid, 'name'); }),
        sequelize_typescript_1.Column
    ], PluginModel.prototype, "name");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Is('PluginType', function (value) { return utils_1.throwIfNotValid(value, plugins_1.isPluginTypeValid, 'type'); }),
        sequelize_typescript_1.Column
    ], PluginModel.prototype, "type");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Is('PluginVersion', function (value) { return utils_1.throwIfNotValid(value, plugins_1.isPluginVersionValid, 'version'); }),
        sequelize_typescript_1.Column
    ], PluginModel.prototype, "version");
    __decorate([
        sequelize_typescript_1.AllowNull(true),
        sequelize_typescript_1.Is('PluginLatestVersion', function (value) { return utils_1.throwIfNotValid(value, plugins_1.isPluginVersionValid, 'version'); }),
        sequelize_typescript_1.Column
    ], PluginModel.prototype, "latestVersion");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Column
    ], PluginModel.prototype, "enabled");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Column
    ], PluginModel.prototype, "uninstalled");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Column
    ], PluginModel.prototype, "peertubeEngine");
    __decorate([
        sequelize_typescript_1.AllowNull(true),
        sequelize_typescript_1.Is('PluginDescription', function (value) { return utils_1.throwIfNotValid(value, plugins_1.isPluginDescriptionValid, 'description'); }),
        sequelize_typescript_1.Column
    ], PluginModel.prototype, "description");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Is('PluginHomepage', function (value) { return utils_1.throwIfNotValid(value, plugins_1.isPluginHomepage, 'homepage'); }),
        sequelize_typescript_1.Column
    ], PluginModel.prototype, "homepage");
    __decorate([
        sequelize_typescript_1.AllowNull(true),
        sequelize_typescript_1.Column(sequelize_typescript_1.DataType.JSONB)
    ], PluginModel.prototype, "settings");
    __decorate([
        sequelize_typescript_1.AllowNull(true),
        sequelize_typescript_1.Column(sequelize_typescript_1.DataType.JSONB)
    ], PluginModel.prototype, "storage");
    __decorate([
        sequelize_typescript_1.CreatedAt
    ], PluginModel.prototype, "createdAt");
    __decorate([
        sequelize_typescript_1.UpdatedAt
    ], PluginModel.prototype, "updatedAt");
    PluginModel = PluginModel_1 = __decorate([
        sequelize_typescript_1.DefaultScope(function () { return ({
            attributes: {
                exclude: ['storage']
            }
        }); }),
        sequelize_typescript_1.Table({
            tableName: 'plugin',
            indexes: [
                {
                    fields: ['name', 'type'],
                    unique: true
                }
            ]
        })
    ], PluginModel);
    return PluginModel;
}(sequelize_typescript_1.Model));
exports.PluginModel = PluginModel;
