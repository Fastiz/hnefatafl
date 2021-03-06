import {GAME_TYPE, TEAM} from "../backend/constants";
import {initialPieces} from "../backend/initialPieces";

export const INITIALIZE = "INITIALIZE";
export function initializeGame({gameType, teamTurn, playerTeam}){
    const board = initialPieces(gameType);

    const dimension = board.length;

    return {
        type: INITIALIZE,
        gameType: gameType || GAME_TYPE.HNEFATAFL,
        teamTurn: teamTurn || TEAM.BLACK,
        dimension,
        board,
        playerTeam
    }
}

export const MOVE_PIECE = "MOVE_PIECE";
export function movePiece(from, to){
    return {
        type: MOVE_PIECE,
        from, to
    }
}

export const LOST_CONNECTION = "LOST_CONNECTION";
export function lostConnection(){
    return {
        type: LOST_CONNECTION
    }
}

export const LEAVE_GAME = "LEAVE_GAME";
export function leaveGame(){
    return {
        type: LEAVE_GAME
    }
}