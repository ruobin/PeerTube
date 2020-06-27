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
var sequelize_1 = require("sequelize");
var sequelizes = {};
function getSequelize(internalServerNumber) {
    if (sequelizes[internalServerNumber])
        return sequelizes[internalServerNumber];
    var dbname = 'peertube_test' + internalServerNumber;
    var username = 'peertube';
    var password = 'peertube';
    var host = process.env.GITLAB_CI ? 'postgres' : 'localhost';
    var port = 5432;
    var seq = new sequelize_1.Sequelize(dbname, username, password, {
        dialect: 'postgres',
        host: host,
        port: port,
        logging: false
    });
    sequelizes[internalServerNumber] = seq;
    return seq;
}
function setActorField(internalServerNumber, to, field, value) {
    var seq = getSequelize(internalServerNumber);
    var options = { type: sequelize_1.QueryTypes.UPDATE };
    return seq.query("UPDATE actor SET \"" + field + "\" = '" + value + "' WHERE url = '" + to + "'", options);
}
exports.setActorField = setActorField;
function setVideoField(internalServerNumber, uuid, field, value) {
    var seq = getSequelize(internalServerNumber);
    var options = { type: sequelize_1.QueryTypes.UPDATE };
    return seq.query("UPDATE video SET \"" + field + "\" = '" + value + "' WHERE uuid = '" + uuid + "'", options);
}
exports.setVideoField = setVideoField;
function setPlaylistField(internalServerNumber, uuid, field, value) {
    var seq = getSequelize(internalServerNumber);
    var options = { type: sequelize_1.QueryTypes.UPDATE };
    return seq.query("UPDATE \"videoPlaylist\" SET \"" + field + "\" = '" + value + "' WHERE uuid = '" + uuid + "'", options);
}
exports.setPlaylistField = setPlaylistField;
function countVideoViewsOf(internalServerNumber, uuid) {
    return __awaiter(this, void 0, void 0, function () {
        var seq, query, options, total;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    seq = getSequelize(internalServerNumber);
                    query = "SELECT SUM(\"videoView\".\"views\") AS \"total\" FROM \"videoView\" INNER JOIN \"video\" ON \"video\".\"id\" = \"videoView\".\"videoId\" WHERE \"video\".\"uuid\" = '" + uuid + "'";
                    options = { type: sequelize_1.QueryTypes.SELECT };
                    return [4 /*yield*/, seq.query(query, options)];
                case 1:
                    total = (_a.sent())[0].total;
                    if (!total)
                        return [2 /*return*/, 0
                            // FIXME: check if we really need parseInt
                        ];
                    // FIXME: check if we really need parseInt
                    return [2 /*return*/, parseInt(total + '', 10)];
            }
        });
    });
}
exports.countVideoViewsOf = countVideoViewsOf;
function closeAllSequelize(servers) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, servers_1, server;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _i = 0, servers_1 = servers;
                    _a.label = 1;
                case 1:
                    if (!(_i < servers_1.length)) return [3 /*break*/, 4];
                    server = servers_1[_i];
                    if (!sequelizes[server.internalServerNumber]) return [3 /*break*/, 3];
                    return [4 /*yield*/, sequelizes[server.internalServerNumber].close()];
                case 2:
                    _a.sent();
                    delete sequelizes[server.internalServerNumber];
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.closeAllSequelize = closeAllSequelize;
function setPluginVersion(internalServerNumber, pluginName, newVersion) {
    var seq = getSequelize(internalServerNumber);
    var options = { type: sequelize_1.QueryTypes.UPDATE };
    return seq.query("UPDATE \"plugin\" SET \"version\" = '" + newVersion + "' WHERE \"name\" = '" + pluginName + "'", options);
}
exports.setPluginVersion = setPluginVersion;
function setActorFollowScores(internalServerNumber, newScore) {
    var seq = getSequelize(internalServerNumber);
    var options = { type: sequelize_1.QueryTypes.UPDATE };
    return seq.query("UPDATE \"actorFollow\" SET \"score\" = " + newScore, options);
}
exports.setActorFollowScores = setActorFollowScores;
