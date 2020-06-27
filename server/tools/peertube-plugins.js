"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var program = require("commander");
var plugin_type_1 = require("../../shared/models/plugins/plugin.type");
var login_1 = require("../../shared/extra-utils/users/login");
var users_1 = require("../../shared/extra-utils/users/users");
var plugins_1 = require("../../shared/extra-utils/server/plugins");
var cli_1 = require("./cli");
var users_2 = require("../../shared/models/users");
var path_1 = require("path");
var Table = require('cli-table');
program
    .name('plugins')
    .usage('[command] [options]');
program
    .command('list')
    .description('List installed plugins')
    .option('-u, --url <url>', 'Server url')
    .option('-U, --username <username>', 'Username')
    .option('-p, --password <token>', 'Password')
    .option('-t, --only-themes', 'List themes only')
    .option('-P, --only-plugins', 'List plugins only')
    .action(function () { return pluginsListCLI(); });
program
    .command('install')
    .description('Install a plugin or a theme')
    .option('-u, --url <url>', 'Server url')
    .option('-U, --username <username>', 'Username')
    .option('-p, --password <token>', 'Password')
    .option('-P --path <path>', 'Install from a path')
    .option('-n, --npm-name <npmName>', 'Install from npm')
    .action(function (options) { return installPluginCLI(options); });
program
    .command('update')
    .description('Update a plugin or a theme')
    .option('-u, --url <url>', 'Server url')
    .option('-U, --username <username>', 'Username')
    .option('-p, --password <token>', 'Password')
    .option('-P --path <path>', 'Update from a path')
    .option('-n, --npm-name <npmName>', 'Update from npm')
    .action(function (options) { return updatePluginCLI(options); });
program
    .command('uninstall')
    .description('Uninstall a plugin or a theme')
    .option('-u, --url <url>', 'Server url')
    .option('-U, --username <username>', 'Username')
    .option('-p, --password <token>', 'Password')
    .option('-n, --npm-name <npmName>', 'NPM plugin/theme name')
    .action(function (options) { return uninstallPluginCLI(options); });
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
program.parse(process.argv);
// ----------------------------------------------------------------------------
function pluginsListCLI() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, url, username, password, accessToken, pluginType, res, plugins, table, _i, plugins_2, plugin, npmName;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, cli_1.getServerCredentials(program)];
                case 1:
                    _a = _b.sent(), url = _a.url, username = _a.username, password = _a.password;
                    return [4 /*yield*/, getAdminTokenOrDie(url, username, password)];
                case 2:
                    accessToken = _b.sent();
                    if (program['onlyThemes'])
                        pluginType = plugin_type_1.PluginType.THEME;
                    if (program['onlyPlugins'])
                        pluginType = plugin_type_1.PluginType.PLUGIN;
                    return [4 /*yield*/, plugins_1.listPlugins({
                            url: url,
                            accessToken: accessToken,
                            start: 0,
                            count: 100,
                            sort: 'name',
                            pluginType: pluginType
                        })];
                case 3:
                    res = _b.sent();
                    plugins = res.body.data;
                    table = new Table({
                        head: ['name', 'version', 'homepage'],
                        colWidths: [50, 10, 50]
                    });
                    for (_i = 0, plugins_2 = plugins; _i < plugins_2.length; _i++) {
                        plugin = plugins_2[_i];
                        npmName = plugin.type === plugin_type_1.PluginType.PLUGIN
                            ? 'peertube-plugin-' + plugin.name
                            : 'peertube-theme-' + plugin.name;
                        table.push([
                            npmName,
                            plugin.version,
                            plugin.homepage
                        ]);
                    }
                    console.log(table.toString());
                    process.exit(0);
                    return [2 /*return*/];
            }
        });
    });
}
function installPluginCLI(options) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, url, username, password, accessToken, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!options['path'] && !options['npmName']) {
                        console.error('You need to specify the npm name or the path of the plugin you want to install.\n');
                        program.outputHelp();
                        process.exit(-1);
                    }
                    if (options['path'] && !path_1.isAbsolute(options['path'])) {
                        console.error('Path should be absolute.');
                        process.exit(-1);
                    }
                    return [4 /*yield*/, cli_1.getServerCredentials(options)];
                case 1:
                    _a = _b.sent(), url = _a.url, username = _a.username, password = _a.password;
                    return [4 /*yield*/, getAdminTokenOrDie(url, username, password)];
                case 2:
                    accessToken = _b.sent();
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, plugins_1.installPlugin({
                            url: url,
                            accessToken: accessToken,
                            npmName: options['npmName'],
                            path: options['path']
                        })];
                case 4:
                    _b.sent();
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _b.sent();
                    console.error('Cannot install plugin.', err_1);
                    process.exit(-1);
                    return [2 /*return*/];
                case 6:
                    console.log('Plugin installed.');
                    process.exit(0);
                    return [2 /*return*/];
            }
        });
    });
}
function updatePluginCLI(options) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, url, username, password, accessToken, err_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!options['path'] && !options['npmName']) {
                        console.error('You need to specify the npm name or the path of the plugin you want to update.\n');
                        program.outputHelp();
                        process.exit(-1);
                    }
                    if (options['path'] && !path_1.isAbsolute(options['path'])) {
                        console.error('Path should be absolute.');
                        process.exit(-1);
                    }
                    return [4 /*yield*/, cli_1.getServerCredentials(options)];
                case 1:
                    _a = _b.sent(), url = _a.url, username = _a.username, password = _a.password;
                    return [4 /*yield*/, getAdminTokenOrDie(url, username, password)];
                case 2:
                    accessToken = _b.sent();
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, plugins_1.updatePlugin({
                            url: url,
                            accessToken: accessToken,
                            npmName: options['npmName'],
                            path: options['path']
                        })];
                case 4:
                    _b.sent();
                    return [3 /*break*/, 6];
                case 5:
                    err_2 = _b.sent();
                    console.error('Cannot update plugin.', err_2);
                    process.exit(-1);
                    return [2 /*return*/];
                case 6:
                    console.log('Plugin updated.');
                    process.exit(0);
                    return [2 /*return*/];
            }
        });
    });
}
function uninstallPluginCLI(options) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, url, username, password, accessToken, err_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!options['npmName']) {
                        console.error('You need to specify the npm name of the plugin/theme you want to uninstall.\n');
                        program.outputHelp();
                        process.exit(-1);
                    }
                    return [4 /*yield*/, cli_1.getServerCredentials(options)];
                case 1:
                    _a = _b.sent(), url = _a.url, username = _a.username, password = _a.password;
                    return [4 /*yield*/, getAdminTokenOrDie(url, username, password)];
                case 2:
                    accessToken = _b.sent();
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, plugins_1.uninstallPlugin({
                            url: url,
                            accessToken: accessToken,
                            npmName: options['npmName']
                        })];
                case 4:
                    _b.sent();
                    return [3 /*break*/, 6];
                case 5:
                    err_3 = _b.sent();
                    console.error('Cannot uninstall plugin.', err_3);
                    process.exit(-1);
                    return [2 /*return*/];
                case 6:
                    console.log('Plugin uninstalled.');
                    process.exit(0);
                    return [2 /*return*/];
            }
        });
    });
}
function getAdminTokenOrDie(url, username, password) {
    return __awaiter(this, void 0, void 0, function () {
        var accessToken, resMe, me;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, login_1.getAccessToken(url, username, password)];
                case 1:
                    accessToken = _a.sent();
                    return [4 /*yield*/, users_1.getMyUserInformation(url, accessToken)];
                case 2:
                    resMe = _a.sent();
                    me = resMe.body;
                    if (me.role !== users_2.UserRole.ADMINISTRATOR) {
                        console.error('Cannot list plugins if you are not administrator.');
                        process.exit(-1);
                    }
                    return [2 /*return*/, accessToken];
            }
        });
    });
}
