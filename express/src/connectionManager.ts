import {MatchMaking} from "./matchMaking";
import {MESSAGES} from "./game/constants";

export interface ConnectionManager {
    socketById(id: string): any
}

interface ConnectionManagerState {
    socketsMap: {
        [index: string]: any
    }
}

export class ConnectionManagerImpl implements ConnectionManager {
    private state: ConnectionManagerState;

    private readonly matchMaking: MatchMaking;
    private readonly io: any;

    constructor(io: any, matchMaking: MatchMaking) {
        this.matchMaking = matchMaking;
        this.io = io;
        this.state = {
            socketsMap: {}
        }

        io.on(MESSAGES.CONNECTION, (socket) => this.onConnection(socket));
    }

    private onConnection(socket) {
        socket.on(MESSAGES.DISCONNECT, () => this.onDisconnect(socket.id)());
        socket.on(MESSAGES.MATCH_MAKING, () => this.onMatchmaking(socket.id)());

        this.state = {
            socketsMap: Object.assign({}, this.state.socketsMap, {[socket.id]: socket})
        }
    }

    private onDisconnect(socketId: string): () => void {
        return () => {
            const mapCopy = Object.assign({}, this.state.socketsMap);

            delete mapCopy[socketId];

            this.state = {
                socketsMap: mapCopy
            }

            this.matchMaking.unregister(socketId);
        }
    }

    private onMatchmaking(socketId: string): () => void {
        return () => {
            this.matchMaking.register(socketId);
        }
    }

    socketById(id: string): any {
        return this.state.socketsMap[id];
    }

}

export default ConnectionManagerImpl as unknown as ConnectionManager;