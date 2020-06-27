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
var request = require("supertest");
var clients_1 = require("../server/clients");
function login(url, client, user, expectedStatus) {
    if (expectedStatus === void 0) { expectedStatus = 200; }
    var path = '/api/v1/users/token';
    var body = {
        client_id: client.id,
        client_secret: client.secret,
        username: user.username,
        password: user.password,
        response_type: 'code',
        grant_type: 'password',
        scope: 'upload'
    };
    return request(url)
        .post(path)
        .type('form')
        .send(body)
        .expect(expectedStatus);
}
exports.login = login;
function serverLogin(server) {
    return __awaiter(this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, login(server.url, server.client, server.user, 200)];
                case 1:
                    res = _a.sent();
                    return [2 /*return*/, res.body.access_token];
            }
        });
    });
}
exports.serverLogin = serverLogin;
function userLogin(server, user, expectedStatus) {
    if (expectedStatus === void 0) { expectedStatus = 200; }
    return __awaiter(this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, login(server.url, server.client, user, expectedStatus)];
                case 1:
                    res = _a.sent();
                    return [2 /*return*/, res.body.access_token];
            }
        });
    });
}
exports.userLogin = userLogin;
function getAccessToken(url, username, password) {
    return __awaiter(this, void 0, void 0, function () {
        var resClient, client, user, res, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, clients_1.getClient(url)];
                case 1:
                    resClient = _a.sent();
                    client = {
                        id: resClient.body.client_id,
                        secret: resClient.body.client_secret
                    };
                    user = { username: username, password: password };
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, login(url, client, user)];
                case 3:
                    res = _a.sent();
                    return [2 /*return*/, res.body.access_token];
                case 4:
                    err_1 = _a.sent();
                    throw new Error('Cannot authenticate. Please check your username/password.');
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.getAccessToken = getAccessToken;
function setAccessTokensToServers(servers) {
    var tasks = [];
    var _loop_1 = function (server) {
        var p = serverLogin(server).then(function (t) { return server.accessToken = t; });
        tasks.push(p);
    };
    for (var _i = 0, servers_1 = servers; _i < servers_1.length; _i++) {
        var server = servers_1[_i];
        _loop_1(server);
    }
    return Promise.all(tasks);
}
exports.setAccessTokensToServers = setAccessTokensToServers;
