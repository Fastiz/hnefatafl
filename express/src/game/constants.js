"use strict";
exports.__esModule = true;
exports.matchFound = exports.Team = exports.GameType = exports.MESSAGES = void 0;
exports.MESSAGES = {
    CONNECTION: 'connection',
    DISCONNECT: 'disconnect',
    MATCH_MAKING: 'match_making',
    MATCH_FOUND: 'match_found',
    PIECE_MOVED: 'piece_moved',
    CHAT_MESSAGE: 'chat_message'
};
var GameType;
(function (GameType) {
    GameType["HNEFATAFL"] = "HNEFATAFL";
})(GameType = exports.GameType || (exports.GameType = {}));
var Team;
(function (Team) {
    Team["WHITE"] = "WHITE";
    Team["BLACK"] = "BLACK";
})(Team = exports.Team || (exports.Team = {}));
function matchFound(_a) {
    var playerTeam = _a.playerTeam;
    return {
        event: exports.MESSAGES.MATCH_FOUND,
        data: {
            gameType: GameType.HNEFATAFL,
            teamTurn: Team.WHITE,
            playerTeam: playerTeam
        }
    };
}
exports.matchFound = matchFound;
