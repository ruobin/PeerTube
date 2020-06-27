"use strict";
exports.__esModule = true;
// Can be filtered by plugins
function isLocalVideoAccepted(object) {
    return { accepted: true };
}
exports.isLocalVideoAccepted = isLocalVideoAccepted;
function isLocalVideoThreadAccepted(_object) {
    return { accepted: true };
}
exports.isLocalVideoThreadAccepted = isLocalVideoThreadAccepted;
function isLocalVideoCommentReplyAccepted(_object) {
    return { accepted: true };
}
exports.isLocalVideoCommentReplyAccepted = isLocalVideoCommentReplyAccepted;
function isRemoteVideoAccepted(_object) {
    return { accepted: true };
}
exports.isRemoteVideoAccepted = isRemoteVideoAccepted;
function isRemoteVideoCommentAccepted(_object) {
    return { accepted: true };
}
exports.isRemoteVideoCommentAccepted = isRemoteVideoCommentAccepted;
