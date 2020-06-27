"use strict";
exports.__esModule = true;
var shared_1 = require("../../shared");
var logger_1 = require("../helpers/logger");
function ensureUserHasRight(userRight) {
    return function (req, res, next) {
        var user = res.locals.oauth.token.user;
        if (user.hasRight(userRight) === false) {
            var message = "User " + user.username + " does not have right " + shared_1.UserRight[userRight] + " to access to " + req.path + ".";
            logger_1.logger.info(message);
            return res.status(403)
                .json({
                error: message
            })
                .end();
        }
        return next();
    };
}
exports.ensureUserHasRight = ensureUserHasRight;
