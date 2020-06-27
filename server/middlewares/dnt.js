"use strict";
exports.__esModule = true;
var advertiseDoNotTrack = function (_, res, next) {
    res.setHeader('Tk', 'N');
    return next();
};
exports.advertiseDoNotTrack = advertiseDoNotTrack;
