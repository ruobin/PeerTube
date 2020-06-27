"use strict";
exports.__esModule = true;
var validator = require("validator");
var misc_1 = require("./misc");
function isNumberArray(value) {
    return misc_1.isArray(value) && value.every(function (v) { return validator.isInt('' + v); });
}
exports.isNumberArray = isNumberArray;
function isStringArray(value) {
    return misc_1.isArray(value) && value.every(function (v) { return typeof v === 'string'; });
}
exports.isStringArray = isStringArray;
function isNSFWQueryValid(value) {
    return value === 'true' || value === 'false' || value === 'both';
}
exports.isNSFWQueryValid = isNSFWQueryValid;
