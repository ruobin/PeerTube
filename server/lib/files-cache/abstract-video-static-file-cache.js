"use strict";
exports.__esModule = true;
var fs_extra_1 = require("fs-extra");
var logger_1 = require("../../helpers/logger");
var memoizee = require("memoizee");
var AbstractVideoStaticFileCache = /** @class */ (function () {
    function AbstractVideoStaticFileCache() {
    }
    AbstractVideoStaticFileCache.prototype.init = function (max, maxAge) {
        var _this = this;
        this.getFilePath = memoizee(this.getFilePathImpl, {
            maxAge: maxAge,
            max: max,
            promise: true,
            dispose: function (result) {
                if (result && result.isOwned !== true) {
                    fs_extra_1.remove(result.path)
                        .then(function () { return logger_1.logger.debug('%s removed from %s', result.path, _this.constructor.name); })["catch"](function (err) { return logger_1.logger.error('Cannot remove %s from cache %s.', result.path, _this.constructor.name, { err: err }); });
                }
            }
        });
    };
    return AbstractVideoStaticFileCache;
}());
exports.AbstractVideoStaticFileCache = AbstractVideoStaticFileCache;
