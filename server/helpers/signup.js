"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var user_1 = require("../models/account/user");
var ipaddr = require("ipaddr.js");
var config_1 = require("../initializers/config");
var isCidr = require('is-cidr');
function isSignupAllowed() {
    return __awaiter(this, void 0, void 0, function () {
        var totalUsers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (config_1.CONFIG.SIGNUP.ENABLED === false) {
                        return [2 /*return*/, false];
                    }
                    // No limit and signup is enabled
                    if (config_1.CONFIG.SIGNUP.LIMIT === -1) {
                        return [2 /*return*/, true];
                    }
                    return [4 /*yield*/, user_1.UserModel.countTotal()];
                case 1:
                    totalUsers = _a.sent();
                    return [2 /*return*/, totalUsers < config_1.CONFIG.SIGNUP.LIMIT];
            }
        });
    });
}
exports.isSignupAllowed = isSignupAllowed;
function isSignupAllowedForCurrentIP(ip) {
    var addr = ipaddr.parse(ip);
    var excludeList = ['blacklist'];
    var matched = '';
    // if there is a valid, non-empty whitelist, we exclude all unknown adresses too
    if (config_1.CONFIG.SIGNUP.FILTERS.CIDR.WHITELIST.filter(function (cidr) { return isCidr(cidr); }).length > 0) {
        excludeList.push('unknown');
    }
    if (addr.kind() === 'ipv4') {
        var addrV4 = ipaddr.IPv4.parse(ip);
        var rangeList = {
            whitelist: config_1.CONFIG.SIGNUP.FILTERS.CIDR.WHITELIST.filter(function (cidr) { return isCidr.v4(cidr); })
                .map(function (cidr) { return ipaddr.IPv4.parseCIDR(cidr); }),
            blacklist: config_1.CONFIG.SIGNUP.FILTERS.CIDR.BLACKLIST.filter(function (cidr) { return isCidr.v4(cidr); })
                .map(function (cidr) { return ipaddr.IPv4.parseCIDR(cidr); })
        };
        matched = ipaddr.subnetMatch(addrV4, rangeList, 'unknown');
    }
    else if (addr.kind() === 'ipv6') {
        var addrV6 = ipaddr.IPv6.parse(ip);
        var rangeList = {
            whitelist: config_1.CONFIG.SIGNUP.FILTERS.CIDR.WHITELIST.filter(function (cidr) { return isCidr.v6(cidr); })
                .map(function (cidr) { return ipaddr.IPv6.parseCIDR(cidr); }),
            blacklist: config_1.CONFIG.SIGNUP.FILTERS.CIDR.BLACKLIST.filter(function (cidr) { return isCidr.v6(cidr); })
                .map(function (cidr) { return ipaddr.IPv6.parseCIDR(cidr); })
        };
        matched = ipaddr.subnetMatch(addrV6, rangeList, 'unknown');
    }
    return !excludeList.includes(matched);
}
exports.isSignupAllowedForCurrentIP = isSignupAllowedForCurrentIP;
