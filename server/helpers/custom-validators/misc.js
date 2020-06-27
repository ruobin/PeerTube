"use strict";
exports.__esModule = true;
require("multer");
var validator = require("validator");
var path_1 = require("path");
function exists(value) {
    return value !== undefined && value !== null;
}
exports.exists = exists;
function isSafePath(p) {
    return exists(p) &&
        (p + '').split(path_1.sep).every(function (part) {
            return ['..'].includes(part) === false;
        });
}
exports.isSafePath = isSafePath;
function isArray(value) {
    return Array.isArray(value);
}
exports.isArray = isArray;
function isNotEmptyIntArray(value) {
    return Array.isArray(value) && value.every(function (v) { return validator.isInt('' + v); }) && value.length !== 0;
}
exports.isNotEmptyIntArray = isNotEmptyIntArray;
function isArrayOf(value, validator) {
    return isArray(value) && value.every(function (v) { return validator(v); });
}
exports.isArrayOf = isArrayOf;
function isDateValid(value) {
    return exists(value) && validator.isISO8601(value);
}
exports.isDateValid = isDateValid;
function isIdValid(value) {
    return exists(value) && validator.isInt('' + value);
}
exports.isIdValid = isIdValid;
function isUUIDValid(value) {
    return exists(value) && validator.isUUID('' + value, 4);
}
exports.isUUIDValid = isUUIDValid;
function isIdOrUUIDValid(value) {
    return isIdValid(value) || isUUIDValid(value);
}
exports.isIdOrUUIDValid = isIdOrUUIDValid;
function isBooleanValid(value) {
    return typeof value === 'boolean' || (typeof value === 'string' && validator.isBoolean(value));
}
exports.isBooleanValid = isBooleanValid;
function toIntOrNull(value) {
    var v = toValueOrNull(value);
    if (v === null || v === undefined)
        return v;
    if (typeof v === 'number')
        return v;
    return validator.toInt('' + v);
}
exports.toIntOrNull = toIntOrNull;
function toBooleanOrNull(value) {
    var v = toValueOrNull(value);
    if (v === null || v === undefined)
        return v;
    if (typeof v === 'boolean')
        return v;
    return validator.toBoolean('' + v);
}
exports.toBooleanOrNull = toBooleanOrNull;
function toValueOrNull(value) {
    if (value === 'null')
        return null;
    return value;
}
exports.toValueOrNull = toValueOrNull;
function toArray(value) {
    if (value && isArray(value) === false)
        return [value];
    return value;
}
exports.toArray = toArray;
function toIntArray(value) {
    if (!value)
        return [];
    if (isArray(value) === false)
        return [validator.toInt(value)];
    return value.map(function (v) { return validator.toInt(v); });
}
exports.toIntArray = toIntArray;
function isFileValid(files, mimeTypeRegex, field, maxSize, optional) {
    if (optional === void 0) { optional = false; }
    // Should have files
    if (!files)
        return optional;
    if (isArray(files))
        return optional;
    // Should have a file
    var fileArray = files[field];
    if (!fileArray || fileArray.length === 0) {
        return optional;
    }
    // The file should exist
    var file = fileArray[0];
    if (!file || !file.originalname)
        return false;
    // Check size
    if ((maxSize !== null) && file.size > maxSize)
        return false;
    return new RegExp("^" + mimeTypeRegex + "$", 'i').test(file.mimetype);
}
exports.isFileValid = isFileValid;
