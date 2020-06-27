"use strict";
exports.__esModule = true;
var users_1 = require("./users");
var misc_1 = require("./misc");
function isAccountNameValid(value) {
    return users_1.isUserUsernameValid(value);
}
exports.isAccountNameValid = isAccountNameValid;
function isAccountIdValid(value) {
    return misc_1.exists(value);
}
exports.isAccountIdValid = isAccountIdValid;
function isAccountDescriptionValid(value) {
    return users_1.isUserDescriptionValid(value);
}
exports.isAccountDescriptionValid = isAccountDescriptionValid;
