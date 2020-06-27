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
require("multer");
var validator = require("validator");
var constants_1 = require("../../initializers/constants");
var misc_1 = require("./misc");
var video_import_1 = require("../../models/video/video-import");
function isVideoImportTargetUrlValid(url) {
    var isURLOptions = {
        require_host: true,
        require_tld: true,
        require_protocol: true,
        require_valid_protocol: true,
        protocols: ['http', 'https']
    };
    return misc_1.exists(url) &&
        validator.isURL('' + url, isURLOptions) &&
        validator.isLength('' + url, constants_1.CONSTRAINTS_FIELDS.VIDEO_IMPORTS.URL);
}
exports.isVideoImportTargetUrlValid = isVideoImportTargetUrlValid;
function isVideoImportStateValid(value) {
    return misc_1.exists(value) && constants_1.VIDEO_IMPORT_STATES[value] !== undefined;
}
exports.isVideoImportStateValid = isVideoImportStateValid;
var videoTorrentImportTypes = Object.keys(constants_1.MIMETYPES.TORRENT.MIMETYPE_EXT).map(function (m) { return "(" + m + ")"; });
var videoTorrentImportRegex = videoTorrentImportTypes.join('|');
function isVideoImportTorrentFile(files) {
    return misc_1.isFileValid(files, videoTorrentImportRegex, 'torrentfile', constants_1.CONSTRAINTS_FIELDS.VIDEO_IMPORTS.TORRENT_FILE.FILE_SIZE.max, true);
}
exports.isVideoImportTorrentFile = isVideoImportTorrentFile;
function doesVideoImportExist(id, res) {
    return __awaiter(this, void 0, void 0, function () {
        var videoImport;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, video_import_1.VideoImportModel.loadAndPopulateVideo(id)];
                case 1:
                    videoImport = _a.sent();
                    if (!videoImport) {
                        res.status(404)
                            .json({ error: 'Video import not found' })
                            .end();
                        return [2 /*return*/, false];
                    }
                    res.locals.videoImport = videoImport;
                    return [2 /*return*/, true];
            }
        });
    });
}
exports.doesVideoImportExist = doesVideoImportExist;
