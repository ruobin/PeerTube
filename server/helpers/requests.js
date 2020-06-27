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
var Bluebird = require("bluebird");
var fs_extra_1 = require("fs-extra");
var request = require("request");
var constants_1 = require("../initializers/constants");
var image_utils_1 = require("./image-utils");
var path_1 = require("path");
var logger_1 = require("./logger");
var config_1 = require("../initializers/config");
function doRequest(requestOptions, bodyKBLimit // 1MB
) {
    if (bodyKBLimit === void 0) { bodyKBLimit = 1000; }
    if (!(requestOptions.headers))
        requestOptions.headers = {};
    requestOptions.headers['User-Agent'] = getUserAgent();
    if (requestOptions.activityPub === true) {
        requestOptions.headers['accept'] = constants_1.ACTIVITY_PUB.ACCEPT_HEADER;
    }
    return new Bluebird(function (res, rej) {
        request(requestOptions, function (err, response, body) { return err ? rej(err) : res({ response: response, body: body }); })
            .on('data', onRequestDataLengthCheck(bodyKBLimit));
    });
}
exports.doRequest = doRequest;
function doRequestAndSaveToFile(requestOptions, destPath, bodyKBLimit // 10MB
) {
    if (bodyKBLimit === void 0) { bodyKBLimit = 10000; }
    if (!requestOptions.headers)
        requestOptions.headers = {};
    requestOptions.headers['User-Agent'] = getUserAgent();
    return new Bluebird(function (res, rej) {
        var file = fs_extra_1.createWriteStream(destPath);
        file.on('finish', function () { return res(); });
        request(requestOptions)
            .on('data', onRequestDataLengthCheck(bodyKBLimit))
            .on('error', function (err) {
            file.close();
            fs_extra_1.remove(destPath)["catch"](function (err) { return logger_1.logger.error('Cannot remove %s after request failure.', destPath, { err: err }); });
            return rej(err);
        })
            .pipe(file);
    });
}
exports.doRequestAndSaveToFile = doRequestAndSaveToFile;
function downloadImage(url, destDir, destName, size) {
    return __awaiter(this, void 0, void 0, function () {
        var tmpPath, destPath, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tmpPath = path_1.join(config_1.CONFIG.STORAGE.TMP_DIR, 'pending-' + destName);
                    return [4 /*yield*/, doRequestAndSaveToFile({ method: 'GET', uri: url }, tmpPath)];
                case 1:
                    _a.sent();
                    destPath = path_1.join(destDir, destName);
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 6]);
                    return [4 /*yield*/, image_utils_1.processImage(tmpPath, destPath, size)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4:
                    err_1 = _a.sent();
                    return [4 /*yield*/, fs_extra_1.remove(tmpPath)];
                case 5:
                    _a.sent();
                    throw err_1;
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.downloadImage = downloadImage;
function getUserAgent() {
    return "PeerTube/" + constants_1.PEERTUBE_VERSION + " (+" + constants_1.WEBSERVER.URL + ")";
}
// ---------------------------------------------------------------------------
// Thanks to https://github.com/request/request/issues/2470#issuecomment-268929907 <3
function onRequestDataLengthCheck(bodyKBLimit) {
    var bufferLength = 0;
    var bytesLimit = bodyKBLimit * 1000;
    return function (chunk) {
        bufferLength += chunk.length;
        if (bufferLength > bytesLimit) {
            this.abort();
            var error = new Error("Response was too large - aborted after " + bytesLimit + " bytes.");
            this.emit('error', error);
        }
    };
}
