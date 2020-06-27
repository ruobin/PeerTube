"use strict";
exports.__esModule = true;
var validator = require("validator");
var misc_1 = require("./misc");
var core_utils_1 = require("../core-utils");
var constants_1 = require("../../initializers/constants");
function isHostValid(host) {
    var isURLOptions = {
        require_host: true,
        require_tld: true
    };
    // We validate 'localhost', so we don't have the top level domain
    if (core_utils_1.isTestInstance()) {
        isURLOptions.require_tld = false;
    }
    return misc_1.exists(host) && validator.isURL(host, isURLOptions) && host.split('://').length === 1;
}
exports.isHostValid = isHostValid;
function isEachUniqueHostValid(hosts) {
    return misc_1.isArray(hosts) &&
        hosts.length !== 0 &&
        hosts.every(function (host) {
            return isHostValid(host) && hosts.indexOf(host) === hosts.lastIndexOf(host);
        });
}
exports.isEachUniqueHostValid = isEachUniqueHostValid;
function isValidContactBody(value) {
    return misc_1.exists(value) && validator.isLength(value, constants_1.CONSTRAINTS_FIELDS.CONTACT_FORM.BODY);
}
exports.isValidContactBody = isValidContactBody;
function isValidContactFromName(value) {
    return misc_1.exists(value) && validator.isLength(value, constants_1.CONSTRAINTS_FIELDS.CONTACT_FORM.FROM_NAME);
}
exports.isValidContactFromName = isValidContactFromName;
