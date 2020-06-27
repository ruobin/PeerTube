#!/usr/bin/env node
"use strict";
exports.__esModule = true;
var program = require("commander");
var cli_1 = require("./cli");
program
    .version(cli_1.version, '-v, --version')
    .usage('[command] [options]');
/* Subcommands automatically loaded in the directory and beginning by peertube-* */
program
    .command('auth [action]', 'register your accounts on remote instances to use them with other commands')
    .command('upload', 'upload a video').alias('up')
    .command('import-videos', 'import a video from a streaming platform').alias('import')
    .command('get-access-token', 'get a peertube access token', { noHelp: true }).alias('token')
    .command('watch', 'watch a video in the terminal ✩°｡⋆').alias('w')
    .command('repl', 'initiate a REPL to access internals')
    .command('plugins [action]', 'manage instance plugins/themes').alias('p');
/* Not Yet Implemented */
program
    .command('diagnostic [action]', 'like couple therapy, but for your instance', { noHelp: true }).alias('d')
    .command('admin', 'manage an instance where you have elevated rights', { noHelp: true }).alias('a');
// help on no command
if (!process.argv.slice(2).length) {
    var logo = '░P░e░e░r░T░u░b░e░';
    console.log("\n  ___/),.._                           " + logo + "\n/'   ,.   .\"'._\n(     \"'   '-.__\"-._             ,-\n\\'='='),  \"\\ -._-\"-.          -\"/\n      / \"\"/\"\\,_\\,__\"\"       _\" /,-\n     /   /                -\" _/\"/\n    /   |    ._\\\\ |\\  |_.\".-\"  /\n   /    |   __\\)|)|),/|_.\" _,.\"\n  /     _.\"   \" \") | ).-\"\"---''--\n (                  \"/.\"\"7__-\"\"''\n |                   \" .\"._--._\n \\       \\ (_    __   \"\"   \".,_\n  \\.,.    \\  \"\"   -\"\".-\"\n   \".,_,  (\",_-,,,-\".-\n       \"'-,\\_   __,-\"\n             \",)\" \")\n              /\"\\-\"\n            ,\"\\/\n      _,.__/\"\\/_                     (the CLI for red chocobos)\n     / \\) \"./,  \".\n  --/---\"---\" \"-) )---- by Chocobozzz et al.\n");
}
cli_1.getSettings()
    .then(function (settings) {
    var state = (settings["default"] === undefined || settings["default"] === -1)
        ? 'no instance selected, commands will require explicit arguments'
        : 'instance ' + settings.remotes[settings["default"]] + ' selected';
    program
        .on('--help', function () {
        console.log();
        console.log('  State: ' + state);
        console.log();
        console.log('  Examples:');
        console.log();
        console.log('    $ peertube auth add -u "PEERTUBE_URL" -U "PEERTUBE_USER" --password "PEERTUBE_PASSWORD"');
        console.log('    $ peertube up <videoFile>');
        console.log('    $ peertube watch https://peertube.cpy.re/videos/watch/e8a1af4e-414a-4d58-bfe6-2146eed06d10');
        console.log();
    })
        .parse(process.argv);
});
