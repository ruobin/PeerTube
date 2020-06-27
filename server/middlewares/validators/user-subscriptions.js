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
var actor_follow_1 = require("../../models/activitypub/actor-follow");
var actor_1 = require("../../helpers/custom-validators/activitypub/actor");
var misc_1 = require("../../helpers/custom-validators/misc");
var constants_1 = require("../../initializers/constants");
var userSubscriptionAddValidator = [
    express_validator_1.body('uri').custom(actor_1.isValidActorHandle).withMessage('Should have a valid URI to follow (username@domain)'),
    function (req, res, next) {
        logger_1.logger.debug('Checking userSubscriptionAddValidator parameters', { parameters: req.body });
        if (utils_1.areValidationErrors(req, res))
            return;
        return next();
    }
];
exports.userSubscriptionAddValidator = userSubscriptionAddValidator;
var areSubscriptionsExistValidator = [
    express_validator_1.query('uris')
        .customSanitizer(misc_1.toArray)
        .custom(actor_1.areValidActorHandles).withMessage('Should have a valid uri array'),
    function (req, res, next) {
        logger_1.logger.debug('Checking areSubscriptionsExistValidator parameters', { parameters: req.query });
        if (utils_1.areValidationErrors(req, res))
            return;
        return next();
    }
];
exports.areSubscriptionsExistValidator = areSubscriptionsExistValidator;
var userSubscriptionGetValidator = [
    express_validator_1.param('uri').custom(actor_1.isValidActorHandle).withMessage('Should have a valid URI to unfollow'),
    function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var _a, name, host, user, subscription;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    logger_1.logger.debug('Checking userSubscriptionGetValidator parameters', { parameters: req.params });
                    if (utils_1.areValidationErrors(req, res))
                        return [2 /*return*/];
                    _a = req.params.uri.split('@'), name = _a[0], host = _a[1];
                    if (host === constants_1.WEBSERVER.HOST)
                        host = null;
                    user = res.locals.oauth.token.User;
                    return [4 /*yield*/, actor_follow_1.ActorFollowModel.loadByActorAndTargetNameAndHostForAPI(user.Account.Actor.id, name, host)];
                case 1:
                    subscription = _b.sent();
                    if (!subscription || !subscription.ActorFollowing.VideoChannel) {
                        return [2 /*return*/, res
                                .status(404)
                                .json({
                                error: "Subscription " + req.params.uri + " not found."
                            })
                                .end()];
                    }
                    res.locals.subscription = subscription;
                    return [2 /*return*/, next()];
            }
        });
    }); }
];
exports.userSubscriptionGetValidator = userSubscriptionGetValidator;
