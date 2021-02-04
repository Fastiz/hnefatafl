"use strict";
exports.__esModule = true;
exports.ConnectionManagerImpl = void 0;
var constants_1 = require("./game/constants");
var ConnectionManagerImpl = /** @class */ (function () {
    function ConnectionManagerImpl(io, matchMaking) {
        var _this = this;
        this.matchMaking = matchMaking;
        this.io = io;
        this.state = {
            socketsMap: {}
        };
        io.on(constants_1.MESSAGES.CONNECTION, function (socket) { return _this.onConnection(socket); });
    }
    ConnectionManagerImpl.prototype.onConnection = function (socket) {
        var _a;
        var _this = this;
        socket.on(constants_1.MESSAGES.DISCONNECT, function () { return _this.onDisconnect(socket.id)(); });
        socket.on(constants_1.MESSAGES.MATCH_MAKING, function () { return _this.onMatchmaking(socket.id)(); });
        this.state = {
            socketsMap: Object.assign({}, this.state.socketsMap, (_a = {}, _a[socket.id] = socket, _a))
        };
    };
    ConnectionManagerImpl.prototype.onDisconnect = function (socketId) {
        var _this = this;
        return function () {
            var mapCopy = Object.assign({}, _this.state.socketsMap);
            delete mapCopy[socketId];
            _this.state = {
                socketsMap: mapCopy
            };
            _this.matchMaking.unregister(socketId);
        };
    };
    ConnectionManagerImpl.prototype.onMatchmaking = function (socketId) {
        var _this = this;
        return function () {
            _this.matchMaking.register(socketId);
        };
    };
    ConnectionManagerImpl.prototype.socketById = function (id) {
        return this.state.socketsMap[id];
    };
    return ConnectionManagerImpl;
}());
exports.ConnectionManagerImpl = ConnectionManagerImpl;
exports["default"] = ConnectionManagerImpl;
