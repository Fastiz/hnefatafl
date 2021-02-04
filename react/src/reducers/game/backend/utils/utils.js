import Piece from "../Piece";


export function positionEquals({x: x1, y: y1}, {x: x2, y: y2}){
    return x1 === x2 && y1 === y2;
}

export function movePiece(piece, newPosition){
    return new Piece(newPosition, piece.getTeam(), piece.isKing());
}