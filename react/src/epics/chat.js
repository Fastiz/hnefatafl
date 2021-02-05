import connection from "../websocket/connection";
import {byEvent} from "./utils/byEvent";
import {SM_CHAT_MESSAGE} from "../constants/socketMessages";
import {switchMap} from "rxjs/operators";
import {of} from "rxjs";
import {combineEpics, ofType} from "redux-observable";
import Connection from "../websocket/connection";
import {chatMessage, SEND_CHAT_MESSAGE} from "../actions/chat";

const socketMessages$ = connection.getMessageSubject();

const messageReceived = () => socketMessages$.pipe(
    byEvent(SM_CHAT_MESSAGE),
    switchMap(received => {
        const {from, message} = received.data;

        return of(chatMessage(from, message));
    })
);

const sendChatMessage = action$ => action$.pipe(
    ofType(SEND_CHAT_MESSAGE),
    switchMap(action => {
        const {message} = action;

        Connection.sendMessage({event: SM_CHAT_MESSAGE, data: {message}})

        return of();
    })
);

export default combineEpics(messageReceived, sendChatMessage);