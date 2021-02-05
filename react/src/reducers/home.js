import {FIND_MATCH, MATCH_FOUND} from "../actions/matchMaking";


const initialState = {
    lookingForMatch: false,
};

function reducer(state=initialState, action){
    switch (action.type){
        case FIND_MATCH:
            return Object.assign({}, state, {lookingForMatch: true});
        case MATCH_FOUND:
            return Object.assign({}, state, {lookingForMatch: false});
        default:
            return state;
    }
}

export default reducer;

