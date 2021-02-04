import {ConnectionManager} from "./connectionManager";
import BrokerImpl, {Broker} from "./broker";
import GameInstanceImpl, {GameInstance} from "./game/gameInstance";

export interface MatchMaking {
    register(id: string): void,
    unregister(id: string): void,
    setConnManager(connManager: ConnectionManager): void
}

interface MatchMakingImplState {
    memberIds: string[]
}

export class MatchMakingImpl implements MatchMaking {
    private state: MatchMakingImplState;
    private connManager: ConnectionManager;

    constructor() {
        this.state = {
            memberIds: []
        }
    }

    public setConnManager(connManager: ConnectionManager): void {
        this.connManager = connManager;
    }

    public register(id: string): void {
        const {memberIds} = this.state;

        this.state = {
            memberIds: [...memberIds, id]
        };

        this.checkMatches();
    }

    public unregister(id: string): void {
        const {memberIds} = this.state;

        const index = memberIds.findIndex(_id => id === _id);

        if(index === -1)
            return;

        const copy = [...memberIds];
        copy.splice(index, 1);

        this.state = {
            memberIds: copy
        }
    }

    private checkMatches(): void {
        if(this.state.memberIds.length >= 2){
            const [id1, id2] = this.state.memberIds;

            const broker: Broker = new BrokerImpl(
                this.connManager.socketById(id1),
                this.connManager.socketById(id2)
            );

            const gameInstance: GameInstance = new GameInstanceImpl(broker);

            this.unregister(id1);
            this.unregister(id2);
        }
    }

}

export default MatchMakingImpl;