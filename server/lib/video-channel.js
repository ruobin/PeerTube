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
var uuidv4 = require("uuid/v4");
var video_channel_1 = require("../models/video/video-channel");
var activitypub_1 = require("./activitypub");
var video_1 = require("../models/video/video");
function createVideoChannel(videoChannelInfo, account, t) {
    return __awaiter(this, void 0, void 0, function () {
        var uuid, url, actorInstance, actorInstanceCreated, videoChannelData, videoChannel, options, videoChannelCreated;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    uuid = uuidv4();
                    url = activitypub_1.getVideoChannelActivityPubUrl(videoChannelInfo.name);
                    actorInstance = activitypub_1.buildActorInstance('Group', url, videoChannelInfo.name, uuid);
                    return [4 /*yield*/, actorInstance.save({ transaction: t })];
                case 1:
                    actorInstanceCreated = _a.sent();
                    videoChannelData = {
                        name: videoChannelInfo.displayName,
                        description: videoChannelInfo.description,
                        support: videoChannelInfo.support,
                        accountId: account.id,
                        actorId: actorInstanceCreated.id
                    };
                    videoChannel = video_channel_1.VideoChannelModel.build(videoChannelData);
                    options = { transaction: t };
                    return [4 /*yield*/, videoChannel.save(options)
                        // Do not forget to add Account/Actor information to the created video channel
                    ];
                case 2:
                    videoChannelCreated = _a.sent();
                    // Do not forget to add Account/Actor information to the created video channel
                    videoChannelCreated.Account = account;
                    videoChannelCreated.Actor = actorInstanceCreated;
                    // No need to seed this empty video channel to followers
                    return [2 /*return*/, videoChannelCreated];
            }
        });
    });
}
exports.createVideoChannel = createVideoChannel;
function federateAllVideosOfChannel(videoChannel) {
    return __awaiter(this, void 0, void 0, function () {
        var videoIds, _i, videoIds_1, videoId, video;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, video_1.VideoModel.getAllIdsFromChannel(videoChannel)];
                case 1:
                    videoIds = _a.sent();
                    _i = 0, videoIds_1 = videoIds;
                    _a.label = 2;
                case 2:
                    if (!(_i < videoIds_1.length)) return [3 /*break*/, 6];
                    videoId = videoIds_1[_i];
                    return [4 /*yield*/, video_1.VideoModel.loadAndPopulateAccountAndServerAndTags(videoId)];
                case 3:
                    video = _a.sent();
                    return [4 /*yield*/, activitypub_1.federateVideoIfNeeded(video, false)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 2];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.federateAllVideosOfChannel = federateAllVideosOfChannel;
