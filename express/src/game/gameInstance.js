"use strict";
exports.__esModule = true;
exports.GameStatus = void 0;
var rxjs_1 = require("rxjs");
var constants_1 = require("./constants");
var operators_1 = require("rxjs/operators");
var pieceMoveFromSocketMessage_1 = require("./operators/pieceMoveFromSocketMessage");
var ofEvent_1 = require("./operators/ofEvent");
var backend_1 = require("./backend");
var initialPieces_1 = require("./initialPieces");
var utils_1 = require("./utils");
var chatMessageFromSocketMessage_1 = require("./operators/chatMessageFromSocketMessage");
var GameStatus;
(function (GameStatus) {
    GameStatus["Playing"] = "PLAYING";
    GameStatus["KingCaptured"] = "KING_CAPTURED";
    GameStatus["KingEscaped"] = "KING_ESCAPED";
    GameStatus["DefendersSurrounded"] = "DEFENDERS_SURROUNDED";
    GameStatus["Draw"] = "DRAW";
})(GameStatus = exports.GameStatus || (exports.GameStatus = {}));
var GameInstanceImpl = /** @class */ (function () {
    function GameInstanceImpl(broker) {
        this.broker = broker;
        this.teamTurn = constants_1.Team.WHITE;
        this.board = initialPieces_1.initialPieces(null);
        this.gameStatus = GameStatus.Playing;
        this.broker.sendMessage1(constants_1.matchFound({ playerTeam: constants_1.Team.BLACK }));
        this.broker.sendMessage2(constants_1.matchFound({ playerTeam: constants_1.Team.WHITE }));
        this.configurePieceMoves(constants_1.Team.BLACK, constants_1.Team.WHITE);
        this.configureChat(constants_1.Team.BLACK, constants_1.Team.WHITE);
    }
    GameInstanceImpl.prototype.configurePieceMoves = function (team1, team2) {
        var _this = this;
        rxjs_1.merge(this.broker.getSubject1()
            .pipe(ofEvent_1.ofEvent(constants_1.MESSAGES.PIECE_MOVED), pieceMoveFromSocketMessage_1.pieceMoveFromSocketMessage(team1)), this.broker.getSubject2()
            .pipe(ofEvent_1.ofEvent(constants_1.MESSAGES.PIECE_MOVED), pieceMoveFromSocketMessage_1.pieceMoveFromSocketMessage(team2))).pipe(operators_1.takeWhile(function () {
            return _this.gameStatus === GameStatus.Playing;
        }), 
        //Checks if was team turn
        operators_1.filter(function (move) {
            var team = move.team;
            return team === _this.teamTurn;
        }), 
        //Checks if piece was from team
        operators_1.filter(function (move) {
            var team = move.team, from = move.from;
            return _this.board[from.x][from.y]
                && team === _this.board[from.x][from.y].getTeam();
        }), 
        //Checks if move is valid
        operators_1.filter(function (move) {
            return backend_1.isMoveValid(move, _this.board);
        })).subscribe({
            next: function (validMove) {
                _this.teamTurn = backend_1.changeTurn(_this.teamTurn);
                _this.board = backend_1.movePiece(validMove, _this.board);
                _this.broker.broadcast(utils_1.pieceMoveToSocketMessage(validMove));
                _this.gameStatus = backend_1.checkGameState(validMove, _this.board);
            },
            error: function () { },
            complete: function () {
                console.log('GAME ENDED', _this.gameStatus);
            }
        });
    };
    GameInstanceImpl.prototype.configureChat = function (team1, team2) {
        var _this = this;
        rxjs_1.merge(this.broker.getSubject1()
            .pipe(ofEvent_1.ofEvent(constants_1.MESSAGES.CHAT_MESSAGE), chatMessageFromSocketMessage_1.chatMessageFromSocketMessage(team1)), this.broker.getSubject2()
            .pipe(ofEvent_1.ofEvent(constants_1.MESSAGES.CHAT_MESSAGE), chatMessageFromSocketMessage_1.chatMessageFromSocketMessage(team2))).subscribe(function (chatMessage) {
            _this.broker.broadcast(utils_1.chatMessageToSocketMessage(chatMessage));
        });
    };
    return GameInstanceImpl;
}());
exports["default"] = GameInstanceImpl;
