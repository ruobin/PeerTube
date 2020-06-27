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
var logger_1 = require("./logger");
var utils_1 = require("./utils");
var WebTorrent = require("webtorrent");
var fs_extra_1 = require("fs-extra");
var config_1 = require("../initializers/config");
var path_1 = require("path");
var createTorrent = require("create-torrent");
var core_utils_1 = require("./core-utils");
function downloadWebTorrentVideo(target, timeout) {
    return __awaiter(this, void 0, void 0, function () {
        var id, timer, path, directoryPath;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = target.magnetUri || target.torrentName;
                    path = utils_1.generateVideoImportTmpPath(id);
                    logger_1.logger.info('Importing torrent video %s', id);
                    directoryPath = path_1.join(config_1.CONFIG.STORAGE.TMP_DIR, 'webtorrent');
                    return [4 /*yield*/, fs_extra_1.ensureDir(directoryPath)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, new Promise(function (res, rej) {
                            var webtorrent = new WebTorrent();
                            var file;
                            var torrentId = target.magnetUri || path_1.join(config_1.CONFIG.STORAGE.TORRENTS_DIR, target.torrentName);
                            var options = { path: directoryPath };
                            var torrent = webtorrent.add(torrentId, options, function (torrent) {
                                if (torrent.files.length !== 1) {
                                    if (timer)
                                        clearTimeout(timer);
                                    for (var _i = 0, _a = torrent.files; _i < _a.length; _i++) {
                                        var file_1 = _a[_i];
                                        deleteDownloadedFile({ directoryPath: directoryPath, filepath: file_1.path });
                                    }
                                    return safeWebtorrentDestroy(webtorrent, torrentId, undefined, target.torrentName)
                                        .then(function () { return rej(new Error('Cannot import torrent ' + torrentId + ': there are multiple files in it')); });
                                }
                                file = torrent.files[0];
                                // FIXME: avoid creating another stream when https://github.com/webtorrent/webtorrent/issues/1517 is fixed
                                var writeStream = fs_extra_1.createWriteStream(path);
                                writeStream.on('finish', function () {
                                    if (timer)
                                        clearTimeout(timer);
                                    return safeWebtorrentDestroy(webtorrent, torrentId, { directoryPath: directoryPath, filepath: file.path }, target.torrentName)
                                        .then(function () { return res(path); });
                                });
                                file.createReadStream().pipe(writeStream);
                            });
                            torrent.on('error', function (err) { return rej(err); });
                            timer = setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, safeWebtorrentDestroy(webtorrent, torrentId, file ? { directoryPath: directoryPath, filepath: file.path } : undefined, target.torrentName)
                                            .then(function () { return rej(new Error('Webtorrent download timeout.')); })];
                                });
                            }); }, timeout);
                        })];
            }
        });
    });
}
exports.downloadWebTorrentVideo = downloadWebTorrentVideo;
var createTorrentPromise = core_utils_1.promisify2(createTorrent);
exports.createTorrentPromise = createTorrentPromise;
// ---------------------------------------------------------------------------
function safeWebtorrentDestroy(webtorrent, torrentId, downloadedFile, torrentName) {
    return new Promise(function (res) {
        webtorrent.destroy(function (err) {
            // Delete torrent file
            if (torrentName) {
                logger_1.logger.debug('Removing %s torrent after webtorrent download.', torrentId);
                fs_extra_1.remove(torrentId)["catch"](function (err) { return logger_1.logger.error('Cannot remove torrent %s in webtorrent download.', torrentId, { err: err }); });
            }
            // Delete downloaded file
            if (downloadedFile)
                deleteDownloadedFile(downloadedFile);
            if (err)
                logger_1.logger.warn('Cannot destroy webtorrent in timeout.', { err: err });
            return res();
        });
    });
}
function deleteDownloadedFile(downloadedFile) {
    // We want to delete the base directory
    var pathToDelete = path_1.dirname(downloadedFile.filepath);
    if (pathToDelete === '.')
        pathToDelete = downloadedFile.filepath;
    var toRemovePath = path_1.join(downloadedFile.directoryPath, pathToDelete);
    logger_1.logger.debug('Removing %s after webtorrent download.', toRemovePath);
    fs_extra_1.remove(toRemovePath)["catch"](function (err) { return logger_1.logger.error('Cannot remove torrent file %s in webtorrent download.', toRemovePath, { err: err }); });
}
