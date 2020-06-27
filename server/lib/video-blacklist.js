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
var config_1 = require("../initializers/config");
var models_1 = require("../../shared/models");
var video_blacklist_1 = require("../models/video/video-blacklist");
var logger_1 = require("../helpers/logger");
var user_flag_model_1 = require("../../shared/models/users/user-flag.model");
var hooks_1 = require("./plugins/hooks");
var notifier_1 = require("./notifier");
function autoBlacklistVideoIfNeeded(parameters) {
    return __awaiter(this, void 0, void 0, function () {
        var video, user, isRemote, isNew, _a, notify, transaction, doAutoBlacklist, videoBlacklistToCreate, videoBlacklist;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    video = parameters.video, user = parameters.user, isRemote = parameters.isRemote, isNew = parameters.isNew, _a = parameters.notify, notify = _a === void 0 ? true : _a, transaction = parameters.transaction;
                    return [4 /*yield*/, hooks_1.Hooks.wrapPromiseFun(autoBlacklistNeeded, { video: video, user: user, isRemote: isRemote, isNew: isNew }, 'filter:video.auto-blacklist.result')];
                case 1:
                    doAutoBlacklist = _b.sent();
                    if (!doAutoBlacklist)
                        return [2 /*return*/, false];
                    videoBlacklistToCreate = {
                        videoId: video.id,
                        unfederated: true,
                        reason: 'Auto-blacklisted. Moderator review required.',
                        type: models_1.VideoBlacklistType.AUTO_BEFORE_PUBLISHED
                    };
                    return [4 /*yield*/, video_blacklist_1.VideoBlacklistModel.findOrCreate({
                            where: {
                                videoId: video.id
                            },
                            defaults: videoBlacklistToCreate,
                            transaction: transaction
                        })];
                case 2:
                    videoBlacklist = (_b.sent())[0];
                    video.VideoBlacklist = videoBlacklist;
                    if (notify)
                        notifier_1.Notifier.Instance.notifyOnVideoAutoBlacklist(video);
                    logger_1.logger.info('Video %s auto-blacklisted.', video.uuid);
                    return [2 /*return*/, true];
            }
        });
    });
}
exports.autoBlacklistVideoIfNeeded = autoBlacklistVideoIfNeeded;
function autoBlacklistNeeded(parameters) {
    return __awaiter(this, void 0, void 0, function () {
        var user, video, isRemote, isNew;
        return __generator(this, function (_a) {
            user = parameters.user, video = parameters.video, isRemote = parameters.isRemote, isNew = parameters.isNew;
            // Already blacklisted
            if (video.VideoBlacklist)
                return [2 /*return*/, false];
            if (!config_1.CONFIG.AUTO_BLACKLIST.VIDEOS.OF_USERS.ENABLED || !user)
                return [2 /*return*/, false];
            if (isRemote || isNew === false)
                return [2 /*return*/, false];
            if (user.hasRight(models_1.UserRight.MANAGE_VIDEO_BLACKLIST) || user.hasAdminFlag(user_flag_model_1.UserAdminFlag.BY_PASS_VIDEO_AUTO_BLACKLIST))
                return [2 /*return*/, false];
            return [2 /*return*/, true];
        });
    });
}
