import {combineReducers} from "redux";
import home from "./home";
import game from "./game";
import chat from "./chat";
import connection from "./connection";
import board from './board';

export default combineReducers({home, game, chat, connection, board});