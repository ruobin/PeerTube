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
var video_1 = require("../video");
var users_1 = require("../../../shared/models/users");
var video_channel_1 = require("../../models/video/video-channel");
function doesVideoExist(id, res, fetchType) {
    if (fetchType === void 0) { fetchType = 'all'; }
    return __awaiter(this, void 0, void 0, function () {
        var userId, video;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userId = res.locals.oauth ? res.locals.oauth.token.User.id : undefined;
                    return [4 /*yield*/, video_1.fetchVideo(id, fetchType, userId)];
                case 1:
                    video = _a.sent();
                    if (video === null) {
                        res.status(404)
                            .json({ error: 'Video not found' })
                            .end();
                        return [2 /*return*/, false];
                    }
                    if (fetchType !== 'none')
                        res.locals.video = video;
                    return [2 /*return*/, true];
            }
        });
    });
}
exports.doesVideoExist = doesVideoExist;
function doesVideoChannelOfAccountExist(channelId, user, res) {
    return __awaiter(this, void 0, void 0, function () {
        var videoChannel_1, videoChannel;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(user.hasRight(users_1.UserRight.UPDATE_ANY_VIDEO) === true)) return [3 /*break*/, 2];
                    return [4 /*yield*/, video_channel_1.VideoChannelModel.loadAndPopulateAccount(channelId)];
                case 1:
                    videoChannel_1 = _a.sent();
                    if (videoChannel_1 === null) {
                        res.status(400)
                            .json({ error: 'Unknown video `video channel` on this instance.' })
                            .end();
                        return [2 /*return*/, false];
                    }
                    res.locals.videoChannel = videoChannel_1;
                    return [2 /*return*/, true];
                case 2: return [4 /*yield*/, video_channel_1.VideoChannelModel.loadByIdAndAccount(channelId, user.Account.id)];
                case 3:
                    videoChannel = _a.sent();
                    if (videoChannel === null) {
                        res.status(400)
                            .json({ error: 'Unknown video `video channel` for this account.' })
                            .end();
                        return [2 /*return*/, false];
                    }
                    res.locals.videoChannel = videoChannel;
                    return [2 /*return*/, true];
            }
        });
    });
}
exports.doesVideoChannelOfAccountExist = doesVideoChannelOfAccountExist;
function checkUserCanManageVideo(user, video, right, res) {
    // Retrieve the user who did the request
    if (video.isOwned() === false) {
        res.status(403)
            .json({ error: 'Cannot manage a video of another server.' })
            .end();
        return false;
    }
    // Check if the user can delete the video
    // The user can delete it if he has the right
    // Or if s/he is the video's account
    var account = video.VideoChannel.Account;
    if (user.hasRight(right) === false && account.userId !== user.id) {
        res.status(403)
            .json({ error: 'Cannot manage a video of another user.' })
            .end();
        return false;
    }
    return true;
}
exports.checkUserCanManageVideo = checkUserCanManageVideo;
