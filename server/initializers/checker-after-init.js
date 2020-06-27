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
var config = require("config");
var core_utils_1 = require("../helpers/core-utils");
var user_1 = require("../models/account/user");
var application_1 = require("../models/application/application");
var oauth_client_1 = require("../models/oauth/oauth-client");
var url_1 = require("url");
var config_1 = require("./config");
var logger_1 = require("../helpers/logger");
var utils_1 = require("../helpers/utils");
var misc_1 = require("../helpers/custom-validators/misc");
var lodash_1 = require("lodash");
var emailer_1 = require("../lib/emailer");
var constants_1 = require("./constants");
function checkActivityPubUrls() {
    return __awaiter(this, void 0, void 0, function () {
        var actor, parsed, NODE_ENV, NODE_CONFIG_DIR;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, utils_1.getServerActor()];
                case 1:
                    actor = _a.sent();
                    parsed = url_1.parse(actor.url);
                    if (constants_1.WEBSERVER.HOST !== parsed.host) {
                        NODE_ENV = config.util.getEnv('NODE_ENV');
                        NODE_CONFIG_DIR = config.util.getEnv('NODE_CONFIG_DIR');
                        logger_1.logger.warn('It seems PeerTube was started (and created some data) with another domain name. ' +
                            'This means you will not be able to federate! ' +
                            'Please use %s %s npm run update-host to fix this.', NODE_CONFIG_DIR ? "NODE_CONFIG_DIR=" + NODE_CONFIG_DIR : '', NODE_ENV ? "NODE_ENV=" + NODE_ENV : '');
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.checkActivityPubUrls = checkActivityPubUrls;
// Some checks on configuration files
// Return an error message, or null if everything is okay
function checkConfig() {
    // Moved configuration keys
    if (config.has('services.csp-logger')) {
        logger_1.logger.warn('services.csp-logger configuration has been renamed to csp.report_uri. Please update your configuration file.');
    }
    // Email verification
    if (!emailer_1.Emailer.isEnabled()) {
        if (config_1.CONFIG.SIGNUP.ENABLED && config_1.CONFIG.SIGNUP.REQUIRES_EMAIL_VERIFICATION) {
            return 'Emailer is disabled but you require signup email verification.';
        }
        if (config_1.CONFIG.CONTACT_FORM.ENABLED) {
            logger_1.logger.warn('Emailer is disabled so the contact form will not work.');
        }
    }
    // NSFW policy
    var defaultNSFWPolicy = config_1.CONFIG.INSTANCE.DEFAULT_NSFW_POLICY;
    {
        var available = ['do_not_list', 'blur', 'display'];
        if (available.indexOf(defaultNSFWPolicy) === -1) {
            return 'NSFW policy setting should be ' + available.join(' or ') + ' instead of ' + defaultNSFWPolicy;
        }
    }
    // Redundancies
    var redundancyVideos = config_1.CONFIG.REDUNDANCY.VIDEOS.STRATEGIES;
    if (misc_1.isArray(redundancyVideos)) {
        var available = ['most-views', 'trending', 'recently-added'];
        for (var _i = 0, redundancyVideos_1 = redundancyVideos; _i < redundancyVideos_1.length; _i++) {
            var r = redundancyVideos_1[_i];
            if (available.indexOf(r.strategy) === -1) {
                return 'Videos redundancy should have ' + available.join(' or ') + ' strategy instead of ' + r.strategy;
            }
            // Lifetime should not be < 10 hours
            if (!core_utils_1.isTestInstance() && r.minLifetime < 1000 * 3600 * 10) {
                return 'Video redundancy minimum lifetime should be >= 10 hours for strategy ' + r.strategy;
            }
        }
        var filtered = lodash_1.uniq(redundancyVideos.map(function (r) { return r.strategy; }));
        if (filtered.length !== redundancyVideos.length) {
            return 'Redundancy video entries should have unique strategies';
        }
        var recentlyAddedStrategy = redundancyVideos.find(function (r) { return r.strategy === 'recently-added'; });
        if (recentlyAddedStrategy && isNaN(recentlyAddedStrategy.minViews)) {
            return 'Min views in recently added strategy is not a number';
        }
    }
    else {
        return 'Videos redundancy should be an array (you must uncomment lines containing - too)';
    }
    // Check storage directory locations
    if (core_utils_1.isProdInstance()) {
        var configStorage = config.get('storage');
        for (var _a = 0, _b = Object.keys(configStorage); _a < _b.length; _a++) {
            var key = _b[_a];
            if (configStorage[key].startsWith('storage/')) {
                logger_1.logger.warn('Directory of %s should not be in the production directory of PeerTube. Please check your production configuration file.', key);
            }
        }
    }
    return null;
}
exports.checkConfig = checkConfig;
// We get db by param to not import it in this file (import orders)
function clientsExist() {
    return __awaiter(this, void 0, void 0, function () {
        var totalClients;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, oauth_client_1.OAuthClientModel.countTotal()];
                case 1:
                    totalClients = _a.sent();
                    return [2 /*return*/, totalClients !== 0];
            }
        });
    });
}
exports.clientsExist = clientsExist;
// We get db by param to not import it in this file (import orders)
function usersExist() {
    return __awaiter(this, void 0, void 0, function () {
        var totalUsers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, user_1.UserModel.countTotal()];
                case 1:
                    totalUsers = _a.sent();
                    return [2 /*return*/, totalUsers !== 0];
            }
        });
    });
}
exports.usersExist = usersExist;
// We get db by param to not import it in this file (import orders)
function applicationExist() {
    return __awaiter(this, void 0, void 0, function () {
        var totalApplication;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, application_1.ApplicationModel.countTotal()];
                case 1:
                    totalApplication = _a.sent();
                    return [2 /*return*/, totalApplication !== 0];
            }
        });
    });
}
exports.applicationExist = applicationExist;
