"use strict";
exports.__esModule = true;
var express_utils_1 = require("../helpers/express-utils");
function setBodyHostsPort(req, res, next) {
    if (!req.body.hosts)
        return next();
    for (var i = 0; i < req.body.hosts.length; i++) {
        var hostWithPort = express_utils_1.getHostWithPort(req.body.hosts[i]);
        // Problem with the url parsing?
        if (hostWithPort === null) {
            return res.sendStatus(500);
        }
        req.body.hosts[i] = hostWithPort;
    }
    return next();
}
exports.setBodyHostsPort = setBodyHostsPort;
