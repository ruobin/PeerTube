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
var core_utils_1 = require("../../../server/helpers/core-utils");
var chai_1 = require("chai");
function getPlaylist(url, statusCodeExpected) {
    if (statusCodeExpected === void 0) { statusCodeExpected = 200; }
    return requests_1.makeRawRequest(url, statusCodeExpected);
}
exports.getPlaylist = getPlaylist;
function getSegment(url, statusCodeExpected, range) {
    if (statusCodeExpected === void 0) { statusCodeExpected = 200; }
    return requests_1.makeRawRequest(url, statusCodeExpected, range);
}
exports.getSegment = getSegment;
function getSegmentSha256(url, statusCodeExpected) {
    if (statusCodeExpected === void 0) { statusCodeExpected = 200; }
    return requests_1.makeRawRequest(url, statusCodeExpected);
}
exports.getSegmentSha256 = getSegmentSha256;
function checkSegmentHash(baseUrlPlaylist, baseUrlSegment, videoUUID, resolution, hlsPlaylist) {
    return __awaiter(this, void 0, void 0, function () {
        var res, playlist, videoName, matches, length, offset, range, res2, resSha, sha256Server;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getPlaylist(baseUrlPlaylist + "/" + videoUUID + "/" + resolution + ".m3u8")];
                case 1:
                    res = _a.sent();
                    playlist = res.text;
                    videoName = videoUUID + "-" + resolution + "-fragmented.mp4";
                    matches = /#EXT-X-BYTERANGE:(\d+)@(\d+)/.exec(playlist);
                    length = parseInt(matches[1], 10);
                    offset = parseInt(matches[2], 10);
                    range = offset + "-" + (offset + length - 1);
                    return [4 /*yield*/, getSegment(baseUrlSegment + "/" + videoUUID + "/" + videoName, 206, "bytes=" + range)];
                case 2:
                    res2 = _a.sent();
                    return [4 /*yield*/, getSegmentSha256(hlsPlaylist.segmentsSha256Url)];
                case 3:
                    resSha = _a.sent();
                    sha256Server = resSha.body[videoName][range];
                    chai_1.expect(core_utils_1.sha256(res2.body)).to.equal(sha256Server);
                    return [2 /*return*/];
            }
        });
    });
}
exports.checkSegmentHash = checkSegmentHash;
