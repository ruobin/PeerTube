"use strict";
exports.__esModule = true;
var program = require("commander");
var extra_utils_1 = require("../../shared/extra-utils");
program
    .option('-u, --url <url>', 'Server url')
    .option('-n, --username <username>', 'Username')
    .option('-p, --password <token>', 'Password')
    .parse(process.argv);
if (!program['url'] ||
    !program['username'] ||
    !program['password']) {
    if (!program['url'])
        console.error('--url field is required.');
    if (!program['username'])
        console.error('--username field is required.');
    if (!program['password'])
        console.error('--password field is required.');
    process.exit(-1);
}
extra_utils_1.getClient(program.url)
    .then(function (res) {
    var server = {
        url: program['url'],
        user: {
            username: program['username'],
            password: program['password']
        },
        client: {
            id: res.body.client_id,
            secret: res.body.client_secret
        }
    };
    return extra_utils_1.serverLogin(server);
})
    .then(function (accessToken) {
    console.log(accessToken);
    process.exit(0);
})["catch"](function (err) {
    console.error(err);
    process.exit(-1);
});
