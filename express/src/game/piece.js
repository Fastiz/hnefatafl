"use strict";
exports.__esModule = true;
var PieceImpl = /** @class */ (function () {
    function PieceImpl(position, team, isKing) {
        if (isKing === void 0) { isKing = false; }
        this.position = position;
        this.team = team;
        this._isKing = isKing;
    }
    PieceImpl.prototype.getPosition = function () {
        return this.position;
    };
    PieceImpl.prototype.getTeam = function () {
        return this.team;
    };
    PieceImpl.prototype.isKing = function () {
        return this._isKing;
    };
    return PieceImpl;
}());
exports["default"] = PieceImpl;
