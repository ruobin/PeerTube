"use strict";
exports.__esModule = true;
var validator = require("validator");
var constants_1 = require("../../../initializers/constants");
var misc_1 = require("../misc");
var lodash_1 = require("lodash");
var misc_2 = require("./misc");
var servers_1 = require("../servers");
function isActorEndpointsObjectValid(endpointObject) {
    return misc_2.isActivityPubUrlValid(endpointObject.sharedInbox);
}
exports.isActorEndpointsObjectValid = isActorEndpointsObjectValid;
function isActorPublicKeyObjectValid(publicKeyObject) {
    return misc_2.isActivityPubUrlValid(publicKeyObject.id) &&
        misc_2.isActivityPubUrlValid(publicKeyObject.owner) &&
        isActorPublicKeyValid(publicKeyObject.publicKeyPem);
}
exports.isActorPublicKeyObjectValid = isActorPublicKeyObjectValid;
function isActorTypeValid(type) {
    return type === 'Person' || type === 'Application' || type === 'Group';
}
exports.isActorTypeValid = isActorTypeValid;
function isActorPublicKeyValid(publicKey) {
    return misc_1.exists(publicKey) &&
        typeof publicKey === 'string' &&
        publicKey.startsWith('-----BEGIN PUBLIC KEY-----') &&
        publicKey.indexOf('-----END PUBLIC KEY-----') !== -1 &&
        validator.isLength(publicKey, constants_1.CONSTRAINTS_FIELDS.ACTORS.PUBLIC_KEY);
}
exports.isActorPublicKeyValid = isActorPublicKeyValid;
var actorNameAlphabet = '[ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789\\-_.]';
exports.actorNameAlphabet = actorNameAlphabet;
var actorNameRegExp = new RegExp("^" + actorNameAlphabet + "+$");
function isActorPreferredUsernameValid(preferredUsername) {
    return misc_1.exists(preferredUsername) && validator.matches(preferredUsername, actorNameRegExp);
}
exports.isActorPreferredUsernameValid = isActorPreferredUsernameValid;
function isActorPrivateKeyValid(privateKey) {
    return misc_1.exists(privateKey) &&
        typeof privateKey === 'string' &&
        privateKey.startsWith('-----BEGIN RSA PRIVATE KEY-----') &&
        // Sometimes there is a \n at the end, so just assert the string contains the end mark
        privateKey.indexOf('-----END RSA PRIVATE KEY-----') !== -1 &&
        validator.isLength(privateKey, constants_1.CONSTRAINTS_FIELDS.ACTORS.PRIVATE_KEY);
}
exports.isActorPrivateKeyValid = isActorPrivateKeyValid;
function isActorObjectValid(actor) {
    return misc_1.exists(actor) &&
        misc_2.isActivityPubUrlValid(actor.id) &&
        isActorTypeValid(actor.type) &&
        misc_2.isActivityPubUrlValid(actor.following) &&
        misc_2.isActivityPubUrlValid(actor.followers) &&
        misc_2.isActivityPubUrlValid(actor.inbox) &&
        misc_2.isActivityPubUrlValid(actor.outbox) &&
        isActorPreferredUsernameValid(actor.preferredUsername) &&
        misc_2.isActivityPubUrlValid(actor.url) &&
        isActorPublicKeyObjectValid(actor.publicKey) &&
        isActorEndpointsObjectValid(actor.endpoints) &&
        misc_2.setValidAttributedTo(actor) &&
        // If this is not an account, it should be attributed to an account
        // In PeerTube we use this to attach a video channel to a specific account
        (actor.type === 'Person' || actor.attributedTo.length !== 0);
}
exports.isActorObjectValid = isActorObjectValid;
function isActorFollowingCountValid(value) {
    return misc_1.exists(value) && validator.isInt('' + value, { min: 0 });
}
exports.isActorFollowingCountValid = isActorFollowingCountValid;
function isActorFollowersCountValid(value) {
    return misc_1.exists(value) && validator.isInt('' + value, { min: 0 });
}
exports.isActorFollowersCountValid = isActorFollowersCountValid;
function isActorDeleteActivityValid(activity) {
    return misc_2.isBaseActivityValid(activity, 'Delete');
}
exports.isActorDeleteActivityValid = isActorDeleteActivityValid;
function sanitizeAndCheckActorObject(object) {
    normalizeActor(object);
    return isActorObjectValid(object);
}
exports.sanitizeAndCheckActorObject = sanitizeAndCheckActorObject;
function normalizeActor(actor) {
    if (!actor || !actor.url)
        return;
    if (typeof actor.url !== 'string') {
        actor.url = actor.url.href || actor.url.url;
    }
    if (actor.summary && typeof actor.summary === 'string') {
        actor.summary = lodash_1.truncate(actor.summary, { length: constants_1.CONSTRAINTS_FIELDS.USERS.DESCRIPTION.max });
        if (actor.summary.length < constants_1.CONSTRAINTS_FIELDS.USERS.DESCRIPTION.min) {
            actor.summary = null;
        }
    }
    return;
}
exports.normalizeActor = normalizeActor;
function isValidActorHandle(handle) {
    if (!misc_1.exists(handle))
        return false;
    var parts = handle.split('@');
    if (parts.length !== 2)
        return false;
    return servers_1.isHostValid(parts[1]);
}
exports.isValidActorHandle = isValidActorHandle;
function areValidActorHandles(handles) {
    return misc_1.isArray(handles) && handles.every(function (h) { return isValidActorHandle(h); });
}
exports.areValidActorHandles = areValidActorHandles;
