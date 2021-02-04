import {GameStatus, PieceMove} from "./gameInstance";
import PieceImpl, {Piece, Position} from "./piece";
var _ = require("lodash");
import {Team} from "./constants";

function isPathClear(path: any[]): boolean {
    return !_.some(path, p => !_.isNil(p));
}

function getMovingAxis(fromVal: number, toVal: number): number[]{
    const min = _.min([fromVal, toVal]);
    const max = _.max([fromVal, toVal]);

    return _.times(max - min)
        .map(x => x + min)
        .filter(val => val !== fromVal);
}

function isRestrictedSquare({x, y}: Position, board: Piece[][]): boolean{
    const dimension = board.length;

    const lastCell = dimension - 1;

    return isThrone({x, y}, board) ||
        (x === 0 && y === 0) ||
        (x === 0 && y === lastCell) ||
        (x === lastCell && y === 0) ||
        (x === lastCell && y === lastCell);
}

function isThrone({x, y}: Position, board: Piece[][]): boolean{
    const dimension = board.length;

    const center = (dimension - 1) / 2;

    return x === center && y === center;
}

function adjacentPositions(position: Position, board: Piece[][]): Position[] {
    const {x, y} = position;

    const result = [];

    if(x + 1 < board.length)  result.push({x: x + 1, y});

    if(x - 1 >= 0)            result.push({x: x - 1, y});

    if(y + 1 < board.length)  result.push({x, y: y + 1});

    if(y - 1 >= 0)            result.push({x, y: y - 1});

    return result
}

function adjacentPieces(position: Position, board: Piece[][]): Piece[] {
    const result = adjacentPositions(position, board)
        .map(({x, y}) => board[x][y]);

    return result
        .filter(val => !_.isNil(val));
}

function isAnotherAllyInLine(ally: Piece, enemy: Piece, board: Piece[][]): boolean {
    const {x: allyX, y: allyY} = ally.getPosition();
    const {x: enemyX, y: enemyY} = enemy.getPosition();

    let otherCellPos;
    if(allyX === enemyX){
        if(allyY > enemyY){
            if(enemyY - 1 < 0) return false;

            otherCellPos = {x: enemyX, y: enemyY - 1};
        }else{
            if(enemyY + 1 === board.length) return false;

            otherCellPos = {x: enemyX, y: enemyY + 1};
        }
    }else{
        if(allyX > enemyX){
            if(enemyX - 1 < 0) return false;

            otherCellPos = {x: enemyX - 1, y: enemyY};
        }else{
            if(enemyX + 1 === board.length) return false;

            otherCellPos = {x: enemyX + 1, y: enemyY};
        }
    }
    const piece = board[otherCellPos.x][otherCellPos.y];

    console.log('piece', piece);

    return (!_.isNil(piece) && piece.getTeam() === ally.getTeam()) ||
        (ally.getTeam() === Team.BLACK ?
                _.isNil(piece) && isRestrictedSquare(otherCellPos, board)
                :
                isRestrictedSquare(otherCellPos, board)
        );
}

function distance(a: Position, b: Position): number{
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function getThronePos(board: Piece[][]): Position {
    const dimension = board.length;

    const center = (dimension - 1) / 2;

    return {x: center, y: center};
}

function isKingCaptured(piece: Piece, board: Piece[][]): boolean {
    const king = _.find(adjacentPieces(piece.getPosition(), board), piece => piece.isKing());

    if(_.isNil(king)) return false;

    const adjacentAttackers = adjacentPieces(king, board);

    if(adjacentAttackers.length === 4) return true;

    const thronePos = getThronePos(board);

    return adjacentAttackers.length === 3 &&
        distance(king.getPosition(), thronePos) === 1 &&
        adjacentAttackers
            .filter((attacker: Piece) => distance(attacker.getPosition(), thronePos) !== 0)
            .length === 3;
}

function isKingInBorder(piece: Piece, board: Piece[][]): boolean {
    const {x, y} = piece.getPosition();

    const lastCell = board.length - 1;

    return (x   === 0           && y === 0)         ||
        (x      === 0           && y === lastCell)  ||
        (x      === lastCell    && y === 0)         ||
        (x      === lastCell    && y === lastCell);
}

function areDefendersSurrounded(board: Piece[][]): boolean{
    const dimension = board.length;

    const visited = _.times(dimension).map(()=>_.fill(Array(dimension), false));

    const frontier = _.chain(board)
        .flatten()
        .filter(p => !_.isNil(p))
        .filter(p => p.getTeam() === Team.BLACK)
        .map(p => p.getPosition())
        .value();

    function markAsVisited(positions){
        positions.forEach(({x, y}) => {
            visited[x][y] = true;
        });
    }

    markAsVisited(frontier);

    while (frontier.length > 0){
        const pos = frontier.pop();

        if(isRestrictedSquare(pos, board) && !isThrone(pos, board)) return false;

        const notVisitedAdjacent = adjacentPositions(pos, board)
            .filter(({x, y}) => !visited[x][y])
            .filter(({x, y}) => _.isNil(board[x][y]));

        markAsVisited(notVisitedAdjacent);

        frontier.push(...notVisitedAdjacent);
    }

    return true;
}


export function isMoveValid(move: PieceMove, board: Piece[][]): boolean {
    const {from, to, team} = move;

    const isKing = board[from.x][from.y].isKing();

    if(!_.isNil(board[to.x][to.y])) return false;

    if(!isKing){
        if(isRestrictedSquare(to, board)) return false;
    }else{
        if(isThrone(from, board)){
            if(
                adjacentPieces(to, board)
                    .filter(p => p.getTeam() !== team)
                    .length === 3
            ) return false;
        }
    }

    if(from.x === to.x){
        const axis = getMovingAxis(from.y, to.y);

        const path = axis.map(y => board[from.x][y]);

        return isPathClear(path);
    }else if(from.y === to.y){
        const axis = getMovingAxis(from.x, to.x);

        const path = axis.map(x => board[x][from.y]);

        return isPathClear(path);
    }else{
        return false;
    }
}

export function pieceCaptures(piece: Piece, board: Piece[][]): Piece[] {
    const adjacentEnemies = adjacentPieces(piece.getPosition(), board)
        .filter(p => !p.isKing())
        .filter(p => p.getTeam() !== piece.getTeam());

    return adjacentEnemies.filter(
        enemy => isAnotherAllyInLine(piece, enemy, board)
    );
}

export function changeTurn(currentTurn: Team): Team {
    return currentTurn === Team.WHITE ? Team.BLACK : Team.WHITE;
}

export function movePiece(validMove: PieceMove, board: Piece[][]): Piece[][] {
    const {
        from, to
    } = validMove;

    const boardCopy = _.cloneDeep(board);

    const pieceToMove = board[from.x][from.y];

    const movedPiece = new PieceImpl(to, pieceToMove.getTeam(), pieceToMove.isKing());

    boardCopy[from.x][from.y] = null;
    boardCopy[to.x][to.y] = movedPiece;

    const captures: Piece[] = pieceCaptures(movedPiece, boardCopy);

    captures.forEach(piece => {
        const {x, y} = piece.getPosition();

        boardCopy[x][y] = null;
    });

    return boardCopy;
}

export function checkGameState(validMove: PieceMove, newBoard: Piece[][]): GameStatus {
    const {team} = validMove;

    const movedPiece = newBoard[validMove.to.x][validMove.to.y];

    if(team === Team.WHITE)
        if(isKingCaptured(movedPiece, newBoard)) return GameStatus.KingCaptured;
        if(areDefendersSurrounded(newBoard)) return GameStatus.DefendersSurrounded;
    else{
        if(movedPiece.isKing() &&
            isKingInBorder(movedPiece, newBoard)) return GameStatus.KingEscaped;
    }

    return GameStatus.Playing;
}