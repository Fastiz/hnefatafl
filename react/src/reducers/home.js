import {FIND_MATCH} from "../actions/matchMaking";


const initialState = {
    lookingForMatch: false,
};

function reducer(state=initialState, action){
    switch (action.type){
        case FIND_MATCH:
            return Object.assign({}, state, {lookingForMatch: true});
        default:
            return state;
    }
}

export default reducer;

