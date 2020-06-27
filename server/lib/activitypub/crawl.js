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
var constants_1 = require("../../initializers/constants");
var requests_1 = require("../../helpers/requests");
var logger_1 = require("../../helpers/logger");
var url_1 = require("url");
function crawlCollectionPage(uri, handler, cleaner) {
    return __awaiter(this, void 0, void 0, function () {
        var options, startDate, response, firstBody, limit, i, nextLink, body, remoteHost, res, items;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.info('Crawling ActivityPub data on %s.', uri);
                    options = {
                        method: 'GET',
                        uri: uri,
                        json: true,
                        activityPub: true,
                        timeout: constants_1.JOB_REQUEST_TIMEOUT
                    };
                    startDate = new Date();
                    return [4 /*yield*/, requests_1.doRequest(options)];
                case 1:
                    response = _a.sent();
                    firstBody = response.body;
                    limit = constants_1.ACTIVITY_PUB.FETCH_PAGE_LIMIT;
                    i = 0;
                    nextLink = firstBody.first;
                    _a.label = 2;
                case 2:
                    if (!(nextLink && i < limit)) return [3 /*break*/, 8];
                    body = void 0;
                    if (!(typeof nextLink === 'string')) return [3 /*break*/, 4];
                    remoteHost = url_1.parse(nextLink).host;
                    if (remoteHost === constants_1.WEBSERVER.HOST)
                        return [3 /*break*/, 2];
                    options.uri = nextLink;
                    return [4 /*yield*/, requests_1.doRequest(options)];
                case 3:
                    res = _a.sent();
                    body = res.body;
                    return [3 /*break*/, 5];
                case 4:
                    // nextLink is already the object we want
                    body = nextLink;
                    _a.label = 5;
                case 5:
                    nextLink = body.next;
                    i++;
                    if (!Array.isArray(body.orderedItems)) return [3 /*break*/, 7];
                    items = body.orderedItems;
                    logger_1.logger.info('Processing %i ActivityPub items for %s.', items.length, options.uri);
                    return [4 /*yield*/, handler(items)];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7: return [3 /*break*/, 2];
                case 8:
                    if (!cleaner) return [3 /*break*/, 10];
                    return [4 /*yield*/, cleaner(startDate)];
                case 9:
                    _a.sent();
                    _a.label = 10;
                case 10: return [2 /*return*/];
            }
        });
    });
}
exports.crawlCollectionPage = crawlCollectionPage;
