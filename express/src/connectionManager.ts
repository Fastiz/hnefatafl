import Connection from "./connection/Connection";
import {ConnectionMessages} from "./connection/constants";
import {Observable, Subject} from "rxjs";
import {socketConfig} from "./socketConfig";
import {io} from "./main";
import {MESSAGES} from "./game/constants";

class ConnectionManager {
    private readonly connections: Set<Connection>;
    private readonly connectionObservable: Observable<Connection>;

    constructor() {
        this.connections = new Set<Connection>();
        this.connectionObservable = this.configureConnectionSubject();
    }

    public getConnectionSubject(): Observable<Connection>{
        return this.connectionObservable;
    }

    private configureConnectionSubject(): Observable<Connection> {
        const subject = new Subject<Connection>();

        io.on(ConnectionMessages.CONNECTION,
            (socket) => subject.next(this.onConnection(socket))
        );

        return subject;
    }

    private onConnection(socket): Connection {
        const connection: Connection = new Connection(socketConfig(socket));

        this.connections.add(connection);

        socket.on(ConnectionMessages.DISCONNECT, () => {
            this.connections.delete(connection);

            this.broadcastPlayerCount();
        });

        this.broadcastPlayerCount();

        return connection;
    }

    private broadcastPlayerCount(): void {
        io.emit(MESSAGES.NUMBER_OF_PLAYERS, {amount: this.connections.size});
    }
}

export default ConnectionManager;