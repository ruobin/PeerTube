"use strict";
exports.__esModule = true;
var async_1 = require("async");
var database_utils_1 = require("../helpers/database-utils");
function asyncMiddleware(fun) {
    return function (req, res, next) {
        if (Array.isArray(fun) === true) {
            return async_1.eachSeries(fun, function (f, cb) {
                Promise.resolve(f(req, res, cb))["catch"](function (err) { return next(err); });
            }, next);
        }
        return Promise.resolve(fun(req, res, next))["catch"](function (err) { return next(err); });
    };
}
exports.asyncMiddleware = asyncMiddleware;
function asyncRetryTransactionMiddleware(fun) {
    return function (req, res, next) {
        return Promise.resolve(database_utils_1.retryTransactionWrapper(fun, req, res, next))["catch"](function (err) { return next(err); });
    };
}
exports.asyncRetryTransactionMiddleware = asyncRetryTransactionMiddleware;
