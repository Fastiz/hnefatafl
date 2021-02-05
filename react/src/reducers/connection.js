import {CONNECTED, DISCONNECTED, NUMBER_OF_MATCHES, NUMBER_OF_PLAYERS} from "../actions/connection";

const initialState = {
    connected: false,
    numberOfPlayers: null,
    numberOfMatches: null
}

function reducer (state=initialState, action) {
    switch (action.type){
        case CONNECTED:
            return Object.assign({}, state ,{connected: true});
        case DISCONNECTED:
            return Object.assign({}, state ,{connected: false});
        case NUMBER_OF_MATCHES:
            return Object.assign({}, state ,{numberOfMatches: action.amount});
        case NUMBER_OF_PLAYERS:
            return Object.assign({}, state ,{numberOfPlayers: action.amount});
        default:
            return state;
    }
}

export default reducer;