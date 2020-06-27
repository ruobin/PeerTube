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
var logger_1 = require("../../helpers/logger");
var utils_1 = require("./utils");
var servers_1 = require("../../helpers/custom-validators/servers");
var server_1 = require("../../models/server/server");
var express_validator_1 = require("express-validator");
var users_1 = require("../../helpers/custom-validators/users");
var emailer_1 = require("../../lib/emailer");
var redis_1 = require("../../lib/redis");
var config_1 = require("../../initializers/config");
var serverGetValidator = [
    express_validator_1.body('host').custom(servers_1.isHostValid).withMessage('Should have a valid host'),
    function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var server;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.debug('Checking serverGetValidator parameters', { parameters: req.body });
                    if (utils_1.areValidationErrors(req, res))
                        return [2 /*return*/];
                    return [4 /*yield*/, server_1.ServerModel.loadByHost(req.body.host)];
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
exports.serverGetValidator = serverGetValidator;
var contactAdministratorValidator = [
    express_validator_1.body('fromName')
        .custom(users_1.isUserDisplayNameValid).withMessage('Should have a valid name'),
    express_validator_1.body('fromEmail')
        .isEmail().withMessage('Should have a valid email'),
    express_validator_1.body('body')
        .custom(servers_1.isValidContactBody).withMessage('Should have a valid body'),
    function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.debug('Checking contactAdministratorValidator parameters', { parameters: req.body });
                    if (utils_1.areValidationErrors(req, res))
                        return [2 /*return*/];
                    if (config_1.CONFIG.CONTACT_FORM.ENABLED === false) {
                        return [2 /*return*/, res
                                .status(409)
                                .send({ error: 'Contact form is not enabled on this instance.' })
                                .end()];
                    }
                    if (emailer_1.Emailer.isEnabled() === false) {
                        return [2 /*return*/, res
                                .status(409)
                                .send({ error: 'Emailer is not enabled on this instance.' })
                                .end()];
                    }
                    return [4 /*yield*/, redis_1.Redis.Instance.doesContactFormIpExist(req.ip)];
                case 1:
                    if (_a.sent()) {
                        logger_1.logger.info('Refusing a contact form by %s: already sent one recently.', req.ip);
                        return [2 /*return*/, res
                                .status(403)
                                .send({ error: 'You already sent a contact form recently.' })
                                .end()];
                    }
                    return [2 /*return*/, next()];
            }
        });
    }); }
];
exports.contactAdministratorValidator = contactAdministratorValidator;
