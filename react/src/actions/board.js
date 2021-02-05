export const SELECT_PIECE = "SELECT_PIECE";
export function selectPiece({position, isKing, team}){
    return {
        type: SELECT_PIECE,
        position, isKing, team
    }
}

export const UNSELECT_PIECE = "UNSELECT_PIECE";
export function unselectPiece(){
    return {
        type: UNSELECT_PIECE
    }
}