
export default class Piece {
    constructor({x, y}, team, isKing=false) {
        this.position = {x, y};
        this.team = team;
        this._isKing = isKing;
    }

    getPosition(){
        return this.position;
    }

    getTeam(){
        return this.team;
    }

    isKing(){
        return this._isKing;
    }
}