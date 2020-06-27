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
var multer = require("multer");
var constants_1 = require("../initializers/constants");
var logger_1 = require("./logger");
var utils_1 = require("./utils");
var path_1 = require("path");
var misc_1 = require("./custom-validators/misc");
var config_1 = require("../initializers/config");
function buildNSFWFilter(res, paramNSFW) {
    if (paramNSFW === 'true')
        return true;
    if (paramNSFW === 'false')
        return false;
    if (paramNSFW === 'both')
        return undefined;
    if (res && res.locals.oauth) {
        var user = res.locals.oauth.token.User;
        // User does not want NSFW videos
        if (user.nsfwPolicy === 'do_not_list')
            return false;
        // Both
        return undefined;
    }
    if (config_1.CONFIG.INSTANCE.DEFAULT_NSFW_POLICY === 'do_not_list')
        return false;
    // Display all
    return null;
}
exports.buildNSFWFilter = buildNSFWFilter;
function cleanUpReqFiles(req) {
    var files = req.files;
    if (!files)
        return;
    if (misc_1.isArray(files)) {
        files.forEach(function (f) { return utils_1.deleteFileAsync(f.path); });
        return;
    }
    for (var _i = 0, _a = Object.keys(files); _i < _a.length; _i++) {
        var key = _a[_i];
        var file = files[key];
        if (misc_1.isArray(file))
            file.forEach(function (f) { return utils_1.deleteFileAsync(f.path); });
        else
            utils_1.deleteFileAsync(file.path);
    }
}
exports.cleanUpReqFiles = cleanUpReqFiles;
function getHostWithPort(host) {
    var splitted = host.split(':');
    // The port was not specified
    if (splitted.length === 1) {
        if (constants_1.REMOTE_SCHEME.HTTP === 'https')
            return host + ':443';
        return host + ':80';
    }
    return host;
}
exports.getHostWithPort = getHostWithPort;
function badRequest(req, res) {
    return res.type('json').status(400).end();
}
exports.badRequest = badRequest;
function createReqFiles(fieldNames, mimeTypes, destinations) {
    var _this = this;
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, destinations[file.fieldname]);
        },
        filename: function (req, file, cb) { return __awaiter(_this, void 0, void 0, function () {
            var extension, fileExtension, extensionFromMimetype, randomString, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fileExtension = path_1.extname(file.originalname);
                        extensionFromMimetype = mimeTypes[file.mimetype];
                        // Take the file extension if we don't understand the mime type
                        // We have the OGG/OGV exception too because firefox sends a bad mime type when sending an OGG file
                        if (fileExtension === '.ogg' || fileExtension === '.ogv' || !extensionFromMimetype) {
                            extension = fileExtension;
                        }
                        else {
                            extension = extensionFromMimetype;
                        }
                        randomString = '';
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, utils_1.generateRandomString(16)];
                    case 2:
                        randomString = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        logger_1.logger.error('Cannot generate random string for file name.', { err: err_1 });
                        randomString = 'fake-random-string';
                        return [3 /*break*/, 4];
                    case 4:
                        cb(null, randomString + extension);
                        return [2 /*return*/];
                }
            });
        }); }
    });
    var fields = [];
    for (var _i = 0, fieldNames_1 = fieldNames; _i < fieldNames_1.length; _i++) {
        var fieldName = fieldNames_1[_i];
        fields.push({
            name: fieldName,
            maxCount: 1
        });
    }
    return multer({ storage: storage }).fields(fields);
}
exports.createReqFiles = createReqFiles;
function isUserAbleToSearchRemoteURI(res) {
    var user = res.locals.oauth ? res.locals.oauth.token.User : undefined;
    return config_1.CONFIG.SEARCH.REMOTE_URI.ANONYMOUS === true ||
        (config_1.CONFIG.SEARCH.REMOTE_URI.USERS === true && user !== undefined);
}
exports.isUserAbleToSearchRemoteURI = isUserAbleToSearchRemoteURI;
