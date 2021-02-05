import {map} from "rxjs/operators";
import {Team} from "../constants";
import {PieceMove} from "../gameInstance";
import {SocketMessage} from "../../connection/Connection";

export function pieceMoveFromSocketMessage(team: Team){
    return function(source){
        return source.pipe(
            map((message: SocketMessage): PieceMove => {
                const {to, from} = message.data;

                return {
                    to, from, team
                }
            })
        )
    }
}