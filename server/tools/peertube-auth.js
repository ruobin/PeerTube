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
var _this = this;
exports.__esModule = true;
var program = require("commander");
var prompt = require("prompt");
var cli_1 = require("./cli");
var users_1 = require("../helpers/custom-validators/users");
var extra_utils_1 = require("../../shared/extra-utils");
var Table = require('cli-table');
function delInstance(url) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, settings, netrc, index;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.all([cli_1.getSettings(), cli_1.getNetrc()])];
                case 1:
                    _a = _b.sent(), settings = _a[0], netrc = _a[1];
                    index = settings.remotes.indexOf(url);
                    settings.remotes.splice(index);
                    if (settings["default"] === index)
                        settings["default"] = -1;
                    return [4 /*yield*/, cli_1.writeSettings(settings)];
                case 2:
                    _b.sent();
                    delete netrc.machines[url];
                    return [4 /*yield*/, netrc.save()];
                case 3:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function setInstance(url, username, password, isDefault) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, settings, netrc;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.all([cli_1.getSettings(), cli_1.getNetrc()])];
                case 1:
                    _a = _b.sent(), settings = _a[0], netrc = _a[1];
                    if (settings.remotes.indexOf(url) === -1) {
                        settings.remotes.push(url);
                    }
                    if (isDefault || settings.remotes.length === 1) {
                        settings["default"] = settings.remotes.length - 1;
                    }
                    return [4 /*yield*/, cli_1.writeSettings(settings)];
                case 2:
                    _b.sent();
                    netrc.machines[url] = { login: username, password: password };
                    return [4 /*yield*/, netrc.save()];
                case 3:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function isURLaPeerTubeInstance(url) {
    return url.startsWith('http://') || url.startsWith('https://');
}
program
    .name('auth')
    .usage('[command] [options]');
program
    .command('add')
    .description('remember your accounts on remote instances for easier use')
    .option('-u, --url <url>', 'Server url')
    .option('-U, --username <username>', 'Username')
    .option('-p, --password <token>', 'Password')
    .option('--default', 'add the entry as the new default')
    .action(function (options) {
    prompt.override = options;
    prompt.start();
    prompt.get({
        properties: {
            url: {
                description: 'instance url',
                conform: function (value) { return isURLaPeerTubeInstance(value); },
                message: 'It should be an URL (https://peertube.example.com)',
                required: true
            },
            username: {
                conform: function (value) { return users_1.isUserUsernameValid(value); },
                message: 'Name must be only letters, spaces, or dashes',
                required: true
            },
            password: {
                hidden: true,
                replace: '*',
                required: true
            }
        }
    }, function (_, result) { return __awaiter(_this, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, extra_utils_1.getAccessToken(result.url, result.username, result.password)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    console.error(err_1.message);
                    process.exit(-1);
                    return [3 /*break*/, 3];
                case 3: return [4 /*yield*/, setInstance(result.url, result.username, result.password, program['default'])];
                case 4:
                    _a.sent();
                    process.exit(0);
                    return [2 /*return*/];
            }
        });
    }); });
});
program
    .command('del <url>')
    .description('unregisters a remote instance')
    .action(function (url) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, delInstance(url)];
            case 1:
                _a.sent();
                process.exit(0);
                return [2 /*return*/];
        }
    });
}); });
program
    .command('list')
    .description('lists registered remote instances')
    .action(function () { return __awaiter(_this, void 0, void 0, function () {
    var _a, settings, netrc, table;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, Promise.all([cli_1.getSettings(), cli_1.getNetrc()])];
            case 1:
                _a = _b.sent(), settings = _a[0], netrc = _a[1];
                table = new Table({
                    head: ['instance', 'login'],
                    colWidths: [30, 30]
                });
                settings.remotes.forEach(function (element) {
                    if (!netrc.machines[element])
                        return;
                    table.push([
                        element,
                        netrc.machines[element].login
                    ]);
                });
                console.log(table.toString());
                process.exit(0);
                return [2 /*return*/];
        }
    });
}); });
program
    .command('set-default <url>')
    .description('set an existing entry as default')
    .action(function (url) { return __awaiter(_this, void 0, void 0, function () {
    var settings, instanceExists;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, cli_1.getSettings()];
            case 1:
                settings = _a.sent();
                instanceExists = settings.remotes.indexOf(url) !== -1;
                if (!instanceExists) return [3 /*break*/, 3];
                settings["default"] = settings.remotes.indexOf(url);
                return [4 /*yield*/, cli_1.writeSettings(settings)];
            case 2:
                _a.sent();
                process.exit(0);
                return [3 /*break*/, 4];
            case 3:
                console.log('<url> is not a registered instance.');
                process.exit(-1);
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); });
program.on('--help', function () {
    console.log('  Examples:');
    console.log();
    console.log('    $ peertube add -u https://peertube.cpy.re -U "PEERTUBE_USER" --password "PEERTUBE_PASSWORD"');
    console.log('    $ peertube add -u https://peertube.cpy.re -U root');
    console.log('    $ peertube list');
    console.log('    $ peertube del https://peertube.cpy.re');
    console.log();
});
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
program.parse(process.argv);
