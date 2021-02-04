var _ = require('lodash');
import {Team} from "./constants";
import PieceImpl, {Piece} from "./piece";


function hnefataflPieces(){
    const pieces = [];

    //WHITE
    pieces.push(
        new PieceImpl({x: 0, y: 3}, Team.WHITE),
        new PieceImpl({x: 0, y: 4}, Team.WHITE),
        new PieceImpl({x: 0, y: 5}, Team.WHITE),
        new PieceImpl({x: 0, y: 6}, Team.WHITE),
        new PieceImpl({x: 0, y: 7}, Team.WHITE),

        new PieceImpl({x: 1, y: 5}, Team.WHITE),
    );

    pieces.push(
        new PieceImpl({x: 10, y: 3}, Team.WHITE),
        new PieceImpl({x: 10, y: 4}, Team.WHITE),
        new PieceImpl({x: 10, y: 5}, Team.WHITE),
        new PieceImpl({x: 10, y: 6}, Team.WHITE),
        new PieceImpl({x: 10, y: 7}, Team.WHITE),

        new PieceImpl({x: 9, y: 5}, Team.WHITE),
    );

    pieces.push(
        new PieceImpl({y: 0, x: 3}, Team.WHITE),
        new PieceImpl({y: 0, x: 4}, Team.WHITE),
        new PieceImpl({y: 0, x: 5}, Team.WHITE),
        new PieceImpl({y: 0, x: 6}, Team.WHITE),
        new PieceImpl({y: 0, x: 7}, Team.WHITE),

        new PieceImpl({y: 1, x: 5}, Team.WHITE),
    );

    pieces.push(
        new PieceImpl({y: 10, x: 3}, Team.WHITE),
        new PieceImpl({y: 10, x: 4}, Team.WHITE),
        new PieceImpl({y: 10, x: 5}, Team.WHITE),
        new PieceImpl({y: 10, x: 6}, Team.WHITE),
        new PieceImpl({y: 10, x: 7}, Team.WHITE),

        new PieceImpl({y: 9, x: 5}, Team.WHITE),
    );

    //BLACK
    pieces.push(
        new PieceImpl({y: 3, x: 5}, Team.BLACK),

        new PieceImpl({y: 4, x: 4}, Team.BLACK),
        new PieceImpl({y: 4, x: 5}, Team.BLACK),
        new PieceImpl({y: 4, x: 6}, Team.BLACK),

        new PieceImpl({y: 5, x: 3}, Team.BLACK),
        new PieceImpl({y: 5, x: 4}, Team.BLACK),
        new PieceImpl({y: 5, x: 5}, Team.BLACK, true),
        new PieceImpl({y: 5, x: 6}, Team.BLACK),
        new PieceImpl({y: 5, x: 7}, Team.BLACK),

        new PieceImpl({y: 6, x: 4}, Team.BLACK),
        new PieceImpl({y: 6, x: 5}, Team.BLACK),
        new PieceImpl({y: 6, x: 6}, Team.BLACK),

        new PieceImpl({y: 7, x: 5}, Team.BLACK)
    );

    return {pieces, dimension: 11};
}

function piecesToBoard(pieces, dimension){
    const board = _.times(dimension).map(()=>_.fill(Array(dimension), null));

    pieces.forEach(p => {
        const {x, y} = p.getPosition();

        board[x][y] = p;
    });

    return board;
}

export function initialPieces(gameType): Piece[][] {
    const {pieces, dimension} = hnefataflPieces();

    return piecesToBoard(pieces, dimension);
}