"use strict";
exports.__esModule = true;
var OAuthServer = require("express-oauth-server");
var constants_1 = require("../initializers/constants");
var logger_1 = require("../helpers/logger");
var oauth_model_1 = require("../lib/oauth-model");
var oAuthServer = new OAuthServer({
    useErrorHandler: true,
    accessTokenLifetime: constants_1.OAUTH_LIFETIME.ACCESS_TOKEN,
    refreshTokenLifetime: constants_1.OAUTH_LIFETIME.REFRESH_TOKEN,
    model: require('../lib/oauth-model')
});
function authenticate(req, res, next) {
    oAuthServer.authenticate()(req, res, function (err) {
        if (err) {
            logger_1.logger.warn('Cannot authenticate.', { err: err });
            return res.status(err.status)
                .json({
                error: 'Token is invalid.',
                code: err.name
            })
                .end();
        }
        return next();
    });
}
exports.authenticate = authenticate;
function authenticateSocket(socket, next) {
    var accessToken = socket.handshake.query.accessToken;
    logger_1.logger.debug('Checking socket access token %s.', accessToken);
    if (!accessToken)
        return next(new Error('No access token provided'));
    oauth_model_1.getAccessToken(accessToken)
        .then(function (tokenDB) {
        var now = new Date();
        if (!tokenDB || tokenDB.accessTokenExpiresAt < now || tokenDB.refreshTokenExpiresAt < now) {
            return next(new Error('Invalid access token.'));
        }
        socket.handshake.query.user = tokenDB.User;
        return next();
    });
}
exports.authenticateSocket = authenticateSocket;
function authenticatePromiseIfNeeded(req, res) {
    return new Promise(function (resolve) {
        // Already authenticated? (or tried to)
        if (res.locals.oauth && res.locals.oauth.token.User)
            return resolve();
        if (res.locals.authenticated === false)
            return res.sendStatus(401);
        authenticate(req, res, function () {
            return resolve();
        });
    });
}
exports.authenticatePromiseIfNeeded = authenticatePromiseIfNeeded;
function optionalAuthenticate(req, res, next) {
    if (req.header('authorization'))
        return authenticate(req, res, next);
    res.locals.authenticated = false;
    return next();
}
exports.optionalAuthenticate = optionalAuthenticate;
function token(req, res, next) {
    return oAuthServer.token()(req, res, function (err) {
        if (err) {
            return res.status(err.status)
                .json({
                error: err.message,
                code: err.name
            })
                .end();
        }
        return next();
    });
}
exports.token = token;
