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
var requests_1 = require("../requests/requests");
var lodash_1 = require("lodash");
var videos_1 = require("./videos");
var path_1 = require("path");
var __1 = require("..");
var fs_extra_1 = require("fs-extra");
var chai_1 = require("chai");
function getVideoPlaylistsList(url, start, count, sort) {
    var path = '/api/v1/video-playlists';
    var query = {
        start: start,
        count: count,
        sort: sort
    };
    return requests_1.makeGetRequest({
        url: url,
        path: path,
        query: query,
        statusCodeExpected: 200
    });
}
exports.getVideoPlaylistsList = getVideoPlaylistsList;
function getVideoChannelPlaylistsList(url, videoChannelName, start, count, sort) {
    var path = '/api/v1/video-channels/' + videoChannelName + '/video-playlists';
    var query = {
        start: start,
        count: count,
        sort: sort
    };
    return requests_1.makeGetRequest({
        url: url,
        path: path,
        query: query,
        statusCodeExpected: 200
    });
}
exports.getVideoChannelPlaylistsList = getVideoChannelPlaylistsList;
function getAccountPlaylistsList(url, accountName, start, count, sort) {
    var path = '/api/v1/accounts/' + accountName + '/video-playlists';
    var query = {
        start: start,
        count: count,
        sort: sort
    };
    return requests_1.makeGetRequest({
        url: url,
        path: path,
        query: query,
        statusCodeExpected: 200
    });
}
exports.getAccountPlaylistsList = getAccountPlaylistsList;
function getAccountPlaylistsListWithToken(url, token, accountName, start, count, playlistType, sort) {
    var path = '/api/v1/accounts/' + accountName + '/video-playlists';
    var query = {
        start: start,
        count: count,
        playlistType: playlistType,
        sort: sort
    };
    return requests_1.makeGetRequest({
        url: url,
        token: token,
        path: path,
        query: query,
        statusCodeExpected: 200
    });
}
exports.getAccountPlaylistsListWithToken = getAccountPlaylistsListWithToken;
function getVideoPlaylist(url, playlistId, statusCodeExpected) {
    if (statusCodeExpected === void 0) { statusCodeExpected = 200; }
    var path = '/api/v1/video-playlists/' + playlistId;
    return requests_1.makeGetRequest({
        url: url,
        path: path,
        statusCodeExpected: statusCodeExpected
    });
}
exports.getVideoPlaylist = getVideoPlaylist;
function getVideoPlaylistWithToken(url, token, playlistId, statusCodeExpected) {
    if (statusCodeExpected === void 0) { statusCodeExpected = 200; }
    var path = '/api/v1/video-playlists/' + playlistId;
    return requests_1.makeGetRequest({
        url: url,
        token: token,
        path: path,
        statusCodeExpected: statusCodeExpected
    });
}
exports.getVideoPlaylistWithToken = getVideoPlaylistWithToken;
function deleteVideoPlaylist(url, token, playlistId, statusCodeExpected) {
    if (statusCodeExpected === void 0) { statusCodeExpected = 204; }
    var path = '/api/v1/video-playlists/' + playlistId;
    return requests_1.makeDeleteRequest({
        url: url,
        path: path,
        token: token,
        statusCodeExpected: statusCodeExpected
    });
}
exports.deleteVideoPlaylist = deleteVideoPlaylist;
function createVideoPlaylist(options) {
    var path = '/api/v1/video-playlists';
    var fields = lodash_1.omit(options.playlistAttrs, 'thumbnailfile');
    var attaches = options.playlistAttrs.thumbnailfile
        ? { thumbnailfile: options.playlistAttrs.thumbnailfile }
        : {};
    return requests_1.makeUploadRequest({
        method: 'POST',
        url: options.url,
        path: path,
        token: options.token,
        fields: fields,
        attaches: attaches,
        statusCodeExpected: options.expectedStatus || 200
    });
}
exports.createVideoPlaylist = createVideoPlaylist;
function updateVideoPlaylist(options) {
    var path = '/api/v1/video-playlists/' + options.playlistId;
    var fields = lodash_1.omit(options.playlistAttrs, 'thumbnailfile');
    var attaches = options.playlistAttrs.thumbnailfile
        ? { thumbnailfile: options.playlistAttrs.thumbnailfile }
        : {};
    return requests_1.makeUploadRequest({
        method: 'PUT',
        url: options.url,
        path: path,
        token: options.token,
        fields: fields,
        attaches: attaches,
        statusCodeExpected: options.expectedStatus || 204
    });
}
exports.updateVideoPlaylist = updateVideoPlaylist;
function addVideoInPlaylist(options) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, path;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = options.elementAttrs;
                    return [4 /*yield*/, videos_1.videoUUIDToId(options.url, options.elementAttrs.videoId)];
                case 1:
                    _a.videoId = _b.sent();
                    path = '/api/v1/video-playlists/' + options.playlistId + '/videos';
                    return [2 /*return*/, requests_1.makePostBodyRequest({
                            url: options.url,
                            path: path,
                            token: options.token,
                            fields: options.elementAttrs,
                            statusCodeExpected: options.expectedStatus || 200
                        })];
            }
        });
    });
}
exports.addVideoInPlaylist = addVideoInPlaylist;
function updateVideoPlaylistElement(options) {
    var path = '/api/v1/video-playlists/' + options.playlistId + '/videos/' + options.playlistElementId;
    return requests_1.makePutBodyRequest({
        url: options.url,
        path: path,
        token: options.token,
        fields: options.elementAttrs,
        statusCodeExpected: options.expectedStatus || 204
    });
}
exports.updateVideoPlaylistElement = updateVideoPlaylistElement;
function removeVideoFromPlaylist(options) {
    var path = '/api/v1/video-playlists/' + options.playlistId + '/videos/' + options.playlistElementId;
    return requests_1.makeDeleteRequest({
        url: options.url,
        path: path,
        token: options.token,
        statusCodeExpected: options.expectedStatus || 204
    });
}
exports.removeVideoFromPlaylist = removeVideoFromPlaylist;
function reorderVideosPlaylist(options) {
    var path = '/api/v1/video-playlists/' + options.playlistId + '/videos/reorder';
    return requests_1.makePostBodyRequest({
        url: options.url,
        path: path,
        token: options.token,
        fields: options.elementAttrs,
        statusCodeExpected: options.expectedStatus || 204
    });
}
exports.reorderVideosPlaylist = reorderVideosPlaylist;
function checkPlaylistFilesWereRemoved(playlistUUID, internalServerNumber, directories) {
    if (directories === void 0) { directories = ['thumbnails']; }
    return __awaiter(this, void 0, void 0, function () {
        var testDirectory, _i, directories_1, directory, directoryPath, files, _a, files_1, file;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    testDirectory = 'test' + internalServerNumber;
                    _i = 0, directories_1 = directories;
                    _b.label = 1;
                case 1:
                    if (!(_i < directories_1.length)) return [3 /*break*/, 4];
                    directory = directories_1[_i];
                    directoryPath = path_1.join(__1.root(), testDirectory, directory);
                    return [4 /*yield*/, fs_extra_1.readdir(directoryPath)];
                case 2:
                    files = _b.sent();
                    for (_a = 0, files_1 = files; _a < files_1.length; _a++) {
                        file = files_1[_a];
                        chai_1.expect(file).to.not.contain(playlistUUID);
                    }
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.checkPlaylistFilesWereRemoved = checkPlaylistFilesWereRemoved;
function getVideoPlaylistPrivacies(url) {
    var path = '/api/v1/video-playlists/privacies';
    return requests_1.makeGetRequest({
        url: url,
        path: path,
        statusCodeExpected: 200
    });
}
exports.getVideoPlaylistPrivacies = getVideoPlaylistPrivacies;
function doVideosExistInMyPlaylist(url, token, videoIds) {
    var path = '/api/v1/users/me/video-playlists/videos-exist';
    return requests_1.makeGetRequest({
        url: url,
        token: token,
        path: path,
        query: { videoIds: videoIds },
        statusCodeExpected: 200
    });
}
exports.doVideosExistInMyPlaylist = doVideosExistInMyPlaylist;
