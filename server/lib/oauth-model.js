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
var oauth2_server_1 = require("oauth2-server");
var logger_1 = require("../helpers/logger");
var user_1 = require("../models/account/user");
var oauth_client_1 = require("../models/oauth/oauth-client");
var oauth_token_1 = require("../models/oauth/oauth-token");
var constants_1 = require("../initializers/constants");
var config_1 = require("../initializers/config");
var LRUCache = require("lru-cache");
var accessTokenCache = new LRUCache({ max: constants_1.LRU_CACHE.USER_TOKENS.MAX_SIZE });
var userHavingToken = new LRUCache({ max: constants_1.LRU_CACHE.USER_TOKENS.MAX_SIZE });
// ---------------------------------------------------------------------------
function deleteUserToken(userId, t) {
    clearCacheByUserId(userId);
    return oauth_token_1.OAuthTokenModel.deleteUserToken(userId, t);
}
exports.deleteUserToken = deleteUserToken;
function clearCacheByUserId(userId) {
    var token = userHavingToken.get(userId);
    if (token !== undefined) {
        accessTokenCache.del(token);
        userHavingToken.del(userId);
    }
}
exports.clearCacheByUserId = clearCacheByUserId;
function clearCacheByToken(token) {
    var tokenModel = accessTokenCache.get(token);
    if (tokenModel !== undefined) {
        userHavingToken.del(tokenModel.userId);
        accessTokenCache.del(token);
    }
}
exports.clearCacheByToken = clearCacheByToken;
function getAccessToken(bearerToken) {
    logger_1.logger.debug('Getting access token (bearerToken: ' + bearerToken + ').');
    if (!bearerToken)
        return Bluebird.resolve(undefined);
    if (accessTokenCache.has(bearerToken))
        return Bluebird.resolve(accessTokenCache.get(bearerToken));
    return oauth_token_1.OAuthTokenModel.getByTokenAndPopulateUser(bearerToken)
        .then(function (tokenModel) {
        if (tokenModel) {
            accessTokenCache.set(bearerToken, tokenModel);
            userHavingToken.set(tokenModel.userId, tokenModel.accessToken);
        }
        return tokenModel;
    });
}
exports.getAccessToken = getAccessToken;
function getClient(clientId, clientSecret) {
    logger_1.logger.debug('Getting Client (clientId: ' + clientId + ', clientSecret: ' + clientSecret + ').');
    return oauth_client_1.OAuthClientModel.getByIdAndSecret(clientId, clientSecret);
}
exports.getClient = getClient;
function getRefreshToken(refreshToken) {
    logger_1.logger.debug('Getting RefreshToken (refreshToken: ' + refreshToken + ').');
    return oauth_token_1.OAuthTokenModel.getByRefreshTokenAndPopulateClient(refreshToken);
}
exports.getRefreshToken = getRefreshToken;
function getUser(usernameOrEmail, password) {
    return __awaiter(this, void 0, void 0, function () {
        var user, passwordMatch;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.debug('Getting User (username/email: ' + usernameOrEmail + ', password: ******).');
                    return [4 /*yield*/, user_1.UserModel.loadByUsernameOrEmail(usernameOrEmail)];
                case 1:
                    user = _a.sent();
                    if (!user)
                        return [2 /*return*/, null];
                    return [4 /*yield*/, user.isPasswordMatch(password)];
                case 2:
                    passwordMatch = _a.sent();
                    if (passwordMatch === false)
                        return [2 /*return*/, null];
                    if (user.blocked)
                        throw new oauth2_server_1.AccessDeniedError('User is blocked.');
                    if (config_1.CONFIG.SIGNUP.REQUIRES_EMAIL_VERIFICATION && user.emailVerified === false) {
                        throw new oauth2_server_1.AccessDeniedError('User email is not verified.');
                    }
                    return [2 /*return*/, user];
            }
        });
    });
}
exports.getUser = getUser;
function revokeToken(tokenInfo) {
    return __awaiter(this, void 0, void 0, function () {
        var token, expiredToken;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, oauth_token_1.OAuthTokenModel.getByRefreshTokenAndPopulateUser(tokenInfo.refreshToken)];
                case 1:
                    token = _a.sent();
                    if (token) {
                        clearCacheByToken(token.accessToken);
                        token.destroy()["catch"](function (err) { return logger_1.logger.error('Cannot destroy token when revoking token.', { err: err }); });
                    }
                    expiredToken = token;
                    expiredToken.refreshTokenExpiresAt = new Date('2015-05-28T06:59:53.000Z');
                    return [2 /*return*/, expiredToken];
            }
        });
    });
}
exports.revokeToken = revokeToken;
function saveToken(token, client, user) {
    return __awaiter(this, void 0, void 0, function () {
        var tokenToCreate, tokenCreated;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.debug('Saving token ' + token.accessToken + ' for client ' + client.id + ' and user ' + user.id + '.');
                    tokenToCreate = {
                        accessToken: token.accessToken,
                        accessTokenExpiresAt: token.accessTokenExpiresAt,
                        refreshToken: token.refreshToken,
                        refreshTokenExpiresAt: token.refreshTokenExpiresAt,
                        oAuthClientId: client.id,
                        userId: user.id
                    };
                    return [4 /*yield*/, oauth_token_1.OAuthTokenModel.create(tokenToCreate)];
                case 1:
                    tokenCreated = _a.sent();
                    return [2 /*return*/, Object.assign(tokenCreated, { client: client, user: user })];
            }
        });
    });
}
exports.saveToken = saveToken;
