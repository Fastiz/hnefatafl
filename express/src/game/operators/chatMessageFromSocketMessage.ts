import {SocketMessage} from "../../broker";
import {map} from "rxjs/operators";
import {Team} from "../constants";
import {ChatMessage} from "../gameInstance";

export function chatMessageFromSocketMessage(team: Team){
    return function(source){
        return source.pipe(
            map((socketMessage: SocketMessage): ChatMessage => {
                const {message} = socketMessage.data;

                return {
                    from: team, message
                }
            })
        )
    }
}