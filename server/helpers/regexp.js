"use strict";
exports.__esModule = true;
// Thanks to https://regex101.com
function regexpCapture(str, regex, maxIterations) {
    if (maxIterations === void 0) { maxIterations = 100; }
    var m;
    var i = 0;
    var result = [];
    // tslint:disable:no-conditional-assignment
    while ((m = regex.exec(str)) !== null && i < maxIterations) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        result.push(m);
        i++;
    }
    return result;
}
exports.regexpCapture = regexpCapture;
