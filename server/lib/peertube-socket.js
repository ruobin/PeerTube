"use strict";
exports.__esModule = true;
var SocketIO = require("socket.io");
var middlewares_1 = require("../middlewares");
var logger_1 = require("../helpers/logger");
var PeerTubeSocket = /** @class */ (function () {
    function PeerTubeSocket() {
        this.userNotificationSockets = {};
    }
    PeerTubeSocket.prototype.init = function (server) {
        var _this = this;
        var io = SocketIO(server);
        io.of('/user-notifications')
            .use(middlewares_1.authenticateSocket)
            .on('connection', function (socket) {
            var userId = socket.handshake.query.user.id;
            logger_1.logger.debug('User %d connected on the notification system.', userId);
            if (!_this.userNotificationSockets[userId])
                _this.userNotificationSockets[userId] = [];
            _this.userNotificationSockets[userId].push(socket);
            socket.on('disconnect', function () {
                logger_1.logger.debug('User %d disconnected from SocketIO notifications.', userId);
                _this.userNotificationSockets[userId] = _this.userNotificationSockets[userId].filter(function (s) { return s !== socket; });
            });
        });
    };
    PeerTubeSocket.prototype.sendNotification = function (userId, notification) {
        var sockets = this.userNotificationSockets[userId];
        if (!sockets)
            return;
        for (var _i = 0, sockets_1 = sockets; _i < sockets_1.length; _i++) {
            var socket = sockets_1[_i];
            socket.emit('new-notification', notification.toFormattedJSON());
        }
    };
    Object.defineProperty(PeerTubeSocket, "Instance", {
        get: function () {
            return this.instance || (this.instance = new this());
        },
        enumerable: true,
        configurable: true
    });
    return PeerTubeSocket;
}());
exports.PeerTubeSocket = PeerTubeSocket;
