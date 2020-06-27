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
var core_utils_1 = require("../../helpers/core-utils");
var servers_1 = require("../../helpers/custom-validators/servers");
var logger_1 = require("../../helpers/logger");
var utils_1 = require("../../helpers/utils");
var constants_1 = require("../../initializers/constants");
var actor_follow_1 = require("../../models/activitypub/actor-follow");
var utils_2 = require("./utils");
var actor_1 = require("../../models/activitypub/actor");
var webfinger_1 = require("../../helpers/webfinger");
var actor_2 = require("../../helpers/custom-validators/activitypub/actor");
var followValidator = [
    express_validator_1.body('hosts').custom(servers_1.isEachUniqueHostValid).withMessage('Should have an array of unique hosts'),
    function (req, res, next) {
        // Force https if the administrator wants to make friends
        if (core_utils_1.isTestInstance() === false && constants_1.WEBSERVER.SCHEME === 'http') {
            return res.status(500)
                .json({
                error: 'Cannot follow on a non HTTPS web server.'
            })
                .end();
        }
        logger_1.logger.debug('Checking follow parameters', { parameters: req.body });
        if (utils_2.areValidationErrors(req, res))
            return;
        return next();
    }
];
exports.followValidator = followValidator;
var removeFollowingValidator = [
    express_validator_1.param('host').custom(servers_1.isHostValid).withMessage('Should have a valid host'),
    function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var serverActor, follow;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.debug('Checking unfollowing parameters', { parameters: req.params });
                    if (utils_2.areValidationErrors(req, res))
                        return [2 /*return*/];
                    return [4 /*yield*/, utils_1.getServerActor()];
                case 1:
                    serverActor = _a.sent();
                    return [4 /*yield*/, actor_follow_1.ActorFollowModel.loadByActorAndTargetNameAndHostForAPI(serverActor.id, constants_1.SERVER_ACTOR_NAME, req.params.host)];
                case 2:
                    follow = _a.sent();
                    if (!follow) {
                        return [2 /*return*/, res
                                .status(404)
                                .json({
                                error: "Following " + req.params.host + " not found."
                            })
                                .end()];
                    }
                    res.locals.follow = follow;
                    return [2 /*return*/, next()];
            }
        });
    }); }
];
exports.removeFollowingValidator = removeFollowingValidator;
var getFollowerValidator = [
    express_validator_1.param('nameWithHost').custom(actor_2.isValidActorHandle).withMessage('Should have a valid nameWithHost'),
    function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var follow, actorUrl, actor, serverActor, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.debug('Checking get follower parameters', { parameters: req.params });
                    if (utils_2.areValidationErrors(req, res))
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, webfinger_1.loadActorUrlOrGetFromWebfinger(req.params.nameWithHost)];
                case 2:
                    actorUrl = _a.sent();
                    return [4 /*yield*/, actor_1.ActorModel.loadByUrl(actorUrl)];
                case 3:
                    actor = _a.sent();
                    return [4 /*yield*/, utils_1.getServerActor()];
                case 4:
                    serverActor = _a.sent();
                    return [4 /*yield*/, actor_follow_1.ActorFollowModel.loadByActorAndTarget(actor.id, serverActor.id)];
                case 5:
                    follow = _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    err_1 = _a.sent();
                    logger_1.logger.warn('Cannot get actor from handle.', { handle: req.params.nameWithHost, err: err_1 });
                    return [3 /*break*/, 7];
                case 7:
                    if (!follow) {
                        return [2 /*return*/, res
                                .status(404)
                                .json({
                                error: "Follower " + req.params.nameWithHost + " not found."
                            })
                                .end()];
                    }
                    res.locals.follow = follow;
                    return [2 /*return*/, next()];
            }
        });
    }); }
];
exports.getFollowerValidator = getFollowerValidator;
var acceptOrRejectFollowerValidator = [
    function (req, res, next) {
        logger_1.logger.debug('Checking accept/reject follower parameters', { parameters: req.params });
        var follow = res.locals.follow;
        if (follow.state !== 'pending') {
            return res.status(400).json({ error: 'Follow is not in pending state.' }).end();
        }
        return next();
    }
];
exports.acceptOrRejectFollowerValidator = acceptOrRejectFollowerValidator;
