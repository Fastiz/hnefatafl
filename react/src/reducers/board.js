import {SELECT_PIECE, UNSELECT_PIECE} from "../actions/board";

const initialState = {
    selectedPiece: null
}

export default function reducer(state=initialState, action){
    switch (action.type){
        case SELECT_PIECE:
            return Object.assign({}, state,
                {
                    selectedPiece: {
                        isKing: action.isKing, position: action.position, team: action.team
                    }
                });
        case UNSELECT_PIECE:
            return Object.assign({}, state, {selectedPiece: null});
        default:
            return state;
    }
}