import {filter} from "rxjs/operators";

export function byEvent(evn){
    return function(source){
        return source.pipe(
            filter(({event}) => {
                return event === evn;
            })
        )
    }
}