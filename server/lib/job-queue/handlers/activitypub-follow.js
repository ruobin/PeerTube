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
var logger_1 = require("../../../helpers/logger");
var constants_1 = require("../../../initializers/constants");
var send_1 = require("../../activitypub/send");
var core_utils_1 = require("../../../helpers/core-utils");
var webfinger_1 = require("../../../helpers/webfinger");
var actor_1 = require("../../activitypub/actor");
var database_utils_1 = require("../../../helpers/database-utils");
var actor_follow_1 = require("../../../models/activitypub/actor-follow");
var actor_2 = require("../../../models/activitypub/actor");
var notifier_1 = require("../../notifier");
var database_1 = require("../../../initializers/database");
function processActivityPubFollow(job) {
    return __awaiter(this, void 0, void 0, function () {
        var payload, host, targetActor, sanitizedHost, actorUrl, fromActor;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    payload = job.data;
                    host = payload.host;
                    logger_1.logger.info('Processing ActivityPub follow in job %d.', job.id);
                    if (!(!host || host === constants_1.WEBSERVER.HOST)) return [3 /*break*/, 2];
                    return [4 /*yield*/, actor_2.ActorModel.loadLocalByName(payload.name)];
                case 1:
                    targetActor = _a.sent();
                    return [3 /*break*/, 5];
                case 2:
                    sanitizedHost = core_utils_1.sanitizeHost(host, constants_1.REMOTE_SCHEME.HTTP);
                    return [4 /*yield*/, webfinger_1.loadActorUrlOrGetFromWebfinger(payload.name + '@' + sanitizedHost)];
                case 3:
                    actorUrl = _a.sent();
                    return [4 /*yield*/, actor_1.getOrCreateActorAndServerAndModel(actorUrl)];
                case 4:
                    targetActor = _a.sent();
                    _a.label = 5;
                case 5: return [4 /*yield*/, actor_2.ActorModel.load(payload.followerActorId)];
                case 6:
                    fromActor = _a.sent();
                    return [2 /*return*/, database_utils_1.retryTransactionWrapper(follow, fromActor, targetActor)];
            }
        });
    });
}
exports.processActivityPubFollow = processActivityPubFollow;
// ---------------------------------------------------------------------------
function follow(fromActor, targetActor) {
    return __awaiter(this, void 0, void 0, function () {
        var state, actorFollow;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (fromActor.id === targetActor.id) {
                        throw new Error('Follower is the same than target actor.');
                    }
                    state = !fromActor.serverId && !targetActor.serverId ? 'accepted' : 'pending';
                    return [4 /*yield*/, database_1.sequelizeTypescript.transaction(function (t) { return __awaiter(_this, void 0, void 0, function () {
                            var actorFollow;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, actor_follow_1.ActorFollowModel.findOrCreate({
                                            where: {
                                                actorId: fromActor.id,
                                                targetActorId: targetActor.id
                                            },
                                            defaults: {
                                                state: state,
                                                actorId: fromActor.id,
                                                targetActorId: targetActor.id
                                            },
                                            transaction: t
                                        })];
                                    case 1:
                                        actorFollow = (_a.sent())[0];
                                        actorFollow.ActorFollowing = targetActor;
                                        actorFollow.ActorFollower = fromActor;
                                        // Send a notification to remote server if our follow is not already accepted
                                        if (actorFollow.state !== 'accepted')
                                            send_1.sendFollow(actorFollow, t);
                                        return [2 /*return*/, actorFollow];
                                }
                            });
                        }); })];
                case 1:
                    actorFollow = _a.sent();
                    if (actorFollow.state === 'accepted')
                        notifier_1.Notifier.Instance.notifyOfNewUserFollow(actorFollow);
                    return [2 /*return*/];
            }
        });
    });
}
