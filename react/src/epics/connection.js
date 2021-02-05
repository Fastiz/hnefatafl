import connection from "../websocket/connection";
import {combineEpics} from "redux-observable";
import {connected, disconnected, numberOfMatches, numberOfPlayers} from "../actions/connection";
import {map} from 'rxjs/operators';
import {byEvent} from "./utils/byEvent";
import {SM_NUMBER_OF_MATCHES, SM_NUMBER_OF_PLAYERS} from "../constants/socketMessages";

const connectionMessages$ = connection.getMessageSubject();

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

const numberOfPlayersEpic = () => connectionMessages$.pipe(
    byEvent(SM_NUMBER_OF_PLAYERS),
    map(({event, data}) => {
        const {amount} = data;

        return numberOfPlayers(amount);
    })
);

const numberOfMatchesEpic = () => connectionMessages$.pipe(
    byEvent(SM_NUMBER_OF_MATCHES),
    map(({event, data}) => {
        const {amount} = data;

        return numberOfMatches(amount);
    })
);


export default combineEpics(connectedEpic, disconnectedEpic, numberOfMatchesEpic, numberOfPlayersEpic);