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
var application_1 = require("../models/application/application");
var core_utils_1 = require("./core-utils");
var logger_1 = require("./logger");
var path_1 = require("path");
var fs_extra_1 = require("fs-extra");
var memoizee = require("memoizee");
var config_1 = require("../initializers/config");
function deleteFileAsync(path) {
    fs_extra_1.remove(path)["catch"](function (err) { return logger_1.logger.error('Cannot delete the file %s asynchronously.', path, { err: err }); });
}
exports.deleteFileAsync = deleteFileAsync;
function generateRandomString(size) {
    return __awaiter(this, void 0, void 0, function () {
        var raw;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, core_utils_1.pseudoRandomBytesPromise(size)];
                case 1:
                    raw = _a.sent();
                    return [2 /*return*/, raw.toString('hex')];
            }
        });
    });
}
exports.generateRandomString = generateRandomString;
function getFormattedObjects(objects, objectsTotal, formattedArg) {
    var formattedObjects = objects.map(function (o) { return o.toFormattedJSON(formattedArg); });
    return {
        total: objectsTotal,
        data: formattedObjects
    };
}
exports.getFormattedObjects = getFormattedObjects;
var getServerActor = memoizee(function () {
    return __awaiter(this, void 0, void 0, function () {
        var application, actor;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, application_1.ApplicationModel.load()];
                case 1:
                    application = _a.sent();
                    if (!application)
                        throw Error('Could not load Application from database.');
                    actor = application.Account.Actor;
                    actor.Account = application.Account;
                    return [2 /*return*/, actor];
            }
        });
    });
});
exports.getServerActor = getServerActor;
function generateVideoImportTmpPath(target) {
    var id = typeof target === 'string' ? target : target.infoHash;
    var hash = core_utils_1.sha256(id);
    return path_1.join(config_1.CONFIG.STORAGE.TMP_DIR, hash + '-import.mp4');
}
exports.generateVideoImportTmpPath = generateVideoImportTmpPath;
function getSecureTorrentName(originalName) {
    return core_utils_1.sha256(originalName) + '.torrent';
}
exports.getSecureTorrentName = getSecureTorrentName;
function getServerCommit() {
    return __awaiter(this, void 0, void 0, function () {
        var tag, err_1, version, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, core_utils_1.execPromise2('[ ! -d .git ] || git name-rev --name-only --tags --no-undefined HEAD 2>/dev/null || true', { stdio: [0, 1, 2] })];
                case 1:
                    tag = _a.sent();
                    if (tag)
                        return [2 /*return*/, tag.replace(/^v/, '')];
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    logger_1.logger.debug('Cannot get version from git tags.', { err: err_1 });
                    return [3 /*break*/, 3];
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, core_utils_1.execPromise('[ ! -d .git ] || git rev-parse --short HEAD')];
                case 4:
                    version = _a.sent();
                    if (version)
                        return [2 /*return*/, version.toString().trim()];
                    return [3 /*break*/, 6];
                case 5:
                    err_2 = _a.sent();
                    logger_1.logger.debug('Cannot get version from git HEAD.', { err: err_2 });
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/, ''];
            }
        });
    });
}
exports.getServerCommit = getServerCommit;
/**
 * From a filename like "ede4cba5-742b-46fa-a388-9a6eb3a3aeb3.mp4", returns
 * only the "ede4cba5-742b-46fa-a388-9a6eb3a3aeb3" part. If the filename does
 * not contain a UUID, returns null.
 */
function getUUIDFromFilename(filename) {
    var regex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;
    var result = filename.match(regex);
    if (!result || Array.isArray(result) === false)
        return null;
    return result[0];
}
exports.getUUIDFromFilename = getUUIDFromFilename;
