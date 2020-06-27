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
var express_validator_1 = require("express-validator");
var logger_1 = require("../../helpers/logger");
var utils_1 = require("./utils");
var account_blocklist_1 = require("../../models/account/account-blocklist");
var servers_1 = require("../../helpers/custom-validators/servers");
var server_blocklist_1 = require("../../models/server/server-blocklist");
var server_1 = require("../../models/server/server");
var utils_2 = require("../../helpers/utils");
var constants_1 = require("../../initializers/constants");
var middlewares_1 = require("../../helpers/middlewares");
var blockAccountValidator = [
    express_validator_1.body('accountName').exists().withMessage('Should have an account name with host'),
    function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var user, accountToBlock;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.debug('Checking blockAccountByAccountValidator parameters', { parameters: req.body });
                    if (utils_1.areValidationErrors(req, res))
                        return [2 /*return*/];
                    return [4 /*yield*/, middlewares_1.doesAccountNameWithHostExist(req.body.accountName, res)];
                case 1:
                    if (!(_a.sent()))
                        return [2 /*return*/];
                    user = res.locals.oauth.token.User;
                    accountToBlock = res.locals.account;
                    if (user.Account.id === accountToBlock.id) {
                        res.status(409)
                            .send({ error: 'You cannot block yourself.' })
                            .end();
                        return [2 /*return*/];
                    }
                    return [2 /*return*/, next()];
            }
        });
    }); }
];
exports.blockAccountValidator = blockAccountValidator;
var unblockAccountByAccountValidator = [
    express_validator_1.param('accountName').exists().withMessage('Should have an account name with host'),
    function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var user, targetAccount;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.debug('Checking unblockAccountByAccountValidator parameters', { parameters: req.params });
                    if (utils_1.areValidationErrors(req, res))
                        return [2 /*return*/];
                    return [4 /*yield*/, middlewares_1.doesAccountNameWithHostExist(req.params.accountName, res)];
                case 1:
                    if (!(_a.sent()))
                        return [2 /*return*/];
                    user = res.locals.oauth.token.User;
                    targetAccount = res.locals.account;
                    return [4 /*yield*/, doesUnblockAccountExist(user.Account.id, targetAccount.id, res)];
                case 2:
                    if (!(_a.sent()))
                        return [2 /*return*/];
                    return [2 /*return*/, next()];
            }
        });
    }); }
];
exports.unblockAccountByAccountValidator = unblockAccountByAccountValidator;
var unblockAccountByServerValidator = [
    express_validator_1.param('accountName').exists().withMessage('Should have an account name with host'),
    function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var serverActor, targetAccount;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.debug('Checking unblockAccountByServerValidator parameters', { parameters: req.params });
                    if (utils_1.areValidationErrors(req, res))
                        return [2 /*return*/];
                    return [4 /*yield*/, middlewares_1.doesAccountNameWithHostExist(req.params.accountName, res)];
                case 1:
                    if (!(_a.sent()))
                        return [2 /*return*/];
                    return [4 /*yield*/, utils_2.getServerActor()];
                case 2:
                    serverActor = _a.sent();
                    targetAccount = res.locals.account;
                    return [4 /*yield*/, doesUnblockAccountExist(serverActor.Account.id, targetAccount.id, res)];
                case 3:
                    if (!(_a.sent()))
                        return [2 /*return*/];
                    return [2 /*return*/, next()];
            }
        });
    }); }
];
exports.unblockAccountByServerValidator = unblockAccountByServerValidator;
var blockServerValidator = [
    express_validator_1.body('host').custom(servers_1.isHostValid).withMessage('Should have a valid host'),
    function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var host, server;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.debug('Checking serverGetValidator parameters', { parameters: req.body });
                    if (utils_1.areValidationErrors(req, res))
                        return [2 /*return*/];
                    host = req.body.host;
                    if (host === constants_1.WEBSERVER.HOST) {
                        return [2 /*return*/, res.status(409)
                                .send({ error: 'You cannot block your own server.' })
                                .end()];
                    }
                    return [4 /*yield*/, server_1.ServerModel.loadByHost(host)];
                case 1:
                    server = _a.sent();
                    if (!server) {
                        return [2 /*return*/, res.status(404)
                                .send({ error: 'Server host not found.' })
                                .end()];
                    }
                    res.locals.server = server;
                    return [2 /*return*/, next()];
            }
        });
    }); }
];
exports.blockServerValidator = blockServerValidator;
var unblockServerByAccountValidator = [
    express_validator_1.param('host').custom(servers_1.isHostValid).withMessage('Should have an account name with host'),
    function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.debug('Checking unblockServerByAccountValidator parameters', { parameters: req.params });
                    if (utils_1.areValidationErrors(req, res))
                        return [2 /*return*/];
                    user = res.locals.oauth.token.User;
                    return [4 /*yield*/, doesUnblockServerExist(user.Account.id, req.params.host, res)];
                case 1:
                    if (!(_a.sent()))
                        return [2 /*return*/];
                    return [2 /*return*/, next()];
            }
        });
    }); }
];
exports.unblockServerByAccountValidator = unblockServerByAccountValidator;
var unblockServerByServerValidator = [
    express_validator_1.param('host').custom(servers_1.isHostValid).withMessage('Should have an account name with host'),
    function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var serverActor;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.debug('Checking unblockServerByServerValidator parameters', { parameters: req.params });
                    if (utils_1.areValidationErrors(req, res))
                        return [2 /*return*/];
                    return [4 /*yield*/, utils_2.getServerActor()];
                case 1:
                    serverActor = _a.sent();
                    return [4 /*yield*/, doesUnblockServerExist(serverActor.Account.id, req.params.host, res)];
                case 2:
                    if (!(_a.sent()))
                        return [2 /*return*/];
                    return [2 /*return*/, next()];
            }
        });
    }); }
];
exports.unblockServerByServerValidator = unblockServerByServerValidator;
// ---------------------------------------------------------------------------
function doesUnblockAccountExist(accountId, targetAccountId, res) {
    return __awaiter(this, void 0, void 0, function () {
        var accountBlock;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, account_blocklist_1.AccountBlocklistModel.loadByAccountAndTarget(accountId, targetAccountId)];
                case 1:
                    accountBlock = _a.sent();
                    if (!accountBlock) {
                        res.status(404)
                            .send({ error: 'Account block entry not found.' })
                            .end();
                        return [2 /*return*/, false];
                    }
                    res.locals.accountBlock = accountBlock;
                    return [2 /*return*/, true];
            }
        });
    });
}
function doesUnblockServerExist(accountId, host, res) {
    return __awaiter(this, void 0, void 0, function () {
        var serverBlock;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, server_blocklist_1.ServerBlocklistModel.loadByAccountAndHost(accountId, host)];
                case 1:
                    serverBlock = _a.sent();
                    if (!serverBlock) {
                        res.status(404)
                            .send({ error: 'Server block entry not found.' })
                            .end();
                        return [2 /*return*/, false];
                    }
                    res.locals.serverBlock = serverBlock;
                    return [2 /*return*/, true];
            }
        });
    });
}
