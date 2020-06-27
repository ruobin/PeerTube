"use strict";
exports.__esModule = true;
var misc_1 = require("./misc");
var validator = require("validator");
var users_1 = require("../../../shared/models/users");
var user_notification_setting_model_1 = require("../../../shared/models/users/user-notification-setting.model");
function isUserNotificationTypeValid(value) {
    return misc_1.exists(value) && validator.isInt('' + value) && users_1.UserNotificationType[value] !== undefined;
}
exports.isUserNotificationTypeValid = isUserNotificationTypeValid;
function isUserNotificationSettingValid(value) {
    return misc_1.exists(value) &&
        validator.isInt('' + value) && (value === user_notification_setting_model_1.UserNotificationSettingValue.NONE ||
        value === user_notification_setting_model_1.UserNotificationSettingValue.WEB ||
        value === user_notification_setting_model_1.UserNotificationSettingValue.EMAIL ||
        value === (user_notification_setting_model_1.UserNotificationSettingValue.WEB | user_notification_setting_model_1.UserNotificationSettingValue.EMAIL));
}
exports.isUserNotificationSettingValid = isUserNotificationSettingValid;
