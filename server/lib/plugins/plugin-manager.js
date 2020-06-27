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
var plugin_1 = require("../../models/server/plugin");
var logger_1 = require("../../helpers/logger");
var path_1 = require("path");
var config_1 = require("../../initializers/config");
var plugins_1 = require("../../helpers/custom-validators/plugins");
var fs_1 = require("fs");
var constants_1 = require("../../initializers/constants");
var plugin_type_1 = require("../../../shared/models/plugins/plugin.type");
var yarn_1 = require("./yarn");
var fs_extra_1 = require("fs-extra");
var server_hook_model_1 = require("../../../shared/models/plugins/server-hook.model");
var hooks_1 = require("../../../shared/core-utils/plugins/hooks");
var client_html_1 = require("../client-html");
var PluginManager = /** @class */ (function () {
    function PluginManager() {
        this.registeredPlugins = {};
        this.settings = {};
        this.hooks = {};
        this.translations = {};
        this.updatedVideoConstants = {
            language: {},
            licence: {},
            category: {}
        };
    }
    // ###################### Getters ######################
    PluginManager.prototype.isRegistered = function (npmName) {
        return !!this.getRegisteredPluginOrTheme(npmName);
    };
    PluginManager.prototype.getRegisteredPluginOrTheme = function (npmName) {
        return this.registeredPlugins[npmName];
    };
    PluginManager.prototype.getRegisteredPlugin = function (name) {
        var npmName = plugin_1.PluginModel.buildNpmName(name, plugin_type_1.PluginType.PLUGIN);
        var registered = this.getRegisteredPluginOrTheme(npmName);
        if (!registered || registered.type !== plugin_type_1.PluginType.PLUGIN)
            return undefined;
        return registered;
    };
    PluginManager.prototype.getRegisteredTheme = function (name) {
        var npmName = plugin_1.PluginModel.buildNpmName(name, plugin_type_1.PluginType.THEME);
        var registered = this.getRegisteredPluginOrTheme(npmName);
        if (!registered || registered.type !== plugin_type_1.PluginType.THEME)
            return undefined;
        return registered;
    };
    PluginManager.prototype.getRegisteredPlugins = function () {
        return this.getRegisteredPluginsOrThemes(plugin_type_1.PluginType.PLUGIN);
    };
    PluginManager.prototype.getRegisteredThemes = function () {
        return this.getRegisteredPluginsOrThemes(plugin_type_1.PluginType.THEME);
    };
    PluginManager.prototype.getRegisteredSettings = function (npmName) {
        return this.settings[npmName] || [];
    };
    PluginManager.prototype.getTranslations = function (locale) {
        return this.translations[locale] || {};
    };
    // ###################### Hooks ######################
    PluginManager.prototype.runHook = function (hookName, result, params) {
        return __awaiter(this, void 0, void 0, function () {
            var hookType, _loop_1, _i, _a, hook;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.hooks[hookName])
                            return [2 /*return*/, Promise.resolve(result)];
                        hookType = hooks_1.getHookType(hookName);
                        _loop_1 = function (hook) {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        logger_1.logger.debug('Running hook %s of plugin %s.', hookName, hook.npmName);
                                        return [4 /*yield*/, hooks_1.internalRunHook(hook.handler, hookType, result, params, function (err) {
                                                logger_1.logger.error('Cannot run hook %s of plugin %s.', hookName, hook.pluginName, { err: err });
                                            })];
                                    case 1:
                                        result = _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        };
                        _i = 0, _a = this.hooks[hookName];
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        hook = _a[_i];
                        return [5 /*yield**/, _loop_1(hook)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, result];
                }
            });
        });
    };
    // ###################### Registration ######################
    PluginManager.prototype.registerPluginsAndThemes = function () {
        return __awaiter(this, void 0, void 0, function () {
            var plugins, _i, plugins_2, plugin, err_1, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.resetCSSGlobalFile()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, plugin_1.PluginModel.listEnabledPluginsAndThemes()];
                    case 2:
                        plugins = _b.sent();
                        _i = 0, plugins_2 = plugins;
                        _b.label = 3;
                    case 3:
                        if (!(_i < plugins_2.length)) return [3 /*break*/, 12];
                        plugin = plugins_2[_i];
                        _b.label = 4;
                    case 4:
                        _b.trys.push([4, 6, , 11]);
                        return [4 /*yield*/, this.registerPluginOrTheme(plugin)];
                    case 5:
                        _b.sent();
                        return [3 /*break*/, 11];
                    case 6:
                        err_1 = _b.sent();
                        _b.label = 7;
                    case 7:
                        _b.trys.push([7, 9, , 10]);
                        return [4 /*yield*/, this.unregister(plugin_1.PluginModel.buildNpmName(plugin.name, plugin.type))];
                    case 8:
                        _b.sent();
                        return [3 /*break*/, 10];
                    case 9:
                        _a = _b.sent();
                        return [3 /*break*/, 10];
                    case 10:
                        logger_1.logger.error('Cannot register plugin %s, skipping.', plugin.name, { err: err_1 });
                        return [3 /*break*/, 11];
                    case 11:
                        _i++;
                        return [3 /*break*/, 3];
                    case 12:
                        this.sortHooksByPriority();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Don't need the plugin type since themes cannot register server code
    PluginManager.prototype.unregister = function (npmName) {
        return __awaiter(this, void 0, void 0, function () {
            var plugin, _i, _a, key;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        logger_1.logger.info('Unregister plugin %s.', npmName);
                        plugin = this.getRegisteredPluginOrTheme(npmName);
                        if (!plugin) {
                            throw new Error("Unknown plugin " + npmName + " to unregister");
                        }
                        delete this.registeredPlugins[plugin.npmName];
                        delete this.settings[plugin.npmName];
                        this.deleteTranslations(plugin.npmName);
                        if (!(plugin.type === plugin_type_1.PluginType.PLUGIN)) return [3 /*break*/, 3];
                        return [4 /*yield*/, plugin.unregister()
                            // Remove hooks of this plugin
                        ];
                    case 1:
                        _b.sent();
                        // Remove hooks of this plugin
                        for (_i = 0, _a = Object.keys(this.hooks); _i < _a.length; _i++) {
                            key = _a[_i];
                            this.hooks[key] = this.hooks[key].filter(function (h) { return h.pluginName !== npmName; });
                        }
                        this.reinitVideoConstants(plugin.npmName);
                        logger_1.logger.info('Regenerating registered plugin CSS to global file.');
                        return [4 /*yield*/, this.regeneratePluginGlobalCSS()];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ###################### Installation ######################
    PluginManager.prototype.install = function (toInstall, version, fromDisk) {
        if (fromDisk === void 0) { fromDisk = false; }
        return __awaiter(this, void 0, void 0, function () {
            var plugin, npmName, _a, pluginType, pluginName, packageJSON, err_2, err_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        logger_1.logger.info('Installing plugin %s.', toInstall);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 8, , 13]);
                        if (!fromDisk) return [3 /*break*/, 3];
                        return [4 /*yield*/, yarn_1.installNpmPluginFromDisk(toInstall)];
                    case 2:
                        _a = _b.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, yarn_1.installNpmPlugin(toInstall, version)];
                    case 4:
                        _a = _b.sent();
                        _b.label = 5;
                    case 5:
                        _a;
                        npmName = fromDisk ? path_1.basename(toInstall) : toInstall;
                        pluginType = plugin_1.PluginModel.getTypeFromNpmName(npmName);
                        pluginName = plugin_1.PluginModel.normalizePluginName(npmName);
                        return [4 /*yield*/, this.getPackageJSON(pluginName, pluginType)];
                    case 6:
                        packageJSON = _b.sent();
                        if (!plugins_1.isPackageJSONValid(packageJSON, pluginType)) {
                            throw new Error('PackageJSON is invalid.');
                        }
                        return [4 /*yield*/, plugin_1.PluginModel.upsert({
                                name: pluginName,
                                description: packageJSON.description,
                                homepage: packageJSON.homepage,
                                type: pluginType,
                                version: packageJSON.version,
                                enabled: true,
                                uninstalled: false,
                                peertubeEngine: packageJSON.engine.peertube
                            }, { returning: true })];
                    case 7:
                        plugin = (_b.sent())[0];
                        return [3 /*break*/, 13];
                    case 8:
                        err_2 = _b.sent();
                        logger_1.logger.error('Cannot install plugin %s, removing it...', toInstall, { err: err_2 });
                        _b.label = 9;
                    case 9:
                        _b.trys.push([9, 11, , 12]);
                        return [4 /*yield*/, yarn_1.removeNpmPlugin(npmName)];
                    case 10:
                        _b.sent();
                        return [3 /*break*/, 12];
                    case 11:
                        err_3 = _b.sent();
                        logger_1.logger.error('Cannot remove plugin %s after failed installation.', toInstall, { err: err_3 });
                        return [3 /*break*/, 12];
                    case 12: throw err_2;
                    case 13:
                        logger_1.logger.info('Successful installation of plugin %s.', toInstall);
                        return [4 /*yield*/, this.registerPluginOrTheme(plugin)];
                    case 14:
                        _b.sent();
                        return [2 /*return*/, plugin];
                }
            });
        });
    };
    PluginManager.prototype.update = function (toUpdate, version, fromDisk) {
        if (fromDisk === void 0) { fromDisk = false; }
        return __awaiter(this, void 0, void 0, function () {
            var npmName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        npmName = fromDisk ? path_1.basename(toUpdate) : toUpdate;
                        logger_1.logger.info('Updating plugin %s.', npmName);
                        // Unregister old hooks
                        return [4 /*yield*/, this.unregister(npmName)];
                    case 1:
                        // Unregister old hooks
                        _a.sent();
                        return [2 /*return*/, this.install(toUpdate, version, fromDisk)];
                }
            });
        });
    };
    PluginManager.prototype.uninstall = function (npmName) {
        return __awaiter(this, void 0, void 0, function () {
            var err_4, plugin;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logger_1.logger.info('Uninstalling plugin %s.', npmName);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.unregister(npmName)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_4 = _a.sent();
                        logger_1.logger.warn('Cannot unregister plugin %s.', npmName, { err: err_4 });
                        return [3 /*break*/, 4];
                    case 4: return [4 /*yield*/, plugin_1.PluginModel.loadByNpmName(npmName)];
                    case 5:
                        plugin = _a.sent();
                        if (!plugin || plugin.uninstalled === true) {
                            logger_1.logger.error('Cannot uninstall plugin %s: it does not exist or is already uninstalled.', npmName);
                            return [2 /*return*/];
                        }
                        plugin.enabled = false;
                        plugin.uninstalled = true;
                        return [4 /*yield*/, plugin.save()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, yarn_1.removeNpmPlugin(npmName)];
                    case 7:
                        _a.sent();
                        logger_1.logger.info('Plugin %s uninstalled.', npmName);
                        return [2 /*return*/];
                }
            });
        });
    };
    // ###################### Private register ######################
    PluginManager.prototype.registerPluginOrTheme = function (plugin) {
        return __awaiter(this, void 0, void 0, function () {
            var npmName, packageJSON, pluginPath, library, clientScripts, _i, _a, c;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        npmName = plugin_1.PluginModel.buildNpmName(plugin.name, plugin.type);
                        logger_1.logger.info('Registering plugin or theme %s.', npmName);
                        return [4 /*yield*/, this.getPackageJSON(plugin.name, plugin.type)];
                    case 1:
                        packageJSON = _b.sent();
                        pluginPath = this.getPluginPath(plugin.name, plugin.type);
                        if (!plugins_1.isPackageJSONValid(packageJSON, plugin.type)) {
                            throw new Error('Package.JSON is invalid.');
                        }
                        if (!(plugin.type === plugin_type_1.PluginType.PLUGIN)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.registerPlugin(plugin, pluginPath, packageJSON)];
                    case 2:
                        library = _b.sent();
                        _b.label = 3;
                    case 3:
                        clientScripts = {};
                        for (_i = 0, _a = packageJSON.clientScripts; _i < _a.length; _i++) {
                            c = _a[_i];
                            clientScripts[c.script] = c;
                        }
                        this.registeredPlugins[npmName] = {
                            npmName: npmName,
                            name: plugin.name,
                            type: plugin.type,
                            version: plugin.version,
                            description: plugin.description,
                            peertubeEngine: plugin.peertubeEngine,
                            path: pluginPath,
                            staticDirs: packageJSON.staticDirs,
                            clientScripts: clientScripts,
                            css: packageJSON.css,
                            unregister: library ? library.unregister : undefined
                        };
                        return [4 /*yield*/, this.addTranslations(plugin, npmName, packageJSON.translations)];
                    case 4:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PluginManager.prototype.registerPlugin = function (plugin, pluginPath, packageJSON) {
        return __awaiter(this, void 0, void 0, function () {
            var npmName, modulePath, library, registerHelpers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        npmName = plugin_1.PluginModel.buildNpmName(plugin.name, plugin.type);
                        modulePath = path_1.join(pluginPath, packageJSON.library);
                        delete require.cache[modulePath];
                        library = require(modulePath);
                        if (!plugins_1.isLibraryCodeValid(library)) {
                            throw new Error('Library code is not valid (miss register or unregister function)');
                        }
                        registerHelpers = this.getRegisterHelpers(npmName, plugin);
                        library.register(registerHelpers)["catch"](function (err) { return logger_1.logger.error('Cannot register plugin %s.', npmName, { err: err }); });
                        logger_1.logger.info('Add plugin %s CSS to global file.', npmName);
                        return [4 /*yield*/, this.addCSSToGlobalFile(pluginPath, packageJSON.css)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, library];
                }
            });
        });
    };
    // ###################### Translations ######################
    PluginManager.prototype.addTranslations = function (plugin, npmName, translationPaths) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, locale, path, json;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _i = 0, _a = Object.keys(translationPaths);
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        locale = _a[_i];
                        path = translationPaths[locale];
                        return [4 /*yield*/, fs_extra_1.readJSON(path_1.join(this.getPluginPath(plugin.name, plugin.type), path))];
                    case 2:
                        json = _b.sent();
                        if (!this.translations[locale])
                            this.translations[locale] = {};
                        this.translations[locale][npmName] = json;
                        logger_1.logger.info('Added locale %s of plugin %s.', locale, npmName);
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PluginManager.prototype.deleteTranslations = function (npmName) {
        for (var _i = 0, _a = Object.keys(this.translations); _i < _a.length; _i++) {
            var locale = _a[_i];
            delete this.translations[locale][npmName];
            logger_1.logger.info('Deleted locale %s of plugin %s.', locale, npmName);
        }
    };
    // ###################### CSS ######################
    PluginManager.prototype.resetCSSGlobalFile = function () {
        client_html_1.ClientHtml.invalidCache();
        return fs_extra_1.outputFile(constants_1.PLUGIN_GLOBAL_CSS_PATH, '');
    };
    PluginManager.prototype.addCSSToGlobalFile = function (pluginPath, cssRelativePaths) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, cssRelativePaths_1, cssPath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _i = 0, cssRelativePaths_1 = cssRelativePaths;
                        _a.label = 1;
                    case 1:
                        if (!(_i < cssRelativePaths_1.length)) return [3 /*break*/, 4];
                        cssPath = cssRelativePaths_1[_i];
                        return [4 /*yield*/, this.concatFiles(path_1.join(pluginPath, cssPath), constants_1.PLUGIN_GLOBAL_CSS_PATH)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        client_html_1.ClientHtml.invalidCache();
                        return [2 /*return*/];
                }
            });
        });
    };
    PluginManager.prototype.concatFiles = function (input, output) {
        return new Promise(function (res, rej) {
            var inputStream = fs_1.createReadStream(input);
            var outputStream = fs_1.createWriteStream(output, { flags: 'a' });
            inputStream.pipe(outputStream);
            inputStream.on('end', function () { return res(); });
            inputStream.on('error', function (err) { return rej(err); });
        });
    };
    PluginManager.prototype.regeneratePluginGlobalCSS = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, plugin;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.resetCSSGlobalFile()];
                    case 1:
                        _b.sent();
                        _i = 0, _a = this.getRegisteredPlugins();
                        _b.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        plugin = _a[_i];
                        return [4 /*yield*/, this.addCSSToGlobalFile(plugin.path, plugin.css)];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // ###################### Utils ######################
    PluginManager.prototype.sortHooksByPriority = function () {
        for (var _i = 0, _a = Object.keys(this.hooks); _i < _a.length; _i++) {
            var hookName = _a[_i];
            this.hooks[hookName].sort(function (a, b) {
                return b.priority - a.priority;
            });
        }
    };
    PluginManager.prototype.getPackageJSON = function (pluginName, pluginType) {
        var pluginPath = path_1.join(this.getPluginPath(pluginName, pluginType), 'package.json');
        return fs_extra_1.readJSON(pluginPath);
    };
    PluginManager.prototype.getPluginPath = function (pluginName, pluginType) {
        var npmName = plugin_1.PluginModel.buildNpmName(pluginName, pluginType);
        return path_1.join(config_1.CONFIG.STORAGE.PLUGINS_DIR, 'node_modules', npmName);
    };
    // ###################### Private getters ######################
    PluginManager.prototype.getRegisteredPluginsOrThemes = function (type) {
        var plugins = [];
        for (var _i = 0, _a = Object.keys(this.registeredPlugins); _i < _a.length; _i++) {
            var npmName = _a[_i];
            var plugin = this.registeredPlugins[npmName];
            if (plugin.type !== type)
                continue;
            plugins.push(plugin);
        }
        return plugins;
    };
    // ###################### Generate register helpers ######################
    PluginManager.prototype.getRegisterHelpers = function (npmName, plugin) {
        var _this = this;
        var registerHook = function (options) {
            if (server_hook_model_1.serverHookObject[options.target] !== true) {
                logger_1.logger.warn('Unknown hook %s of plugin %s. Skipping.', options.target, npmName);
                return;
            }
            if (!_this.hooks[options.target])
                _this.hooks[options.target] = [];
            _this.hooks[options.target].push({
                npmName: npmName,
                pluginName: plugin.name,
                handler: options.handler,
                priority: options.priority || 0
            });
        };
        var registerSetting = function (options) {
            if (!_this.settings[npmName])
                _this.settings[npmName] = [];
            _this.settings[npmName].push(options);
        };
        var settingsManager = {
            getSetting: function (name) { return plugin_1.PluginModel.getSetting(plugin.name, plugin.type, name); },
            setSetting: function (name, value) { return plugin_1.PluginModel.setSetting(plugin.name, plugin.type, name, value); }
        };
        var storageManager = {
            getData: function (key) { return plugin_1.PluginModel.getData(plugin.name, plugin.type, key); },
            storeData: function (key, data) { return plugin_1.PluginModel.storeData(plugin.name, plugin.type, key, data); }
        };
        var videoLanguageManager = {
            addLanguage: function (key, label) { return _this.addConstant({ npmName: npmName, type: 'language', obj: constants_1.VIDEO_LANGUAGES, key: key, label: label }); },
            deleteLanguage: function (key) { return _this.deleteConstant({ npmName: npmName, type: 'language', obj: constants_1.VIDEO_LANGUAGES, key: key }); }
        };
        var videoCategoryManager = {
            addCategory: function (key, label) { return _this.addConstant({ npmName: npmName, type: 'category', obj: constants_1.VIDEO_CATEGORIES, key: key, label: label }); },
            deleteCategory: function (key) { return _this.deleteConstant({ npmName: npmName, type: 'category', obj: constants_1.VIDEO_CATEGORIES, key: key }); }
        };
        var videoLicenceManager = {
            addLicence: function (key, label) { return _this.addConstant({ npmName: npmName, type: 'licence', obj: constants_1.VIDEO_LICENCES, key: key, label: label }); },
            deleteLicence: function (key) { return _this.deleteConstant({ npmName: npmName, type: 'licence', obj: constants_1.VIDEO_LICENCES, key: key }); }
        };
        var peertubeHelpers = {
            logger: logger_1.logger
        };
        return {
            registerHook: registerHook,
            registerSetting: registerSetting,
            settingsManager: settingsManager,
            storageManager: storageManager,
            videoLanguageManager: videoLanguageManager,
            videoCategoryManager: videoCategoryManager,
            videoLicenceManager: videoLicenceManager,
            peertubeHelpers: peertubeHelpers
        };
    };
    PluginManager.prototype.addConstant = function (parameters) {
        var npmName = parameters.npmName, type = parameters.type, obj = parameters.obj, key = parameters.key, label = parameters.label;
        if (obj[key]) {
            logger_1.logger.warn('Cannot add %s %s by plugin %s: key already exists.', type, npmName, key);
            return false;
        }
        if (!this.updatedVideoConstants[type][npmName]) {
            this.updatedVideoConstants[type][npmName] = {
                added: [],
                deleted: []
            };
        }
        this.updatedVideoConstants[type][npmName].added.push({ key: key, label: label });
        obj[key] = label;
        return true;
    };
    PluginManager.prototype.deleteConstant = function (parameters) {
        var npmName = parameters.npmName, type = parameters.type, obj = parameters.obj, key = parameters.key;
        if (!obj[key]) {
            logger_1.logger.warn('Cannot delete %s %s by plugin %s: key does not exist.', type, npmName, key);
            return false;
        }
        if (!this.updatedVideoConstants[type][npmName]) {
            this.updatedVideoConstants[type][npmName] = {
                added: [],
                deleted: []
            };
        }
        this.updatedVideoConstants[type][npmName].deleted.push({ key: key, label: obj[key] });
        delete obj[key];
        return true;
    };
    PluginManager.prototype.reinitVideoConstants = function (npmName) {
        var hash = {
            language: constants_1.VIDEO_LANGUAGES,
            licence: constants_1.VIDEO_LICENCES,
            category: constants_1.VIDEO_CATEGORIES
        };
        var types = ['language', 'licence', 'category'];
        for (var _i = 0, types_1 = types; _i < types_1.length; _i++) {
            var type = types_1[_i];
            var updatedConstants = this.updatedVideoConstants[type][npmName];
            if (!updatedConstants)
                continue;
            for (var _a = 0, _b = updatedConstants.added; _a < _b.length; _a++) {
                var added = _b[_a];
                delete hash[type][added.key];
            }
            for (var _c = 0, _d = updatedConstants.deleted; _c < _d.length; _c++) {
                var deleted = _d[_c];
                hash[type][deleted.key] = deleted.label;
            }
            delete this.updatedVideoConstants[type][npmName];
        }
    };
    Object.defineProperty(PluginManager, "Instance", {
        get: function () {
            return this.instance || (this.instance = new this());
        },
        enumerable: true,
        configurable: true
    });
    return PluginManager;
}());
exports.PluginManager = PluginManager;
