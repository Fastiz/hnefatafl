import _ from 'lodash';
import {TEAM} from "../constants";

function isPathClear(path){
    return !_.some(path, p => !_.isNil(p));
}

function getMovingAxis(fromVal, toVal){
    const min = _.min([fromVal, toVal]);
    const max = _.max([fromVal, toVal]);

    return _.times(max - min)
        .map(x => x + min)
        .filter(val => val !== fromVal);
}

function isThrone({x, y}, board){
    const dimension = board.length;

    const center = (dimension - 1) / 2;

    return x === center && y === center;
}

export function isRestrictedSquare({x, y}, board){
    const dimension = board.length;

    const lastCell = dimension - 1;

    return isThrone({x, y}, board) ||
        (x === 0 && y === 0) ||
        (x === 0 && y === lastCell) ||
        (x === lastCell && y === 0) ||
        (x === lastCell && y === lastCell);
}

export function canMove({from, to, board, isKing, team}){
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

function adjacentPositions(position, board){
    const {x, y} = position;

    const result = [];

    if(x + 1 < board.length)  result.push({x: x + 1, y});

    if(x - 1 >= 0)            result.push({x: x - 1, y});

    if(y + 1 < board.length)  result.push({x, y: y + 1});

    if(y - 1 >= 0)            result.push({x, y: y - 1});

    return result
}

export function adjacentPieces(position, board){
    const result = adjacentPositions(position, board)
        .map(({x, y}) => board[x][y]);

    return result
        .filter(val => !_.isNil(val));
}

function isAnotherAllyInLine({allyPos, enemy, board, team}){
    const {x: enemyX, y: enemyY} = enemy.getPosition();

    let otherCellPos;
    if(allyPos.x === enemyX){
        if(allyPos.y > enemyY){
            if(enemyY - 1 < 0) return false;

            otherCellPos = {x: enemyX, y: enemyY - 1};
        }else{
            if(enemyY + 1 === board.length) return false;

            otherCellPos = {x: enemyX, y: enemyY + 1};
        }
    }else{
        if(allyPos.x > enemyX){
            if(enemyX - 1 < 0) return false;

            otherCellPos = {x: enemyX - 1, y: enemyY};
        }else{
            if(enemyX + 1 === board.length) return false;

            otherCellPos = {x: enemyX + 1, y: enemyY};
        }
    }
    const piece = board[otherCellPos.x][otherCellPos.y];

    return (!_.isNil(piece) && piece.getTeam() === team) ||
        (team === TEAM.BLACK ?
            _.isNil(piece) && isRestrictedSquare(otherCellPos, board)
            :
            isRestrictedSquare(otherCellPos, board)
        );
}

export function moveCaptures({to, board, team}){
    const adjacentEnemies = adjacentPieces(to, board)
        .filter(piece => !piece.isKing())
        .filter(piece => piece.getTeam() !== team);

    return adjacentEnemies.filter(
        enemy => isAnotherAllyInLine({allyPos: to, enemy, board, team})
    ).map(piece => piece.getPosition());
}

function findKing(board){
    return _.chain(board)
        .flatten()
        .find(cell => cell && cell.isKing())
        .value();
}

export function isKingCaptured({board, to}){
    if(isThrone(to, board)) return false;

    const king = findKing(adjacentPieces(to, board));

    if(_.isNil(king)) return false;

    const adjacentEnemies = adjacentPieces(king.getPosition(), board)
        .filter(p => p.getTeam() === TEAM.WHITE);

    if(adjacentEnemies.length === 3) return true;

    if(adjacentEnemies.length < 3) return false;

    const center = (board.length - 1) / 2;

    const kingPos = king.getPosition();
    if(
        Math.abs(kingPos.x - center) + Math.abs(kingPos.y - center) !== 1
    ) return false;

    return !_.some(adjacentEnemies, p => {
        const {x, y} = p.getPosition();

        return x === center && y === center;
    });
}

export function isKingOnBorder({board}){
    const king = findKing(board);

    const {x, y} = king.getPosition();

    return !isThrone({x, y}, board) &&
        isRestrictedSquare({x, y}, board);
}

export function areDefendersSurrounded({board}){
    const dimension = board.length;

    const visited = _.times(dimension).map(()=>_.fill(Array(dimension), false));

    const frontier = _.chain(board)
        .flatten()
        .filter(p => !_.isNil(p))
        .filter(p => p.getTeam() === TEAM.BLACK)
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

