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
var WebFinger = require("webfinger.js");
var actor_1 = require("../models/activitypub/actor");
var core_utils_1 = require("./core-utils");
var misc_1 = require("./custom-validators/activitypub/misc");
var constants_1 = require("../initializers/constants");
var webfinger = new WebFinger({
    webfist_fallback: false,
    tls_only: core_utils_1.isTestInstance(),
    uri_fallback: false,
    request_timeout: 3000
});
function loadActorUrlOrGetFromWebfinger(uriArg) {
    return __awaiter(this, void 0, void 0, function () {
        var uri, _a, name, host, actor;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    uri = uriArg.startsWith('@') ? uriArg.slice(1) : uriArg;
                    _a = uri.split('@'), name = _a[0], host = _a[1];
                    if (!(!host || host === constants_1.WEBSERVER.HOST)) return [3 /*break*/, 2];
                    return [4 /*yield*/, actor_1.ActorModel.loadLocalByName(name)];
                case 1:
                    actor = _b.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, actor_1.ActorModel.loadByNameAndHost(name, host)];
                case 3:
                    actor = _b.sent();
                    _b.label = 4;
                case 4:
                    if (actor)
                        return [2 /*return*/, actor.url];
                    return [2 /*return*/, getUrlFromWebfinger(uri)];
            }
        });
    });
}
exports.loadActorUrlOrGetFromWebfinger = loadActorUrlOrGetFromWebfinger;
function getUrlFromWebfinger(uri) {
    return __awaiter(this, void 0, void 0, function () {
        var webfingerData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, webfingerLookup(uri)];
                case 1:
                    webfingerData = _a.sent();
                    return [2 /*return*/, getLinkOrThrow(webfingerData)];
            }
        });
    });
}
exports.getUrlFromWebfinger = getUrlFromWebfinger;
// ---------------------------------------------------------------------------
function getLinkOrThrow(webfingerData) {
    if (Array.isArray(webfingerData.links) === false)
        throw new Error('WebFinger links is not an array.');
    var selfLink = webfingerData.links.find(function (l) { return l.rel === 'self'; });
    if (selfLink === undefined || misc_1.isActivityPubUrlValid(selfLink.href) === false) {
        throw new Error('Cannot find self link or href is not a valid URL.');
    }
    return selfLink.href;
}
function webfingerLookup(nameWithHost) {
    return new Promise(function (res, rej) {
        webfinger.lookup(nameWithHost, function (err, p) {
            if (err)
                return rej(err);
            return res(p.object);
        });
    });
}
