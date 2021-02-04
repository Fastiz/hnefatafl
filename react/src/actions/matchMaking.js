export const FIND_MATCH = "FIND_MATCH";
export function findMatch(){
    return {
        type: FIND_MATCH
    }
}

export const MATCH_FOUND = "MATCH_FOUND";
export function matchFound(){
    return {
        type: MATCH_FOUND
    }
}

export const SEND_PIECE_MOVE = "SEND_PIECE_MOVE";
export function sendPieceMove(from, to){
    return {
        type: SEND_PIECE_MOVE,
        from, to
    }
}