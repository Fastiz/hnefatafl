import connection from "../websocket/connection";
import {combineEpics} from "redux-observable";
import {connected, disconnected} from "../actions/connection";
import {map} from 'rxjs/operators';

const connectedEpic = () => connection.getConnectSubject().pipe(
    map(() => {
        return connected();
    })
);

const disconnectedEpic = () => connection.getDisconnectSubject().pipe(
    map(() => {
        return disconnected();
    })
);


export default combineEpics(connectedEpic, disconnectedEpic);