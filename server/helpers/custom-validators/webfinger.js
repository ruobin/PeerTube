"use strict";
exports.__esModule = true;
var constants_1 = require("../../initializers/constants");
var core_utils_1 = require("../core-utils");
var misc_1 = require("./misc");
function isWebfingerLocalResourceValid(value) {
    if (!misc_1.exists(value))
        return false;
    if (value.startsWith('acct:') === false)
        return false;
    var actorWithHost = value.substr(5);
    var actorParts = actorWithHost.split('@');
    if (actorParts.length !== 2)
        return false;
    var host = actorParts[1];
    return core_utils_1.sanitizeHost(host, constants_1.REMOTE_SCHEME.HTTP) === constants_1.WEBSERVER.HOST;
}
exports.isWebfingerLocalResourceValid = isWebfingerLocalResourceValid;
