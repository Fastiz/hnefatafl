import {CHAT_MESSAGE, INITIALIZE_CHAT} from "../actions/chat";

const initialState = {
    messages: []
}

function reducer (state=initialState, action){
    switch (action.type){
        case CHAT_MESSAGE:
            const {from, message} = action;
            return Object.assign({}, state, {messages: [...state.messages, {from, message}]});
        case INITIALIZE_CHAT:
            return initialState;
        default:
            return state;
    }
}

export default reducer;