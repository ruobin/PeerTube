"use strict";
exports.__esModule = true;
var validator = require("validator");
var constants_1 = require("../../../initializers/constants");
var core_utils_1 = require("../../core-utils");
var misc_1 = require("../misc");
function isUrlValid(url) {
    var isURLOptions = {
        require_host: true,
        require_tld: true,
        require_protocol: true,
        require_valid_protocol: true,
        protocols: ['http', 'https']
    };
    // We validate 'localhost', so we don't have the top level domain
    if (core_utils_1.isTestInstance()) {
        isURLOptions.require_tld = false;
    }
    return misc_1.exists(url) && validator.isURL('' + url, isURLOptions);
}
exports.isUrlValid = isUrlValid;
function isActivityPubUrlValid(url) {
    return isUrlValid(url) && validator.isLength('' + url, constants_1.CONSTRAINTS_FIELDS.ACTORS.URL);
}
exports.isActivityPubUrlValid = isActivityPubUrlValid;
function isBaseActivityValid(activity, type) {
    return activity.type === type &&
        isActivityPubUrlValid(activity.id) &&
        isObjectValid(activity.actor) &&
        isUrlCollectionValid(activity.to) &&
        isUrlCollectionValid(activity.cc);
}
exports.isBaseActivityValid = isBaseActivityValid;
function isUrlCollectionValid(collection) {
    return collection === undefined ||
        (Array.isArray(collection) && collection.every(function (t) { return isActivityPubUrlValid(t); }));
}
function isObjectValid(object) {
    return misc_1.exists(object) &&
        (isActivityPubUrlValid(object) || isActivityPubUrlValid(object.id));
}
exports.isObjectValid = isObjectValid;
function setValidAttributedTo(obj) {
    if (Array.isArray(obj.attributedTo) === false) {
        obj.attributedTo = [];
        return true;
    }
    obj.attributedTo = obj.attributedTo.filter(function (a) {
        return (a.type === 'Group' || a.type === 'Person') && isActivityPubUrlValid(a.id);
    });
    return true;
}
exports.setValidAttributedTo = setValidAttributedTo;
