"use strict";
exports.__esModule = true;
var misc_1 = require("./misc");
var validator = require("validator");
var plugin_type_1 = require("../../../shared/models/plugins/plugin.type");
var constants_1 = require("../../initializers/constants");
var misc_2 = require("./activitypub/misc");
var PLUGINS_CONSTRAINTS_FIELDS = constants_1.CONSTRAINTS_FIELDS.PLUGINS;
function isPluginTypeValid(value) {
    return misc_1.exists(value) && validator.isInt('' + value) && plugin_type_1.PluginType[value] !== undefined;
}
exports.isPluginTypeValid = isPluginTypeValid;
function isPluginNameValid(value) {
    return misc_1.exists(value) &&
        validator.isLength(value, PLUGINS_CONSTRAINTS_FIELDS.NAME) &&
        validator.matches(value, /^[a-z\-]+$/);
}
exports.isPluginNameValid = isPluginNameValid;
function isNpmPluginNameValid(value) {
    return misc_1.exists(value) &&
        validator.isLength(value, PLUGINS_CONSTRAINTS_FIELDS.NAME) &&
        validator.matches(value, /^[a-z\-]+$/) &&
        (value.startsWith('peertube-plugin-') || value.startsWith('peertube-theme-'));
}
exports.isNpmPluginNameValid = isNpmPluginNameValid;
function isPluginDescriptionValid(value) {
    return misc_1.exists(value) && validator.isLength(value, PLUGINS_CONSTRAINTS_FIELDS.DESCRIPTION);
}
exports.isPluginDescriptionValid = isPluginDescriptionValid;
function isPluginVersionValid(value) {
    if (!misc_1.exists(value))
        return false;
    var parts = (value + '').split('.');
    return parts.length === 3 && parts.every(function (p) { return validator.isInt(p); });
}
exports.isPluginVersionValid = isPluginVersionValid;
function isPluginEngineValid(engine) {
    return misc_1.exists(engine) && misc_1.exists(engine.peertube);
}
function isPluginHomepage(value) {
    return misc_1.exists(value) && (!value || misc_2.isUrlValid(value));
}
exports.isPluginHomepage = isPluginHomepage;
function isPluginBugs(value) {
    return misc_1.exists(value) && (!value || misc_2.isUrlValid(value));
}
function areStaticDirectoriesValid(staticDirs) {
    if (!misc_1.exists(staticDirs) || typeof staticDirs !== 'object')
        return false;
    for (var _i = 0, _a = Object.keys(staticDirs); _i < _a.length; _i++) {
        var key = _a[_i];
        if (!misc_1.isSafePath(staticDirs[key]))
            return false;
    }
    return true;
}
function areClientScriptsValid(clientScripts) {
    return misc_1.isArray(clientScripts) &&
        clientScripts.every(function (c) {
            return misc_1.isSafePath(c.script) && misc_1.isArray(c.scopes);
        });
}
function areTranslationPathsValid(translations) {
    if (!misc_1.exists(translations) || typeof translations !== 'object')
        return false;
    for (var _i = 0, _a = Object.keys(translations); _i < _a.length; _i++) {
        var key = _a[_i];
        if (!misc_1.isSafePath(translations[key]))
            return false;
    }
    return true;
}
function areCSSPathsValid(css) {
    return misc_1.isArray(css) && css.every(function (c) { return misc_1.isSafePath(c); });
}
function isThemeNameValid(name) {
    return isPluginNameValid(name);
}
exports.isThemeNameValid = isThemeNameValid;
function isPackageJSONValid(packageJSON, pluginType) {
    return isNpmPluginNameValid(packageJSON.name) &&
        isPluginDescriptionValid(packageJSON.description) &&
        isPluginEngineValid(packageJSON.engine) &&
        isPluginHomepage(packageJSON.homepage) &&
        misc_1.exists(packageJSON.author) &&
        isPluginBugs(packageJSON.bugs) &&
        (pluginType === plugin_type_1.PluginType.THEME || misc_1.isSafePath(packageJSON.library)) &&
        areStaticDirectoriesValid(packageJSON.staticDirs) &&
        areCSSPathsValid(packageJSON.css) &&
        areClientScriptsValid(packageJSON.clientScripts) &&
        areTranslationPathsValid(packageJSON.translations);
}
exports.isPackageJSONValid = isPackageJSONValid;
function isLibraryCodeValid(library) {
    return typeof library.register === 'function'
        && typeof library.unregister === 'function';
}
exports.isLibraryCodeValid = isLibraryCodeValid;
