import {combineEpics} from "redux-observable";
import matchMaking from "./matchMaking";
import chat from "./chat";
import connection from "./connection";

export default combineEpics(matchMaking, chat, connection);