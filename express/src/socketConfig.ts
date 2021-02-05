import {Observable, Subject} from "rxjs";
import {SocketMessage} from "./connection/Connection";
import {MESSAGES} from "./game/constants";

export const socketConfig = socket => {
    const onevent = socket.onevent;
    socket.onevent = function (packet) {
        var args = packet.data || [];
        onevent.call (this, packet);    // original call
        packet.data = ["*"].concat(args);
        onevent.call(this, packet);      // additional call to catch-all
    };

    return socket;
}

export function observableFromSocket(socket): Observable<SocketMessage>{
    const subject: Subject<SocketMessage> = new Subject();

    function handler(event, data) {
        subject.next({event, data});
    }

    socket.on('*', handler);

    socket.on(MESSAGES.DISCONNECT, () => {
        subject.error(new Error(MESSAGES.DISCONNECT));

        socket.removeListener('*', handler)
    });

    return subject;
}