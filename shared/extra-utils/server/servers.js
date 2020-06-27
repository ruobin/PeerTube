"use strict";
/* tslint:disable:no-unused-expression */
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
var child_process_1 = require("child_process");
var path_1 = require("path");
var miscs_1 = require("../miscs/miscs");
var fs_extra_1 = require("fs-extra");
var chai_1 = require("chai");
var miscs_2 = require("../../core-utils/miscs/miscs");
function parallelTests() {
    return process.env.MOCHA_PARALLEL === 'true';
}
exports.parallelTests = parallelTests;
function flushAndRunMultipleServers(totalServers, configOverride) {
    var apps = [];
    var i = 0;
    return new Promise(function (res) {
        function anotherServerDone(serverNumber, app) {
            apps[serverNumber - 1] = app;
            i++;
            if (i === totalServers) {
                return res(apps);
            }
        }
        var _loop_1 = function (j) {
            flushAndRunServer(j, configOverride).then(function (app) { return anotherServerDone(j, app); });
        };
        for (var j = 1; j <= totalServers; j++) {
            _loop_1(j);
        }
    });
}
exports.flushAndRunMultipleServers = flushAndRunMultipleServers;
function flushTests(serverNumber) {
    return new Promise(function (res, rej) {
        var suffix = serverNumber ? " -- " + serverNumber : '';
        return child_process_1.exec('npm run clean:server:test' + suffix, function (err, _stdout, stderr) {
            if (err || stderr)
                return rej(err || new Error(stderr));
            return res();
        });
    });
}
exports.flushTests = flushTests;
function randomServer() {
    var low = 10;
    var high = 10000;
    return miscs_2.randomInt(low, high);
}
function flushAndRunServer(serverNumber, configOverride, args) {
    if (args === void 0) { args = []; }
    return __awaiter(this, void 0, void 0, function () {
        var parallel, internalServerNumber, port, server;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    parallel = parallelTests();
                    internalServerNumber = parallel ? randomServer() : serverNumber;
                    port = 9000 + internalServerNumber;
                    return [4 /*yield*/, flushTests(internalServerNumber)];
                case 1:
                    _a.sent();
                    server = {
                        app: null,
                        port: port,
                        internalServerNumber: internalServerNumber,
                        parallel: parallel,
                        serverNumber: serverNumber,
                        url: "http://localhost:" + port,
                        host: "localhost:" + port,
                        client: {
                            id: null,
                            secret: null
                        },
                        user: {
                            username: null,
                            password: null
                        }
                    };
                    return [2 /*return*/, runServer(server, configOverride, args)];
            }
        });
    });
}
exports.flushAndRunServer = flushAndRunServer;
function runServer(server, configOverrideArg, args) {
    if (args === void 0) { args = []; }
    return __awaiter(this, void 0, void 0, function () {
        var serverRunString, key, regexps, basePath, tmpConfigFile, configOverride, env, options;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    serverRunString = {
                        'Server listening': false
                    };
                    key = 'Database peertube_test' + server.internalServerNumber + ' is ready';
                    serverRunString[key] = false;
                    regexps = {
                        client_id: 'Client id: (.+)',
                        client_secret: 'Client secret: (.+)',
                        user_username: 'Username: (.+)',
                        user_password: 'User password: (.+)'
                    };
                    if (!(server.internalServerNumber !== server.serverNumber)) return [3 /*break*/, 2];
                    basePath = path_1.join(miscs_1.root(), 'config');
                    tmpConfigFile = path_1.join(basePath, "test-" + server.internalServerNumber + ".yaml");
                    return [4 /*yield*/, fs_extra_1.copy(path_1.join(basePath, "test-" + server.serverNumber + ".yaml"), tmpConfigFile)];
                case 1:
                    _a.sent();
                    server.customConfigFile = tmpConfigFile;
                    _a.label = 2;
                case 2:
                    configOverride = {};
                    if (server.parallel) {
                        Object.assign(configOverride, {
                            listen: {
                                port: server.port
                            },
                            webserver: {
                                port: server.port
                            },
                            database: {
                                suffix: '_test' + server.internalServerNumber
                            },
                            storage: {
                                tmp: "test" + server.internalServerNumber + "/tmp/",
                                avatars: "test" + server.internalServerNumber + "/avatars/",
                                videos: "test" + server.internalServerNumber + "/videos/",
                                streaming_playlists: "test" + server.internalServerNumber + "/streaming-playlists/",
                                redundancy: "test" + server.internalServerNumber + "/redundancy/",
                                logs: "test" + server.internalServerNumber + "/logs/",
                                previews: "test" + server.internalServerNumber + "/previews/",
                                thumbnails: "test" + server.internalServerNumber + "/thumbnails/",
                                torrents: "test" + server.internalServerNumber + "/torrents/",
                                captions: "test" + server.internalServerNumber + "/captions/",
                                cache: "test" + server.internalServerNumber + "/cache/",
                                plugins: "test" + server.internalServerNumber + "/plugins/"
                            },
                            admin: {
                                email: "admin" + server.internalServerNumber + "@example.com"
                            }
                        });
                    }
                    if (configOverrideArg !== undefined) {
                        Object.assign(configOverride, configOverrideArg);
                    }
                    env = Object.create(process.env);
                    env['NODE_ENV'] = 'test';
                    env['NODE_APP_INSTANCE'] = server.internalServerNumber.toString();
                    env['NODE_CONFIG'] = JSON.stringify(configOverride);
                    options = {
                        silent: true,
                        env: env,
                        detached: true
                    };
                    return [2 /*return*/, new Promise(function (res) {
                            server.app = child_process_1.fork(path_1.join(miscs_1.root(), 'dist', 'server.js'), args, options);
                            server.app.stdout.on('data', function onStdout(data) {
                                var dontContinue = false;
                                // Capture things if we want to
                                for (var _i = 0, _a = Object.keys(regexps); _i < _a.length; _i++) {
                                    var key_1 = _a[_i];
                                    var regexp = regexps[key_1];
                                    var matches = data.toString().match(regexp);
                                    if (matches !== null) {
                                        if (key_1 === 'client_id')
                                            server.client.id = matches[1];
                                        else if (key_1 === 'client_secret')
                                            server.client.secret = matches[1];
                                        else if (key_1 === 'user_username')
                                            server.user.username = matches[1];
                                        else if (key_1 === 'user_password')
                                            server.user.password = matches[1];
                                    }
                                }
                                // Check if all required sentences are here
                                for (var _b = 0, _c = Object.keys(serverRunString); _b < _c.length; _b++) {
                                    var key_2 = _c[_b];
                                    if (data.toString().indexOf(key_2) !== -1)
                                        serverRunString[key_2] = true;
                                    if (serverRunString[key_2] === false)
                                        dontContinue = true;
                                }
                                // If no, there is maybe one thing not already initialized (client/user credentials generation...)
                                if (dontContinue === true)
                                    return;
                                server.app.stdout.removeListener('data', onStdout);
                                process.on('exit', function () {
                                    try {
                                        process.kill(server.app.pid);
                                    }
                                    catch ( /* empty */_a) { /* empty */ }
                                });
                                res(server);
                            });
                        })];
            }
        });
    });
}
function reRunServer(server, configOverride) {
    return __awaiter(this, void 0, void 0, function () {
        var newServer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runServer(server, configOverride)];
                case 1:
                    newServer = _a.sent();
                    server.app = newServer.app;
                    return [2 /*return*/, server];
            }
        });
    });
}
exports.reRunServer = reRunServer;
function checkTmpIsEmpty(server) {
    return checkDirectoryIsEmpty(server, 'tmp', ['plugins-global.css']);
}
exports.checkTmpIsEmpty = checkTmpIsEmpty;
function checkDirectoryIsEmpty(server, directory, exceptions) {
    if (exceptions === void 0) { exceptions = []; }
    return __awaiter(this, void 0, void 0, function () {
        var testDirectory, directoryPath, directoryExists, files, filtered;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    testDirectory = 'test' + server.internalServerNumber;
                    directoryPath = path_1.join(miscs_1.root(), testDirectory, directory);
                    return [4 /*yield*/, fs_extra_1.pathExists(directoryPath)];
                case 1:
                    directoryExists = _a.sent();
                    chai_1.expect(directoryExists).to.be["true"];
                    return [4 /*yield*/, fs_extra_1.readdir(directoryPath)];
                case 2:
                    files = _a.sent();
                    filtered = files.filter(function (f) { return exceptions.includes(f) === false; });
                    chai_1.expect(filtered).to.have.lengthOf(0);
                    return [2 /*return*/];
            }
        });
    });
}
exports.checkDirectoryIsEmpty = checkDirectoryIsEmpty;
function killallServers(servers) {
    for (var _i = 0, servers_1 = servers; _i < servers_1.length; _i++) {
        var server = servers_1[_i];
        if (!server.app)
            continue;
        process.kill(-server.app.pid);
        server.app = null;
    }
}
exports.killallServers = killallServers;
function cleanupTests(servers) {
    killallServers(servers);
    var p = [];
    for (var _i = 0, servers_2 = servers; _i < servers_2.length; _i++) {
        var server = servers_2[_i];
        if (server.parallel) {
            p.push(flushTests(server.internalServerNumber));
        }
        if (server.customConfigFile) {
            p.push(fs_extra_1.remove(server.customConfigFile));
        }
    }
    return Promise.all(p);
}
exports.cleanupTests = cleanupTests;
function waitUntilLog(server, str, count) {
    if (count === void 0) { count = 1; }
    return __awaiter(this, void 0, void 0, function () {
        var logfile, buf, matches;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logfile = path_1.join(miscs_1.root(), 'test' + server.internalServerNumber, 'logs/peertube.log');
                    _a.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 4];
                    return [4 /*yield*/, fs_extra_1.readFile(logfile)];
                case 2:
                    buf = _a.sent();
                    matches = buf.toString().match(new RegExp(str, 'g'));
                    if (matches && matches.length === count)
                        return [2 /*return*/];
                    return [4 /*yield*/, miscs_1.wait(1000)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.waitUntilLog = waitUntilLog;
