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
var logger_1 = require("../helpers/logger");
var peertube_crypto_1 = require("../helpers/peertube-crypto");
var constants_1 = require("../initializers/constants");
var activitypub_1 = require("../lib/activitypub");
var webfinger_1 = require("../helpers/webfinger");
function checkSignature(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var httpSignatureChecked, actor, bodyActor, bodyActorId, jsonLDSignatureChecked, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, checkHttpSignature(req, res)];
                case 1:
                    httpSignatureChecked = _a.sent();
                    if (httpSignatureChecked !== true)
                        return [2 /*return*/];
                    actor = res.locals.signature.actor;
                    bodyActor = req.body.actor;
                    bodyActorId = bodyActor && bodyActor.id ? bodyActor.id : bodyActor;
                    if (!(bodyActorId && bodyActorId !== actor.url)) return [3 /*break*/, 3];
                    return [4 /*yield*/, checkJsonLDSignature(req, res)];
                case 2:
                    jsonLDSignatureChecked = _a.sent();
                    if (jsonLDSignatureChecked !== true)
                        return [2 /*return*/];
                    _a.label = 3;
                case 3: return [2 /*return*/, next()];
                case 4:
                    err_1 = _a.sent();
                    logger_1.logger.error('Error in ActivityPub signature checker.', err_1);
                    return [2 /*return*/, res.sendStatus(403)];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.checkSignature = checkSignature;
function executeIfActivityPub(req, res, next) {
    var accepted = req.accepts(constants_1.ACCEPT_HEADERS);
    if (accepted === false || constants_1.ACTIVITY_PUB.POTENTIAL_ACCEPT_HEADERS.indexOf(accepted) === -1) {
        // Bypass this route
        return next('route');
    }
    logger_1.logger.debug('ActivityPub request for %s.', req.url);
    return next();
}
exports.executeIfActivityPub = executeIfActivityPub;
// ---------------------------------------------------------------------------
function checkHttpSignature(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var sig, parsed, keyId, actorUrl, actor, verified;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sig = req.headers[constants_1.HTTP_SIGNATURE.HEADER_NAME];
                    if (sig && sig.startsWith('Signature ') === false)
                        req.headers[constants_1.HTTP_SIGNATURE.HEADER_NAME] = 'Signature ' + sig;
                    parsed = peertube_crypto_1.parseHTTPSignature(req);
                    keyId = parsed.keyId;
                    if (!keyId) {
                        res.sendStatus(403);
                        return [2 /*return*/, false];
                    }
                    logger_1.logger.debug('Checking HTTP signature of actor %s...', keyId);
                    actorUrl = keyId.split('#')[0];
                    if (!actorUrl.startsWith('acct:')) return [3 /*break*/, 2];
                    return [4 /*yield*/, webfinger_1.loadActorUrlOrGetFromWebfinger(actorUrl.replace(/^acct:/, ''))];
                case 1:
                    actorUrl = _a.sent();
                    _a.label = 2;
                case 2: return [4 /*yield*/, activitypub_1.getOrCreateActorAndServerAndModel(actorUrl)];
                case 3:
                    actor = _a.sent();
                    verified = peertube_crypto_1.isHTTPSignatureVerified(parsed, actor);
                    if (verified !== true) {
                        logger_1.logger.warn('Signature from %s is invalid', actorUrl, { parsed: parsed });
                        res.sendStatus(403);
                        return [2 /*return*/, false];
                    }
                    res.locals.signature = { actor: actor };
                    return [2 /*return*/, true];
            }
        });
    });
}
exports.checkHttpSignature = checkHttpSignature;
function checkJsonLDSignature(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var signatureObject, creator, actor, verified;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    signatureObject = req.body.signature;
                    if (!signatureObject || !signatureObject.creator) {
                        res.sendStatus(403);
                        return [2 /*return*/, false];
                    }
                    creator = signatureObject.creator.split('#')[0];
                    logger_1.logger.debug('Checking JsonLD signature of actor %s...', creator);
                    return [4 /*yield*/, activitypub_1.getOrCreateActorAndServerAndModel(creator)];
                case 1:
                    actor = _a.sent();
                    return [4 /*yield*/, peertube_crypto_1.isJsonLDSignatureVerified(actor, req.body)];
                case 2:
                    verified = _a.sent();
                    if (verified !== true) {
                        res.sendStatus(403);
                        return [2 /*return*/, false];
                    }
                    res.locals.signature = { actor: actor };
                    return [2 /*return*/, true];
            }
        });
    });
}
