import _ from 'lodash';
import Piece from "./Piece";
import {TEAM} from "./constants";

function hnefataflPieces(){
    const pieces = [];

    //WHITE
    pieces.push(
        new Piece({x: 0, y: 3}, TEAM.WHITE),
        new Piece({x: 0, y: 4}, TEAM.WHITE),
        new Piece({x: 0, y: 5}, TEAM.WHITE),
        new Piece({x: 0, y: 6}, TEAM.WHITE),
        new Piece({x: 0, y: 7}, TEAM.WHITE),

        new Piece({x: 1, y: 5}, TEAM.WHITE),
    );

    pieces.push(
        new Piece({x: 10, y: 3}, TEAM.WHITE),
        new Piece({x: 10, y: 4}, TEAM.WHITE),
        new Piece({x: 10, y: 5}, TEAM.WHITE),
        new Piece({x: 10, y: 6}, TEAM.WHITE),
        new Piece({x: 10, y: 7}, TEAM.WHITE),

        new Piece({x: 9, y: 5}, TEAM.WHITE),
    );

    pieces.push(
        new Piece({y: 0, x: 3}, TEAM.WHITE),
        new Piece({y: 0, x: 4}, TEAM.WHITE),
        new Piece({y: 0, x: 5}, TEAM.WHITE),
        new Piece({y: 0, x: 6}, TEAM.WHITE),
        new Piece({y: 0, x: 7}, TEAM.WHITE),

        new Piece({y: 1, x: 5}, TEAM.WHITE),
    );

    pieces.push(
        new Piece({y: 10, x: 3}, TEAM.WHITE),
        new Piece({y: 10, x: 4}, TEAM.WHITE),
        new Piece({y: 10, x: 5}, TEAM.WHITE),
        new Piece({y: 10, x: 6}, TEAM.WHITE),
        new Piece({y: 10, x: 7}, TEAM.WHITE),

        new Piece({y: 9, x: 5}, TEAM.WHITE),
    );

    //BLACK
    pieces.push(
        new Piece({y: 3, x: 5}, TEAM.BLACK),

        new Piece({y: 4, x: 4}, TEAM.BLACK),
        new Piece({y: 4, x: 5}, TEAM.BLACK),
        new Piece({y: 4, x: 6}, TEAM.BLACK),

        new Piece({y: 5, x: 3}, TEAM.BLACK),
        new Piece({y: 5, x: 4}, TEAM.BLACK),
        new Piece({y: 5, x: 5}, TEAM.BLACK, true),
        new Piece({y: 5, x: 6}, TEAM.BLACK),
        new Piece({y: 5, x: 7}, TEAM.BLACK),

        new Piece({y: 6, x: 4}, TEAM.BLACK),
        new Piece({y: 6, x: 5}, TEAM.BLACK),
        new Piece({y: 6, x: 6}, TEAM.BLACK),

        new Piece({y: 7, x: 5}, TEAM.BLACK)
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

export function initialPieces(gameType){
    const {pieces, dimension} = hnefataflPieces();

    return piecesToBoard(pieces, dimension);
}