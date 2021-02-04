import {Subject} from "rxjs";

const config = socket => {
    const onevent = socket.onevent;
    socket.onevent = function (packet) {
        var args = packet.data || [];
        onevent.call (this, packet);    // original call
        packet.data = ["*"].concat(args);
        onevent.call(this, packet);      // additional call to catch-all
    };

    return socket;
}

export interface SocketMessage {
    event: string,
    data: any
}

export interface Broker {
    broadcast(socketMessage: SocketMessage): void,
    getSubject1(): Subject<SocketMessage>,
    getSubject2(): Subject<SocketMessage>
    sendMessage1(socketMessage: SocketMessage): void,
    sendMessage2(socketMessage: SocketMessage): void
}

class BrokerImpl implements Broker{
    private readonly socket1;
    private readonly socket2;
    private readonly subject1: Subject<SocketMessage>;
    private readonly subject2: Subject<SocketMessage>;

    constructor(socket1, socket2) {
        this.socket1 = config(socket1);
        this.socket2 = config(socket2);

        this.subject1 = this.subjectFromSocket(socket1);
        this.subject2 = this.subjectFromSocket(socket2);
    }

    public getSubject1(): Subject<SocketMessage> {
        return this.subject1;
    }

    public getSubject2(): Subject<SocketMessage> {
        return this.subject2;
    }

    public broadcast(socketMessage: SocketMessage): void {
        this.sendMessage1(socketMessage);
        this.sendMessage2(socketMessage);
    }

    public sendMessage1(socketMessage: SocketMessage): void {
        BrokerImpl.sendMessage(this.socket1, socketMessage);
    }

    public sendMessage2(socketMessage: SocketMessage): void {
        BrokerImpl.sendMessage(this.socket2, socketMessage);
    }

    private subjectFromSocket(socket): Subject<SocketMessage>{
        const subject: Subject<SocketMessage> = new Subject();

        socket.on('*', (event, data) => {
            subject.next({event, data});
        });

        return subject;
    }

    private static sendMessage(socket, socketMessage: SocketMessage): void {
        const {event, data} = socketMessage;

        socket.emit(event, data);
    }
}

export default BrokerImpl;

