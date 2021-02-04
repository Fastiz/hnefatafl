"use strict";
exports.__esModule = true;
exports.initialPieces = void 0;
var _ = require('lodash');
var constants_1 = require("./constants");
var piece_1 = require("./piece");
function hnefataflPieces() {
    var pieces = [];
    //WHITE
    pieces.push(new piece_1["default"]({ x: 0, y: 3 }, constants_1.Team.WHITE), new piece_1["default"]({ x: 0, y: 4 }, constants_1.Team.WHITE), new piece_1["default"]({ x: 0, y: 5 }, constants_1.Team.WHITE), new piece_1["default"]({ x: 0, y: 6 }, constants_1.Team.WHITE), new piece_1["default"]({ x: 0, y: 7 }, constants_1.Team.WHITE), new piece_1["default"]({ x: 1, y: 5 }, constants_1.Team.WHITE));
    pieces.push(new piece_1["default"]({ x: 10, y: 3 }, constants_1.Team.WHITE), new piece_1["default"]({ x: 10, y: 4 }, constants_1.Team.WHITE), new piece_1["default"]({ x: 10, y: 5 }, constants_1.Team.WHITE), new piece_1["default"]({ x: 10, y: 6 }, constants_1.Team.WHITE), new piece_1["default"]({ x: 10, y: 7 }, constants_1.Team.WHITE), new piece_1["default"]({ x: 9, y: 5 }, constants_1.Team.WHITE));
    pieces.push(new piece_1["default"]({ y: 0, x: 3 }, constants_1.Team.WHITE), new piece_1["default"]({ y: 0, x: 4 }, constants_1.Team.WHITE), new piece_1["default"]({ y: 0, x: 5 }, constants_1.Team.WHITE), new piece_1["default"]({ y: 0, x: 6 }, constants_1.Team.WHITE), new piece_1["default"]({ y: 0, x: 7 }, constants_1.Team.WHITE), new piece_1["default"]({ y: 1, x: 5 }, constants_1.Team.WHITE));
    pieces.push(new piece_1["default"]({ y: 10, x: 3 }, constants_1.Team.WHITE), new piece_1["default"]({ y: 10, x: 4 }, constants_1.Team.WHITE), new piece_1["default"]({ y: 10, x: 5 }, constants_1.Team.WHITE), new piece_1["default"]({ y: 10, x: 6 }, constants_1.Team.WHITE), new piece_1["default"]({ y: 10, x: 7 }, constants_1.Team.WHITE), new piece_1["default"]({ y: 9, x: 5 }, constants_1.Team.WHITE));
    //BLACK
    pieces.push(new piece_1["default"]({ y: 3, x: 5 }, constants_1.Team.BLACK), new piece_1["default"]({ y: 4, x: 4 }, constants_1.Team.BLACK), new piece_1["default"]({ y: 4, x: 5 }, constants_1.Team.BLACK), new piece_1["default"]({ y: 4, x: 6 }, constants_1.Team.BLACK), new piece_1["default"]({ y: 5, x: 3 }, constants_1.Team.BLACK), new piece_1["default"]({ y: 5, x: 4 }, constants_1.Team.BLACK), new piece_1["default"]({ y: 5, x: 5 }, constants_1.Team.BLACK, true), new piece_1["default"]({ y: 5, x: 6 }, constants_1.Team.BLACK), new piece_1["default"]({ y: 5, x: 7 }, constants_1.Team.BLACK), new piece_1["default"]({ y: 6, x: 4 }, constants_1.Team.BLACK), new piece_1["default"]({ y: 6, x: 5 }, constants_1.Team.BLACK), new piece_1["default"]({ y: 6, x: 6 }, constants_1.Team.BLACK), new piece_1["default"]({ y: 7, x: 5 }, constants_1.Team.BLACK));
    return { pieces: pieces, dimension: 11 };
}
function piecesToBoard(pieces, dimension) {
    var board = _.times(dimension).map(function () { return _.fill(Array(dimension), null); });
    pieces.forEach(function (p) {
        var _a = p.getPosition(), x = _a.x, y = _a.y;
        board[x][y] = p;
    });
    return board;
}
function initialPieces(gameType) {
    var _a = hnefataflPieces(), pieces = _a.pieces, dimension = _a.dimension;
    return piecesToBoard(pieces, dimension);
}
exports.initialPieces = initialPieces;
