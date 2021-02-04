import {combineEpics, ofType} from "redux-observable";
import {switchMap} from "rxjs/operators";
import {FIND_MATCH, matchFound, SEND_PIECE_MOVE} from "../actions/matchMaking";
import {from, of} from "rxjs";
import Connection from '../websocket/connection';
import {MATCH} from "../constants/routes";
import {MATCH_MAKING, MATCH_FOUND, PIECE_MOVED} from '../constants/socketMessages';
import connection from "../websocket/connection";
import {byEvent} from "./utils/byEvent";
import {initializeGame, movePiece} from "../actions/game";

const socketMessages$ = connection.getMessageSubject();

const findMatchEpic = action$ => action$.pipe(
    ofType(FIND_MATCH),
    switchMap(() => {
        Connection.sendMessage({event: MATCH_MAKING});

        return of();
    })
);

const matchFoundEpic = (action$, state, {history}) => socketMessages$.pipe(
    byEvent(MATCH_FOUND),
    switchMap(message => {
        history.push(MATCH);

        const {
            gameType,
            teamTurn,
            playerTeam
        } = message.data;

        return from([
            matchFound(),
            initializeGame(
                {
                        gameType,
                        teamTurn,
                        playerTeam
                    }
                )
        ]);
    })
);

const pieceMovedEpic = () => socketMessages$.pipe(
    byEvent(PIECE_MOVED),
    switchMap(message => {
        const {from, to} = message.data;

        return of(movePiece(from, to));
    })
);

const sendPieceMove = action$ => action$.pipe(
    ofType(SEND_PIECE_MOVE),
    switchMap(action => {
        const {from, to} = action;

        Connection.sendMessage({event: PIECE_MOVED, data: {from, to}})

        return of();
    })
);

export default combineEpics(findMatchEpic, matchFoundEpic, pieceMovedEpic, sendPieceMove);