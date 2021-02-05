import Connection, {SocketMessage} from "./connection/Connection";
import {Observable} from "rxjs";
import {GameType, MESSAGES} from "./game/constants";
import * as _ from "lodash";

import {filter, map, pairwise, startWith} from "rxjs/operators";
import {ofEvent} from "./game/operators/ofEvent";
import Room from "./room";
import GameInstance from "./game/gameInstance";
import {io} from "./main";

enum SocketEvents {
    MATCH_MAKING_START = 'match_making',
    MATCH_MAKING_END = 'match_making_end'
}


export class MatchMaking {
    private readonly connectionObservable: Observable<Connection>;
    private readonly lobby: Map<GameType, Connection[]>;
    private readonly matches: GameInstance[];

    constructor(connectionObservable: Observable<Connection>) {
        this.connectionObservable = connectionObservable;
        this.lobby = MatchMaking.createLobby();
        this.matches = [];
        this.connectionObservable.subscribe(this.configureNewConnection.bind(this));
    }

    private register(gameType: GameType, connection: Connection): void {
        this.lobby.set(gameType, [...this.lobby.get(gameType), connection]);
    }

    private unregister(connection: Connection): void {
        for(let [key, value] of this.lobby.entries()){
            const index = _.findIndex(value, conn => conn === connection);

            this.removeFromLobby(key, index);
        }
    }

    private checkMatches(): void {
        for(let [key, value] of this.lobby.entries()){
            if(value.length >= 2){
                const [con1, con2] = value;

                this.lobby.set(key, []);

                const room = new Room(con1, con2);
                const match = new GameInstance(room);

                this.matches.push(match);

                this.broadcastMatchCount();

                match.getGameObservable().subscribe({
                    complete: () => {
                        this.removeMatch(match);
                        this.broadcastMatchCount();
                    },
                    error: () => {
                        this.removeMatch(match);
                        this.broadcastMatchCount();
                    }
                });

                return;
            }
        }
    }

    private static createLobby(): Map<GameType, Connection[]> {
        const lobby = new Map<GameType, Connection[]>();

        lobby.set(GameType.HNEFATAFL, []);

        return lobby;
    }

    private configureNewConnection(connection: Connection): void {
        const matchMakingMessages$ = connection.getReceive$().pipe(
            startWith(null),
            pairwise(),
            filter(([prev, curr]: [SocketMessage, SocketMessage]) => {
                if(_.isNil(prev))
                    return curr.event === SocketEvents.MATCH_MAKING_START;

                return curr.event !== prev.event;
            }),
            map(([, curr]: [SocketMessage, SocketMessage]) => {
                return curr;
            })
        );

        matchMakingMessages$.pipe(
            ofEvent(SocketEvents.MATCH_MAKING_START)
        ).subscribe({
            next: (socketMessage: SocketMessage) => {
                const gameType = _.get(socketMessage, 'data.gameType', GameType.HNEFATAFL);

                this.register(gameType, connection);

                this.checkMatches();
            },
            error: err => {}
        });

        matchMakingMessages$.pipe(
            ofEvent(SocketEvents.MATCH_MAKING_END)
        ).subscribe({
            next: () => {
                this.unregister(connection);
            },
            error: err => {
                this.unregister(connection);
            }
        });

        connection.getSend$().next({
            event: MESSAGES.NUMBER_OF_MATCHES,
            data: {amount: this.matches.length}
        })
    }

    private removeFromLobby(gameType: GameType, index: number): void{
        if(index === -1) return;

        const connectionArray = this.lobby.get(gameType);

        const newValue = [...connectionArray];
        newValue.splice(index, 1);
        this.lobby.set(gameType, newValue);

        return;
    }

    private removeMatch(match: GameInstance): void {
        const index = _.findIndex(this.matches, m => m === match);
        if(index === -1) return;

        this.matches.splice(index, 1);
    }

    private broadcastMatchCount(): void {
        io.emit(MESSAGES.NUMBER_OF_MATCHES, {amount: this.matches.length});
    }
}

export default MatchMaking;