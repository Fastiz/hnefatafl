import _ from 'lodash';
import {INITIALIZE, LEAVE_GAME, LOST_CONNECTION, MOVE_PIECE} from "../actions/game";
import {TEAM} from "../backend/constants";
import {areDefendersSurrounded, isKingCaptured, isKingOnBorder, moveCaptures} from "../backend/utils/movement";
import {movePiece} from "../backend/utils/utils";

export const GAME_STATUS = {
    ENDED: "ENDED",
    LOST_CONNECTION: "LOST_CONNECTION",
    KING_CAPTURED: "KING_CAPTURED",
    KING_ESCAPED: "KING_ESCAPED",
    DEFENDERS_SURROUNDED: "DEFENDERS_SURROUNDED",
    PLAYING: "PLAYING"
}

const initialState = {
    playerTeam: null,
    board: null,
    teamTurn: null,
    dimension: null,
    gameType: null,
    gameStatus: null,
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
                _.pick(action, ['playerTeam', 'board', 'teamTurn', 'dimension', 'gameType']),
                {gameStatus: GAME_STATUS.PLAYING});
        case MOVE_PIECE:
            const {to, from} = action;

            const result = {};

            Object.assign(result, newState, {teamTurn: state.teamTurn === TEAM.BLACK ? TEAM.WHITE : TEAM.BLACK})

            const movedPiece = state.board[from.x][from.y];

            if(movedPiece.getTeam() === TEAM.BLACK){
                if(isKingOnBorder({board: newState.board})){
                    Object.assign(result, {gameStatus: GAME_STATUS.KING_ESCAPED});
                }
            }else{
                if(
                    isKingCaptured({board: state.board, to})
                ){
                    Object.assign(result, {gameStatus: GAME_STATUS.KING_CAPTURED});
                }else if(
                    areDefendersSurrounded({board: newState.board})
                ){
                    Object.assign(result, {gameStatus: GAME_STATUS.DEFENDERS_SURROUNDED});
                }
            }

            Object.assign(result, {moveList: [...state.moveList, {to, from}]});

            return result;
        case LOST_CONNECTION:
            return Object.assign({}, newState, {gameStatus: GAME_STATUS.LOST_CONNECTION});
        case LEAVE_GAME:
            return Object.assign({}, newState, {gameStatus: null});
        default:
            return newState;
    }
}

export default gameReducer;