import {CONNECTED, DISCONNECTED} from "../actions/connection";

const initialState = {
    connected: false
}

function reducer (state=initialState, action) {
    switch (action.type){
        case CONNECTED:
            return {connected: true};
        case DISCONNECTED:
            return {connected: false};
        default:
            return state;
    }
}

export default reducer;