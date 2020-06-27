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
var program = require("commander");
var fs_extra_1 = require("fs-extra");
var path_1 = require("path");
var extra_utils_1 = require("../../shared/extra-utils");
var extra_utils_2 = require("../../shared/extra-utils/");
var cli_1 = require("./cli");
var command = program
    .name('upload');
command = cli_1.buildCommonVideoOptions(command);
command
    .option('-u, --url <url>', 'Server url')
    .option('-U, --username <username>', 'Username')
    .option('-p, --password <token>', 'Password')
    .option('-b, --thumbnail <thumbnailPath>', 'Thumbnail path')
    .option('-v, --preview <previewPath>', 'Preview path')
    .option('-f, --file <file>', 'Video absolute file path')
    .parse(process.argv);
cli_1.getServerCredentials(command)
    .then(function (_a) {
    var url = _a.url, username = _a.username, password = _a.password;
    if (!program['videoName'] || !program['file']) {
        if (!program['videoName'])
            console.error('--video-name is required.');
        if (!program['file'])
            console.error('--file is required.');
        process.exit(-1);
    }
    if (path_1.isAbsolute(program['file']) === false) {
        console.error('File path should be absolute.');
        process.exit(-1);
    }
    run(url, username, password)["catch"](function (err) {
        console.error(err);
        process.exit(-1);
    });
});
function run(url, username, password) {
    return __awaiter(this, void 0, void 0, function () {
        var accessToken, videoAttributes, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, extra_utils_1.getAccessToken(url, username, password)];
                case 1:
                    accessToken = _a.sent();
                    return [4 /*yield*/, fs_extra_1.access(program['file'], fs_extra_1.constants.F_OK)];
                case 2:
                    _a.sent();
                    console.log('Uploading %s video...', program['videoName']);
                    return [4 /*yield*/, cli_1.buildVideoAttributesFromCommander(url, program)];
                case 3:
                    videoAttributes = _a.sent();
                    Object.assign(videoAttributes, {
                        fixture: program['file'],
                        thumbnailfile: program['thumbnail'],
                        previewfile: program['preview']
                    });
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, extra_utils_2.uploadVideo(url, accessToken, videoAttributes)];
                case 5:
                    _a.sent();
                    console.log("Video " + program['videoName'] + " uploaded.");
                    process.exit(0);
                    return [3 /*break*/, 7];
                case 6:
                    err_1 = _a.sent();
                    console.error(require('util').inspect(err_1));
                    process.exit(-1);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
// ----------------------------------------------------------------------------
