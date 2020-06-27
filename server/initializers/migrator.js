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
var path = require("path");
var logger_1 = require("../helpers/logger");
var constants_1 = require("./constants");
var database_1 = require("./database");
var fs_extra_1 = require("fs-extra");
var sequelize_1 = require("sequelize");
function migrate() {
    return __awaiter(this, void 0, void 0, function () {
        var tables, actualVersion, query, options, rows, migrationScripts, _i, migrationScripts_1, migrationScript, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, database_1.sequelizeTypescript.getQueryInterface().showAllTables()
                    // No tables, we don't need to migrate anything
                    // The installer will do that
                ];
                case 1:
                    tables = _a.sent();
                    // No tables, we don't need to migrate anything
                    // The installer will do that
                    if (tables.length === 0)
                        return [2 /*return*/];
                    actualVersion = null;
                    query = 'SELECT "migrationVersion" FROM "application"';
                    options = {
                        type: sequelize_1.QueryTypes.SELECT
                    };
                    return [4 /*yield*/, database_1.sequelizeTypescript.query(query, options)];
                case 2:
                    rows = _a.sent();
                    if (rows && rows[0] && rows[0].migrationVersion) {
                        actualVersion = rows[0].migrationVersion;
                    }
                    if (!(actualVersion === null)) return [3 /*break*/, 4];
                    return [4 /*yield*/, database_1.sequelizeTypescript.query('INSERT INTO "application" ("migrationVersion") VALUES (0)')];
                case 3:
                    _a.sent();
                    actualVersion = 0;
                    _a.label = 4;
                case 4:
                    // No need migrations, abort
                    if (actualVersion >= constants_1.LAST_MIGRATION_VERSION)
                        return [2 /*return*/];
                    // If there are a new migration scripts
                    logger_1.logger.info('Begin migrations.');
                    return [4 /*yield*/, getMigrationScripts()];
                case 5:
                    migrationScripts = _a.sent();
                    _i = 0, migrationScripts_1 = migrationScripts;
                    _a.label = 6;
                case 6:
                    if (!(_i < migrationScripts_1.length)) return [3 /*break*/, 11];
                    migrationScript = migrationScripts_1[_i];
                    _a.label = 7;
                case 7:
                    _a.trys.push([7, 9, , 10]);
                    return [4 /*yield*/, executeMigration(actualVersion, migrationScript)];
                case 8:
                    _a.sent();
                    return [3 /*break*/, 10];
                case 9:
                    err_1 = _a.sent();
                    logger_1.logger.error('Cannot execute migration %s.', migrationScript.version, { err: err_1 });
                    process.exit(-1);
                    return [3 /*break*/, 10];
                case 10:
                    _i++;
                    return [3 /*break*/, 6];
                case 11:
                    logger_1.logger.info('Migrations finished. New migration version schema: %s', constants_1.LAST_MIGRATION_VERSION);
                    return [2 /*return*/];
            }
        });
    });
}
exports.migrate = migrate;
// ---------------------------------------------------------------------------
function getMigrationScripts() {
    return __awaiter(this, void 0, void 0, function () {
        var files, filesToMigrate;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs_extra_1.readdir(path.join(__dirname, 'migrations'))];
                case 1:
                    files = _a.sent();
                    filesToMigrate = [];
                    files
                        .filter(function (file) { return file.endsWith('.js.map') === false; })
                        .forEach(function (file) {
                        // Filename is something like 'version-blabla.js'
                        var version = file.split('-')[0];
                        filesToMigrate.push({
                            version: version,
                            script: file
                        });
                    });
                    return [2 /*return*/, filesToMigrate];
            }
        });
    });
}
function executeMigration(actualVersion, entity) {
    return __awaiter(this, void 0, void 0, function () {
        var versionScript, migrationScriptName, migrationScript;
        var _this = this;
        return __generator(this, function (_a) {
            versionScript = parseInt(entity.version, 10);
            // Do not execute old migration scripts
            if (versionScript <= actualVersion)
                return [2 /*return*/, undefined
                    // Load the migration module and run it
                ];
            migrationScriptName = entity.script;
            logger_1.logger.info('Executing %s migration script.', migrationScriptName);
            migrationScript = require(path.join(__dirname, 'migrations', migrationScriptName));
            return [2 /*return*/, database_1.sequelizeTypescript.transaction(function (t) { return __awaiter(_this, void 0, void 0, function () {
                    var options;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                options = {
                                    transaction: t,
                                    queryInterface: database_1.sequelizeTypescript.getQueryInterface(),
                                    sequelize: database_1.sequelizeTypescript
                                };
                                return [4 /*yield*/, migrationScript.up(options)
                                    // Update the new migration version
                                ];
                            case 1:
                                _a.sent();
                                // Update the new migration version
                                return [4 /*yield*/, database_1.sequelizeTypescript.query('UPDATE "application" SET "migrationVersion" = ' + versionScript, { transaction: t })];
                            case 2:
                                // Update the new migration version
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
