import connection from "../websocket/connection";
import {combineEpics} from "redux-observable";
import {connected, disconnected, numberOfMatches, numberOfPlayers} from "../actions/connection";
import {concatMapTo, map, mapTo} from 'rxjs/operators';
import {byEvent} from "./utils/byEvent";
import {SM_NUMBER_OF_MATCHES, SM_NUMBER_OF_PLAYERS, SM_OPPONENT_DISCONNECTED} from "../constants/socketMessages";
import {lostConnection} from "../actions/game";
import {from} from "rxjs";

const connectionMessages$ = connection.getMessageSubject();

const connectedEpic = () => connection.getConnectSubject().pipe(
    map(() => {
        return connected();
    })
);

const disconnectedEpic = () => connection.getDisconnectSubject().pipe(
    concatMapTo(from([disconnected(), lostConnection()]))
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

const opponentDisconnectedEpic = () => connectionMessages$.pipe(
    byEvent(SM_OPPONENT_DISCONNECTED),
    mapTo(lostConnection())
);

export default combineEpics(connectedEpic, disconnectedEpic, numberOfMatchesEpic, numberOfPlayersEpic, opponentDisconnectedEpic);