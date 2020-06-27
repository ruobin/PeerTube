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
var constants_1 = require("../initializers/constants");
var core_utils_1 = require("./core-utils");
var custom_jsonld_signature_1 = require("./custom-jsonld-signature");
var logger_1 = require("./logger");
var lodash_1 = require("lodash");
var crypto_1 = require("crypto");
var activitypub_http_utils_1 = require("../lib/job-queue/handlers/utils/activitypub-http-utils");
var bcrypt = require("bcrypt");
var bcryptComparePromise = core_utils_1.promisify2(bcrypt.compare);
var bcryptGenSaltPromise = core_utils_1.promisify1(bcrypt.genSalt);
var bcryptHashPromise = core_utils_1.promisify2(bcrypt.hash);
var httpSignature = require('http-signature');
function createPrivateAndPublicKeys() {
    return __awaiter(this, void 0, void 0, function () {
        var key, publicKey;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.info('Generating a RSA key...');
                    return [4 /*yield*/, core_utils_1.createPrivateKey(constants_1.PRIVATE_RSA_KEY_SIZE)];
                case 1:
                    key = (_a.sent()).key;
                    return [4 /*yield*/, core_utils_1.getPublicKey(key)];
                case 2:
                    publicKey = (_a.sent()).publicKey;
                    return [2 /*return*/, { privateKey: key, publicKey: publicKey }];
            }
        });
    });
}
exports.createPrivateAndPublicKeys = createPrivateAndPublicKeys;
// User password checks
function comparePassword(plainPassword, hashPassword) {
    return bcryptComparePromise(plainPassword, hashPassword);
}
exports.comparePassword = comparePassword;
function cryptPassword(password) {
    return __awaiter(this, void 0, void 0, function () {
        var salt;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, bcryptGenSaltPromise(constants_1.BCRYPT_SALT_SIZE)];
                case 1:
                    salt = _a.sent();
                    return [2 /*return*/, bcryptHashPromise(password, salt)];
            }
        });
    });
}
exports.cryptPassword = cryptPassword;
// HTTP Signature
function isHTTPSignatureDigestValid(rawBody, req) {
    if (req.headers[constants_1.HTTP_SIGNATURE.HEADER_NAME] && req.headers['digest']) {
        return activitypub_http_utils_1.buildDigest(rawBody.toString()) === req.headers['digest'];
    }
    return true;
}
exports.isHTTPSignatureDigestValid = isHTTPSignatureDigestValid;
function isHTTPSignatureVerified(httpSignatureParsed, actor) {
    return httpSignature.verifySignature(httpSignatureParsed, actor.publicKey) === true;
}
exports.isHTTPSignatureVerified = isHTTPSignatureVerified;
function parseHTTPSignature(req, clockSkew) {
    return httpSignature.parse(req, { authorizationHeaderName: constants_1.HTTP_SIGNATURE.HEADER_NAME, clockSkew: clockSkew });
}
exports.parseHTTPSignature = parseHTTPSignature;
// JSONLD
function isJsonLDSignatureVerified(fromActor, signedDocument) {
    return __awaiter(this, void 0, void 0, function () {
        var res, publicKeyObject, publicKeyOwnerObject, options;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(signedDocument.signature.type === 'RsaSignature2017')) return [3 /*break*/, 2];
                    return [4 /*yield*/, isJsonLDRSA2017Verified(fromActor, signedDocument)
                        // Success? If no, try with our library
                    ];
                case 1:
                    res = _a.sent();
                    // Success? If no, try with our library
                    if (res === true)
                        return [2 /*return*/, true];
                    _a.label = 2;
                case 2:
                    publicKeyObject = {
                        '@context': custom_jsonld_signature_1.jsig.SECURITY_CONTEXT_URL,
                        id: fromActor.url,
                        type: 'CryptographicKey',
                        owner: fromActor.url,
                        publicKeyPem: fromActor.publicKey
                    };
                    publicKeyOwnerObject = {
                        '@context': custom_jsonld_signature_1.jsig.SECURITY_CONTEXT_URL,
                        id: fromActor.url,
                        publicKey: [publicKeyObject]
                    };
                    options = {
                        publicKey: publicKeyObject,
                        publicKeyOwner: publicKeyOwnerObject
                    };
                    return [2 /*return*/, custom_jsonld_signature_1.jsig.promises
                            .verify(signedDocument, options)
                            .then(function (result) { return result.verified; })["catch"](function (err) {
                            logger_1.logger.error('Cannot check signature.', { err: err });
                            return false;
                        })];
            }
        });
    });
}
exports.isJsonLDSignatureVerified = isJsonLDSignatureVerified;
// Backward compatibility with "other" implementations
function isJsonLDRSA2017Verified(fromActor, signedDocument) {
    return __awaiter(this, void 0, void 0, function () {
        function hash(obj) {
            return custom_jsonld_signature_1.jsonld.promises
                .normalize(obj, {
                algorithm: 'URDNA2015',
                format: 'application/n-quads'
            })
                .then(function (res) { return core_utils_1.sha256(res); });
        }
        var signatureCopy, docWithoutSignature, _a, documentHash, optionsHash, toVerify, verify;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    signatureCopy = lodash_1.cloneDeep(signedDocument.signature);
                    Object.assign(signatureCopy, {
                        '@context': [
                            'https://w3id.org/security/v1',
                            { RsaSignature2017: 'https://w3id.org/security#RsaSignature2017' }
                        ]
                    });
                    delete signatureCopy.type;
                    delete signatureCopy.id;
                    delete signatureCopy.signatureValue;
                    docWithoutSignature = lodash_1.cloneDeep(signedDocument);
                    delete docWithoutSignature.signature;
                    return [4 /*yield*/, Promise.all([
                            hash(docWithoutSignature),
                            hash(signatureCopy)
                        ])];
                case 1:
                    _a = _b.sent(), documentHash = _a[0], optionsHash = _a[1];
                    toVerify = optionsHash + documentHash;
                    verify = crypto_1.createVerify('RSA-SHA256');
                    verify.update(toVerify, 'utf8');
                    return [2 /*return*/, verify.verify(fromActor.publicKey, signedDocument.signature.signatureValue, 'base64')];
            }
        });
    });
}
function signJsonLDObject(byActor, data) {
    var options = {
        privateKeyPem: byActor.privateKey,
        creator: byActor.url,
        algorithm: 'RsaSignature2017'
    };
    return custom_jsonld_signature_1.jsig.promises.sign(data, options);
}
exports.signJsonLDObject = signJsonLDObject;
// ---------------------------------------------------------------------------
