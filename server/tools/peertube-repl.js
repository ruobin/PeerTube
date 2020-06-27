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
var _this = this;
exports.__esModule = true;
var repl = require("repl");
var path = require("path");
var _ = require("lodash");
var uuidv1 = require("uuid/v1");
var uuidv3 = require("uuid/v3");
var uuidv4 = require("uuid/v4");
var uuidv5 = require("uuid/v5");
var Sequelize = require("sequelize");
var YoutubeDL = require("youtube-dl");
var initializers_1 = require("../initializers");
var cli = require("../tools/cli");
var logger_1 = require("../helpers/logger");
var constants = require("../initializers/constants");
var modelsUtils = require("../models/utils");
var coreUtils = require("../helpers/core-utils");
var ffmpegUtils = require("../helpers/ffmpeg-utils");
var peertubeCryptoUtils = require("../helpers/peertube-crypto");
var signupUtils = require("../helpers/signup");
var utils = require("../helpers/utils");
var YoutubeDLUtils = require("../helpers/youtube-dl");
var start = function () { return __awaiter(_this, void 0, void 0, function () {
    var versionCommitHash, initContext, replServer, resetCommand;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, initializers_1.initDatabaseModels(true)];
            case 1:
                _a.sent();
                return [4 /*yield*/, utils.getServerCommit()];
            case 2:
                versionCommitHash = _a.sent();
                initContext = function (replServer) {
                    return function (context) {
                        var properties = {
                            context: context, repl: replServer, env: process.env,
                            lodash: _, path: path,
                            uuidv1: uuidv1, uuidv3: uuidv3, uuidv4: uuidv4, uuidv5: uuidv5,
                            cli: cli, logger: logger_1.logger, constants: constants,
                            Sequelize: Sequelize, sequelizeTypescript: initializers_1.sequelizeTypescript, modelsUtils: modelsUtils,
                            models: initializers_1.sequelizeTypescript.models, transaction: initializers_1.sequelizeTypescript.transaction,
                            query: initializers_1.sequelizeTypescript.query, queryInterface: initializers_1.sequelizeTypescript.getQueryInterface(),
                            YoutubeDL: YoutubeDL,
                            coreUtils: coreUtils, ffmpegUtils: ffmpegUtils, peertubeCryptoUtils: peertubeCryptoUtils, signupUtils: signupUtils, utils: utils, YoutubeDLUtils: YoutubeDLUtils
                        };
                        for (var prop in properties) {
                            Object.defineProperty(context, prop, {
                                configurable: false,
                                enumerable: true,
                                value: properties[prop]
                            });
                        }
                    };
                };
                replServer = repl.start({
                    prompt: "PeerTube [" + cli.version + "] (" + versionCommitHash + ")> "
                });
                initContext(replServer)(replServer.context);
                replServer.on('reset', initContext(replServer));
                replServer.on('exit', function () { return process.exit(); });
                resetCommand = {
                    help: 'Reset REPL',
                    action: function () {
                        this.write('.clear\n');
                        this.displayPrompt();
                    }
                };
                replServer.defineCommand('reset', resetCommand);
                replServer.defineCommand('r', resetCommand);
                return [2 /*return*/];
        }
    });
}); };
start()["catch"](function (err) {
    console.error(err);
});
