"use strict";
exports.__esModule = true;
var requests_1 = require("../requests/requests");
var fs_extra_1 = require("fs-extra");
var miscs_1 = require("../miscs/miscs");
var path_1 = require("path");
function listPlugins(parameters) {
    var url = parameters.url, accessToken = parameters.accessToken, start = parameters.start, count = parameters.count, sort = parameters.sort, pluginType = parameters.pluginType, uninstalled = parameters.uninstalled, _a = parameters.expectedStatus, expectedStatus = _a === void 0 ? 200 : _a;
    var path = '/api/v1/plugins';
    return requests_1.makeGetRequest({
        url: url,
        path: path,
        token: accessToken,
        query: {
            start: start,
            count: count,
            sort: sort,
            pluginType: pluginType,
            uninstalled: uninstalled
        },
        statusCodeExpected: expectedStatus
    });
}
exports.listPlugins = listPlugins;
function listAvailablePlugins(parameters) {
    var url = parameters.url, accessToken = parameters.accessToken, start = parameters.start, count = parameters.count, sort = parameters.sort, pluginType = parameters.pluginType, search = parameters.search, currentPeerTubeEngine = parameters.currentPeerTubeEngine, _a = parameters.expectedStatus, expectedStatus = _a === void 0 ? 200 : _a;
    var path = '/api/v1/plugins/available';
    var query = {
        start: start,
        count: count,
        sort: sort,
        pluginType: pluginType,
        currentPeerTubeEngine: currentPeerTubeEngine,
        search: search
    };
    return requests_1.makeGetRequest({
        url: url,
        path: path,
        token: accessToken,
        query: query,
        statusCodeExpected: expectedStatus
    });
}
exports.listAvailablePlugins = listAvailablePlugins;
function getPlugin(parameters) {
    var url = parameters.url, accessToken = parameters.accessToken, npmName = parameters.npmName, _a = parameters.expectedStatus, expectedStatus = _a === void 0 ? 200 : _a;
    var path = '/api/v1/plugins/' + npmName;
    return requests_1.makeGetRequest({
        url: url,
        path: path,
        token: accessToken,
        statusCodeExpected: expectedStatus
    });
}
exports.getPlugin = getPlugin;
function updatePluginSettings(parameters) {
    var url = parameters.url, accessToken = parameters.accessToken, npmName = parameters.npmName, settings = parameters.settings, _a = parameters.expectedStatus, expectedStatus = _a === void 0 ? 204 : _a;
    var path = '/api/v1/plugins/' + npmName + '/settings';
    return requests_1.makePutBodyRequest({
        url: url,
        path: path,
        token: accessToken,
        fields: { settings: settings },
        statusCodeExpected: expectedStatus
    });
}
exports.updatePluginSettings = updatePluginSettings;
function getPluginRegisteredSettings(parameters) {
    var url = parameters.url, accessToken = parameters.accessToken, npmName = parameters.npmName, _a = parameters.expectedStatus, expectedStatus = _a === void 0 ? 200 : _a;
    var path = '/api/v1/plugins/' + npmName + '/registered-settings';
    return requests_1.makeGetRequest({
        url: url,
        path: path,
        token: accessToken,
        statusCodeExpected: expectedStatus
    });
}
exports.getPluginRegisteredSettings = getPluginRegisteredSettings;
function getPublicSettings(parameters) {
    var url = parameters.url, npmName = parameters.npmName, _a = parameters.expectedStatus, expectedStatus = _a === void 0 ? 200 : _a;
    var path = '/api/v1/plugins/' + npmName + '/public-settings';
    return requests_1.makeGetRequest({
        url: url,
        path: path,
        statusCodeExpected: expectedStatus
    });
}
exports.getPublicSettings = getPublicSettings;
function getPluginTranslations(parameters) {
    var url = parameters.url, locale = parameters.locale, _a = parameters.expectedStatus, expectedStatus = _a === void 0 ? 200 : _a;
    var path = '/plugins/translations/' + locale + '.json';
    return requests_1.makeGetRequest({
        url: url,
        path: path,
        statusCodeExpected: expectedStatus
    });
}
exports.getPluginTranslations = getPluginTranslations;
function installPlugin(parameters) {
    var url = parameters.url, accessToken = parameters.accessToken, npmName = parameters.npmName, path = parameters.path, _a = parameters.expectedStatus, expectedStatus = _a === void 0 ? 200 : _a;
    var apiPath = '/api/v1/plugins/install';
    return requests_1.makePostBodyRequest({
        url: url,
        path: apiPath,
        token: accessToken,
        fields: { npmName: npmName, path: path },
        statusCodeExpected: expectedStatus
    });
}
exports.installPlugin = installPlugin;
function updatePlugin(parameters) {
    var url = parameters.url, accessToken = parameters.accessToken, npmName = parameters.npmName, path = parameters.path, _a = parameters.expectedStatus, expectedStatus = _a === void 0 ? 200 : _a;
    var apiPath = '/api/v1/plugins/update';
    return requests_1.makePostBodyRequest({
        url: url,
        path: apiPath,
        token: accessToken,
        fields: { npmName: npmName, path: path },
        statusCodeExpected: expectedStatus
    });
}
exports.updatePlugin = updatePlugin;
function uninstallPlugin(parameters) {
    var url = parameters.url, accessToken = parameters.accessToken, npmName = parameters.npmName, _a = parameters.expectedStatus, expectedStatus = _a === void 0 ? 204 : _a;
    var apiPath = '/api/v1/plugins/uninstall';
    return requests_1.makePostBodyRequest({
        url: url,
        path: apiPath,
        token: accessToken,
        fields: { npmName: npmName },
        statusCodeExpected: expectedStatus
    });
}
exports.uninstallPlugin = uninstallPlugin;
function getPluginsCSS(url) {
    var path = '/plugins/global.css';
    return requests_1.makeGetRequest({
        url: url,
        path: path,
        statusCodeExpected: 200
    });
}
exports.getPluginsCSS = getPluginsCSS;
function getPackageJSONPath(server, npmName) {
    return path_1.join(miscs_1.root(), 'test' + server.internalServerNumber, 'plugins', 'node_modules', npmName, 'package.json');
}
exports.getPackageJSONPath = getPackageJSONPath;
function updatePluginPackageJSON(server, npmName, json) {
    var path = getPackageJSONPath(server, npmName);
    return fs_extra_1.writeJSON(path, json);
}
exports.updatePluginPackageJSON = updatePluginPackageJSON;
function getPluginPackageJSON(server, npmName) {
    var path = getPackageJSONPath(server, npmName);
    return fs_extra_1.readJSON(path);
}
exports.getPluginPackageJSON = getPluginPackageJSON;
function getPluginTestPath(suffix) {
    if (suffix === void 0) { suffix = ''; }
    return path_1.join(miscs_1.root(), 'server', 'tests', 'fixtures', 'peertube-plugin-test' + suffix);
}
exports.getPluginTestPath = getPluginTestPath;
