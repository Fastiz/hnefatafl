"use strict";
exports.__esModule = true;
var rxjs_1 = require("rxjs");
var config = function (socket) {
    var onevent = socket.onevent;
    socket.onevent = function (packet) {
        var args = packet.data || [];
        onevent.call(this, packet); // original call
        packet.data = ["*"].concat(args);
        onevent.call(this, packet); // additional call to catch-all
    };
    return socket;
};
var BrokerImpl = /** @class */ (function () {
    function BrokerImpl(socket1, socket2) {
        this.socket1 = config(socket1);
        this.socket2 = config(socket2);
        this.subject1 = this.subjectFromSocket(socket1);
        this.subject2 = this.subjectFromSocket(socket2);
    }
    BrokerImpl.prototype.getSubject1 = function () {
        return this.subject1;
    };
    BrokerImpl.prototype.getSubject2 = function () {
        return this.subject2;
    };
    BrokerImpl.prototype.broadcast = function (socketMessage) {
        this.sendMessage1(socketMessage);
        this.sendMessage2(socketMessage);
    };
    BrokerImpl.prototype.sendMessage1 = function (socketMessage) {
        BrokerImpl.sendMessage(this.socket1, socketMessage);
    };
    BrokerImpl.prototype.sendMessage2 = function (socketMessage) {
        BrokerImpl.sendMessage(this.socket2, socketMessage);
    };
    BrokerImpl.prototype.subjectFromSocket = function (socket) {
        var subject = new rxjs_1.Subject();
        socket.on('*', function (event, data) {
            subject.next({ event: event, data: data });
        });
        return subject;
    };
    BrokerImpl.sendMessage = function (socket, socketMessage) {
        var event = socketMessage.event, data = socketMessage.data;
        socket.emit(event, data);
    };
    return BrokerImpl;
}());
exports["default"] = BrokerImpl;
