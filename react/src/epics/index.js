import {combineEpics} from "redux-observable";
import matchMaking from "./matchMaking";
import chat from "./chat";

export default combineEpics(matchMaking, chat);