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
var ffmpeg_utils_1 = require("../helpers/ffmpeg-utils");
var config_1 = require("../initializers/config");
var constants_1 = require("../initializers/constants");
var thumbnail_1 = require("../models/video/thumbnail");
var thumbnail_type_1 = require("../../shared/models/videos/thumbnail.type");
var image_utils_1 = require("../helpers/image-utils");
var path_1 = require("path");
var requests_1 = require("../helpers/requests");
function createPlaylistMiniatureFromExisting(inputPath, playlist, automaticallyGenerated, keepOriginal, size) {
    if (keepOriginal === void 0) { keepOriginal = false; }
    var _a = buildMetadataFromPlaylist(playlist, size), filename = _a.filename, outputPath = _a.outputPath, height = _a.height, width = _a.width, existingThumbnail = _a.existingThumbnail;
    var type = thumbnail_type_1.ThumbnailType.MINIATURE;
    var thumbnailCreator = function () { return image_utils_1.processImage(inputPath, outputPath, { width: width, height: height }, keepOriginal); };
    return createThumbnailFromFunction({ thumbnailCreator: thumbnailCreator, filename: filename, height: height, width: width, type: type, automaticallyGenerated: automaticallyGenerated, existingThumbnail: existingThumbnail });
}
exports.createPlaylistMiniatureFromExisting = createPlaylistMiniatureFromExisting;
function createPlaylistMiniatureFromUrl(fileUrl, playlist, size) {
    var _a = buildMetadataFromPlaylist(playlist, size), filename = _a.filename, basePath = _a.basePath, height = _a.height, width = _a.width, existingThumbnail = _a.existingThumbnail;
    var type = thumbnail_type_1.ThumbnailType.MINIATURE;
    var thumbnailCreator = function () { return requests_1.downloadImage(fileUrl, basePath, filename, { width: width, height: height }); };
    return createThumbnailFromFunction({ thumbnailCreator: thumbnailCreator, filename: filename, height: height, width: width, type: type, existingThumbnail: existingThumbnail, fileUrl: fileUrl });
}
exports.createPlaylistMiniatureFromUrl = createPlaylistMiniatureFromUrl;
function createVideoMiniatureFromUrl(fileUrl, video, type, size) {
    var _a = buildMetadataFromVideo(video, type, size), filename = _a.filename, basePath = _a.basePath, height = _a.height, width = _a.width, existingThumbnail = _a.existingThumbnail;
    var thumbnailCreator = function () { return requests_1.downloadImage(fileUrl, basePath, filename, { width: width, height: height }); };
    return createThumbnailFromFunction({ thumbnailCreator: thumbnailCreator, filename: filename, height: height, width: width, type: type, existingThumbnail: existingThumbnail, fileUrl: fileUrl });
}
exports.createVideoMiniatureFromUrl = createVideoMiniatureFromUrl;
function createVideoMiniatureFromExisting(inputPath, video, type, automaticallyGenerated, size) {
    var _a = buildMetadataFromVideo(video, type, size), filename = _a.filename, outputPath = _a.outputPath, height = _a.height, width = _a.width, existingThumbnail = _a.existingThumbnail;
    var thumbnailCreator = function () { return image_utils_1.processImage(inputPath, outputPath, { width: width, height: height }); };
    return createThumbnailFromFunction({ thumbnailCreator: thumbnailCreator, filename: filename, height: height, width: width, type: type, automaticallyGenerated: automaticallyGenerated, existingThumbnail: existingThumbnail });
}
exports.createVideoMiniatureFromExisting = createVideoMiniatureFromExisting;
function generateVideoMiniature(video, videoFile, type) {
    var input = video.getVideoFilePath(videoFile);
    var _a = buildMetadataFromVideo(video, type), filename = _a.filename, basePath = _a.basePath, height = _a.height, width = _a.width, existingThumbnail = _a.existingThumbnail, outputPath = _a.outputPath;
    var thumbnailCreator = videoFile.isAudio()
        ? function () { return image_utils_1.processImage(constants_1.ASSETS_PATH.DEFAULT_AUDIO_BACKGROUND, outputPath, { width: width, height: height }, true); }
        : function () { return ffmpeg_utils_1.generateImageFromVideoFile(input, basePath, filename, { height: height, width: width }); };
    return createThumbnailFromFunction({ thumbnailCreator: thumbnailCreator, filename: filename, height: height, width: width, type: type, automaticallyGenerated: true, existingThumbnail: existingThumbnail });
}
exports.generateVideoMiniature = generateVideoMiniature;
function createPlaceholderThumbnail(fileUrl, video, type, size) {
    var _a = buildMetadataFromVideo(video, type, size), filename = _a.filename, height = _a.height, width = _a.width, existingThumbnail = _a.existingThumbnail;
    var thumbnail = existingThumbnail ? existingThumbnail : new thumbnail_1.ThumbnailModel();
    thumbnail.filename = filename;
    thumbnail.height = height;
    thumbnail.width = width;
    thumbnail.type = type;
    thumbnail.fileUrl = fileUrl;
    return thumbnail;
}
exports.createPlaceholderThumbnail = createPlaceholderThumbnail;
function buildMetadataFromPlaylist(playlist, size) {
    var filename = playlist.generateThumbnailName();
    var basePath = config_1.CONFIG.STORAGE.THUMBNAILS_DIR;
    return {
        filename: filename,
        basePath: basePath,
        existingThumbnail: playlist.Thumbnail,
        outputPath: path_1.join(basePath, filename),
        height: size ? size.height : constants_1.THUMBNAILS_SIZE.height,
        width: size ? size.width : constants_1.THUMBNAILS_SIZE.width
    };
}
function buildMetadataFromVideo(video, type, size) {
    var existingThumbnail = Array.isArray(video.Thumbnails)
        ? video.Thumbnails.find(function (t) { return t.type === type; })
        : undefined;
    if (type === thumbnail_type_1.ThumbnailType.MINIATURE) {
        var filename = video.generateThumbnailName();
        var basePath = config_1.CONFIG.STORAGE.THUMBNAILS_DIR;
        return {
            filename: filename,
            basePath: basePath,
            existingThumbnail: existingThumbnail,
            outputPath: path_1.join(basePath, filename),
            height: size ? size.height : constants_1.THUMBNAILS_SIZE.height,
            width: size ? size.width : constants_1.THUMBNAILS_SIZE.width
        };
    }
    if (type === thumbnail_type_1.ThumbnailType.PREVIEW) {
        var filename = video.generatePreviewName();
        var basePath = config_1.CONFIG.STORAGE.PREVIEWS_DIR;
        return {
            filename: filename,
            basePath: basePath,
            existingThumbnail: existingThumbnail,
            outputPath: path_1.join(basePath, filename),
            height: size ? size.height : constants_1.PREVIEWS_SIZE.height,
            width: size ? size.width : constants_1.PREVIEWS_SIZE.width
        };
    }
    return undefined;
}
function createThumbnailFromFunction(parameters) {
    return __awaiter(this, void 0, void 0, function () {
        var thumbnailCreator, filename, width, height, type, existingThumbnail, _a, automaticallyGenerated, _b, fileUrl, thumbnail;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    thumbnailCreator = parameters.thumbnailCreator, filename = parameters.filename, width = parameters.width, height = parameters.height, type = parameters.type, existingThumbnail = parameters.existingThumbnail, _a = parameters.automaticallyGenerated, automaticallyGenerated = _a === void 0 ? null : _a, _b = parameters.fileUrl, fileUrl = _b === void 0 ? null : _b;
                    thumbnail = existingThumbnail ? existingThumbnail : new thumbnail_1.ThumbnailModel();
                    thumbnail.filename = filename;
                    thumbnail.height = height;
                    thumbnail.width = width;
                    thumbnail.type = type;
                    thumbnail.fileUrl = fileUrl;
                    thumbnail.automaticallyGenerated = automaticallyGenerated;
                    return [4 /*yield*/, thumbnailCreator()];
                case 1:
                    _c.sent();
                    return [2 /*return*/, thumbnail];
            }
        });
    });
}
