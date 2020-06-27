"use strict";
exports.__esModule = true;
var constants_1 = require("../../initializers/constants");
var plugin_manager_1 = require("./plugin-manager");
var config_1 = require("../../initializers/config");
function getThemeOrDefault(name, defaultTheme) {
    if (isThemeRegistered(name))
        return name;
    // Fallback to admin default theme
    if (name !== config_1.CONFIG.THEME.DEFAULT)
        return getThemeOrDefault(config_1.CONFIG.THEME.DEFAULT, constants_1.DEFAULT_THEME_NAME);
    return defaultTheme;
}
exports.getThemeOrDefault = getThemeOrDefault;
function isThemeRegistered(name) {
    if (name === constants_1.DEFAULT_THEME_NAME || name === constants_1.DEFAULT_USER_THEME_NAME)
        return true;
    return !!plugin_manager_1.PluginManager.Instance.getRegisteredThemes()
        .find(function (r) { return r.name === name; });
}
exports.isThemeRegistered = isThemeRegistered;
