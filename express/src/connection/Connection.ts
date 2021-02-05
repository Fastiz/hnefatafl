import {Observable, Subject} from "rxjs";
import {observableFromSocket} from "../socketConfig";

export interface SocketMessage {
    event: string,
    data: any
}

class Connection {
    private readonly id: string;
    private readonly socket;
    private readonly receive$: Observable<SocketMessage>;
    private readonly send$: Subject<SocketMessage>;

    constructor(socket) {
        this.id = socket.id;
        this.socket = socket;
        this.receive$ = observableFromSocket(socket);
        this.send$ = this.configureSendSubject();

        this.receive$.subscribe({
            error: err => {
                // this.send$.error(err);
            }
        })
    }

    public sendMessage(message: SocketMessage): void {
        const {event, data} = message;

        this.socket.emit(event, data);
    }

    public getId(): string {
        return this.id;
    }

    public getReceive$(): Observable<SocketMessage> {
        return this.receive$;
    }

    public getSend$(): Subject<SocketMessage> {
        return this.send$;
    }

    private configureSendSubject(): Subject<SocketMessage> {
        const subject = new Subject<SocketMessage>();

        subject.subscribe(
            (message: SocketMessage) => {
                const {event, data} = message;

                this.socket.emit(event, data);
            }
        )

        return subject;
    }
}

export default Connection;