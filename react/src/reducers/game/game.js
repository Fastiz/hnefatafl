import _ from 'lodash';
import {INITIALIZE, MOVE_PIECE} from "../../actions/game";
import {TEAM} from "./backend/constants";
import {areDefendersSurrounded, isKingCaptured, isKingOnBorder, moveCaptures} from "./backend/utils/movement";
import {movePiece} from "./backend/utils/utils";

const initialState = {
    playerTeam: null,
    board: null,
    teamTurn: null,
    dimension: null,
    gameType: null,
    winner: null,
    moveList: []
}

function boardReducer(board=null, action){
    switch (action.type){
        case MOVE_PIECE:
            const boardCopy = _.cloneDeep(board);

            const {from, to} = action;

            const movedPiece = boardCopy[from.x][from.y];

            boardCopy[to.x][to.y] = movePiece(movedPiece, to);
            boardCopy[from.x][from.y] = null;

            const capturedEnemies = moveCaptures(
                {
                    to,
                    board,
                    team: board[from.x][from.y].getTeam()}
                );

            capturedEnemies.forEach(e => {
                boardCopy[e.x][e.y] = null;
            });

            return boardCopy;
        default:
            return board;
    }
}

function gameReducer(state=initialState, action){
    const newState = Object.assign({}, state, {board: boardReducer(state.board, action)});

    switch (action.type){
        case INITIALIZE:
            return Object.assign(initialState, newState,
                _.pick(action, ['playerTeam', 'board', 'teamTurn', 'dimension', 'gameType']));
        case MOVE_PIECE:
            const {to, from} = action;

            const result = {};

            Object.assign(result, newState, {teamTurn: state.teamTurn === TEAM.BLACK ? TEAM.WHITE : TEAM.BLACK})

            const movedPiece = state.board[from.x][from.y];

            if(movedPiece.getTeam() === TEAM.BLACK){
                if(isKingOnBorder({board: newState.board})){
                    Object.assign(result, {winner: TEAM.BLACK});
                }
            }else{
                if(
                    isKingCaptured({board: state.board, to}) ||
                    areDefendersSurrounded({board: newState.board})
                ){
                    Object.assign(result, {winner: TEAM.WHITE});
                }
            }

            Object.assign(result, {moveList: [...state.moveList, {to, from}]});

            return result;
        default:
            return newState;
    }
}

export default gameReducer;