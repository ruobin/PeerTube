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
var database_utils_1 = require("../../../helpers/database-utils");
var logger_1 = require("../../../helpers/logger");
var initializers_1 = require("../../../initializers");
var actor_1 = require("../../../models/activitypub/actor");
var actor_follow_1 = require("../../../models/activitypub/actor-follow");
var send_1 = require("../send");
var notifier_1 = require("../../notifier");
var activitypub_1 = require("../../../helpers/activitypub");
var utils_1 = require("../../../helpers/utils");
var config_1 = require("../../../initializers/config");
function processFollowActivity(options) {
    return __awaiter(this, void 0, void 0, function () {
        var activity, byActor, activityObject;
        return __generator(this, function (_a) {
            activity = options.activity, byActor = options.byActor;
            activityObject = activitypub_1.getAPId(activity.object);
            return [2 /*return*/, database_utils_1.retryTransactionWrapper(processFollow, byActor, activityObject)];
        });
    });
}
exports.processFollowActivity = processFollowActivity;
// ---------------------------------------------------------------------------
function processFollow(byActor, targetActorURL) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, actorFollow, created, isFollowingInstance;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, initializers_1.sequelizeTypescript.transaction(function (t) { return __awaiter(_this, void 0, void 0, function () {
                        var targetActor, serverActor, isFollowingInstance, _a, actorFollow, created;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, actor_1.ActorModel.loadByUrlAndPopulateAccountAndChannel(targetActorURL, t)];
                                case 1:
                                    targetActor = _b.sent();
                                    if (!targetActor)
                                        throw new Error('Unknown actor');
                                    if (targetActor.isOwned() === false)
                                        throw new Error('This is not a local actor.');
                                    return [4 /*yield*/, utils_1.getServerActor()];
                                case 2:
                                    serverActor = _b.sent();
                                    isFollowingInstance = targetActor.id === serverActor.id;
                                    if (!(isFollowingInstance && config_1.CONFIG.FOLLOWERS.INSTANCE.ENABLED === false)) return [3 /*break*/, 4];
                                    logger_1.logger.info('Rejecting %s because instance followers are disabled.', targetActor.url);
                                    return [4 /*yield*/, send_1.sendReject(byActor, targetActor)];
                                case 3:
                                    _b.sent();
                                    return [2 /*return*/, { actorFollow: undefined }];
                                case 4: return [4 /*yield*/, actor_follow_1.ActorFollowModel.findOrCreate({
                                        where: {
                                            actorId: byActor.id,
                                            targetActorId: targetActor.id
                                        },
                                        defaults: {
                                            actorId: byActor.id,
                                            targetActorId: targetActor.id,
                                            state: config_1.CONFIG.FOLLOWERS.INSTANCE.MANUAL_APPROVAL ? 'pending' : 'accepted'
                                        },
                                        transaction: t
                                    })];
                                case 5:
                                    _a = _b.sent(), actorFollow = _a[0], created = _a[1];
                                    if (!(actorFollow.state !== 'accepted' && config_1.CONFIG.FOLLOWERS.INSTANCE.MANUAL_APPROVAL === false)) return [3 /*break*/, 7];
                                    actorFollow.state = 'accepted';
                                    return [4 /*yield*/, actorFollow.save({ transaction: t })];
                                case 6:
                                    _b.sent();
                                    _b.label = 7;
                                case 7:
                                    actorFollow.ActorFollower = byActor;
                                    actorFollow.ActorFollowing = targetActor;
                                    if (!(actorFollow.state === 'accepted')) return [3 /*break*/, 9];
                                    return [4 /*yield*/, send_1.sendAccept(actorFollow)];
                                case 8:
                                    _b.sent();
                                    _b.label = 9;
                                case 9: return [2 /*return*/, { actorFollow: actorFollow, created: created, isFollowingInstance: isFollowingInstance }];
                            }
                        });
                    }); })
                    // Rejected
                ];
                case 1:
                    _a = _b.sent(), actorFollow = _a.actorFollow, created = _a.created, isFollowingInstance = _a.isFollowingInstance;
                    // Rejected
                    if (!actorFollow)
                        return [2 /*return*/];
                    if (created) {
                        if (isFollowingInstance)
                            notifier_1.Notifier.Instance.notifyOfNewInstanceFollow(actorFollow);
                        else
                            notifier_1.Notifier.Instance.notifyOfNewUserFollow(actorFollow);
                    }
                    logger_1.logger.info('Actor %s is followed by actor %s.', targetActorURL, byActor.url);
                    return [2 /*return*/];
            }
        });
    });
}
