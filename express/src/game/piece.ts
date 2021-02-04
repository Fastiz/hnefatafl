import {Team} from "./constants";

export interface Position {x: number, y: number}

export interface Piece {
    getPosition(): Position,
    getTeam(): Team,
    isKing(): boolean
}

export default class PieceImpl implements Piece{
    private readonly position: Position;
    private readonly team: Team;
    private readonly _isKing: boolean;

    constructor(position: Position, team: Team, isKing: boolean = false) {
        this.position = position;
        this.team = team;
        this._isKing = isKing;
    }

    getPosition(): Position {
        return this.position;
    }

    getTeam(): Team {
        return this.team;
    }

    isKing(): boolean {
        return this._isKing;
    }
}