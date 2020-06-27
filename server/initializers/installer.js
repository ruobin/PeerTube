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
var passwordGenerator = require("password-generator");
var shared_1 = require("../../shared");
var logger_1 = require("../helpers/logger");
var user_1 = require("../lib/user");
var user_2 = require("../models/account/user");
var application_1 = require("../models/application/application");
var oauth_client_1 = require("../models/oauth/oauth-client");
var checker_after_init_1 = require("./checker-after-init");
var constants_1 = require("./constants");
var database_1 = require("./database");
var fs_extra_1 = require("fs-extra");
var config_1 = require("./config");
function installApplication() {
    return __awaiter(this, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, Promise.all([
                            // Database related
                            database_1.sequelizeTypescript.sync()
                                .then(function () {
                                return Promise.all([
                                    createApplicationIfNotExist(),
                                    createOAuthClientIfNotExist(),
                                    createOAuthAdminIfNotExist()
                                ]);
                            }),
                            // Directories
                            removeCacheAndTmpDirectories()
                                .then(function () { return createDirectoriesIfNotExist(); })
                        ])];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    logger_1.logger.error('Cannot install application.', { err: err_1 });
                    process.exit(-1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.installApplication = installApplication;
// ---------------------------------------------------------------------------
function removeCacheAndTmpDirectories() {
    var cacheDirectories = Object.keys(constants_1.FILES_CACHE)
        .map(function (k) { return constants_1.FILES_CACHE[k].DIRECTORY; });
    var tasks = [];
    // Cache directories
    for (var _i = 0, _a = Object.keys(cacheDirectories); _i < _a.length; _i++) {
        var key = _a[_i];
        var dir = cacheDirectories[key];
        tasks.push(fs_extra_1.remove(dir));
    }
    tasks.push(fs_extra_1.remove(config_1.CONFIG.STORAGE.TMP_DIR));
    return Promise.all(tasks);
}
function createDirectoriesIfNotExist() {
    var storage = config_1.CONFIG.STORAGE;
    var cacheDirectories = Object.keys(constants_1.FILES_CACHE)
        .map(function (k) { return constants_1.FILES_CACHE[k].DIRECTORY; });
    var tasks = [];
    for (var _i = 0, _a = Object.keys(storage); _i < _a.length; _i++) {
        var key = _a[_i];
        var dir = storage[key];
        tasks.push(fs_extra_1.ensureDir(dir));
    }
    // Cache directories
    for (var _b = 0, _c = Object.keys(cacheDirectories); _b < _c.length; _b++) {
        var key = _c[_b];
        var dir = cacheDirectories[key];
        tasks.push(fs_extra_1.ensureDir(dir));
    }
    // Playlist directories
    tasks.push(fs_extra_1.ensureDir(constants_1.HLS_STREAMING_PLAYLIST_DIRECTORY));
    return Promise.all(tasks);
}
function createOAuthClientIfNotExist() {
    return __awaiter(this, void 0, void 0, function () {
        var exist, id, secret, client, createdClient;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, checker_after_init_1.clientsExist()
                    // Nothing to do, clients already exist
                ];
                case 1:
                    exist = _a.sent();
                    // Nothing to do, clients already exist
                    if (exist === true)
                        return [2 /*return*/, undefined];
                    logger_1.logger.info('Creating a default OAuth Client.');
                    id = passwordGenerator(32, false, /[a-z0-9]/);
                    secret = passwordGenerator(32, false, /[a-zA-Z0-9]/);
                    client = new oauth_client_1.OAuthClientModel({
                        clientId: id,
                        clientSecret: secret,
                        grants: ['password', 'refresh_token'],
                        redirectUris: null
                    });
                    return [4 /*yield*/, client.save()];
                case 2:
                    createdClient = _a.sent();
                    logger_1.logger.info('Client id: ' + createdClient.clientId);
                    logger_1.logger.info('Client secret: ' + createdClient.clientSecret);
                    return [2 /*return*/, undefined];
            }
        });
    });
}
function createOAuthAdminIfNotExist() {
    return __awaiter(this, void 0, void 0, function () {
        var exist, username, role, email, validatePassword, password, userData, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, checker_after_init_1.usersExist()
                    // Nothing to do, users already exist
                ];
                case 1:
                    exist = _a.sent();
                    // Nothing to do, users already exist
                    if (exist === true)
                        return [2 /*return*/, undefined];
                    logger_1.logger.info('Creating the administrator.');
                    username = 'root';
                    role = shared_1.UserRole.ADMINISTRATOR;
                    email = config_1.CONFIG.ADMIN.EMAIL;
                    validatePassword = true;
                    password = '';
                    // Do not generate a random password for tests
                    if (process.env.NODE_ENV === 'test') {
                        password = 'test';
                        if (process.env.NODE_APP_INSTANCE) {
                            password += process.env.NODE_APP_INSTANCE;
                        }
                        // Our password is weak so do not validate it
                        validatePassword = false;
                    }
                    else if (process.env.PT_INITIAL_ROOT_PASSWORD) {
                        password = process.env.PT_INITIAL_ROOT_PASSWORD;
                    }
                    else {
                        password = passwordGenerator(16, true);
                    }
                    userData = {
                        username: username,
                        email: email,
                        password: password,
                        role: role,
                        verified: true,
                        nsfwPolicy: config_1.CONFIG.INSTANCE.DEFAULT_NSFW_POLICY,
                        videoQuota: -1,
                        videoQuotaDaily: -1
                    };
                    user = new user_2.UserModel(userData);
                    return [4 /*yield*/, user_1.createUserAccountAndChannelAndPlaylist({ userToCreate: user, channelNames: undefined, validateUser: validatePassword })];
                case 2:
                    _a.sent();
                    logger_1.logger.info('Username: ' + username);
                    logger_1.logger.info('User password: ' + password);
                    return [2 /*return*/];
            }
        });
    });
}
function createApplicationIfNotExist() {
    return __awaiter(this, void 0, void 0, function () {
        var exist, application;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, checker_after_init_1.applicationExist()
                    // Nothing to do, application already exist
                ];
                case 1:
                    exist = _a.sent();
                    // Nothing to do, application already exist
                    if (exist === true)
                        return [2 /*return*/, undefined];
                    logger_1.logger.info('Creating application account.');
                    return [4 /*yield*/, application_1.ApplicationModel.create({
                            migrationVersion: constants_1.LAST_MIGRATION_VERSION
                        })];
                case 2:
                    application = _a.sent();
                    return [2 /*return*/, user_1.createApplicationActor(application.id)];
            }
        });
    });
}
