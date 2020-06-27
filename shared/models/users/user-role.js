"use strict";
exports.__esModule = true;
var _a, _b;
var user_right_enum_1 = require("./user-right.enum");
// Keep the order
var UserRole;
(function (UserRole) {
    UserRole[UserRole["ADMINISTRATOR"] = 0] = "ADMINISTRATOR";
    UserRole[UserRole["MODERATOR"] = 1] = "MODERATOR";
    UserRole[UserRole["USER"] = 2] = "USER";
})(UserRole = exports.UserRole || (exports.UserRole = {}));
// TODO: use UserRole for key once https://github.com/Microsoft/TypeScript/issues/13042 is fixed
exports.USER_ROLE_LABELS = (_a = {},
    _a[UserRole.USER] = 'User',
    _a[UserRole.MODERATOR] = 'Moderator',
    _a[UserRole.ADMINISTRATOR] = 'Administrator',
    _a);
// TODO: use UserRole for key once https://github.com/Microsoft/TypeScript/issues/13042 is fixed
var userRoleRights = (_b = {},
    _b[UserRole.ADMINISTRATOR] = [
        user_right_enum_1.UserRight.ALL
    ],
    _b[UserRole.MODERATOR] = [
        user_right_enum_1.UserRight.MANAGE_VIDEO_BLACKLIST,
        user_right_enum_1.UserRight.MANAGE_VIDEO_ABUSES,
        user_right_enum_1.UserRight.REMOVE_ANY_VIDEO,
        user_right_enum_1.UserRight.REMOVE_ANY_VIDEO_CHANNEL,
        user_right_enum_1.UserRight.REMOVE_ANY_VIDEO_PLAYLIST,
        user_right_enum_1.UserRight.REMOVE_ANY_VIDEO_COMMENT,
        user_right_enum_1.UserRight.UPDATE_ANY_VIDEO,
        user_right_enum_1.UserRight.SEE_ALL_VIDEOS,
        user_right_enum_1.UserRight.MANAGE_ACCOUNTS_BLOCKLIST,
        user_right_enum_1.UserRight.MANAGE_SERVERS_BLOCKLIST,
        user_right_enum_1.UserRight.MANAGE_USERS
    ],
    _b[UserRole.USER] = [],
    _b);
function hasUserRight(userRole, userRight) {
    var userRights = userRoleRights[userRole];
    return userRights.indexOf(user_right_enum_1.UserRight.ALL) !== -1 || userRights.indexOf(userRight) !== -1;
}
exports.hasUserRight = hasUserRight;
