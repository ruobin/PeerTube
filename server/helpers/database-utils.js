"use strict";
exports.__esModule = true;
var retry = require("async/retry");
var logger_1 = require("./logger");
function retryTransactionWrapper(functionToRetry) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return transactionRetryer(function (callback) {
        functionToRetry.apply(null, args)
            .then(function (result) { return callback(null, result); })["catch"](function (err) { return callback(err); });
    })["catch"](function (err) {
        logger_1.logger.error("Cannot execute " + functionToRetry.name + " with many retries.", { err: err });
        throw err;
    });
}
exports.retryTransactionWrapper = retryTransactionWrapper;
function transactionRetryer(func) {
    return new Promise(function (res, rej) {
        retry({
            times: 5,
            errorFilter: function (err) {
                var willRetry = (err.name === 'SequelizeDatabaseError');
                logger_1.logger.debug('Maybe retrying the transaction function.', { willRetry: willRetry, err: err });
                return willRetry;
            }
        }, func, function (err, data) { return err ? rej(err) : res(data); });
    });
}
exports.transactionRetryer = transactionRetryer;
function updateInstanceWithAnother(instanceToUpdate, baseInstance) {
    var obj = baseInstance.toJSON();
    for (var _i = 0, _a = Object.keys(obj); _i < _a.length; _i++) {
        var key = _a[_i];
        instanceToUpdate[key] = obj[key];
    }
}
exports.updateInstanceWithAnother = updateInstanceWithAnother;
function resetSequelizeInstance(instance, savedFields) {
    Object.keys(savedFields).forEach(function (key) {
        instance[key] = savedFields[key];
    });
}
exports.resetSequelizeInstance = resetSequelizeInstance;
function afterCommitIfTransaction(t, fn) {
    if (t)
        return t.afterCommit(function () { return fn(); });
    return fn();
}
exports.afterCommitIfTransaction = afterCommitIfTransaction;
