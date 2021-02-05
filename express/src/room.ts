import Connection, {SocketMessage} from "./connection/Connection";



class Room {
    private readonly player1: Connection;
    private readonly player2: Connection;

    constructor(conn1: Connection, conn2: Connection) {
        this.player1 = conn1;
        this.player2 = conn2;
    }

    public getPlayer1(): Connection {
        return this.player1;
    }

    public getPlayer2(): Connection {
        return this.player2;
    }

    public broadcast(socketMessage: SocketMessage): void {
        this.player1.getSend$().next(socketMessage);
        this.player2.getSend$().next(socketMessage);
    }
}

export default Room;

