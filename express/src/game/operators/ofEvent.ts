import {filter, map} from "rxjs/operators";
import {SocketMessage} from "../../broker";

export function ofEvent(event: string){
    return function(source){
        return source.pipe(
            filter((message: SocketMessage): boolean => {
                const {event: evn} = message;

                return event === evn;
            }),
        )
    }
}