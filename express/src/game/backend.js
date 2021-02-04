"use strict";
exports.__esModule = true;
exports.checkGameState = exports.movePiece = exports.changeTurn = exports.pieceCaptures = exports.isMoveValid = void 0;
var gameInstance_1 = require("./gameInstance");
var piece_1 = require("./piece");
var _ = require("lodash");
var constants_1 = require("./constants");
function isPathClear(path) {
    return !_.some(path, function (p) { return !_.isNil(p); });
}
function getMovingAxis(fromVal, toVal) {
    var min = _.min([fromVal, toVal]);
    var max = _.max([fromVal, toVal]);
    return _.times(max - min)
        .map(function (x) { return x + min; })
        .filter(function (val) { return val !== fromVal; });
}
function isRestrictedSquare(_a, board) {
    var x = _a.x, y = _a.y;
    var dimension = board.length;
    var lastCell = dimension - 1;
    return isThrone({ x: x, y: y }, board) ||
        (x === 0 && y === 0) ||
        (x === 0 && y === lastCell) ||
        (x === lastCell && y === 0) ||
        (x === lastCell && y === lastCell);
}
function isThrone(_a, board) {
    var x = _a.x, y = _a.y;
    var dimension = board.length;
    var center = (dimension - 1) / 2;
    return x === center && y === center;
}
function adjacentPositions(position, board) {
    var x = position.x, y = position.y;
    var result = [];
    if (x + 1 < board.length)
        result.push({ x: x + 1, y: y });
    if (x - 1 >= 0)
        result.push({ x: x - 1, y: y });
    if (y + 1 < board.length)
        result.push({ x: x, y: y + 1 });
    if (y - 1 >= 0)
        result.push({ x: x, y: y - 1 });
    return result;
}
function adjacentPieces(position, board) {
    var result = adjacentPositions(position, board)
        .map(function (_a) {
        var x = _a.x, y = _a.y;
        return board[x][y];
    });
    return result
        .filter(function (val) { return !_.isNil(val); });
}
function isAnotherAllyInLine(ally, enemy, board) {
    var _a = ally.getPosition(), allyX = _a.x, allyY = _a.y;
    var _b = enemy.getPosition(), enemyX = _b.x, enemyY = _b.y;
    var otherCellPos;
    if (allyX === enemyX) {
        if (allyY > enemyY) {
            if (enemyY - 1 < 0)
                return false;
            otherCellPos = { x: enemyX, y: enemyY - 1 };
        }
        else {
            if (enemyY + 1 === board.length)
                return false;
            otherCellPos = { x: enemyX, y: enemyY + 1 };
        }
    }
    else {
        if (allyX > enemyX) {
            if (enemyX - 1 < 0)
                return false;
            otherCellPos = { x: enemyX - 1, y: enemyY };
        }
        else {
            if (enemyX + 1 === board.length)
                return false;
            otherCellPos = { x: enemyX + 1, y: enemyY };
        }
    }
    var piece = board[otherCellPos.x][otherCellPos.y];
    console.log('piece', piece);
    return (!_.isNil(piece) && piece.getTeam() === ally.getTeam()) ||
        (ally.getTeam() === constants_1.Team.BLACK ?
            _.isNil(piece) && isRestrictedSquare(otherCellPos, board)
            :
                isRestrictedSquare(otherCellPos, board));
}
function distance(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}
function getThronePos(board) {
    var dimension = board.length;
    var center = (dimension - 1) / 2;
    return { x: center, y: center };
}
function isKingCaptured(piece, board) {
    var king = _.find(adjacentPieces(piece.getPosition(), board), function (piece) { return piece.isKing(); });
    if (_.isNil(king))
        return false;
    var adjacentAttackers = adjacentPieces(king, board);
    if (adjacentAttackers.length === 4)
        return true;
    var thronePos = getThronePos(board);
    return adjacentAttackers.length === 3 &&
        distance(king.getPosition(), thronePos) === 1 &&
        adjacentAttackers
            .filter(function (attacker) { return distance(attacker.getPosition(), thronePos) !== 0; })
            .length === 3;
}
function isKingInBorder(piece, board) {
    var _a = piece.getPosition(), x = _a.x, y = _a.y;
    var lastCell = board.length - 1;
    return (x === 0 && y === 0) ||
        (x === 0 && y === lastCell) ||
        (x === lastCell && y === 0) ||
        (x === lastCell && y === lastCell);
}
function areDefendersSurrounded(board) {
    var dimension = board.length;
    var visited = _.times(dimension).map(function () { return _.fill(Array(dimension), false); });
    var frontier = _.chain(board)
        .flatten()
        .filter(function (p) { return !_.isNil(p); })
        .filter(function (p) { return p.getTeam() === constants_1.Team.BLACK; })
        .map(function (p) { return p.getPosition(); })
        .value();
    function markAsVisited(positions) {
        positions.forEach(function (_a) {
            var x = _a.x, y = _a.y;
            visited[x][y] = true;
        });
    }
    markAsVisited(frontier);
    while (frontier.length > 0) {
        var pos = frontier.pop();
        if (isRestrictedSquare(pos, board) && !isThrone(pos, board))
            return false;
        var notVisitedAdjacent = adjacentPositions(pos, board)
            .filter(function (_a) {
            var x = _a.x, y = _a.y;
            return !visited[x][y];
        })
            .filter(function (_a) {
            var x = _a.x, y = _a.y;
            return _.isNil(board[x][y]);
        });
        markAsVisited(notVisitedAdjacent);
        frontier.push.apply(frontier, notVisitedAdjacent);
    }
    return true;
}
function isMoveValid(move, board) {
    var from = move.from, to = move.to, team = move.team;
    var isKing = board[from.x][from.y].isKing();
    if (!_.isNil(board[to.x][to.y]))
        return false;
    if (!isKing) {
        if (isRestrictedSquare(to, board))
            return false;
    }
    else {
        if (isThrone(from, board)) {
            if (adjacentPieces(to, board)
                .filter(function (p) { return p.getTeam() !== team; })
                .length === 3)
                return false;
        }
    }
    if (from.x === to.x) {
        var axis = getMovingAxis(from.y, to.y);
        var path = axis.map(function (y) { return board[from.x][y]; });
        return isPathClear(path);
    }
    else if (from.y === to.y) {
        var axis = getMovingAxis(from.x, to.x);
        var path = axis.map(function (x) { return board[x][from.y]; });
        return isPathClear(path);
    }
    else {
        return false;
    }
}
exports.isMoveValid = isMoveValid;
function pieceCaptures(piece, board) {
    var adjacentEnemies = adjacentPieces(piece.getPosition(), board)
        .filter(function (p) { return !p.isKing(); })
        .filter(function (p) { return p.getTeam() !== piece.getTeam(); });
    return adjacentEnemies.filter(function (enemy) { return isAnotherAllyInLine(piece, enemy, board); });
}
exports.pieceCaptures = pieceCaptures;
function changeTurn(currentTurn) {
    return currentTurn === constants_1.Team.WHITE ? constants_1.Team.BLACK : constants_1.Team.WHITE;
}
exports.changeTurn = changeTurn;
function movePiece(validMove, board) {
    var from = validMove.from, to = validMove.to;
    var boardCopy = _.cloneDeep(board);
    var pieceToMove = board[from.x][from.y];
    var movedPiece = new piece_1["default"](to, pieceToMove.getTeam(), pieceToMove.isKing());
    boardCopy[from.x][from.y] = null;
    boardCopy[to.x][to.y] = movedPiece;
    var captures = pieceCaptures(movedPiece, boardCopy);
    captures.forEach(function (piece) {
        var _a = piece.getPosition(), x = _a.x, y = _a.y;
        boardCopy[x][y] = null;
    });
    return boardCopy;
}
exports.movePiece = movePiece;
function checkGameState(validMove, newBoard) {
    var team = validMove.team;
    var movedPiece = newBoard[validMove.to.x][validMove.to.y];
    if (team === constants_1.Team.WHITE)
        if (isKingCaptured(movedPiece, newBoard))
            return gameInstance_1.GameStatus.KingCaptured;
    if (areDefendersSurrounded(newBoard))
        return gameInstance_1.GameStatus.DefendersSurrounded;
    else {
        if (movedPiece.isKing() &&
            isKingInBorder(movedPiece, newBoard))
            return gameInstance_1.GameStatus.KingEscaped;
    }
    return gameInstance_1.GameStatus.Playing;
}
exports.checkGameState = checkGameState;
