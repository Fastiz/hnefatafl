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

        this.socket.on('connect', () => {
            console.log('connected');
        });

        this.socket.on('disconnect', () => {
            console.log('disconnect');
        });

        this.messageSubject = new Subject();

        this.socket.on('*', (event, data) => {
            this.messageSubject.next({event, data})
        });
    }

    sendMessage({event, data}){
        this.socket.emit(event, data);
    }

    getMessageSubject(){
        return this.messageSubject;
    }
}

export default new Connection();