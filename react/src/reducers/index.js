import {combineReducers} from "redux";
import home from "./home";
import game from "./game/game";
import chat from "./chat";

export default combineReducers({home, game, chat});