import {io} from "socket.io-client";
import {Observable, Subject} from "rxjs";
import {WS_HOST} from "../config";

const config = socket => {
    const onevent = socket.onevent;
    socket.onevent = function (packet) {
        var args = packet.data || [];
        onevent.call (this, packet);    // original call
        packet.data = ["*"].concat(args);
        onevent.call(this, packet);      // additional call to catch-all
    };
}

class Connection {
    constructor() {
        this.socket = io(WS_HOST);

        config(this.socket);

        this.connectSubject = new Subject();

        this.connectSubject = this.configureSubject('connect');

        this.disconnectSubject = this.configureSubject('disconnect');

        this.messageSubject = this.configureSubject('*');
    }

    configureSubject(eventName){
        const sub = new Subject();

        this.socket.on(eventName, (event, data) => {
            sub.next({event, data})
        });

        return sub;
    }

    sendMessage({event, data}){
        this.socket.emit(event, data);
    }

    getMessageSubject(){
        return this.messageSubject;
    }

    getConnectSubject(){
        return this.connectSubject;
    }

    getDisconnectSubject(){
        return this.disconnectSubject;
    }
}

export default new Connection();